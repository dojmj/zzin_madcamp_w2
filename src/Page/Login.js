import React, { useState } from "react";
import "../Page/css/Login.css";
import { ReactComponent as Logo } from "../assets/logo/logo.svg";
import { ReactComponent as Google } from "../assets/icons/google.svg";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import axios from "axios";

function Login({ setUserId }) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log("Id:", id, "Password:", password);
    try {
      const response = await axios.post(
        "http://localhost:8080/auth/login", // API 엔드포인트
        {
          userid: id,
          password: password,
        }
      );

      console.log("Login successful:", response.data);
      const user = { id, name: response.data.name }; // 서버 데이터 기반으로 수정 가능
      login(user);

      navigate("/");
      alert("로그인 성공!");
    } catch (error) {
      console.error("Login failed:", error);
      alert("로그인 실패: 아이디와 비밀번호를 확인하세요.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await axios.get("http://localhost:8080/login");
      console.log("Google login successful:", response.data);

      // 구글 로그인 후 사용자 정보를 AuthContext에 저장
      const user = { id: response.data.id, name: response.data.name };
      login(user);

      navigate("/"); // 홈 화면으로 이동
      alert("구글 로그인 성공!");
    } catch (error) {
      console.error("Google login failed:", error);
      alert("구글 로그인 실패: 다시 시도해주세요.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-logo">
        <Link to="/">
          <Logo />
        </Link>
      </div>

      <div className="input-container">
        <input
          type="text"
          placeholder="아이디"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button className="login-button" onClick={handleLogin}>
        로그인
      </button>
      <div className="links">
        <span>비밀번호 찾기</span> |{" "}
        <span>
          <Link to="/Signup">회원가입</Link>
        </span>
      </div>

      <div className="divider"></div>

      <a href="http://localhost:8080/login">
        <button className="google-button" onClick={handleGoogleLogin}>
          <Google />
          구글 로그인
        </button>
      </a>
    </div>
  );
}

export default Login;
