import React from "react";
import { ReactComponent as Logo } from "../assets/logo/logo.svg";
import "../components/nav.css";
import { Link, useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { useLocation } from "react-router-dom";
import { useAuth } from "../Page/AuthContext";

function Nav() {
  const { user, logout } = useAuth();
  const location = useLocation(); // 현재 경로 확인
  const hideNavPaths = ["/login", "/signup"]; // Nav를 숨길 경로
  const shouldHideNav = hideNavPaths.includes(location.pathname);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // AuthContext에서 상태 관리
  };

  const handleUserClick = () => {
    navigate("/my-channel");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  if (shouldHideNav) {
    return null;
  }

  return (
    <nav className="nav">
      <div className="container">
        <div className="logo">
          <Link to="/">
            <Logo />
          </Link>
        </div>

        <div className="nav-elements">
          <ul>
            <li>
              <HashLink smooth to="#home">
                Home
              </HashLink>
            </li>
            <li>
              <HashLink smooth to="#introduce">
                Introduce
              </HashLink>
            </li>
            <li>
              <Link to="/CategorySelection">Favorite</Link>
            </li>
          </ul>
        </div>

        <div className="right-elements">
          {user ? (
            <>
              <span className="user-id" onClick={handleUserClick}>
                {user?.name || "사용자"} 님
              </span>
              <button className="login-button-nav" onClick={handleLogout}>
                로그아웃
              </button>
            </>
          ) : (
            <button className="login-button-nav" onClick={handleLogin}>
              로그인
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Nav;
