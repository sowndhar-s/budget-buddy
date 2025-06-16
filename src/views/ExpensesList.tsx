import React, { useState, useEffect } from "react";
import {
  Search,
  Download,
  CreditCard,
  Wallet,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Expense } from "../types";

interface ExpensesListProps {
  filteredExpenses: Expense[];
  categories: string[];
  filters: {
    category: string;
    dateRange: string;
    minAmount: string;
    maxAmount: string;
    searchTerm: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    category: string;
    dateRange: string;
    minAmount: string;
    maxAmount: string;
    searchTerm: string;
  }>>;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  onExport: () => void;
}

const ExpensesList: React.FC<ExpensesListProps> = ({
  filteredExpenses,
  categories,
  filters,
  setFilters,
  onEdit,
  onDelete,
  onExport,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExpenses = filteredExpenses.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Filters */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search expenses..."
              value={filters.searchTerm}
              onChange={(e) =>
                setFilters({ ...filters, searchTerm: e.target.value })
              }
              className="p-2 border rounded-lg"
            />
          </div>
          
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
            className="p-2 border rounded-lg"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          
          <select
            value={filters.dateRange}
            onChange={(e) =>
              setFilters({ ...filters, dateRange: e.target.value })
            }
            className="p-2 border rounded-lg"
          >
            <option value="all">All Time</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
          
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min amount"
              value={filters.minAmount}
              onChange={(e) =>
                setFilters({ ...filters, minAmount: e.target.value })
              }
              className="p-2 border rounded-lg w-32"
            />
            <input
              type="number"
              placeholder="Max amount"
              value={filters.maxAmount}
              onChange={(e) =>
                setFilters({ ...filters, maxAmount: e.target.value })
              }
              className="p-2 border rounded-lg w-32"
            />
          </div>
          
          <button
            onClick={onExport}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Expenses List */}
      <div className="space-y-4 min-h-[400px]">
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No expenses found matching your filters</p>
          </div>
        ) : (
          currentExpenses.map((expense) => (
            <div
              key={expense.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded-lg ${
                      expense.paymentMethod === "card"
                        ? "bg-blue-100"
                        : expense.paymentMethod === "cash"
                        ? "bg-green-100"
                        : expense.paymentMethod === "upi"
                        ? "bg-purple-100"
                        : "bg-orange-100"
                    }`}
                  >
                    {expense.paymentMethod === "card" ? (
                      <CreditCard size={20} />
                    ) : (
                      <Wallet size={20} />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold">{expense.description}</h4>
                    <p className="text-sm text-gray-600">
                      {expense.category} •{" "}
                      {new Date(expense.date).toLocaleDateString()} •{" "}
                      {expense.paymentMethod.toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xl font-bold">
                    ₹{expense.amount.toFixed(2)}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(expense)}
                      className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                      title="Edit expense"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(expense.id)}
                      className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                      title="Delete expense"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {filteredExpenses.length > 0 && totalPages > 1 && (
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredExpenses.length)} of {filteredExpenses.length} expenses
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
      
      {/* Summary */}
      {filteredExpenses.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Total Expenses: {filteredExpenses.length}</span>
            <span>
              Total Amount: ₹
              {filteredExpenses
                .reduce((sum, expense) => sum + expense.amount, 0)
                .toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpensesList;