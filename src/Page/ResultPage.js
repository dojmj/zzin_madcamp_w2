import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../Page/css/ResultPage.css";
import { useAuth } from "./AuthContext";
import Nav from "../components/Nav";

function ResultPage() {
  const location = useLocation();
  const { selectedSubtopics } = location.state || {};
  const [responseData, setResponseData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const fordev = true;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!selectedSubtopics || selectedSubtopics.length === 0) {
          setError("선택한 태그가 없습니다.");
          return;
        }

        let data;

        if (!fordev) {
          // 개발 환경에서는 로컬 JSON 파일 사용
          const response = await fetch("/youtubeChannelsforTest.json");
          if (!response.ok) {
            throw new Error("로컬 JSON 파일을 불러오는 중 오류 발생");
          }
          data = await response.json();
        } else {
          const response = await fetch("http://localhost:8080/favorite", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ tags: selectedSubtopics }),
          });

          if (!response.ok) {
            throw new Error("서버 요청 실패");
          }

          data = await response.json();
        }
        setResponseData({ youtubeChannels: data });
        setError(null); // 에러 상태 초기화

        console.log("응답 데이터:", data);
      } catch (error) {
        console.error("오류 발생:", error);
        setError(error.message);
        alert("요청 중 문제가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedSubtopics]);

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (loading) {
    return <p className="loading">결과를 로드 중입니다...</p>;
  }

  if (!responseData || responseData.length === 0) {
    return <p>추천 결과가 없습니다. 다시 시도해주세요.</p>;
  }
  console.log("유튜브 채널 데이터:", responseData.youtubeChannels);

  return (
    <div>
      <Nav handleLogout={logout} />
      <div className="result-container">
        <h1 className="fav-title">관심에서 진심으로, 진심에서 콘텐츠로</h1>
        <div className="card-grid">
          {responseData.youtubeChannels.map((channel, index) => (
            <div
              className="card"
              key={index}
              onClick={() => window.open(channel.url, "_blank")}
            >
              <div className="card-header">
                <img
                  src={channel.channelPicture}
                  alt={channel.name}
                  className="card-image"
                />
              </div>
              <div className="card-body">
                <h3>{channel.name}</h3>
                <p>구독자 수: {channel.subscribers.toLocaleString()}</p>
                {channel.topVideo && (
                  <>
                    <p>누적 조회수: {channel.totalViews}</p>
                    <a
                      href={`https://www.youtube.com/watch?v=${channel.topVideo.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="video-link"
                      onClick={(e) => e.stopPropagation()}
                    >
                      대표 영상 보기
                    </a>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ResultPage;
