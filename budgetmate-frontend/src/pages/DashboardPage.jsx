import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [monthlyBudget, setMonthlyBudget] = useState(100000); // Alapértelmezett havi keret
  const [categories, setCategories] = useState({
    "Élelmiszer": 0,
    "Számlák": 0,
    "Szórakozás": 0,
    "Közlekedés": 0,
    "Egyéb": 0
  });

  useEffect(() => {
    const savedExpenses = localStorage.getItem('localExpenses');
    if (savedExpenses) {
      const parsedExpenses = JSON.parse(savedExpenses);
      setExpenses(parsedExpenses);
      
      // Kategóriák kiszámítása
      const newCategories = { ...categories };
      parsedExpenses.forEach(expense => {
        const category = expense.category || "Egyéb";
        newCategories[category] = (newCategories[category] || 0) + expense.amount;
      });
      setCategories(newCategories);
    }
  }, []);

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBudget = monthlyBudget - totalExpenses;
  const budgetPercentage = (totalExpenses / monthlyBudget) * 100;

  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 p-6">
      <div className="max-w-6xl mx-auto grid gap-6">
        {/* Fejléc */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Üdvözöl a BudgetMate! 🎉
          </h1>
          <p className="text-gray-600">Kövesd nyomon a pénzügyeidet egyszerűen és hatékonyan</p>
        </div>

        {/* Fő statisztikák */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Havi költségkeret</h2>
            <p className="text-3xl font-bold text-blue-600">{monthlyBudget.toLocaleString()} Ft</p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Eddigi kiadások</h2>
            <p className="text-3xl font-bold text-red-600">{totalExpenses.toLocaleString()} Ft</p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Maradék keret</h2>
            <p className={`text-3xl font-bold ${remainingBudget < 0 ? 'text-red-600' : 'text-green-600'}`}>
              {remainingBudget.toLocaleString()} Ft
            </p>
          </div>
        </div>

        {/* Költségkeret progress bar */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-700">Költségkeret kihasználtság</span>
            <span className="text-gray-700">{Math.round(budgetPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className={`h-4 rounded-full ${budgetPercentage > 100 ? 'bg-red-600' : 'bg-blue-600'}`}
              style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Kategóriák */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Kiadások kategóriák szerint</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(categories).map(([category, amount]) => (
              <div key={category} className="p-4 border rounded-lg">
                <h3 className="font-semibold text-gray-800">{category}</h3>
                <p className="text-lg text-blue-600">{amount.toLocaleString()} Ft</p>
              </div>
            ))}
          </div>
        </div>

        {/* Legutóbbi kiadások */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Legutóbbi kiadások</h2>
            <button
              onClick={() => navigate("/local-expenses")}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Összes kiadás
            </button>
          </div>
          {recentExpenses.length === 0 ? (
            <p className="text-gray-600">Még nincsenek kiadások.</p>
          ) : (
            <ul className="space-y-4">
              {recentExpenses.map((expense) => (
                <li key={expense.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-lg">{expense.title}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(expense.date).toLocaleString("hu-HU")}
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-red-600">{expense.amount.toLocaleString()} Ft</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Gyors műveletek */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Gyors műveletek</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/local-expenses")}
              className="p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 text-center"
            >
              <span className="text-xl">➕</span>
              <p className="mt-2">Új kiadás hozzáadása</p>
            </button>
            <button
              onClick={() => {
                const newBudget = prompt("Add meg az új havi költségkeretet (Ft):", monthlyBudget);
                if (newBudget && !isNaN(newBudget)) {
                  setMonthlyBudget(parseInt(newBudget));
                }
              }}
              className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-center"
            >
              <span className="text-xl">💰</span>
              <p className="mt-2">Költségkeret módosítása</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
