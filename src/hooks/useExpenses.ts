import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import type { Expense, FormData } from '../types';

export const useExpenses = (userId: string) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const categories = [
    "Food & Dining",
    "Transportation",
    "Shopping",
    "Entertainment",
    "Family support",
    "Bills & Utilities",
    "Healthcare",
    "Education",
    "Travel",
    "Other",
  ];

  // Calculate available years for filtering
  const availableYears = expenses.length > 0
    ? [...new Set(expenses.map(exp => new Date(exp.date).getFullYear()))].sort((a, b) => b - a)
    : [new Date().getFullYear()];

  // Load expenses from Firestore
  useEffect(() => {
    const fetchExpenses = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        setError(null);
        const q = query(
          collection(db, "expenses"),
          where("uid", "==", userId),
          orderBy("date", "desc")
        );
        const querySnapshot = await getDocs(q);
        const data: Expense[] = [];

        querySnapshot.forEach((docSnap) => {
          const d = docSnap.data();
          data.push({
            id: docSnap.id,
            amount: d.amount,
            description: d.description,
            category: d.category,
            date: d.date,
            paymentMethod: d.paymentMethod,
            uid: d.uid,
          });
        });

        setExpenses(data);
      } catch (err) {
        console.error("Error fetching expenses:", err);
        setError("Failed to load expenses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [userId]);

  const addExpense = async (formData: FormData): Promise<void> => {
    if (!formData.amount || !formData.description || !formData.category) {
      throw new Error("Please fill in all required fields");
    }

    const newExpense = {
      amount: parseFloat(formData.amount),
      description: formData.description,
      category: formData.category,
      date: formData.date,
      paymentMethod: formData.paymentMethod,
      uid: userId,
    };

    const docRef = await addDoc(collection(db, "expenses"), newExpense);
    setExpenses([{ ...newExpense, id: docRef.id }, ...expenses]);
  };

  const updateExpense = async (id: string, formData: FormData): Promise<void> => {
    if (!formData.amount || !formData.description || !formData.category) {
      throw new Error("Please fill in all required fields");
    }

    const updatedExpense = {
      amount: parseFloat(formData.amount),
      description: formData.description,
      category: formData.category,
      date: formData.date,
      paymentMethod: formData.paymentMethod,
      uid: userId,
    };

    await updateDoc(doc(db, "expenses", id), updatedExpense);
    setExpenses(expenses.map(exp => 
      exp.id === id ? { ...exp, ...updatedExpense, id } : exp
    ));
  };

  const deleteExpense = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, "expenses", id));
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  return {
    expenses,
    loading,
    error,
    categories,
    addExpense,
    updateExpense,
    deleteExpense,
    setError,
    editingExpense,
    setEditingExpense,
    availableYears,
  };
};