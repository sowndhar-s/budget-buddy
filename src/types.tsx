import type { User } from 'firebase/auth';

export type Expense = {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  paymentMethod: string;
  uid: string;
};

export type ViewMode = "monthly" | "yearly";

export type CurrentView = "dashboard" | "expenses" | "analytics";

export interface Filters {
  category: string;
  dateRange: string;
  minAmount: string;
  maxAmount: string;
  searchTerm: string;
}

export interface FormData {
  amount: string;
  description: string;
  category: string;
  date: string;
  paymentMethod: string;
}

export interface ChartData {
  name?: string;
  value?: number;
  month?: string;
  date?: string;
  amount?: number;
}

export interface ExpenseTrackerProps {
  user: User; // Firebase User type
  onLogout: () => void;
}