import { useMemo } from 'react';
import type { Expense, ViewMode } from '../types';
import { getShortMonthName } from '../utils/formatters';

export const useChartData = (
  filteredExpenses: Expense[],
  currentExpenses: Expense[],  // Add this parameter
  selectedMonth: number,
  selectedYear: number,
  viewMode: ViewMode
) => {
  // Total expenses for current period
  const totalExpenses = useMemo(() => {
    return currentExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [currentExpenses]);

  // Average expense for current period
  const averageExpense = useMemo(() => {
    if (currentExpenses.length === 0) return 0;
    return totalExpenses / currentExpenses.length;
  }, [totalExpenses, currentExpenses]);

  // Monthly data for yearly view
  const monthlyData = useMemo(() => {
    if (viewMode !== "yearly") return [];
    const months = Array.from({ length: 12 }, (_, i) => ({
      month: getShortMonthName(i),
      amount: 0,
    }));
    
    filteredExpenses.forEach((expense) => {
      const expenseDate = new Date(expense.date);
      if (expenseDate.getFullYear() === selectedYear) {
        const month = expenseDate.getMonth();
        months[month].amount += expense.amount;
      }
    });
    
    return months;
  }, [filteredExpenses, selectedYear, viewMode]);

  // Daily trend data for monthly view
  const trendData = useMemo(() => {
    if (viewMode !== "monthly") return [];
    
    // Create a day-by-day breakdown for the selected month
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      return {
        date: `${day < 10 ? '0' + day : day}`,
        amount: 0,
      };
    });

    currentExpenses.forEach(expense => {
      const expenseDate = new Date(expense.date);
      if (expenseDate.getMonth() === selectedMonth && 
          expenseDate.getFullYear() === selectedYear) {
        const day = expenseDate.getDate() - 1; // 0-based index
        days[day].amount += expense.amount;
      }
    });
    
    return days;
  }, [currentExpenses, selectedMonth, selectedYear, viewMode]);

  // Category breakdown for current period
  const categoryData = useMemo(() => {
    const map: { [key: string]: number } = {};
    currentExpenses.forEach((expense) => {
      map[expense.category] = (map[expense.category] || 0) + expense.amount;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [currentExpenses]);

  return {
    totalExpenses,
    averageExpense,
    monthlyData,
    trendData,
    categoryData,
  };
};