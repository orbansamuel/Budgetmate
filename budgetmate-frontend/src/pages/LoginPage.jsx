import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  // 🔐 Ha már be van jelentkezve, irány a dashboardra
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      navigate("/dashboard");
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Hibás email vagy jelszó");

      const user = await res.json();
      localStorage.setItem("user", JSON.stringify(user)); // 💾 mentés
      alert("Sikeres bejelentkezés, üdv: " + user.fullName);
      navigate("/dashboard"); // ⏩ tovább a dashboardra
    } catch (err) {
      alert("Hiba: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 p-6">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Bejelentkezés</h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">Email cím</label>
            <input
              type="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="pelda@email.hu"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">Jelszó</label>
            <input
              type="password"
              id="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Bejelentkezés
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Nincs még fiókod? <a href="/regisztracio" className="text-blue-500 hover:underline">Regisztrálj itt</a>
        </p>

        <p className="mt-4 text-center text-sm text-gray-600">
  <a href="/" className="text-blue-500 hover:underline">⬅ Vissza a főoldalra</a>
</p>

      </div>
      
    </div>
  );
}
