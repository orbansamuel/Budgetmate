import React, { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      
      if (!res.ok) throw new Error("Hiba a regisztráció során.");

      alert("Sikeres regisztráció!");
      console.log("API_BASE:", import.meta.env.VITE_API_BASE);
    } catch (err) {
      console.log("API_BASE:", import.meta.env.VITE_API_BASE);
      alert("Hiba: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 p-6">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Regisztráció</h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="fullName" className="block mb-1 text-sm font-medium text-gray-700">Teljes név</label>
            <input
              type="text"
              id="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none"
              placeholder="Kiss Péter"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">Email cím</label>
            <input
              type="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none"
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
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition"
          >
            Regisztráció
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Már van fiókod? <a href="/bejelentkezes" className="text-green-600 hover:underline">Lépj be</a>
        </p>
        <p className="mt-4 text-center text-sm text-gray-600">
  <a href="/" className="text-blue-500 hover:underline">⬅ Vissza a főoldalra</a>
</p>

      </div>
    </div>
  );
}
