import { useState, useMemo } from 'react';
import type { Expense, Filters } from '../types';

export const useFilters = (expenses: Expense[]) => {
  const [filters, setFilters] = useState<Filters>({
    category: "",
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
