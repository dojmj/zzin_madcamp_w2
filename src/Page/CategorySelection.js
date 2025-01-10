import React, { useState, useEffect } from "react";
import "../Page/css/CategorySelection.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Nav from "../components/Nav";

function Animation({ setShowSelection }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSelection(true); // 일정 시간 후 상태 변경
    }, 2000);

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, [setShowSelection]);

  return <h2>당신의 콘텐츠를 찾아보세요!</h2>;
}

function CategorySelection() {
  const [showSelection, setShowSelection] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const categories = [
    "엔터테인먼트",
    "운동",
    "요리",
    "여행",
    "쇼핑",
    "역사",
    "과학",
    "외국어",
    "문학",
    "사진",
    "미술",
    "프로그래밍",
    "기기_리뷰",
    "투자_및_재태크",
    "창업",
  ];

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleNextPage = () => {
    if (selectedCategory) {
      navigate("/subtopics", { state: { category: selectedCategory } });
    } else {
      alert("카테고리를 선택해주세요!");
    }
  };

  return (
    <div>
      <Nav handleLogout={logout} />
      <div className="favorite">
        {!showSelection ? (
          <div className="animation-container">
            <Animation setShowSelection={setShowSelection} />
          </div>
        ) : (
          <div className="selection-container">
            <h1>
              <span className="username">{user?.name || "사용자"}</span>님,
              관심사 카테고리 한 가지를 선택해주세요.
            </h1>
            <div className="tags-container">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`tag-button ${
                    selectedCategory === category ? "selected" : ""
                  }`}
                  onClick={() => handleCategorySelect(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            <button className="next-button" onClick={handleNextPage}>
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategorySelection;
