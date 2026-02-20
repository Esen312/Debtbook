import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    last_name: "",
    shop_name: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/accounts/register/", formData);
      navigate("/login");
    } catch (err) {
      setError("Ошибка при регистрации. Проверьте данные.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Регистрация</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Введите email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="username"
          placeholder="Введите имя пользователя"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="last_name"
          placeholder="Введите фамилию"
          value={formData.last_name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="shop_name"
          placeholder="Название магазина"
          value={formData.shop_name}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Введите пароль"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Зарегистрироваться</button>
      </form>
      <p>
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </p>
    </div>
  );
}

export default Register;
