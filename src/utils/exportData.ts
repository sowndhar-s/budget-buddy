import type { Expense } from '../types';

export const exportExpensesToCSV = (expenses: Expense[]): void => {
  const csvContent = [
    ["Date", "Description", "Category", "Amount", "Payment Method"],
    ...expenses.map((expense) => [
      expense.date,
      expense.description,
      expense.category,
      expense.amount.toString(),
      expense.paymentMethod,
    ]),
  ]
    .map((row) => row.join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "expenses.csv";
  a.click();
  window.URL.revokeObjectURL(url);
};
