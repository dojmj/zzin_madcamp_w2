const axios = require("axios");
const express = require("express");
const bodyParser = require("body-parser");
const { google } = require("googleapis");
const mysql = require("mysql2/promise"); // mysql2 패키지 사용
const bcrypt = require("bcrypt"); // 비밀번호 암호화를 위한 bcrypt
const saltRounds = 10;
require("dotenv").config(); // Load environment variables from .env file
const cors = require("cors");

// 구독자 수 변환 함수
function formatSubscribersCount(subscriberCount) {
  const count = Number(subscriberCount); // 문자열을 숫자로 변환
  if (count >= 10000) {
    // 만 단위
    return `${(count / 10000).toFixed(1)}만명`;
  } else if (count >= 1000) {
    // 천 단위
    return `${(count / 1000).toFixed(1)}천명`;
  }
  return `${count}명`; // 천명 이하 그대로 반환
}

async function getTopVideo(channelId) {
  try {
    const searchResponse = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          key: process.env.YOUTUBE_API_KEY,
          channelId: channelId,
          part: "snippet",
          maxResults: 1,
          order: "viewCount", // 인기 있는 영상 기준으로 정렬
        },
      }
    );

    const video = searchResponse.data.items[0];
    if (!video) return null;

    // 동영상의 추가 정보를 가져오기 위해 videoId 사용
    const videoId = video.id.videoId;
    const videoDetailsResponse = await axios.get(
      "https://www.googleapis.com/youtube/v3/videos",
      {
        params: {
          key: process.env.YOUTUBE_API_KEY,
          id: videoId,
          part: "snippet,statistics",
        },
      }
    );

    const videoDetails = videoDetailsResponse.data.items[0];
    if (!videoDetails) return null;

    return {
      videoId: videoId,
      title: videoDetails.snippet.title,
      thumbnail: videoDetails.snippet.thumbnails.medium.url,
      viewCount: videoDetails.statistics.viewCount,
    };
  } catch (error) {
    console.error("대표 영상 가져오기 중 오류:", error);
    return null;
  }
}

const getAllVideo = async (channelId, accessToken) => {
  let nextPageToken = null;
  const allVideos = [];
  do {
    const response = await youtube.search.list({
      part: "snippet",
      channelId: channelId,
      maxResults: 50,
      pageToken: nextPageToken,
      type: "video",
      headers: {
        Authorization: `Bearer ${accessToken}`, // OAuth2 인증 토큰 추가
      },
    });

    const videos = response.data.items.map((video) => ({
      videoId: video.id.videoId,
      title: video.snippet.title,
      thumbnail: video.snippet.thumbnails.medium.url,
    }));

    allVideos.push(...videos);
    nextPageToken = response.data.nextPageToken;
  } while (nextPageToken);

  return allVideos;
};

// YouTube API 키
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

const app = express();
app.use(cors());
const PORT = process.env.PORT || 8080; // Elastic Beanstalk PORT 설정 사용

// Load credentials from environment variables
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

// Initialize OAuth2 Client
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

app.use(bodyParser.json());

// Create a MySQL connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST, // e.g., 'localhost' 또는 EC2의 IP 주소
  user: process.env.DB_USER, // MySQL 사용자 이름
  password: process.env.DB_PASSWORD, // MySQL 사용자 비밀번호
  database: process.env.DB_NAME, // 'user_data' 데이터베이스 이름
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.get("/db-test", async (req, res) => {
  try {
    // MySQL 연결 테스트
    const [rows] = await db.query("SELECT 1");
    res.status(200).send("MySQL 연결 성공!");
  } catch (error) {
    console.error("MySQL 연결 오류:", error);
    res.status(500).send("MySQL 연결 실패");
  }
});

// Generate the auth URL dynamically
app.get("/login", (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/youtube.readonly",
      "https://www.googleapis.com/auth/yt-analytics.readonly",
      "https://www.googleapis.com/auth/yt-analytics-monetary.readonly",
    ],
    redirect_uri: REDIRECT_URI, // 명시적으로 추가
  });
  res.redirect(authUrl);
});

// Handle OAuth2 callback
app.get("/redirect", async (req, res) => {
  const code = req.query.code;

  try {
    // Google OAuth 인증
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Access Token 만료 시간 계산
    const expiresAt = tokens.expires_in
      ? Date.now() + tokens.expires_in * 1000
      : Date.now() + 3600 * 1000;

    // 사용자 정보 가져오기
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();
    const user = userInfo.data;

    // Access Token과 Refresh Token 해싱
    // const hashedAccessToken = await bcrypt.hash(tokens.access_token, 10);
    // const hashedRefreshToken = tokens.refresh_token
    //   ? await bcrypt.hash(tokens.refresh_token, 10)
    //   : null;
    const hashedAccessToken = tokens.access_token;
    const hashedRefreshToken = tokens.refresh_token;

    // 사용자 정보 및 토큰 DB에 저장
    const query = `
      INSERT INTO users (google_id, email, name, picture, hashed_access_token, hashed_refresh_token, token_expires_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        email = VALUES(email),
        name = VALUES(name),
        picture = VALUES(picture),
        hashed_access_token = VALUES(hashed_access_token),
        hashed_refresh_token = IFNULL(VALUES(hashed_refresh_token), hashed_refresh_token),
        token_expires_at = VALUES(token_expires_at)
        `;
    const [result] = await db.query(query, [
      user.id,
      user.email,
      user.name,
      user.picture,
      hashedAccessToken,
      hashedRefreshToken,
      expiresAt,
    ]);

    console.log("User info and tokens saved to database:", result);

    // res.json({ user });
    const redirectWithUserData = `http://localhost:3000?user=${encodeURIComponent(
      JSON.stringify(user)
    )}`;
    res.redirect(redirectWithUserData);
  } catch (error) {
    console.error("Error during authentication:", error);
    res.status(500).send("Authentication failed");
  }
});

