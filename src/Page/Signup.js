import React, { useState } from "react";
import "../Page/css/Signup.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    lastName: "",
    firstName: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 비밀번호 확인 검증
    if (form.password !== form.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      // 백엔드로 전달할 데이터
      const response = await axios.post(
        "http://localhost:8080/join", // API 엔드포인트
        {
          userid: form.username, // 사용자 ID
          password: form.password, // 비밀번호
          firstName: form.firstName, // 이름 (First Name)
          lastName: form.lastName, // 성 (Last Name)
        }
      );

      // 서버로부터 받은 데이터를 처리
      console.log("회원가입 성공:", response.data);

      // 회원가입 성공 시 알림 표시 및 이동
      alert("회원가입 성공!");
      navigate("/login");
    } catch (error) {
      console.error("회원가입 실패:", error);
      // alert("회원가입 실패: " + (error.response?.data || "서버 오류"));
      alert("회원가입 실패: " + error);
    }
  };

  return (
    <div className="signup-container">
      <h1 className="signup-title">회원가입</h1>
      <p className="signup-subtitle">
        YouWithMe와 함께 크리에이터가 되어보세요!
      </p>
      <form onSubmit={handleSubmit} className="signup-form">
        <input
          type="text"
          name="lastName"
          placeholder="성"
          value={form.lastName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="firstName"
          placeholder="이름"
          value={form.firstName}
          onChange={handleChange}
        />
        <div className="username-container">
          <input
            className="username-input"
            type="text"
            name="username"
            placeholder="아이디"
            value={form.username}
            onChange={handleChange}
          />
          <button type="button" className="check-button">
            중복확인
          </button>
        </div>
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={form.password}
          onChange={handleChange}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="비밀번호 확인"
          value={form.confirmPassword}
          onChange={handleChange}
        />
        <button type="submit" className="signup-button" onClick={handleLogin}>
          회원가입
        </button>
      </form>
    </div>
  );
}

export default Signup;
