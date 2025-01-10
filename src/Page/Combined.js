import React from "react";
import Home from "./Home";
import Introduce from "./Introduce";
import CategorySelection from "./CategorySelection";
import Nav from "../components/Nav";

function Combined({ userId, setUserId, handleLogout }) {
  return (
    <div>
      <Nav className="Nav" handleLogout={handleLogout} />
      <Home id="home"></Home>
      <Introduce id="introduce" />
    </div>
  );
}

export default Combined;
