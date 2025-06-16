import React from 'react';
import type { ViewMode } from '../types';
import { getShortMonthName, getMonthName } from '../utils/formatters';

interface PeriodSelectorProps {
  viewMode: ViewMode;
  selectedMonth: number;
  selectedYear: number;
  availableYears: number[];
  onViewModeChange: (mode: ViewMode) => void;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  viewMode,
  selectedMonth,
  selectedYear,
  availableYears,
  onViewModeChange,
  onMonthChange,
  onYearChange,
}) => {
  const shortMonths = Array.from({ length: 12 }, (_, i) => getShortMonthName(i));

  return (
    <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">View:</label>
        <select
          value={viewMode}
          onChange={(e) => onViewModeChange(e.target.value as ViewMode)}
          className="p-2 border rounded-lg bg-white"
        >
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Year:</label>
        <select
          value={selectedYear}
          onChange={(e) => onYearChange(parseInt(e.target.value))}
          className="p-2 border rounded-lg bg-white"
        >
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {viewMode === "monthly" && (
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Month:</label>
          <select
            value={selectedMonth}
            onChange={(e) => onMonthChange(parseInt(e.target.value))}
            className="p-2 border rounded-lg bg-white"
          >
            {shortMonths.map((month, index) => (
              <option key={index} value={index}>
                {month} {selectedYear}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="ml-auto text-sm text-gray-600">
        {viewMode === "monthly"
          ? `Showing ${getMonthName(selectedMonth)} ${selectedYear}`
          : `Showing Year ${selectedYear}`}
      </div>
    </div>
  );
};
