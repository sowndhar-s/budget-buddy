import React from "react";
import {
  PieChart,
} from "lucide-react";
import {
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

interface DashboardProps {
  viewMode: "monthly" | "yearly";
  selectedMonth: number;
  selectedYear: number;
  monthlyData: { month: string; amount: number }[];
  trendData: { date: string; amount: number }[];
  categoryData: { name: string; value: number }[];
  colors: string[];
}

const Dashboard: React.FC<DashboardProps> = ({
  viewMode,
  selectedMonth,
  selectedYear,
  monthlyData,
  trendData,
  categoryData,
  colors,
}) => {
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Spending Chart */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-bold mb-4">
          {viewMode === "yearly"
            ? `Monthly Breakdown – ${selectedYear}`
            : `Daily Spending – ${monthNames[selectedMonth]} ${selectedYear}`}
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={viewMode === "yearly" ? monthlyData : trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={viewMode === "yearly" ? "month" : "date"}
              tick={{ fontSize: 11 }}
              interval={viewMode === "monthly" ? 4 : 0}
            />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(value: number) => [`₹${value.toFixed(2)}`, "Amount"]}
            />
            <Bar dataKey="amount" fill="#6366f1" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-bold mb-4">
          {viewMode === "monthly"
            ? `Category Breakdown – ${monthNames[selectedMonth]} ${selectedYear}`
            : `Category Breakdown – ${selectedYear}`}
        </h3>
        {categoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <RechartsPieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={95}
                dataKey="value"
                label={({
                  name,
                  percent,
                }: {
                  name: string;
                  percent: number;
                }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
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
    </div>
  );
};

export default Dashboard;