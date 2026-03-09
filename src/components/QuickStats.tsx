import React from 'react';
import { IndianRupee, TrendingUp, BarChart3, Calendar } from 'lucide-react';
import type { ViewMode } from '../types';
import { formatCurrency } from '../utils/formatters';

interface QuickStatsProps {
  viewMode: ViewMode;
  totalExpenses: number;
  averageExpense: number;
  transactionCount: number;
  selectedMonth: number;
  selectedYear: number;
}

export const QuickStats: React.FC<QuickStatsProps> = ({
  viewMode,
  totalExpenses,
  averageExpense,
  transactionCount,
  selectedMonth,
  selectedYear,
}) => {
  const dailyAverage = viewMode === "monthly"
    ? totalExpenses / new Date(selectedYear, selectedMonth + 1, 0).getDate()
    : totalExpenses / 12;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
      <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-lg p-3 md:p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-xs md:text-sm">
              {viewMode === "monthly" ? "Monthly" : "Yearly"} Total
            </p>
            <p className="text-lg md:text-2xl font-bold">
              {formatCurrency(totalExpenses)}
            </p>
          </div>
          <IndianRupee size={24} className="md:w-8 md:h-8 opacity-80" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg p-3 md:p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-xs md:text-sm">Avg Expense</p>
            <p className="text-lg md:text-2xl font-bold">
              {formatCurrency(averageExpense)}
            </p>
          </div>
          <TrendingUp size={24} className="md:w-8 md:h-8 opacity-80" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg p-3 md:p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-xs md:text-sm">Transactions</p>
            <p className="text-lg md:text-2xl font-bold">{transactionCount}</p>
          </div>
          <BarChart3 size={24} className="md:w-8 md:h-8 opacity-80" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg p-3 md:p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-xs md:text-sm">
              {viewMode === "monthly" ? "Daily Avg" : "Monthly Avg"}
            </p>
            <p className="text-lg md:text-2xl font-bold">
              {formatCurrency(dailyAverage)}
            </p>
          </div>
          <Calendar size={24} className="md:w-8 md:h-8 opacity-80" />
        </div>
      </div>
    </div>
  );
};
