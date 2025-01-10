import React, { useState, useEffect } from "react";
import "../Page/css/MyChannel.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Nav from "../components/Nav";

function MyChannel() {
  const [googleId, setGoogleId] = useState("");
  const [channels, setChannels] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();

  const handleInputChange = (e) => {
    setGoogleId(e.target.value);
  };

  const handleFetchChannels = async () => {
    if (!googleId.trim()) {
      alert("Google ID를 입력해주세요.");
      return;
    }

    setLoading(true); // 로딩 상태 시작
    setError(null); // 이전 에러 상태 초기화

    try {
      const response = await fetch("http://localhost:8080/mychannel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ googleId }),
      });

      if (!response.ok) {
        throw new Error("서버 요청 실패");
      }

      const data = await response.json();
      setChannels(data.channels || []);
    } catch (err) {
      console.error("오류 발생:", err);
      setError("유튜브 채널 정보를 가져오는 데 실패했습니다.");
    } finally {
      setLoading(false); // 로딩 상태 종료
    }
  };

  return (
    <div>
      <Nav
        userId={user?.id}
        username={user?.name || "사용자"}
        handleLogout={logout}
      />
      <div className="my-channel-container">
        <h1>내 유튜브 채널</h1>
        <div>
          <input
            type="text"
            value={googleId}
            onChange={handleInputChange}
            placeholder="Google ID를 입력하세요"
            disabled={loading} // 로딩 중에는 입력 비활성화
          />
          <button onClick={handleFetchChannels} disabled={loading}>
            {loading ? "로딩 중..." : "채널 정보 가져오기"}
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="channel-list">
          {channels.length > 0 ? (
            <ul>
              {channels.map((channel, index) => (
                <li key={index} className="channel-item">
                  <a
                    href={channel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <h3>{channel.name}</h3>
                  </a>
                  <p>구독자 수: {channel.subscribers}</p>
                  <p>채널 설명: {channel.description}</p>
                  {channel.topVideo && (
                    <div className="video-preview">
                      <h4>대표 영상: {channel.topVideo.title}</h4>
                      <a
                        href={`https://www.youtube.com/watch?v=${channel.topVideo.videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={channel.topVideo.thumbnail}
                          alt={channel.topVideo.title}
                        />
                      </a>
                      <p>조회수: {channel.topVideo.viewCount}</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            !loading && <p>등록된 유튜브 채널이 없습니다.</p> // 로딩 중일 때는 표시하지 않음
          )}
        </div>
      </div>
    </div>
  );
}

export default MyChannel;
