import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ title: "", amount: "" });
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.email) return;

    fetch(`${import.meta.env.VITE_API_BASE}/api/expenses/${encodeURIComponent(user.email)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Nincs ilyen végpont vagy hiba történt");
        return res.json();
      })
      .then((data) => {
        setExpenses(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Hiba a lekérdezéskor:", err);
        setExpenses([]);
      });
  }, [user?.email]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
  
    if (!newExpense.title || !newExpense.amount || !user?.email) {
      alert("Minden mezőt ki kell tölteni!");
      return;
    }
  
    if (isNaN(parseFloat(newExpense.amount))) {
      alert("Az összegnek számnak kell lennie!");
      return;
    }
  
    const expenseToSend = {
      ...newExpense,
      amount: parseFloat(newExpense.amount),
      userEmail: user.email,
    };
  
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expenseToSend),
      });
  
      if (!res.ok) throw new Error("Hiba a kiadás hozzáadásakor");
      const added = await res.json();
      setExpenses((prev) => [...prev, added]);
      setNewExpense({ title: "", amount: "" });
    } catch (err) {
      console.error("Error:", err);
      alert("Nem sikerült hozzáadni a kiadást.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-red-100 to-pink-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">📊 Kiadások</h2>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Vissza
          </button>
        </div>

        <form onSubmit={handleAddExpense} className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Kiadás címe"
            value={newExpense.title}
            onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
            className="px-4 py-2 border rounded-lg"
            required
          />
          <input
            type="number"
            placeholder="Összeg (Ft)"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
            className="px-4 py-2 border rounded-lg"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Hozzáadás
          </button>
        </form>

        {expenses.length === 0 ? (
          <p className="text-gray-600">Nincs megjeleníthető kiadás.</p>
        ) : (
          <ul className="space-y-4">
            {expenses.map((expense) => (
              <li key={expense.id} className="p-4 border rounded-lg shadow-sm bg-gray-50">
                <p className="font-semibold text-lg">💸 {expense.title}</p>
                <p className="text-sm text-gray-700">Összeg: {expense.amount} Ft</p>
                <p className="text-sm text-gray-500">
                  Dátum: {new Date(expense.date).toLocaleString("hu-HU")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}