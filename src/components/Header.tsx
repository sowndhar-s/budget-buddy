import React from 'react';
import { PlusCircle, LogOut } from 'lucide-react';
import type { User } from 'firebase/auth';

interface HeaderProps {
  user: User;
  onAddExpense: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onAddExpense, onLogout }) => {
  // Get first name from display name or fallback to email
  const getDisplayName = () => {
    if (user.displayName) {
      return user.displayName.split(' ')[0]; // Get first name only
    }
    return user.email?.split('@')[0] || 'User';
  };

  // Get time-based greeting with personality
  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = getDisplayName();

    if (hour < 6) return `${name}, burning the midnight oil? 🌙`;
    if (hour < 12) return `Good morning, ${name}! ☀️`;
    if (hour < 17) return `Hey ${name}! 👋`;
    if (hour < 21) return `Evening, ${name}! 🌅`;
    return `${name}, still counting coins? 🌙`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-8">
      {/* Single row layout - same as original but responsive */}
      <div className="flex justify-between items-center gap-2 md:gap-4">
        {/* Left: Title */}
        <div className="flex-shrink-0">
          <h1 className="text-xl md:text-3xl font-bold text-gray-800">
            Budget Buddy 💰
          </h1>
          <p className="text-gray-600 text-xs md:text-sm mt-1 hidden sm:block">
            Track every penny, master your money
          </p>
        </div>

        {/* Center: Welcome Message - hidden on small screens */}
        <div className="flex-1 text-center hidden lg:block">
          <p className="text-lg font-medium text-gray-700">
            {getGreeting()}
          </p>
        </div>

        {/* Right: Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onAddExpense}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 md:px-6 md:py-3 rounded-lg flex items-center gap-1 md:gap-2 transition-colors text-sm md:text-base"
          >
            <PlusCircle size={18} className="md:w-5 md:h-5" />
            <span className="hidden sm:inline">Add Expense</span>
          </button>
          <button
            onClick={onLogout}
            className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 md:px-4 md:py-3 rounded-lg flex items-center gap-1 md:gap-2 transition-colors"
            title="Logout"
          >
            <LogOut size={18} className="md:w-5 md:h-5" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};