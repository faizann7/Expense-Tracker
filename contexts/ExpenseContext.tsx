"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Expense = {
  id: string;
  amount: number;
  category: string;
  notes?: string;
  date: string;
};

type ExpenseContextType = {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, "id">) => void;
  updateExpense: (id: string, expense: Omit<Expense, "id">) => void;
  deleteExpense: (id: string) => void;
};

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error("useExpenses must be used within an ExpenseProvider");
  }
  return context;
};

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Helper function to safely parse JSON
  const safeParseJSON = (value: string | null): Expense[] => {
    try {
      return value ? JSON.parse(value) : [];
    } catch (error) {
      console.error("Failed to parse JSON from localStorage:", error);
      return [];
    }
  };

  // Load expenses from localStorage when the component mounts
  useEffect(() => {
    const storedExpenses = localStorage.getItem("expenses");
    const parsedExpenses = safeParseJSON(storedExpenses);
    if (parsedExpenses.length > 0) {
      console.log("Loaded expenses from localStorage:", parsedExpenses);
      setExpenses(parsedExpenses);
    }
  }, []);

  // Save expenses to localStorage whenever the `expenses` state changes
  useEffect(() => {
    try {
      console.log("Saving expenses to localStorage:", expenses);
      localStorage.setItem("expenses", JSON.stringify(expenses));
    } catch (error) {
      console.error("Error saving expenses to localStorage:", error);
    }
  }, [expenses]);

  const addExpense = (expense: Omit<Expense, "id">) => {
    const newExpense = { ...expense, id: Date.now().toString() };
    setExpenses((prev) => [...prev, newExpense]);
  };

  const updateExpense = (id: string, updatedExpense: Omit<Expense, "id">) => {
    setExpenses((prev) =>
      prev.map((expense) =>
        expense.id === id ? { ...updatedExpense, id } : expense
      )
    );
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };

  return (
    <ExpenseContext.Provider
      value={{ expenses, addExpense, updateExpense, deleteExpense }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};
