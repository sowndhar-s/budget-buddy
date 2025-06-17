import React, { useState } from "react";
import confetti from 'canvas-confetti';
import {UtensilsCrossed, X, Edit3, Sparkles, Fuel } from "lucide-react";
import type { Expense } from "../types";

interface ExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: {
    amount: string;
    description: string;
    category: string;
    date: string;
    paymentMethod: string;
  };
  setFormData: (data: {
    amount: string;
    description: string;
    category: string;
    date: string;
    paymentMethod: string;
  }) => void;
  categories: string[];
  editingExpense: Expense | null;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  categories,
  editingExpense,
}) => {
  const [isShaking, setIsShaking] = useState(false);
  const [currentJoke, setCurrentJoke] = useState(0);
  
  const expenseJokes = [
    "💸 Another day, another rupee gone!",
    "🤑 Money printer go brrr... backwards!",
    "💰 Wallet.exe has stopped working",
    "🏦 Breaking: Local person discovers money isn't infinite!",
    "💳 Card declined? Must be a feature, not a bug!",
    "🍕 Pizza is a vegetable, so this is healthy spending!"
  ];

  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
    setFormData({
      amount: "",
      description: "",
      category: "",
      date: new Date().toISOString().split("T")[0],
      paymentMethod: "upi",
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Dramatic shake animation for high amounts
    if (parseFloat(formData.amount) > 1000) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
      
      // Show different confetti for expensive items
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
      });
      
      // Cycle through jokes
      setCurrentJoke((prev) => (prev + 1) % expenseJokes.length);
    } else {
      // Normal confetti for regular expenses
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B']
      });
    }
    
    await onSubmit(e);
  };

  // Quick expense presets
  const commonExpenses = [
    {
      icon: UtensilsCrossed,
      label: "Dinner",
      amount: "50",
      description: "Evening meal",
      category: "Food & Dining",
      emoji: "🍽️",
      color: "from-orange-400 to-red-500",
      hoverText: "Time to feast!"
    },
    {
      icon: UtensilsCrossed,
      label: "Lunch",
      amount: "120",
      description: "Midday meal",
      category: "Food & Dining",
      emoji: "🍛",
      color: "from-green-400 to-emerald-500",
      hoverText: "Lunch break!"
    },
    {
      icon: Fuel,
      label: "Petrol",
      amount: "200",
      description: "Fuel refill",
      category: "Transportation",
      emoji: "⛽",
      color: "from-blue-400 to-purple-500",
      hoverText: "Fill her up!"
    }
  ];

  const handlePresetClick = (preset: typeof commonExpenses[0]) => {
    setFormData({
      ...formData,
      amount: preset.amount,
      description: preset.description,
      category: preset.category,
    });
    
    // Mini confetti for preset clicks
    confetti({
      particleCount: 30,
      spread: 30,
      origin: { y: 0.8 },
      colors: ['#FFE66D', '#FF6B6B', '#4ECDC4']
    });
  };

  const paymentMethods = [
    { value: "upi", label: "UPI", emoji: "🚀" },
    { value: "card", label: "Card", emoji: "💳" },
    { value: "cash", label: "Cash", emoji: "💵" },
    { value: "bank", label: "Bank", emoji: "🏦" }
  ];

  const getAmountReaction = () => {
    const amount = parseFloat(formData.amount);
    if (amount > 2000) return "😱";
    if (amount > 1000) return "😬";
    if (amount > 500) return "😅";
    if (amount > 100) return "😊";
    if (amount > 0) return "🤏";
    return "💰";
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900/80 via-blue-900/80 to-indigo-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[95vh] transform transition-all duration-300 ${isShaking ? 'animate-bounce' : ''} relative overflow-hidden flex flex-col`}>
        
        {/* Compact header */}
        <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 text-white p-3 overflow-hidden flex-shrink-0">
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='stars' x='0' y='0' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Ccircle cx='2' cy='2' r='1' fill='white' opacity='0.3'/%3E%3Ccircle cx='12' cy='8' r='0.5' fill='white' opacity='0.4'/%3E%3Ccircle cx='8' cy='15' r='0.8' fill='white' opacity='0.2'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23stars)'/%3E%3C/svg%3E")`
            }}
          ></div>
          
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/20 transition-all hover:rotate-90"
            title="Close"
          >
            <X size={16} />
          </button>
          
          <div className="flex items-center gap-2 relative z-10">
            <div className="animate-pulse">
              {editingExpense ? <Edit3 size={18} /> : <Sparkles size={18} />}
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {editingExpense ? "Edit Expense" : "New Expense 💸"}
              </h2>
              <p className="text-xs opacity-80">
                {parseFloat(formData.amount) > 1000 ? expenseJokes[currentJoke] : "Track your spending! 💪"}
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3 space-y-3">
            {/* Quick Buttons - Only show if not editing */}
            {!editingExpense && (
              <div className="space-y-2">
                <p className="text-xs text-gray-600 text-center">🎯 Quick Add</p>
                <div className="flex gap-1">
                  {commonExpenses.map((preset, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handlePresetClick(preset)}
                      className={`flex-1 bg-gradient-to-br ${preset.color} text-white rounded-lg p-2 transition-all hover:scale-105 active:scale-95 group relative overflow-hidden`}
                      title={preset.hoverText}
                    >
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                      <div className="relative z-10">
                        <div className="text-sm">{preset.emoji}</div>
                        <div className="text-xs font-bold">{preset.label}</div>
                        <div className="text-xs opacity-80">₹{preset.amount}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-3">
              {/* Amount with reaction */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  💰 Amount {getAmountReaction()}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className={`w-full p-2 text-lg font-bold text-center rounded-lg border-2 transition-all ${
                    parseFloat(formData.amount) > 1000 
                      ? 'border-red-300 bg-red-50 text-red-600' 
                      : 'border-green-300 bg-green-50 text-green-600'
                  } focus:ring-2 focus:ring-purple-200 focus:border-purple-400`}
                  placeholder="₹0"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  📝 What for?
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all text-sm"
                  placeholder="Coffee, lunch, etc..."
                  required
                />
              </div>

              {/* Category & Date Row */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">📂 Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all text-sm"
                    required
                  >
                    <option value="">Pick one</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">📅 Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-2 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all text-sm"
                    required
                  />
                </div>
              </div>

              {/* Payment Method - Compact Pills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">💳 Payment</label>
                <div className="grid grid-cols-4 gap-1">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: method.value })}
                      className={`p-2 rounded-lg border-2 text-xs font-medium transition-all hover:scale-105 ${
                        formData.paymentMethod === method.value
                          ? 'bg-purple-500 text-white border-purple-500 shadow-md'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="text-sm mb-1">{method.emoji}</div>
                      <div className="font-bold">{method.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Fixed Action Buttons at bottom */}
        <div className="flex gap-2 p-3 bg-gray-50 border-t flex-shrink-0">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-all font-medium hover:scale-105 active:scale-95 text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleFormSubmit}
            className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all font-medium shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 relative overflow-hidden group text-sm"
          >
            <span className="relative z-10">
              {editingExpense ? "🔧 Update" : "💸 Add Expense"}
            </span>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseForm;