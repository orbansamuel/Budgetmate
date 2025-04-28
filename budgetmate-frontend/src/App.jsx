import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// App.jsx – csak Routes és Route legyen!
import React from "react";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ExpensesPage from "./pages/ExpensesPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./compoments/ProtectedRoute";
import LocalExpensesPage from "./pages/LocalExpensesPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/bejelentkezes" element={<LoginPage />} />
      <Route path="/regisztracio" element={<RegisterPage />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/expenses" element={
        <ProtectedRoute>
          <ExpensesPage />
        </ProtectedRoute>
      } />
      <Route path="/local-expenses" element={<LocalExpensesPage />} />
    </Routes>
  );
}

export default App;
