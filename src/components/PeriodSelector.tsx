import React from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import type { ViewMode } from '../types';
import { getMonthName } from '../utils/formatters';

interface PeriodSelectorProps {
  viewMode: ViewMode;
  selectedMonth: number;
  selectedYear: number;
  availableYears: number[];
  onViewModeChange: (mode: ViewMode) => void;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  viewMode,
  selectedMonth,
  selectedYear,
  availableYears,
  onViewModeChange,
  onMonthChange,
  onYearChange,
}) => {
  const minYear = availableYears.length > 0 ? Math.min(...availableYears) : selectedYear;
  const maxYear = availableYears.length > 0 ? Math.max(...availableYears) : selectedYear;

  const handlePrevYear = () => {
    if (selectedYear > minYear) onYearChange(selectedYear - 1);
  };

  const handleNextYear = () => {
    if (selectedYear < maxYear) onYearChange(selectedYear + 1);
  };

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      if (selectedYear > minYear) {
        onYearChange(selectedYear - 1);
        onMonthChange(11);
      }
    } else {
      onMonthChange(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    const now = new Date();
    const isCurrentYearMonth =
      selectedYear === now.getFullYear() && selectedMonth === now.getMonth();
    if (isCurrentYearMonth) return;

    if (selectedMonth === 11) {
      if (selectedYear < maxYear) {
        onYearChange(selectedYear + 1);
        onMonthChange(0);
      }
    } else {
      onMonthChange(selectedMonth + 1);
    }
  };

  const isNextMonthDisabled = () => {
    const now = new Date();
    return selectedYear === now.getFullYear() && selectedMonth === now.getMonth();
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-100">
      {/* View Mode Toggle */}
      <div className="flex items-center bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <button
          onClick={() => onViewModeChange('monthly')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            viewMode === 'monthly'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => onViewModeChange('yearly')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            viewMode === 'yearly'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Yearly
        </button>
      </div>

      {/* Year Selector */}
      <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 shadow-sm">
        <button
          onClick={handlePrevYear}
          disabled={selectedYear <= minYear}
          className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-l-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Previous year"
        >
          <ChevronLeft size={16} />
        </button>
        <select
          value={selectedYear}
          onChange={(e) => onYearChange(parseInt(e.target.value))}
          className="px-2 py-2 text-sm font-semibold text-gray-700 bg-transparent border-none outline-none cursor-pointer"
        >
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <button
          onClick={handleNextYear}
          disabled={selectedYear >= maxYear}
          className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-r-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Next year"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Month Selector (only in Monthly view) */}
      {viewMode === 'monthly' && (
        <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 shadow-sm">
          <button
            onClick={handlePrevMonth}
            disabled={selectedYear <= minYear && selectedMonth === 0}
            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-l-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Previous month"
          >
            <ChevronLeft size={16} />
          </button>
          <select
            value={selectedMonth}
            onChange={(e) => onMonthChange(parseInt(e.target.value))}
            className="px-2 py-2 text-sm font-semibold text-gray-700 bg-transparent border-none outline-none cursor-pointer"
          >
            {MONTHS.map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </select>
          <button
            onClick={handleNextMonth}
            disabled={isNextMonthDisabled()}
            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-r-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Next month"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Current Period Label */}
      <div className="ml-auto flex items-center gap-2 text-sm font-medium text-indigo-700 bg-indigo-100 px-3 py-2 rounded-lg">
        <Calendar size={15} />
        {viewMode === 'monthly'
          ? `${getMonthName(selectedMonth)} ${selectedYear}`
          : `Year ${selectedYear}`}
      </div>
    </div>
  );
};
