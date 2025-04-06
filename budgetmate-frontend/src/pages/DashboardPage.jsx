import React from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 p-6">
      <div className="max-w-4xl mx-auto grid gap-6">
        {/* Üdvözlő kártya */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Üdv újra, {user?.fullName}! 🎉
          </h1>
          <p className="text-gray-600">Örülünk, hogy újra itt vagy a BudgetMate-ben!</p>
        </div>

        {/* Profil infók */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">👤 Profil információk</h2>
          <div className="text-gray-700 space-y-2">
            <p><strong>Teljes név:</strong> {user?.fullName}</p>
            <p><strong>Email cím:</strong> {user?.email}</p>
            <p><strong>Regisztráció:</strong> {new Date(user?.registeredAt).toLocaleString("hu-HU")}</p>
          </div>
        </div>

        {/* Gombok */}
        <div className="flex justify-between mt-4">
          <button
            onClick={() => navigate("/expenses")}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition"
          >
            Kiadások kezelése
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("user");
              window.location.href = "/";
            }}
            className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition"
          >
            Kijelentkezés
          </button>
        </div>
      </div>
    </div>
  );
}
