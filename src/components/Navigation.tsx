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
  const views: CurrentView[] = ["dashboard", "expenses", "analytics"];

  return (
    <div className="flex gap-4 mb-6">
      {views.map((view) => (
        <button
          key={view}
          onClick={() => onViewChange(view)}
          className={`px-4 py-2 rounded-lg capitalize transition-colors ${
            currentView === view
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {view}
        </button>
      ))}
    </div>
  );
};
