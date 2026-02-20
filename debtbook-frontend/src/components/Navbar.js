import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  const isAuthenticated = !!localStorage.getItem("access");

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">📒 DebtsApp</Link>
      </div>
      <ul className="navbar-links">
        {isAuthenticated ? (
          <>
            <li><Link to="/debts">Список долгов</Link></li>
            <li><button onClick={handleLogout} className="logout-btn">Выйти</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Войти</Link></li>
            <li><Link to="/register">Регистрация</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
