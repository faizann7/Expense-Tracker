'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Expense = {
  id: string
  amount: number
  category: string
  notes?: string
  date: string
}

type ExpenseContextType = {
  expenses: Expense[]
  addExpense: (expense: Omit<Expense, 'id'>) => void
  updateExpense: (id: string, expense: Omit<Expense, 'id'>) => void
  deleteExpense: (id: string) => void
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined)

export const useExpenses = () => {
  const context = useContext(ExpenseContext)
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider')
  }
  return context
}

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([])

  useEffect(() => {
    const storedExpenses = localStorage.getItem('expenses')
    if (storedExpenses) {
      const parsedExpenses = JSON.parse(storedExpenses)
      console.log('Loaded expenses from localStorage:', parsedExpenses)
      setExpenses(parsedExpenses)
    }
  }, [])

  useEffect(() => {
    console.log('Saving expenses to localStorage:', expenses)
    localStorage.setItem('expenses', JSON.stringify(expenses))
  }, [expenses])

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = { ...expense, id: Date.now().toString() }
    console.log('Adding new expense:', newExpense)
    setExpenses((prevExpenses) => [...prevExpenses, newExpense])
  }

  const updateExpense = (id: string, updatedExpense: Omit<Expense, 'id'>) => {
    console.log('Updating expense:', id, updatedExpense)
    setExpenses((prevExpenses) =>
      prevExpenses.map((expense) =>
        expense.id === id ? { ...updatedExpense, id } : expense
      )
    )
  }

  const deleteExpense = (id: string) => {
    console.log('Deleting expense:', id)
    setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense.id !== id))
  }

  return (
    <ExpenseContext.Provider value={{ expenses, addExpense, updateExpense, deleteExpense }}>
      {children}
    </ExpenseContext.Provider>
  )
}

