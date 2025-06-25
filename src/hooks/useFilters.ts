import { useState, useMemo } from 'react';
import type { Expense, Filters } from '../types';

export const useFilters = (expenses: Expense[]) => {
  const [filters, setFilters] = useState<Filters>({
    category: "",
    dateRange: "month",
    minAmount: "",
    maxAmount: "",
    searchTerm: "",
  });

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      // Category filter
      if (filters.category && expense.category !== filters.category)
        return false;

      // Search term filter
      if (
        filters.searchTerm &&
        !expense.description
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase())
      )
        return false;

      // Date range filter
      const expenseDate = new Date(expense.date);
      const now = new Date();

      if (filters.dateRange === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        if (expenseDate < weekAgo) return false;
      }

      if (filters.dateRange === "month") {
        const monthAgo = new Date();
        monthAgo.setMonth(now.getMonth() - 1);
        if (expenseDate < monthAgo) return false;
      }

      if (filters.dateRange === "year") {
        const yearAgo = new Date();
        yearAgo.setFullYear(now.getFullYear() - 1);
        if (expenseDate < yearAgo) return false;
      }

      // Min amount filter
      if (filters.minAmount && expense.amount < parseFloat(filters.minAmount))
        return false;

      // Max amount filter
      if (filters.maxAmount && expense.amount > parseFloat(filters.maxAmount))
        return false;

      return true;
    });
  }, [expenses, filters]);

  return {
    filters,
    setFilters,
    filteredExpenses,
  };
};
