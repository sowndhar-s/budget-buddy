import React, { useState, useEffect } from "react";
import {
  Search,
  Download,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Expense } from "../types";

interface ExpensesListProps {
  currentExpenses: Expense[];
  categories: string[];
  filters: {
    category: string;
    minAmount: string;
    maxAmount: string;
    searchTerm: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    category: string;
    minAmount: string;
    maxAmount: string;
    searchTerm: string;
  }>>;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  onExport: () => void;
}

const ExpensesList: React.FC<ExpensesListProps> = ({
  currentExpenses,
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
  const totalPages = Math.ceil(currentExpenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageExpenses = currentExpenses.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
      {/* Filters */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-3 mb-4">
          {/* Search */}
          <div className="flex items-center gap-2 flex-1 min-w-[180px]">
            <Search size={18} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={filters.searchTerm}
              onChange={(e) =>
                setFilters({ ...filters, searchTerm: e.target.value })
              }
              className="w-full p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Category */}
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
            className="p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 flex-shrink-0"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Amount range */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <input
              type="number"
              placeholder="Min ₹"
              value={filters.minAmount}
              onChange={(e) =>
                setFilters({ ...filters, minAmount: e.target.value })
              }
              className="p-2 border rounded-lg text-sm w-24 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <span className="text-gray-400 text-sm">–</span>
            <input
              type="number"
              placeholder="Max ₹"
              value={filters.maxAmount}
              onChange={(e) =>
                setFilters({ ...filters, maxAmount: e.target.value })
              }
              className="p-2 border rounded-lg text-sm w-24 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Export */}
          <button
            onClick={onExport}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm flex-shrink-0 transition-colors"
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Expenses List */}
      <div className="space-y-3 min-h-[300px]">
        {currentExpenses.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No expenses found for this period</p>
            <p className="text-sm mt-1">Try adjusting your filters or selecting a different period</p>
          </div>
        ) : (
          pageExpenses.map((expense) => (
            <div
              key={expense.id}
              className="border rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate">{expense.description}</h4>
                    <p className="text-sm text-gray-500 truncate">
                      {expense.category} {'\u2022'}{" "}
                      {new Date(expense.date).toLocaleDateString()} {'\u2022'}{" "}
                      {expense.paymentMethod.toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0">
                  <span className="text-lg font-bold text-gray-800">
                    ₹{expense.amount.toFixed(2)}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => onEdit(expense)}
                      className="text-blue-600 hover:text-blue-800 p-1.5 rounded hover:bg-blue-50 transition-colors"
                      title="Edit expense"
                    >
                      <Edit size={15} />
                    </button>
                    <button
                      onClick={() => onDelete(expense.id)}
                      className="text-red-600 hover:text-red-800 p-1.5 rounded hover:bg-red-50 transition-colors"
                      title="Delete expense"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {currentExpenses.length > 0 && totalPages > 1 && (
        <div className="mt-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1}–{Math.min(endIndex, currentExpenses.length)} of {currentExpenses.length}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>

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

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Summary */}
      {currentExpenses.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 text-sm text-gray-600">
            <span>{currentExpenses.length} expense{currentExpenses.length !== 1 ? "s" : ""}</span>
            <span className="font-semibold">
              Total: ₹{currentExpenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpensesList;