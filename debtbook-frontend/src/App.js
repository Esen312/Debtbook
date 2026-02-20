// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Debts from "./pages/Debts";
import Navbar from "./components/Navbar";
import DebtsDetails from "./pages/DebtsDetails";
import { ThemeProvider } from "./context/ThemeContext"; // ✅

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Navbar />
        <div style={{ padding: "20px" }}>
          <Routes>
            <Route path="/" element={<h2>Добро пожаловать в DebtsApp 📒</h2>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/debts" element={<Debts />} />
            <Route path="/debts/:id" element={<DebtsDetails />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
