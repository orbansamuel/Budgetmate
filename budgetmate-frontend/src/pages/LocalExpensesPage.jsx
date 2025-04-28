import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function LocalExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [recurringTransactions, setRecurringTransactions] = useState([]);
  const [newExpense, setNewExpense] = useState({ title: "", amount: "", category: "Egyéb" });
  const [newIncome, setNewIncome] = useState({ title: "", amount: "", category: "Fizetés" });
  const [newRecurring, setNewRecurring] = useState({
    title: "",
    amount: "",
    category: "Fizetés",
    type: "income",
    interval: "monthly",
    startDate: new Date().toISOString().split('T')[0]
  });
  const [editingExpense, setEditingExpense] = useState(null);
  const [editingIncome, setEditingIncome] = useState(null);
  const [activeTab, setActiveTab] = useState("expenses");
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const expenseCategories = ["Élelmiszer", "Számlák", "Szórakozás", "Közlekedés", "Egyéb"];
  const incomeCategories = ["Fizetés", "Bónusz", "Befektetés", "Egyéb"];
  const intervals = [
    { value: "daily", label: "Naponta" },
    { value: "weekly", label: "Hetente" },
    { value: "monthly", label: "Havonta" },
    { value: "yearly", label: "Évente" }
  ];

  // Fetch data on mount
  useEffect(() => {
    if (!user?.email) return;

    // Fetch expenses
    fetch(`${import.meta.env.VITE_API_BASE}/api/expenses/${encodeURIComponent(user.email)}`)
      .then(res => res.json())
      .then(data => setExpenses(Array.isArray(data) ? data : []))
      .catch(() => setExpenses([]));

    // Fetch incomes
    fetch(`${import.meta.env.VITE_API_BASE}/api/incomes/${encodeURIComponent(user.email)}`)
      .then(res => res.json())
      .then(data => setIncomes(Array.isArray(data) ? data : []))
      .catch(() => setIncomes([]));

    // Fetch recurring transactions
    fetch(`${import.meta.env.VITE_API_BASE}/api/recurring/${encodeURIComponent(user.email)}`)
      .then(res => res.json())
      .then(data => setRecurringTransactions(Array.isArray(data) ? data : []))
      .catch(() => setRecurringTransactions([]));
  }, [user?.email]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab === "incomes") setActiveTab("incomes");
    else if (tab === "recurring") setActiveTab("recurring");
    else setActiveTab("expenses");
  }, [location.search]);

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expenseToSend),
      });
      if (!res.ok) throw new Error("Hiba a kiadás hozzáadásakor");
      const added = await res.json();
      setExpenses(prev => [...prev, added]);
      setNewExpense({ title: "", amount: "", category: "Egyéb" });
      alert("Kiadás sikeresen hozzáadva!");
    } catch (err) {
      console.error("Error:", err);
      alert("Nem sikerült hozzáadni a kiadást.");
    }
  };

  const handleAddIncome = async (e) => {
    e.preventDefault();
    if (!newIncome.title || !newIncome.amount || !user?.email) {
      alert("Minden mezőt ki kell tölteni!");
      return;
    }
    if (isNaN(parseFloat(newIncome.amount))) {
      alert("Az összegnek számnak kell lennie!");
      return;
    }
    const incomeToSend = {
      ...newIncome,
      amount: parseFloat(newIncome.amount),
      userEmail: user.email,
    };
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/incomes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(incomeToSend),
      });
      if (!res.ok) throw new Error("Hiba a bevétel hozzáadásakor");
      const added = await res.json();
      setIncomes(prev => [...prev, added]);
      setNewIncome({ title: "", amount: "", category: "Fizetés" });
      alert("Bevétel sikeresen hozzáadva!");
    } catch (err) {
      console.error("Error:", err);
      alert("Nem sikerült hozzáadni a bevételt.");
    }
  };

  const handleAddRecurring = async (e) => {
    e.preventDefault();
    if (!newRecurring.title || !newRecurring.amount || !user?.email) {
      alert("Minden mezőt ki kell tölteni!");
      return;
    }
    if (isNaN(parseFloat(newRecurring.amount))) {
      alert("Az összegnek számnak kell lennie!");
      return;
    }
    const recurringToSend = {
      ...newRecurring,
      amount: parseFloat(newRecurring.amount),
      userEmail: user.email,
    };
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/recurring`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recurringToSend),
      });
      if (!res.ok) throw new Error("Hiba a rendszeres tranzakció hozzáadásakor");
      const added = await res.json();
      setRecurringTransactions(prev => [...prev, added]);
      setNewRecurring({
        title: "",
        amount: "",
        category: "Fizetés",
        type: "income",
        interval: "monthly",
        startDate: new Date().toISOString().split('T')[0]
      });
      alert("Rendszeres tranzakció sikeresen hozzáadva!");
    } catch (err) {
      console.error("Error:", err);
      alert("Nem sikerült hozzáadni a rendszeres tranzakciót.");
    }
  };

  const handleDeleteItem = async (id, type) => {
    if (!window.confirm("Biztosan törölni szeretnéd ezt a tételt?")) return;
    try {
      const endpoint = type === "expense" ? "expenses" : "incomes";
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/${endpoint}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Hiba a törlés során");
      if (type === "expense") {
        setExpenses(prev => prev.filter(item => item.id !== id));
      } else {
        setIncomes(prev => prev.filter(item => item.id !== id));
      }
      alert("Tétel sikeresen törölve!");
    } catch (err) {
      console.error("Error:", err);
      alert("Nem sikerült törölni a tételt.");
    }
  };

  const handleDeleteRecurring = async (id) => {
    if (!window.confirm("Biztosan törölni szeretnéd ezt a rendszeres tranzakciót?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/recurring/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Hiba a törlés során");
      setRecurringTransactions(prev => prev.filter(item => item.id !== id));
      alert("Rendszeres tranzakció sikeresen törölve!");
    } catch (err) {
      console.error("Error:", err);
      alert("Nem sikerült törölni a rendszeres tranzakciót.");
    }
  };

  const handleEditItem = (item, type) => {
    if (type === "expense") {
      setEditingExpense(item);
    } else {
      setEditingIncome(item);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (editingExpense) {
      if (!editingExpense.title || !editingExpense.amount) {
        alert("Minden mezőt ki kell tölteni!");
        return;
      }
      try {
        const updatedExpense = {
          ...editingExpense,
          user: { id: user.id },
        };
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/expenses/${editingExpense.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedExpense),
        });
        if (!res.ok) throw new Error("Hiba a módosítás során");
        const updated = await res.json();
        setExpenses(prev => prev.map(item => item.id === updated.id ? updated : item));
        setEditingExpense(null);
        alert("Kiadás sikeresen módosítva!");
      } catch (err) {
        console.error("Error:", err);
        alert("Nem sikerült módosítani a kiadást.");
      }
    } else if (editingIncome) {
      if (!editingIncome.title || !editingIncome.amount) {
        alert("Minden mezőt ki kell tölteni!");
        return;
      }
      try {
        const updatedIncome = {
          ...editingIncome,
          user: { id: user.id },
        };
        const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/incomes/${editingIncome.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedIncome),
        });
        if (!res.ok) throw new Error("Hiba a módosítás során");
        const updated = await res.json();
        setIncomes(prev => prev.map(item => item.id === updated.id ? updated : item));
        setEditingIncome(null);
        alert("Bevétel sikeresen módosítva!");
      } catch (err) {
        console.error("Error:", err);
        alert("Nem sikerült módosítani a bevételt.");
      }
    }
  };

  const handleAmountChange = (e, type) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    const validValue = value === '' ? '' : parseInt(value, 10).toString();
    if (type === "expense") {
      if (editingExpense) {
        setEditingExpense({ ...editingExpense, amount: validValue });
      } else {
        setNewExpense({ ...newExpense, amount: validValue });
      }
    } else {
      if (editingIncome) {
        setEditingIncome({ ...editingIncome, amount: validValue });
      } else {
        setNewIncome({ ...newIncome, amount: validValue });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-red-100 to-pink-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">📊 Pénzügyek</h2>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Vissza
          </button>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 border-b">
          <button
            onClick={() => setActiveTab("expenses")}
            className={`px-4 py-2 font-medium ${activeTab === "expenses" ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          >
            Kiadások
          </button>
          <button
            onClick={() => setActiveTab("incomes")}
            className={`px-4 py-2 font-medium ${activeTab === "incomes" ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          >
            Bevételek
          </button>
          <button
            onClick={() => setActiveTab("recurring")}
            className={`px-4 py-2 font-medium ${activeTab === "recurring" ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          >
            Rendszeres tranzakciók
          </button>
        </div>

        {/* Kiadások */}
        {activeTab === "expenses" && (
          <>
            <form onSubmit={handleAddExpense} className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Kiadás címe"
                value={newExpense.title}
                onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                className="px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Összeg (Ft)"
                value={newExpense.amount}
                onChange={(e) => handleAmountChange(e, "expense")}
                className="px-4 py-2 border rounded-lg"
                required
              />
              <select
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                className="px-4 py-2 border rounded-lg"
              >
                {expenseCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
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
                    {editingExpense?.id === expense.id ? (
                      <form onSubmit={handleSaveEdit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <input
                            type="text"
                            value={editingExpense.title}
                            onChange={(e) => setEditingExpense({ ...editingExpense, title: e.target.value })}
                            className="px-4 py-2 border rounded-lg"
                            required
                          />
                          <input
                            type="text"
                            value={editingExpense.amount}
                            onChange={(e) => handleAmountChange(e, "expense")}
                            className="px-4 py-2 border rounded-lg"
                            required
                          />
                          <select
                            value={editingExpense.category}
                            onChange={(e) => setEditingExpense({ ...editingExpense, category: e.target.value })}
                            className="px-4 py-2 border rounded-lg"
                          >
                            {expenseCategories.map(category => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <button
                            type="button"
                            onClick={() => setEditingExpense(null)}
                            className="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm"
                          >
                            Mégse
                          </button>
                          <button
                            type="submit"
                            className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                          >
                            Mentés
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-lg">💸 {expense.title}</p>
                          <p className="text-sm text-gray-700">Összeg: {expense.amount} Ft</p>
                          <p className="text-sm text-gray-700">Kategória: {expense.category}</p>
                          <p className="text-sm text-gray-500">
                            Dátum: {new Date(expense.date).toLocaleString("hu-HU")}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditItem(expense, "expense")}
                            className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm"
                          >
                            Szerkesztés
                          </button>
                          <button
                            onClick={() => handleDeleteItem(expense.id, "expense")}
                            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                          >
                            Törlés
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {/* Bevételek */}
        {activeTab === "incomes" && (
          <>
            <form onSubmit={handleAddIncome} className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Bevétel címe"
                value={newIncome.title}
                onChange={(e) => setNewIncome({ ...newIncome, title: e.target.value })}
                className="px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Összeg (Ft)"
                value={newIncome.amount}
                onChange={(e) => handleAmountChange(e, "income")}
                className="px-4 py-2 border rounded-lg"
                required
              />
              <select
                value={newIncome.category}
                onChange={(e) => setNewIncome({ ...newIncome, category: e.target.value })}
                className="px-4 py-2 border rounded-lg"
              >
                {incomeCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Hozzáadás
              </button>
            </form>

            {incomes.length === 0 ? (
              <p className="text-gray-600">Nincs megjeleníthető bevétel.</p>
            ) : (
              <ul className="space-y-4">
                {incomes.map((income) => (
                  <li key={income.id} className="p-4 border rounded-lg shadow-sm bg-gray-50">
                    {editingIncome?.id === income.id ? (
                      <form onSubmit={handleSaveEdit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <input
                            type="text"
                            value={editingIncome.title}
                            onChange={(e) => setEditingIncome({ ...editingIncome, title: e.target.value })}
                            className="px-4 py-2 border rounded-lg"
                            required
                          />
                          <input
                            type="text"
                            value={editingIncome.amount}
                            onChange={(e) => handleAmountChange(e, "income")}
                            className="px-4 py-2 border rounded-lg"
                            required
                          />
                          <select
                            value={editingIncome.category}
                            onChange={(e) => setEditingIncome({ ...editingIncome, category: e.target.value })}
                            className="px-4 py-2 border rounded-lg"
                          >
                            {incomeCategories.map(category => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <button
                            type="button"
                            onClick={() => setEditingIncome(null)}
                            className="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm"
                          >
                            Mégse
                          </button>
                          <button
                            type="submit"
                            className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                          >
                            Mentés
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-lg">💰 {income.title}</p>
                          <p className="text-sm text-gray-700">Összeg: {income.amount} Ft</p>
                          <p className="text-sm text-gray-700">Kategória: {income.category}</p>
                          <p className="text-sm text-gray-500">
                            Dátum: {new Date(income.date).toLocaleString("hu-HU")}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditItem(income, "income")}
                            className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm"
                          >
                            Szerkesztés
                          </button>
                          <button
                            onClick={() => handleDeleteItem(income.id, "income")}
                            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                          >
                            Törlés
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {/* Rendszeres tranzakciók */}
        {activeTab === "recurring" && (
          <>
            <form onSubmit={handleAddRecurring} className="mb-8 grid grid-cols-1 md:grid-cols-5 gap-4">
              <input
                type="text"
                placeholder="Tranzakció címe"
                value={newRecurring.title}
                onChange={(e) => setNewRecurring({ ...newRecurring, title: e.target.value })}
                className="px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Összeg (Ft)"
                value={newRecurring.amount}
                onChange={(e) => setNewRecurring({ ...newRecurring, amount: e.target.value.replace(/[^0-9]/g, '') })}
                className="px-4 py-2 border rounded-lg"
                required
              />
              <select
                value={newRecurring.type}
                onChange={(e) => setNewRecurring({ ...newRecurring, type: e.target.value })}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="income">Bevétel</option>
                <option value="expense">Kiadás</option>
              </select>
              <select
                value={newRecurring.interval}
                onChange={(e) => setNewRecurring({ ...newRecurring, interval: e.target.value })}
                className="px-4 py-2 border rounded-lg"
              >
                {intervals.map(interval => (
                  <option key={interval.value} value={interval.value}>{interval.label}</option>
                ))}
              </select>
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Hozzáadás
              </button>
            </form>

            {recurringTransactions.length === 0 ? (
              <p className="text-gray-600">Nincs megjeleníthető rendszeres tranzakció.</p>
            ) : (
              <ul className="space-y-4">
                {recurringTransactions.map((transaction) => (
                  <li key={transaction.id} className="p-4 border rounded-lg shadow-sm bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-lg">
                          {transaction.type === "income" ? "💰" : "💸"} {transaction.title}
                        </p>
                        <p className="text-sm text-gray-700">Összeg: {transaction.amount} Ft</p>
                        <p className="text-sm text-gray-700">Típus: {transaction.type === "income" ? "Bevétel" : "Kiadás"}</p>
                        <p className="text-sm text-gray-700">Ismétlődés: {intervals.find(i => i.value === transaction.interval)?.label}</p>
                        <p className="text-sm text-gray-500">
                          Kezdés: {new Date(transaction.startDate).toLocaleString("hu-HU")}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDeleteRecurring(transaction.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                        >
                          Törlés
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
} 