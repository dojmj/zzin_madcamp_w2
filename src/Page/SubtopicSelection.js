import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../Page/css/SubtopicSelection.css";
import { useAuth } from "./AuthContext";
import Nav from "../components/Nav";

const subtopicsByCategory = {
  엔터테인먼트: [
    "영화",
    "액션 영화",
    "로맨스 영화",
    "SF 영화",
    "다큐멘터리",
    "음악",
    "K-pop",
    "힙합",
    "클래식 음악",
    "재즈",
    "TV 및 드라마",
    "넷플릭스 추천",
    "드라마 리뷰",
    "예능 프로그램",
    "공연 및 이벤트",
    "콘서트 리뷰",
    "뮤지컬 추천",
    "연극",
    "팬미팅",
    "독립 영화",
    "웹툰_및_웹소설",
  ],
  운동: [
    "홈 트레이닝",
    "요가",
    "헬스 및 웨이트 트레이닝",
    "달리기",
    "필라테스",
    "크로스핏",
    "자전거 타기",
    "등산",
  ],
  요리: [
    "비건 요리",
    "간단 레시피",
    "전통 한국 요리",
    "디저트 만들기",
    "세계 요리",
    "홈메이드 음료",
    "바비큐",
  ],
  여행: [
    "국내 여행",
    "해외 여행",
    "캠핑",
    "배낭 여행",
    "럭셔리 여행",
    "자연 탐방",
    "도시 여행",
  ],
  쇼핑: [
    "할인 및 꿀팁",
    "패션 리뷰",
    "최신 가전제품",
    "온라인 쇼핑몰 추천",
    "인테리어 소품",
    "뷰티 제품 리뷰",
  ],
  역사: [
    "한국사",
    "세계사",
    "민속 문화",
    "유물 탐구",
    "고대 문명",
    "전쟁 역사",
  ],
  과학: [
    "우주 과학",
    "생물학",
    "물리학",
    "화학",
    "최신 과학 기술",
    "환경 과학",
    "인공지능",
  ],
  외국어: [
    "영어 회화",
    "일본어 배우기",
    "중국어 기초",
    "스페인어 팁",
    "프랑스어 기초",
    "독일어 기초",
  ],
  문학: [
    "책 리뷰 및 추천",
    "소설 리뷰",
    "자기계발서 추천",
    "경제 관련 도서",
    "철학 책 추천",
    "시집 추천",
    "에세이 리뷰",
  ],
  사진: [
    "풍경 사진",
    "인물 사진",
    "사진 편집",
    "촬영 기법",
    "스마트폰 사진",
    "야경 사진",
    "드론 촬영",
  ],
  미술: [
    "현대 미술",
    "전통 회화",
    "디지털 아트",
    "조각 예술",
    "일러스트",
    "타투 디자인",
  ],
  프로그래밍: [
    "자바스크립트",
    "파이썬",
    "데이터 분석",
    "웹 개발",
    "앱 개발",
    "알고리즘 기초",
    "React 학습",
  ],
  기기_리뷰: [
    "스마트폰 비교",
    "노트북 추천",
    "태블릿 리뷰",
    "카메라 장비",
    "게이밍 기어",
    "이어폰 및 헤드셋",
  ],
  투자_및_재테크: [
    "주식 기초",
    "ETF 추천",
    "재테크",
    "저축 팁",
    "부동산 투자",
    "채권 투자",
    "비트코인",
  ],
  창업: [
    "스타트업",
    "창업 아이디어",
    "벤처 투자",
    "비즈니스 모델",
    "소셜 미디어 마케팅",
    "전자상거래",
  ],
};

function SubtopicSelection() {
  const location = useLocation();
  const { category } = location.state || {};
  const [selectedSubtopics, setSelectedSubtopics] = useState([]);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  if (!category) {
    return (
      <p className="error">카테고리를 선택하지 않았습니다. 다시 시도하세요.</p>
    );
  }

  const handleSubtopicToggle = (subtopic) => {
    if (selectedSubtopics.includes(subtopic)) {
      setSelectedSubtopics(
        selectedSubtopics.filter((item) => item !== subtopic)
      );
    } else {
      setSelectedSubtopics([...selectedSubtopics, subtopic]);
    }
  };

  const handleNextPage = () => {
    if (selectedSubtopics.length === 0) {
      alert("태그를 하나 이상 선택해주세요.");
      return;
    }

    navigate("/results", { state: { selectedSubtopics } });
  };

  return (
    <div>
      <Nav handleLogout={logout} />
      <div className="subtopic-container">
        <h1>
          <span className="username">{user?.name || "사용자"}</span>님,{" "}
          {category}의 세부 관심사를 모두 선택해주세요.
        </h1>
        <div className="subtopics">
          {(subtopicsByCategory[category] || []).map((subtopic) => (
            <button
              key={subtopic}
              className={`subtopic-button ${
                selectedSubtopics.includes(subtopic) ? "selected" : ""
              }`}
              onClick={() => handleSubtopicToggle(subtopic)}
            >
              {subtopic}
            </button>
          ))}
        </div>
        <button className="finish-button" onClick={handleNextPage}>
          Finish
        </button>
      </div>
    </div>
  );
}

export default SubtopicSelection;
