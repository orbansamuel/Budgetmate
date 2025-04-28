import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { useAuth } from "../context/AuthContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [recurringTransactions, setRecurringTransactions] = useState([]);
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { logout } = useAuth();

  // --- Toggle for daily chart ---
  const [dailyChartType, setDailyChartType] = useState('expense'); // 'expense' or 'income'

  const [showQuickModal, setShowQuickModal] = useState(false);
  const [quickType, setQuickType] = useState('expense'); // 'expense' or 'income'
  const [quickTitle, setQuickTitle] = useState('');
  const [quickAmount, setQuickAmount] = useState('');
  const [quickCategory, setQuickCategory] = useState('');
  const [quickSuccess, setQuickSuccess] = useState(false);

  const expenseCategories = ["Élelmiszer", "Számlák", "Szórakozás", "Közlekedés", "Egyéb"];
  const incomeCategories = ["Fizetés", "Bónusz", "Befektetés", "Egyéb"];

  // Fetch all data on mount
  useEffect(() => {
    if (!user?.email) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch expenses
        const expensesRes = await fetch(`${import.meta.env.VITE_API_BASE}/api/expenses/${encodeURIComponent(user.email)}`);
        const expensesData = await expensesRes.json();
        setExpenses(Array.isArray(expensesData) ? expensesData : []);

        // Fetch incomes
        const incomesRes = await fetch(`${import.meta.env.VITE_API_BASE}/api/incomes/${encodeURIComponent(user.email)}`);
        const incomesData = await incomesRes.json();
        setIncomes(Array.isArray(incomesData) ? incomesData : []);

        // Fetch recurring transactions
        const recurringRes = await fetch(`${import.meta.env.VITE_API_BASE}/api/recurring/${encodeURIComponent(user.email)}`);
        const recurringData = await recurringRes.json();
        setRecurringTransactions(Array.isArray(recurringData) ? recurringData : []);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Hiba történt az adatok betöltése során.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.email, navigate]);

  // Calculate totals
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalIncomes = incomes.reduce((sum, income) => sum + income.amount, 0);
  const balance = totalIncomes - totalExpenses;

  // Calculate average monthly income and expenses
  const averageMonthlyIncome = incomes.reduce((sum, income) => sum + income.amount, 0) / 12;
  const averageMonthlyExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0) / 12;

  // Calculate recurring income and expenses
  const recurringIncome = recurringTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => {
      const monthlyAmount = calculateMonthlyAmount(t);
      return sum + monthlyAmount;
    }, 0);

  const recurringExpense = recurringTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => {
      const monthlyAmount = calculateMonthlyAmount(t);
      return sum + monthlyAmount;
    }, 0);

  function calculateMonthlyAmount(transaction) {
    const amount = parseFloat(transaction.amount);
    switch (transaction.interval) {
      case 'daily':
        return amount * 30;
      case 'weekly':
        return amount * 4;
      case 'monthly':
        return amount;
      case 'yearly':
        return amount / 12;
      default:
        return 0;
    }
  }

  // Calculate projected savings
  const calculateProjectedSavings = () => {
    const months = 12;
    const projectedData = [];
    let currentSavings = balance;
    const totalMonthlyIncome = averageMonthlyIncome + recurringIncome;
    const totalMonthlyExpense = averageMonthlyExpense + recurringExpense;
    const monthlySavings = totalMonthlyIncome - totalMonthlyExpense;

    for (let i = 0; i < months; i++) {
      currentSavings += monthlySavings;
      projectedData.push({
        month: new Date(new Date().setMonth(new Date().getMonth() + i + 1)).toLocaleString('hu-HU', { month: 'long' }),
        savings: Math.round(currentSavings)
      });
    }

    return projectedData;
  };

  const projectedSavings = calculateProjectedSavings();

  const chartData = {
    labels: projectedSavings.map(item => item.month.charAt(0).toUpperCase() + item.month.slice(1)),
    datasets: [
      {
        label: 'Becsült megtakarítás (Ft)',
        data: projectedSavings.map(item => item.savings),
        borderColor: '#06b6d4', // cyan-500
        backgroundColor: 'rgba(6, 182, 212, 0.15)',
        pointBackgroundColor: '#06b6d4',
        pointBorderColor: '#fff',
        pointRadius: 6,
        pointHoverRadius: 9,
        borderWidth: 4,
        fill: true,
        tension: 0.25,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 16, weight: 'bold' },
          color: '#0f172a',
        }
      },
      title: {
        display: true,
        text: 'Egy éves megtakarítás előrejelzés',
        font: { size: 22, weight: 'bold' },
        color: '#0f172a',
        padding: { top: 10, bottom: 30 }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let value = context.parsed.y;
            return `Megtakarítás: ${value.toLocaleString('hu-HU')} Ft`;
          }
        },
        backgroundColor: '#fff',
        titleColor: '#06b6d4',
        bodyColor: '#0f172a',
        borderColor: '#06b6d4',
        borderWidth: 2,
        titleFont: { weight: 'bold', size: 16 },
        bodyFont: { size: 15 },
        padding: 12,
        cornerRadius: 8,
        displayColors: false
      }
    },
    scales: {
      x: {
        ticks: {
          font: { size: 15, style: 'italic', weight: 'bold' },
          color: '#0f172a',
        },
        grid: {
          color: 'rgba(6, 182, 212, 0.08)'
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value.toLocaleString('hu-HU') + ' Ft';
          },
          font: { size: 15, weight: 'bold' },
          color: '#0f172a',
          stepSize: 500000
        },
        grid: {
          color: 'rgba(6, 182, 212, 0.08)'
        }
      }
    },
    layout: {
      padding: 20
    }
  };

  // Get category breakdown
  const expensesByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const incomesByCategory = incomes.reduce((acc, income) => {
    acc[income.category] = (acc[income.category] || 0) + income.amount;
    return acc;
  }, {});

  // Külön legutóbbi kiadások és bevételek
  const recentExpenses = expenses
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const recentIncomes = incomes
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // --- Calculate last 30 days data ---
  const getLast30Days = () => {
    const days = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      days.push(d);
    }
    return days;
  };

  const last30Days = getLast30Days();

  const dailyExpenses = last30Days.map(date => {
    const dayStr = date.toISOString().slice(0, 10);
    return expenses
      .filter(e => e.date && e.date.slice(0, 10) === dayStr)
      .reduce((sum, e) => sum + e.amount, 0);
  });

  const dailyIncomes = last30Days.map(date => {
    const dayStr = date.toISOString().slice(0, 10);
    return incomes
      .filter(i => i.date && i.date.slice(0, 10) === dayStr)
      .reduce((sum, i) => sum + i.amount, 0);
  });

  const last30DaysLabels = last30Days.map(d => `${d.getMonth() + 1}.${d.getDate()}`);

  const dailyChartSingleData = {
    labels: last30DaysLabels,
    datasets: [
      dailyChartType === 'expense'
        ? {
            label: 'Kiadás',
            data: dailyExpenses,
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            pointBackgroundColor: '#ef4444',
            pointBorderColor: '#fff',
            pointRadius: 5,
            borderWidth: 4,
            fill: true,
            tension: 0.25,
          }
        : {
            label: 'Bevétel',
            data: dailyIncomes,
            borderColor: '#22c55e',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            pointBackgroundColor: '#22c55e',
            pointBorderColor: '#fff',
            pointRadius: 5,
            borderWidth: 4,
            fill: true,
            tension: 0.25,
          }
    ]
  };

  const dailyChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 15, weight: 'bold' },
          color: '#0f172a',
        }
      },
      title: {
        display: true,
        text: 'Elmúlt 30 nap napi kiadásai és bevételei',
        font: { size: 20, weight: 'bold' },
        color: '#0f172a',
        padding: { top: 10, bottom: 20 }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let value = context.parsed.y;
            return `${context.dataset.label}: ${value.toLocaleString('hu-HU')} Ft`;
          }
        },
        backgroundColor: '#fff',
        titleColor: '#0ea5e9',
        bodyColor: '#0f172a',
        borderColor: '#0ea5e9',
        borderWidth: 2,
        titleFont: { weight: 'bold', size: 15 },
        bodyFont: { size: 14 },
        padding: 10,
        cornerRadius: 8,
        displayColors: false
      }
    },
    scales: {
      x: {
        ticks: {
          font: { size: 13, style: 'italic' },
          color: '#0f172a',
          maxRotation: 0,
          minRotation: 0,
          autoSkip: true,
          maxTicksLimit: 10
        },
        grid: {
          color: 'rgba(14, 165, 233, 0.07)'
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value.toLocaleString('hu-HU') + ' Ft';
          },
          font: { size: 13 },
          color: '#0f172a',
        },
        grid: {
          color: 'rgba(14, 165, 233, 0.07)'
        }
      }
    },
    layout: {
      padding: 16
    }
  };

  function openQuickModal(type) {
    setQuickType(type);
    setQuickTitle('');
    setQuickAmount('');
    setQuickCategory(type === 'expense' ? expenseCategories[0] : incomeCategories[0]);
    setShowQuickModal(true);
    setQuickSuccess(false);
  }

  function closeQuickModal() {
    setShowQuickModal(false);
    setQuickSuccess(false);
  }

  async function handleQuickAdd(e) {
    e.preventDefault();
    if (!quickTitle || !quickAmount || isNaN(parseFloat(quickAmount))) return;

    const newItem = {
      title: quickTitle,
      amount: parseFloat(quickAmount),
      category: quickCategory,
      userEmail: user.email,
    };

    try {
      let url = "";
      if (quickType === "expense") {
        url = `${import.meta.env.VITE_API_BASE}/api/expenses`;
      } else {
        url = `${import.meta.env.VITE_API_BASE}/api/incomes`;
      }
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      if (!res.ok) throw new Error("Hiba a mentés során");
      const added = await res.json();

      if (quickType === "expense") {
        setExpenses(prev => [...prev, added]);
      } else {
        setIncomes(prev => [...prev, added]);
      }
      setQuickSuccess(true);
      setTimeout(() => {
        setShowQuickModal(false);
        setQuickSuccess(false);
      }, 1200);
    } catch (err) {
      alert("Nem sikerült menteni: " + err.message);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-red-100 to-pink-100 p-6 flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-700">Betöltés...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-red-100 to-pink-100 p-6">
      {/* Premium Sticky Top Bar */}
      <div className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 py-3"
        style={{backdropFilter: 'blur(16px)', background: 'rgba(255,255,255,0.85)', borderBottomLeftRadius: '2rem', borderBottomRightRadius: '2rem', boxShadow: '0 4px 24px 0 rgba(6,182,212,0.10)'}}>
        {/* Left: Quick Add FABs */}
        <div className="flex gap-3">
          {/* Gyors kiadás */}
          <button
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-lg font-bold rounded-full shadow-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-200"
            onClick={() => openQuickModal('expense')}
            title="Gyors kiadás hozzáadása"
            style={{boxShadow: '0 4px 16px 0 rgba(239,68,68,0.18)'}}
          >
            <span className="text-2xl">💸</span>
            <span className="text-base font-semibold">Kiadás</span>
          </button>
          {/* Gyors bevétel */}
          <button
            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-lg font-bold rounded-full shadow-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-200"
            onClick={() => openQuickModal('income')}
            title="Gyors bevétel hozzáadása"
            style={{boxShadow: '0 4px 16px 0 rgba(34,197,94,0.18)'}}
          >
            <span className="text-2xl">💰</span>
            <span className="text-base font-semibold">Bevétel</span>
          </button>
        </div>
        {/* Center: Logo or Title */}
        <div className="flex items-center justify-center">
          <span className="text-2xl font-extrabold text-cyan-600 tracking-tight drop-shadow-sm select-none">BudgetMate</span>
        </div>
        {/* Right: Logout */}
        <div className="flex gap-2">
          <button
            onClick={() => { logout(); navigate("/bejelentkezes"); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-lg font-bold rounded-full shadow-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-200"
            title="Kijelentkezés"
            style={{boxShadow: '0 4px 16px 0 rgba(59,130,246,0.18)'}}
          >
            <span className="text-2xl">🚪</span>
            <span className="text-base font-semibold">Kijelentkezés</span>
          </button>
        </div>
      </div>
      <div className="max-w-6xl mx-auto pt-28 relative">
        {/* Quick Add Modal with blurred dashboard background */}
        {showQuickModal && (
          <>
            <div className="fixed inset-0 z-40 bg-transparent backdrop-blur-[6px] transition-all duration-300"></div>
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in">
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
                  onClick={closeQuickModal}
                  aria-label="Bezárás"
                >
                  ×
                </button>
                {quickSuccess ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <span className="text-5xl text-green-500 mb-4 animate-bounce">✔️</span>
                    <p className="text-lg font-bold text-green-700">Sikeresen hozzáadva!</p>
                  </div>
                ) : (
                  <form onSubmit={handleQuickAdd} className="space-y-5">
                    <h3 className="text-2xl font-bold text-center mb-2 text-cyan-700">
                      {quickType === 'expense' ? 'Gyors kiadás hozzáadása' : 'Gyors bevétel hozzáadása'}
                    </h3>
                    <input
                      type="text"
                      placeholder="Megnevezés"
                      className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-cyan-300"
                      value={quickTitle}
                      onChange={e => setQuickTitle(e.target.value)}
                      required
                    />
                    <input
                      type="number"
                      placeholder="Összeg (Ft)"
                      className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-cyan-300"
                      value={quickAmount}
                      onChange={e => setQuickAmount(e.target.value.replace(/[^0-9]/g, ''))}
                      required
                    />
                    <select
                      className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-cyan-300"
                      value={quickCategory}
                      onChange={e => setQuickCategory(e.target.value)}
                    >
                      {(quickType === 'expense' ? expenseCategories : incomeCategories).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white text-lg font-bold rounded-xl shadow transition-all duration-200"
                    >
                      Hozzáadás
                    </button>
                  </form>
                )}
              </div>
            </div>
          </>
        )}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">📊 Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in">
          <div className="bg-gradient-to-br from-cyan-100 to-blue-50 p-6 rounded-3xl shadow-xl hover:scale-105 transition-transform duration-300 flex flex-col items-center group">
            <span className="text-3xl mb-2">💼</span>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Havi Költségvetés</h3>
            <p className="text-3xl font-bold text-blue-600">{monthlyBudget.toLocaleString()} Ft</p>
          </div>
          <div className="bg-gradient-to-br from-red-100 to-pink-50 p-6 rounded-3xl shadow-xl hover:scale-105 transition-transform duration-300 flex flex-col items-center group">
            <span className="text-3xl mb-2">💸</span>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Összes Kiadás</h3>
            <p className="text-3xl font-bold text-red-600">{totalExpenses.toLocaleString()} Ft</p>
          </div>
          <div className="bg-gradient-to-br from-green-100 to-lime-50 p-6 rounded-3xl shadow-xl hover:scale-105 transition-transform duration-300 flex flex-col items-center group">
            <span className="text-3xl mb-2">💰</span>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Összes Bevétel</h3>
            <p className="text-3xl font-bold text-green-600">{totalIncomes.toLocaleString()} Ft</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-100 to-orange-50 p-6 rounded-3xl shadow-xl hover:scale-105 transition-transform duration-300 flex flex-col items-center group">
            <span className="text-3xl mb-2">💎</span>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Egyenleg</h3>
            <p className={`text-3xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>{balance.toLocaleString()} Ft</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-fade-in">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Kiadások kategóriánként</h3>
            <div className="space-y-2">
              {Object.entries(expensesByCategory).map(([category, amount]) => (
                <div key={category} className="flex justify-between items-center">
                  <span className="text-gray-600">{category}</span>
                  <span className="font-semibold text-red-600">{amount.toLocaleString()} Ft</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Bevételek kategóriánként</h3>
            <div className="space-y-2">
              {Object.entries(incomesByCategory).map(([category, amount]) => (
                <div key={category} className="flex justify-between items-center">
                  <span className="text-gray-600">{category}</span>
                  <span className="font-semibold text-green-600">{amount.toLocaleString()} Ft</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Savings Prediction Chart */}
        <div className="flex justify-center w-full mb-8 animate-fade-in">
          <div className="bg-white p-6 rounded-3xl shadow-2xl border border-cyan-100 w-full max-w-4xl">
            <div className="h-96 flex items-center justify-center">
              <Line data={chartData} options={chartOptions} />
            </div>
            <div className="mt-6 bg-cyan-50 rounded-2xl shadow-inner p-6 max-w-2xl mx-auto">
              <h4 className="text-lg font-bold text-cyan-700 mb-4 flex items-center gap-2">
                <span className="text-2xl">📊</span> Előrejelzés alapadatai
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-cyan-500 text-xl">💰</span>
                  <span className="text-gray-700">Átlagos havi bevétel:</span>
                  <span className="font-bold text-green-600 ml-auto">{Math.round(averageMonthlyIncome + recurringIncome).toLocaleString()} Ft</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-cyan-500 text-xl">💸</span>
                  <span className="text-gray-700">Átlagos havi kiadás:</span>
                  <span className="font-bold text-red-500 ml-auto">{Math.round(averageMonthlyExpense + recurringExpense).toLocaleString()} Ft</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-cyan-500 text-xl">📈</span>
                  <span className="text-gray-700">Rendszeres havi bevétel:</span>
                  <span className="font-bold text-green-600 ml-auto">{Math.round(recurringIncome).toLocaleString()} Ft</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-cyan-500 text-xl">📉</span>
                  <span className="text-gray-700">Rendszeres havi kiadás:</span>
                  <span className="font-bold text-red-500 ml-auto">{Math.round(recurringExpense).toLocaleString()} Ft</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Last 30 days daily chart with toggle */}
        <div className="flex justify-center w-full mb-8 animate-fade-in">
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-blue-100 w-full max-w-4xl">
            {/* Toggle */}
            <div className="flex justify-center mb-6">
              <div className="flex bg-blue-50 rounded-full p-1 shadow-inner w-64">
                <button
                  className={`flex-1 py-2 rounded-full transition-all duration-300 font-semibold text-lg focus:outline-none
                    ${dailyChartType === 'expense' ? 'bg-red-500 text-white shadow-lg scale-105' : 'text-red-500 hover:bg-red-100'}`}
                  onClick={() => setDailyChartType('expense')}
                  aria-pressed={dailyChartType === 'expense'}
                  title="Elmúlt 30 nap kiadásai"
                >
                  💸 Kiadás
                </button>
                <button
                  className={`flex-1 py-2 rounded-full transition-all duration-300 font-semibold text-lg focus:outline-none
                    ${dailyChartType === 'income' ? 'bg-green-500 text-white shadow-lg scale-105' : 'text-green-600 hover:bg-green-100'}`}
                  onClick={() => setDailyChartType('income')}
                  aria-pressed={dailyChartType === 'income'}
                  title="Elmúlt 30 nap bevételei"
                >
                  💰 Bevétel
                </button>
              </div>
            </div>
            <div className="h-80 flex items-center justify-center">
              <Line data={dailyChartSingleData} options={dailyChartOptions} />
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in mb-8">
          {/* Legutóbbi Kiadások */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Legutóbbi Kiadások</h3>
            <div className="space-y-4">
              {recentExpenses.length === 0 ? (
                <p className="text-gray-600">Nincsenek kiadások.</p>
              ) : (
                recentExpenses.map((expense, idx) => (
                  <div key={`expense-${expense.id ?? 'noid'}-${idx}`} className="flex justify-between items-center p-4 border-b last:border-b-0">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">💸</span>
                      <div>
                        <p className="font-medium">{expense.title}</p>
                        <p className="text-sm text-gray-500">{new Date(expense.date).toLocaleString("hu-HU")}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-red-600">{expense.amount.toLocaleString()} Ft</p>
                  </div>
                ))
              )}
            </div>
          </div>
          {/* Legutóbbi Bevételek */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Legutóbbi Bevételek</h3>
            <div className="space-y-4">
              {recentIncomes.length === 0 ? (
                <p className="text-gray-600">Nincsenek bevételek.</p>
              ) : (
                recentIncomes.map((income, idx) => (
                  <div key={`income-${income.id ?? 'noid'}-${idx}`} className="flex justify-between items-center p-4 border-b last:border-b-0">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">💰</span>
                      <div>
                        <p className="font-medium">{income.title}</p>
                        <p className="text-sm text-gray-500">{new Date(income.date).toLocaleString("hu-HU")}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-green-600">{income.amount.toLocaleString()} Ft</p>
                  </div>
                ))  
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center space-x-4 animate-fade-in">
          <button
            onClick={() => navigate("/local-expenses")}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-lg transition-all duration-200"
            title="Kiadások részletes kezelése"
          >
            Kiadások kezelése
          </button>
          <button
            onClick={() => navigate("/local-expenses?tab=incomes")}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow-lg transition-all duration-200"
            title="Bevételek részletes kezelése"
          >
            Bevételek kezelése
          </button>
        </div>
      </div>
    </div>
  );
} 