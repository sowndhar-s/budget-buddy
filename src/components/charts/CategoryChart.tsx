import React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { PieChart } from "lucide-react";

interface CategoryChartProps {
  data: { name: string; value: number }[];
  selectedMonth?: number;
  selectedYear: number;
  viewMode: "monthly" | "yearly";
  colors: string[];
  height?: number;
}

const CategoryChart: React.FC<CategoryChartProps> = ({
  data,
  selectedMonth,
  selectedYear,
  viewMode,
  colors,
  height = 250,
}) => {
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const getTitle = () => {
    if (viewMode === "monthly" && selectedMonth !== undefined) {
      return `Category Breakdown - ${monthNames[selectedMonth]} ${selectedYear}`;
    }
    return `Category Breakdown - ${selectedYear}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4">{getTitle()}</h3>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={height}>
          <RechartsPieChart>
            <Pie
              data={data}
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
              {data.map((_, index: number) => (
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
  );
};

export default CategoryChart;
