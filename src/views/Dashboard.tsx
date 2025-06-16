import React from "react";
import {
  PieChart,
  CreditCard,
  Wallet,
} from "lucide-react";
import {
  AreaChart,
  Area,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import type{ Expense } from "../types";

interface DashboardProps {
  currentExpenses: Expense[];
  viewMode: "monthly" | "yearly";
  selectedMonth: number;
  selectedYear: number;
  monthlyData: { month: string; amount: number }[];
  trendData: { date: string; amount: number }[];
  categoryData: { name: string; value: number }[];
  colors: string[];
}

const Dashboard: React.FC<DashboardProps> = ({
  currentExpenses,
  viewMode,
  selectedMonth,
  selectedYear,
  monthlyData,
  categoryData,
  colors,
}) => {
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  // Generate 7-day trend data from current expenses
  const generateWeeklyData = () => {
    const today = new Date();
    const weeklyData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      // Calculate total expenses for this date
      const dayExpenses = currentExpenses.filter(expense => 
        expense.date === dateString
      );
      
      const totalAmount = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      weeklyData.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        amount: totalAmount
      });
    }
    
    return weeklyData;
  };

  const weeklyData = generateWeeklyData();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Main Chart - Monthly breakdown for yearly view, 7-day trend for monthly view */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4">
          {viewMode === "yearly"
            ? `Monthly Breakdown - ${selectedYear}`
            : "7-Day Spending Trend"}
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          {viewMode === "yearly" ? (
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [
                  `₹${value.toFixed(2)}`,
                  "Amount",
                ]}
              />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          ) : (
            <AreaChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [
                  `₹${value.toFixed(2)}`,
                  "Amount",
                ]}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.3}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4">
          {viewMode === "monthly"
            ? `Category Breakdown - ${monthNames[selectedMonth]} ${selectedYear}`
            : `Category Breakdown - ${selectedYear}`}
        </h3>
        {categoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <RechartsPieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                label={({
                  name,
                  percent,
                }: {
                  name: string;
                  percent: number;
                }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {categoryData.map((_, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `₹${value.toFixed(2)}`}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <PieChart size={48} className="mx-auto mb-4 opacity-50" />
              <p>No expenses found for this period</p>
            </div>
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
        <h3 className="text-xl font-bold mb-4">Recent Transactions</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {currentExpenses.slice(0, 5).map((expense) => (
            <div
              key={expense.id}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    expense.paymentMethod === "card"
                      ? "bg-blue-100"
                      : expense.paymentMethod === "cash"
                      ? "bg-green-100"
                      : "bg-purple-100"
                  }`}
                >
                  {expense.paymentMethod === "card" ? (
                    <CreditCard size={16} />
                  ) : (
                    <Wallet size={16} />
                  )}
                </div>
                <div>
                  <h4 className="font-medium">{expense.description}</h4>
                  <p className="text-sm text-gray-600">
                    {expense.category}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">
                  ₹{expense.amount.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">
                  {new Date(expense.date).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
          {currentExpenses.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No transactions found for this period
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;