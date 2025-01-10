import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./Page/AuthContext";
import "./App.css";
import Combined from "./Page/Combined";
import Login from "./Page/Login";
import Signup from "./Page/Signup";
import CategorySelection from "./Page/CategorySelection";
import SubtopicSelection from "./Page/SubtopicSelection";
import ResultPage from "./Page/ResultPage";
import MyChannel from "./Page/MyChannel";

function AppRoutes() {
  const { user, login, logout } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userParam = params.get("user");

    if (userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam)); // URL 파라미터에서 사용자 정보 디코드
        console.log("Decoded user data:", user);
        login(user); // 사용자 정보를 AuthContext에 저장
      } catch (error) {
        console.error("Failed to parse user data from URL:", error);
      }
    }
  }, [login]);

  return (
    <Routes>
      <Route
        path="/"
        element={<Combined user={user} handleLogout={logout} />}
      />

      <Route path="/login" element={<Login handleLogin={login} />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/CategorySelection"
        element={<CategorySelection user={user} handleLogout={logout} />}
      />
      <Route
        path="/subtopics"
        element={<SubtopicSelection user={user} handleLogout={logout} />}
      />
      <Route
        path="/results"
        element={<ResultPage user={user} handleLogout={logout} />}
      />
      <Route
        path="/my-channel"
        element={<MyChannel user={user} handleLogout={logout} />}
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
export default App;
