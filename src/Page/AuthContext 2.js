import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (userData) => {
    const userWithUsername = {
      id: userData.id,
      name: userData.name || "사용자", // username이 없을 경우 기본값 설정
    };

    setUser(userWithUsername);
    localStorage.setItem("user", JSON.stringify(userWithUsername));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    alert("로그아웃 되었습니다.");
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
