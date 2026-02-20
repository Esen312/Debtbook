import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import api from "../api";
import "./Debts.css";

function Debts() {
  const [debts, setDebts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(false); // ✅ тёмный режим
  const [formData, setFormData] = useState({
    last_name: "",
    first_name: "",
    amount: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [editingAmount, setEditingAmount] = useState("");

  const itemsPerPage = 5;

  const fetchDebts = async () => {
    try {
      const response = await api.get("/debts/");
      const sorted = response.data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setDebts(sorted);
    } catch (error) {
      console.error("Ошибка загрузки долгов:", error);
      if (error.response && error.response.status === 401) {
        alert("⚠️ Сессия истекла, авторизуйтесь заново.");
      }
    }
  };

  useEffect(() => {
    fetchDebts();
  }, []);

  // ✅ применяем класс dark-mode к body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/debts/", {
        debtor: {
          last_name: formData.last_name,
          first_name: formData.first_name,
        },
        amount: Number(formData.amount),
      });
      setFormData({ last_name: "", first_name: "", amount: "" });
      fetchDebts();
    } catch (error) {
      console.error("Ошибка добавления долга:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Удалить этот долг?")) return;
    try {
      await api.delete(`/debts/${id}/`);
      fetchDebts();
    } catch (error) {
      console.error("Ошибка удаления:", error);
    }
  };

  const handleAmountClick = (debt) => {
    setEditingId(debt.id);
    setEditingAmount(debt.amount);
  };

  const handleAmountChange = (e) => {
    setEditingAmount(e.target.value);
  };

  const handleAmountBlur = async (debt) => {
    try {
      const newAmount = Number(editingAmount);
      await api.patch(`/debts/${debt.id}/`, {
        amount: newAmount,
      });
      setEditingId(null);
      setEditingAmount("");
      fetchDebts();
    } catch (error) {
      console.error("Ошибка обновления суммы:", error);
    }
  };

  // ✅ фильтрация
  const filtered = debts
    .filter(
      (d) =>
        d.debtor.last_name.toLowerCase().includes(search.toLowerCase()) ||
        d.debtor.first_name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((d) => {
      if (filter === "paid") return d.is_paid || d.amount === 0;
      if (filter === "unpaid") return !(d.is_paid || d.amount === 0);
      return true;
    });

  const startIndex = (page - 1) * itemsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const renderStatus = (debt) => {
    if (debt.is_paid || debt.amount === 0) {
      return <span className="status-paid">🟢 Оплачен</span>;
    } else {
      return <span className="status-unpaid">🔴 Не оплачен</span>;
    }
  };

  return (
    <div className="table-container">
      <div className="header-bar">
        <h2 className="page-title">📒 Список долгов</h2>

        {/* ✅ Свитч переключения темы */}
        <label className="switch">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          <span className="slider"></span>
        </label>
      </div>

      {/* 🔍 Поиск */}
      <div className="controls-bar">
        <input
          type="text"
          placeholder="Поиск по имени или фамилии..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <h3 className="page-title">Добавить долг</h3>

      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="text"
          name="last_name"
          placeholder="Фамилия"
          value={formData.last_name}
          onChange={handleChange}
          required
          className="form-input"
        />
        <input
          type="text"
          name="first_name"
          placeholder="Имя"
          value={formData.first_name}
          onChange={handleChange}
          required
          className="form-input"
        />
        <input
          type="number"
          name="amount"
          placeholder="Сумма"
          value={formData.amount}
          onChange={handleChange}
          required
          className="form-input"
        />
        <button type="submit" className="submit-btn">
          Добавить
        </button>
      </form>

      <div className="filter-container">
        <label className="filter-label">Фильтр:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">Все</option>
          <option value="paid">Оплаченные</option>
          <option value="unpaid">Неоплаченные</option>
        </select>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Фамилия</th>
            <th>Имя</th>
            <th>Сумма</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((debt) => (
            <tr key={debt.id} className="table-row">
              <td className="table-cell">
                <Link to={`/debts/${debt.id}`} className="link">
                  {debt.debtor.last_name}
                </Link>
              </td>
              <td className="table-cell">
                <Link to={`/debts/${debt.id}`} className="link">
                  {debt.debtor.first_name}
                </Link>
              </td>
              <td
                className="table-cell amount-cell"
                onClick={() => handleAmountClick(debt)}
              >
                {editingId === debt.id ? (
                  <input
                    type="number"
                    value={editingAmount}
                    onChange={handleAmountChange}
                    onBlur={() => handleAmountBlur(debt)}
                    autoFocus
                    className="edit-input"
                  />
                ) : (
                  debt.amount
                )}
              </td>
              <td className="table-cell status-cell">{renderStatus(debt)}</td>
              <td className="table-cell actions-cell">
                <button
                  onClick={() => handleAmountClick(debt)}
                  className="icon-btn edit-btn"
                >
                  <FiEdit />
                </button>
                <button
                  onClick={() => handleDelete(debt.id)}
                  className="icon-btn delete-btn"
                >
                  <FiTrash2 />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={page === i + 1 ? "page-btn active" : "page-btn"}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Debts;
