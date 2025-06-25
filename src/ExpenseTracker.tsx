import React, { useState, useMemo } from "react";
import type { User } from "firebase/auth";
import LoadingSpinner from "./components/LoadingSpinner";
import { Header } from "./components/Header";
import { Navigation } from "./components/Navigation";
import { PeriodSelector } from "./components/PeriodSelector";
import { QuickStats } from "./components/QuickStats";
import ExpenseForm from "./components/ExpenseForm";
import  Dashboard  from "./views/Dashboard";
import ExpensesList from "./views/ExpensesList";
import Analytics from "./views/Analytics";
import { useExpenses } from "./hooks/useExpenses";
import { useFilters } from "./hooks/useFilters";
import { useChartData } from "./hooks/useChartData";
import { exportExpensesToCSV } from "./utils/exportData";
import type { ViewMode, CurrentView, FormData, Expense } from "./types";

interface Props {
  user: User;
  onLogout: () => void;
}

const ExpenseTracker: React.FC<Props> = ({ user, onLogout }) => {
  // State for UI controls
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentView, setCurrentView] = useState<CurrentView>("dashboard");
  const [viewMode, setViewMode] = useState<ViewMode>("monthly");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Custom hooks for data management
  const {
    expenses,
    loading,
    error,
    setError,
    categories,
    addExpense,
    updateExpense,
    deleteExpense,
    editingExpense,
    setEditingExpense,
    availableYears,
  } = useExpenses(user.uid);

  // Initialize form data state
  const [formData, setFormData] = useState<FormData>({
    amount: "",
    description: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    paymentMethod: "upi",
  });

  const {
    filters,
    setFilters,
    filteredExpenses,
  } = useFilters(expenses);

  // Get current expenses based on filters and selected period
  const currentExpenses = useMemo(() => {
    // Filter by selected month/year if in monthly view
    if (viewMode === "monthly") {
      return filteredExpenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === selectedMonth &&
               expenseDate.getFullYear() === selectedYear;
      });
    } else {
      // Filter by selected year if in yearly view
      return filteredExpenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getFullYear() === selectedYear;
      });
    }
  }, [filteredExpenses, viewMode, selectedMonth, selectedYear]);

  const {
    totalExpenses,
    averageExpense,
    monthlyData,
    trendData,
    categoryData,
  } = useChartData(filteredExpenses, currentExpenses, selectedMonth, selectedYear, viewMode);

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingExpense) {
        await updateExpense(editingExpense.id, formData);
      } else {
        await addExpense(formData);
      }
      setShowAddForm(false);
      setEditingExpense(null);
    } catch (err) {
      console.error("Error saving expense:", err);
      setError("Failed to save expense. Please try again.");
    }
  };

  // Handle expense editing
  const handleEdit = (expense: Expense) => {
    setFormData({
      amount: expense.amount.toString(),
      description: expense.description,
      category: expense.category,
      date: expense.date,
      paymentMethod: expense.paymentMethod,
    });
    setEditingExpense(expense);
    setShowAddForm(true);
  };

  // Handle expense deletion
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) {
      return;
    }

    try {
      await deleteExpense(id);
    } catch (err) {
      console.error("Error deleting expense:", err);
      setError("Failed to delete expense. Please try again.");
    }
  };

  // Handle export
  const handleExport = () => {
    exportExpensesToCSV(filteredExpenses);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <LoadingSpinner text="Loading expenses..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            <button
              onClick={() => setError(null)}
              className="float-right text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        )}

        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <Header
            user={user}
            onAddExpense={() => setShowAddForm(true)}
            onLogout={onLogout}
          />

          <Navigation
            currentView={currentView}
            onViewChange={setCurrentView}
          />

          <PeriodSelector
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            availableYears={availableYears}
          />

          <QuickStats
            totalExpenses={totalExpenses}
            averageExpense={averageExpense}
            transactionCount={currentExpenses.length}
            viewMode={viewMode}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />
        </div>

        {/* Add/Edit Form Modal */}
        <ExpenseForm
          isOpen={showAddForm}
          onClose={() => {
            setShowAddForm(false);
            setEditingExpense(null);
          }}
          onSubmit={handleFormSubmit}
          formData={formData}
          setFormData={setFormData}
          categories={categories}
          editingExpense={editingExpense}
        />

        {/* Main Content Views */}
        {currentView === "dashboard" && (
          <Dashboard
            viewMode={viewMode}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            monthlyData={monthlyData}
            trendData={trendData}
            categoryData={categoryData}
            currentExpenses={currentExpenses}
            colors={["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c"]}
          />
        )}

        {currentView === "expenses" && (
          <ExpensesList
            filteredExpenses={filteredExpenses}
            categories={categories}
            filters={filters}
            setFilters={setFilters}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onExport={handleExport}
          />
        )}

        {currentView === "analytics" && (
          <Analytics
            categoryData={categoryData}
            totalExpenses={totalExpenses}
            viewMode={viewMode}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            currentExpenses={currentExpenses}
            colors={["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c"]}
          />
        )}
      </div>
    </div>
  );
};

export default ExpenseTracker;