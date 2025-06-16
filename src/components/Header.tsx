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
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      {/* Single row with title, welcome message, and buttons */}
      <div className="flex justify-between items-center">
        {/* Left: Title */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Budget Buddy 💰
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Track every penny, master your money
          </p>
        </div>

        {/* Center: Welcome Message */}
        <div className="flex-1 mx-8 text-center">
          <p className="text-lg font-medium text-gray-700">
            {getGreeting()}
          </p>
        </div>

        {/* Right: Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onAddExpense}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <PlusCircle size={20} />
            Add Expense
          </button>
          <button
            onClick={onLogout}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg flex items-center gap-2 transition-colors"
            title="Logout"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
