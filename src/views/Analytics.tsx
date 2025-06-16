import React from "react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, TrendingDown, Target, IndianRupee } from "lucide-react";
import type { Expense } from "../types";

interface AnalyticsProps {
  categoryData: { name: string; value: number }[];
  totalExpenses: number;
  currentExpenses: Expense[];
  viewMode: "monthly" | "yearly";
  selectedMonth: number;
  selectedYear: number;
  colors: string[];
  monthlyData?: { month: string; amount: number }[];
}

const Analytics: React.FC<AnalyticsProps> = ({
  categoryData,
  totalExpenses,
  currentExpenses,
  viewMode,
  selectedMonth,
  selectedYear,
  colors,
  monthlyData = [],
}) => {
  // Calculate spending trends
  const spendingTrend = React.useMemo(() => {
    if (viewMode === "yearly" && monthlyData.length > 0) {
      const currentMonth = new Date().getMonth();
      const currentData = monthlyData[currentMonth]?.amount || 0;
      const previousData = monthlyData[currentMonth - 1]?.amount || 0;
      
      if (previousData === 0) return { trend: "neutral", percentage: 0 };
      
      const percentage = ((currentData - previousData) / previousData) * 100;
      return {
        trend: percentage > 0 ? "up" : percentage < 0 ? "down" : "neutral",
        percentage: Math.abs(percentage),
      };
    }
    return { trend: "neutral", percentage: 0 };
  }, [viewMode, monthlyData]);

  // Calculate payment method breakdown
  const paymentMethodData = React.useMemo(() => {
    const paymentMethods: { [key: string]: number } = {};
    currentExpenses.forEach((expense) => {
      paymentMethods[expense.paymentMethod] = 
        (paymentMethods[expense.paymentMethod] || 0) + expense.amount;
    });
    
    return Object.entries(paymentMethods).map(([method, amount]) => ({
      name: method.charAt(0).toUpperCase() + method.slice(1),
      value: amount,
    }));
  }, [currentExpenses]);

  // Calculate daily/weekly averages
  const averages = React.useMemo(() => {
    if (currentExpenses.length === 0) {
      return { daily: 0, weekly: 0 };
    }

    if (viewMode === "monthly") {
      const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
      const daily = totalExpenses / daysInMonth;
      const weekly = daily * 7;
      return { daily, weekly };
    } else {
      const daily = totalExpenses / 365;
      const weekly = daily * 7;
      return { daily, weekly };
    }
  }, [currentExpenses, totalExpenses, viewMode, selectedMonth, selectedYear]);

  // Top spending days
  const topSpendingDays = React.useMemo(() => {
    const dailySpending: { [key: string]: number } = {};
    
    currentExpenses.forEach((expense) => {
      const date = expense.date;
      dailySpending[date] = (dailySpending[date] || 0) + expense.amount;
    });

    return Object.entries(dailySpending)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([date, amount]) => ({
        date: new Date(date).toLocaleDateString(),
        amount,
      }));
  }, [currentExpenses]);

  // const monthNames = [
  //   "January", "February", "March", "April", "May", "June",
  //   "July", "August", "September", "October", "November", "December"
  // ];

  return (
    <div className="space-y-8">
      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-600 text-sm">Daily Average</p>
              <p className="text-2xl font-bold">₹{averages.daily.toFixed(2)}</p>
            </div>
            <IndianRupee className="text-blue-500" size={32} />
          </div>
          <div className="text-sm text-gray-500">
            Based on {viewMode === "monthly" ? "current month" : "current year"}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-600 text-sm">Weekly Average</p>
              <p className="text-2xl font-bold">₹{averages.weekly.toFixed(2)}</p>
            </div>
            <Target className="text-green-500" size={32} />
          </div>
          <div className="text-sm text-gray-500">
            Projected weekly spending
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-600 text-sm">Spending Trend</p>
              <div className="flex items-center gap-2">
                {spendingTrend.trend === "up" ? (
                  <TrendingUp className="text-red-500" size={20} />
                ) : spendingTrend.trend === "down" ? (
                  <TrendingDown className="text-green-500" size={20} />
                ) : (
                  <div className="w-5 h-5 bg-gray-300 rounded-full" />
                )}
                <span className="text-xl font-bold">
                  {spendingTrend.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {spendingTrend.trend === "up" 
              ? "Increased spending" 
              : spendingTrend.trend === "down" 
              ? "Decreased spending" 
              : "Stable spending"}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-600 text-sm">Transactions</p>
              <p className="text-2xl font-bold">{currentExpenses.length}</p>
            </div>
            <div className="text-blue-500 text-2xl">📊</div>
          </div>
          <div className="text-sm text-gray-500">
            Total transactions
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Comparison */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Category Comparison</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => `₹${value.toFixed(2)}`}
                />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No data available for this period
            </div>
          )}
        </div>

        {/* Payment Method Breakdown */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Payment Methods</h3>
          {paymentMethodData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  dataKey="value"
                  label={({ name, percent }: { name: string; percent: number }) => 
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {paymentMethodData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `₹${value.toFixed(2)}`}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No payment data available
            </div>
          )}
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Spending Categories */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Top Spending Categories</h3>
          <div className="space-y-4">
            {categoryData
              .sort((a, b) => b.value - a.value)
              .slice(0, 5)
              .map((category, index) => (
                <div
                  key={category.name}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    />
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">₹{category.value.toFixed(2)}</div>
                    <div className="text-sm text-gray-600">
                      {totalExpenses > 0 ? 
                        ((category.value / totalExpenses) * 100).toFixed(1) : 0}%
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Top Spending Days */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Highest Spending Days</h3>
          <div className="space-y-4">
            {topSpendingDays.length > 0 ? (
              topSpendingDays.map((day, index) => (
                <div
                  key={day.date}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className="font-medium">{day.date}</span>
                  </div>
                  <div className="font-bold">₹{day.amount.toFixed(2)}</div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                No spending data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Monthly Trend (for yearly view) */}
      {viewMode === "yearly" && monthlyData.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Monthly Spending Trend - {selectedYear}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => `₹${value.toFixed(2)}`}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ fill: "#8884d8", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Analytics;