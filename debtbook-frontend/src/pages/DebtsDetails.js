// src/pages/DebtsDetails.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { FiEdit, FiTrash2, FiSave, FiX } from "react-icons/fi";
import "./DebtsDetails.css";

function DebtsDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [debt, setDebt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDebt, setEditedDebt] = useState(null);

  useEffect(() => {
    const fetchDebt = async () => {
      try {
        const response = await api.get(`/debts/${id}/`);
        setDebt(response.data);
        setEditedDebt(response.data);
      } catch (err) {
        console.error("Ошибка загрузки деталей долга:", err);
        if (err.response && err.response.status === 401) {
          alert("⚠️ Сессия истекла, авторизуйтесь заново.");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDebt();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm("Вы уверены, что хотите удалить этот долг?")) return;

    try {
      await api.delete(`/debts/${id}/`);
      alert("Долг удалён!");
      navigate("/debts");
    } catch (err) {
      console.error("Ошибка при удалении:", err);
      if (err.response && err.response.status === 401) {
        alert("⚠️ Сессия истекла, авторизуйтесь заново.");
        navigate("/login");
      }
    }
  };

  const handleSave = async () => {
    try {
      const response = await api.put(`/debts/${id}/`, {
        amount: Number(editedDebt.amount), // ✅ приводим к числу
        description: editedDebt.description,
        debtor: {
          last_name: editedDebt.debtor?.last_name || "",
          first_name: editedDebt.debtor?.first_name || "",
          middle_name: editedDebt.debtor?.middle_name || "",
          phone: editedDebt.debtor?.phone || "",
        },
      });

      setDebt(response.data);
      setIsEditing(false);
      alert("Изменения сохранены!");
    } catch (err) {
      console.error("Ошибка при сохранении:", err);
      alert("❌ Не удалось сохранить изменения.");
    }
  };

  const renderStatus = (debt) => {
    if (debt.amount === 0 || debt.is_paid) {
      return <span className="status-paid">Оплачен</span>;
    } else {
      return <span className="status-unpaid">Не оплачен</span>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) return <p>Загрузка...</p>;
  if (!debt) return <p>Долг не найден.</p>;

  return (
    <div className="details-container">
      <h2 className="details-title">Детали долга</h2>

      {isEditing ? (
        <>
          <p className="details-item">
            <strong>Фамилия:</strong>
            <input
              type="text"
              className="details-input"
              value={editedDebt.debtor?.last_name || ""}
              onChange={(e) =>
                setEditedDebt({
                  ...editedDebt,
                  debtor: { ...editedDebt.debtor, last_name: e.target.value },
                })
              }
            />
          </p>
          <p className="details-item">
            <strong>Имя:</strong>
            <input
              type="text"
              className="details-input"
              value={editedDebt.debtor?.first_name || ""}
              onChange={(e) =>
                setEditedDebt({
                  ...editedDebt,
                  debtor: { ...editedDebt.debtor, first_name: e.target.value },
                })
              }
            />
          </p>
          <p className="details-item">
            <strong>Отчество:</strong>
            <input
              type="text"
              className="details-input"
              value={editedDebt.debtor?.middle_name || ""}
              onChange={(e) =>
                setEditedDebt({
                  ...editedDebt,
                  debtor: { ...editedDebt.debtor, middle_name: e.target.value },
                })
              }
            />
          </p>
          <p className="details-item">
            <strong>Телефон:</strong>
            <input
              type="text"
              className="details-input"
              value={editedDebt.debtor?.phone || ""}
              onChange={(e) =>
                setEditedDebt({
                  ...editedDebt,
                  debtor: { ...editedDebt.debtor, phone: e.target.value },
                })
              }
            />
          </p>
          <p className="details-item">
            <strong>Сумма:</strong>
            <input
              type="number"
              className="details-input"
              value={editedDebt.amount || 0}
              onChange={(e) =>
                setEditedDebt({ ...editedDebt, amount: e.target.value })
              }
            />{" "}
            сом
          </p>
          <p className="details-item">
            <strong>Описание:</strong>
            <textarea
              className="details-textarea"
              value={editedDebt.description || ""}
              onChange={(e) =>
                setEditedDebt({ ...editedDebt, description: e.target.value })
              }
            />
          </p>
        </>
      ) : (
        <>
          <p className="details-item">
            <strong>Фамилия:</strong> {debt.debtor?.last_name || ""}
          </p>
          <p className="details-item">
            <strong>Имя:</strong> {debt.debtor?.first_name || ""}
          </p>
          <p className="details-item">
            <strong>Отчество:</strong> {debt.debtor?.middle_name || ""}
          </p>
          <p className="details-item">
            <strong>Телефон:</strong> {debt.debtor?.phone || ""}
          </p>
          <p className="details-item">
            <strong>Сумма:</strong> {debt.amount || 0} сом
          </p>
          <p className="details-item">
            <strong>Дата:</strong> {formatDate(debt.created_at)}
          </p>
          <p className="details-item">
            <strong>Статус:</strong> {renderStatus(debt)}
          </p>
          <p className="details-item">
            <strong>Описание:</strong> {debt.description || ""}
          </p>
        </>
      )}

      <div className="details-actions">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="btn save-btn">
              <FiSave /> Сохранить
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="btn cancel-btn"
            >
              <FiX /> Отмена
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="btn edit-btn"
            >
              <FiEdit /> Редактировать
            </button>
            <button onClick={handleDelete} className="btn delete-btn">
              <FiTrash2 /> Удалить
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default DebtsDetails;