// 회원가입 API
app.post("/join", async (req, res) => {
  const { userid, password, firstName, lastName } = req.body;

  // 입력 검증
  if (!userid || !password || !firstName || !lastName) {
    return res.status(400).send("모든 필드를 입력하세요.");
  }

  try {
    // 사용자 중복 확인
    const [rows] = await db.query("SELECT id FROM users WHERE userid = ?", [
      userid,
    ]);
    if (rows.length > 0) {
      return res.status(400).send("이미 존재하는 아이디입니다.");
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 데이터베이스 삽입
    const query = `
      INSERT INTO users (userid, password, name)
      VALUES (?, ?, ?)
    `;
    await db.query(query, [userid, hashedPassword, `${lastName}${firstName}`]);

    res.status(201).send("회원가입 성공");
  } catch (error) {
    console.error("회원가입 중 오류 발생:", error);
    res.status(500).send("서버 오류");
  }
});

// 로그인 API
app.post("/auth/login", async (req, res) => {
  const { userid, password } = req.body;

  try {
    // 사용자 조회
    const [rows] = await db.query("SELECT * FROM users WHERE userid = ?", [
      userid,
    ]);
    if (rows.length === 0) {
      return res.status(401).send("아이디 또는 비밀번호가 올바르지 않습니다.");
    }

    const user = rows[0];

    // 비밀번호 검증
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).send("아이디 또는 비밀번호가 올바르지 않습니다.");
    }

    // 로그인 성공 시 사용자 정보 반환
    res.json({
      id: user.id,
      name: user.name,
      createdAt: user.created_at,
    });
  } catch (error) {
    console.error("로그인 중 오류 발생:", error);
    res.status(500).send("서버 오류");
  }
});

// Google API 초기화
const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY, // 유튜브 API 키
});

let currentOffset = 0; // 반환 범위를 관리하는 변수
const cache = {}; // 태그별 결과를 캐싱

