import React from 'react';
import type { CurrentView } from '../types';

interface NavigationProps {
  currentView: CurrentView;
  onViewChange: (view: CurrentView) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onViewChange
}) => {
  const views: { id: CurrentView; label: string }[] = [
    { id: "dashboard", label: "Dashboard" },
    { id: "expenses", label: "Expenses" },
    { id: "analytics", label: "Analytics" },
  ];

  return (
    <div className="flex gap-2 md:gap-4 mb-6 overflow-x-auto pb-1">
      {views.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onViewChange(id)}
          className={`px-3 md:px-4 py-2 rounded-lg text-sm md:text-base font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
            currentView === id
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};