// 관심사 API
app.post("/favorite", async (req, res) => {
  const { tags } = req.body;

  if (!tags || tags.length === 0) {
    return res.status(400).json({ error: "태그를 하나 이상 선택해주세요." });
  }

  try {
    // DB에서 최근 한 달 이내 업데이트된 채널 조회
    const [channelsFromDb] = await db.query(
      `
      SELECT c.id, c.name, c.url, c.subscribers, c.view_count, v.id AS video_id, v.title AS video_title,
             v.thumbnail_url AS video_thumbnail, v.view_count AS video_view_count, v.channel_picture
      FROM youtube_channels c
      LEFT JOIN youtube_videos v ON c.id = v.channel_id
      WHERE MATCH(c.name) AGAINST(? IN NATURAL LANGUAGE MODE)
        AND c.last_updated >= NOW() - INTERVAL 1 MONTH
      ,
      [tags.join(' ')]`
    );

    if (channelsFromDb.length > 0) {
      console.log("캐싱된 데이터 사용");
      const youtubeChannels = channelsFromDb.map((channel) => ({
        name: channel.name,
        url: channel.url,
        subscribers: formatSubscribersCount(
          channel.statistics.subscriberCount || 0
        ),
        totalViews: channel.view_count?.toString() || "0",
        channelPicture: channel.channel_picture || "",
        topVideo: {
          videoId: channel.video_id || "",
          title: channel.video_title || "대표 영상 없음",
          thumbnail: channel.video_thumbnail || "",
          viewCount: channel.video_view_count?.toString() || "0",
        },
      }));

      return res.json(youtubeChannels);
    }

    // DB에 저장된 데이터가 없을 경우, YouTube API 호출
    console.log("YouTube API 호출");
    const searchResults = await youtube.search.list({
      part: "snippet",
      q: tags.join(" "),
      maxResults: 8, // 필요한 채널 수
      type: "channel",
      order: "relevance",
    });

    const channelIds = searchResults.data.items.map(
      (channel) => channel.snippet.channelId
    );

    if (channelIds.length === 0) {
      return res.status(404).json({ error: "검색된 채널이 없습니다." });
    }

    const channelDetails = await youtube.channels.list({
      part: "snippet,statistics",
      id: channelIds.join(","),
    });

    const youtubeChannels = await Promise.all(
      channelDetails.data.items.map(async (channel) => {
        const topVideo = await getTopVideo(channel.id);

        // DB에 youtube_channels 저장
        await db.query(
          `
          INSERT INTO youtube_channels (id, name, url, subscribers, view_count, last_updated)
          VALUES (?, ?, ?, ?, ?, NOW())
          ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            subscribers = VALUES(subscribers),
            view_count = VALUES(view_count),
            last_updated = NOW()
          ,
          [
            channel.id,
            channel.snippet.title || "채널 이름 없음",
            https://www.youtube.com/channel/${channel.id},
            channel.statistics.subscriberCount || 0,
            channel.statistics.viewCount || 0,
          ]`
        );

        // DB에 youtube_videos 저장
        if (topVideo) {
          await db.query(
            `
            INSERT INTO youtube_videos (id, channel_id, title, thumbnail_url, view_count, last_updated, channel_picture)
            VALUES (?, ?, ?, ?, ?, NOW(), ?)
            ON DUPLICATE KEY UPDATE
              title = VALUES(title),
              thumbnail_url = VALUES(thumbnail_url),
              view_count = VALUES(view_count),
              last_updated = NOW(),
              channel_picture = VALUES(channel_picture)
            ,
            [
              topVideo.videoId,
              channel.id,
              topVideo.title || "대표 영상 없음",
              topVideo.thumbnail || "",
              topVideo.viewCount || 0,
              channel.snippet.thumbnails?.maxres?.url ||
                channel.snippet.thumbnails?.standard?.url ||
                channel.snippet.thumbnails?.high?.url ||
                channel.snippet.thumbnails?.medium?.url ||
                channel.snippet.thumbnails?.default?.url ||
                "",
            ]
          `
          );
        }

        return {
          name: channel.snippet.title || "채널 이름 없음",
          url: `https://www.youtube.com/channel/${channel.id}`,
          subscribers: formatSubscribersCount(
            channel.statistics.subscriberCount || 0
          ),
          totalViews: channel.statistics.viewCount?.toString() || "0",
          channelPicture:
            channel.snippet.thumbnails?.maxres?.url ||
            channel.snippet.thumbnails?.standard?.url ||
            channel.snippet.thumbnails?.high?.url ||
            channel.snippet.thumbnails?.medium?.url ||
            channel.snippet.thumbnails?.default?.url ||
            "",
          topVideo: {
            videoId: topVideo?.videoId || "",
            title: topVideo?.title || "대표 영상 없음",
            thumbnail: topVideo?.thumbnail || "",
            viewCount: topVideo?.viewCount?.toString() || "0",
          },
        };
      })
    );

    res.json(youtubeChannels);
  } catch (error) {
    console.error("유튜브 API 요청 중 오류 발생:", error);
    res.status(500).json({ error: "유튜브 API 요청 실패" });
  }
});

app.post("/mychannel", async (req, res) => {
  const { googleId } = req.body;

  if (!googleId) {
    return res.status(400).json({ error: "Google ID를 제공하세요." });
  }

  try {
    const [rows] = await db.query(
      "SELECT hashed_access_token AS accessToken, hashed_refresh_token AS refreshToken, token_expires_at AS expiresAt FROM users WHERE google_id = ?",
      [googleId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
    }

    let { accessToken, refreshToken, expiresAt } = rows[0];
    if (Date.now() > expiresAt) {
      const { credentials } = await oauth2Client.refreshToken(refreshToken);
      accessToken = credentials.access_token;
      await db.query(
        "UPDATE users SET hashed_access_token = ?, token_expires_at = ? WHERE google_id = ?",
        [accessToken, Date.now() + credentials.expires_in * 1000, googleId]
      );
    }

    oauth2Client.setCredentials({ access_token: accessToken });

    // YouTube 채널 데이터 가져오기
    const youtubeResponse = await youtube.channels.list({
      part: "snippet,statistics",
      mine: true,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const channels = await Promise.all(
      youtubeResponse.data.items.map(async (channel) => {
        const videos = await getAllVideo(channel.id, accessToken);

        return {
          name: channel.snippet.title || "채널 이름 없음",
          url: `https://www.youtube.com/channel/${channel.id}`,
          subscribers: channel.statistics.subscriberCount || 0, // 구독자 수 추가
          channelPicture: channel.snippet.thumbnails?.high?.url || "", // 채널 사진 추가
          videos,
        };
      })
    );

    // 모든 video_acc_views 데이터 가져오기 (테스트 목적)
    const [videoStats] = await db.query(
      "SELECT video_id, date, acc_views FROM video_acc_views"
    );

    const [accStats] = await db.query(
      "SELECT date, acc_views, acc_subscribers FROM channel_acc_stat WHERE google_id = ? ORDER BY date ASC",
      [googleId]
    );

    res.json({ channels, videoStats, accStats });
  } catch (error) {
    console.error("서버 오류:", error.response?.data || error);
    res.status(500).json({ error: "서버 오류 발생" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
