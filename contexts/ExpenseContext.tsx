"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { DateRange } from "react-day-picker"
import { isWithinInterval, parseISO } from "date-fns"

export type Expense = {
  id: string
  date: string
  category: string
  amount: number
  notes: string
}

export type Category = {
  id: string
  name: string
  description: string
  color: string
  createdAt: string
  expenseCount: number
}

type FilterCriteria = {
  dateRange?: DateRange
  category?: string
}

interface ExpenseContextType {
  expenses: Expense[]
  filteredExpenses: Expense[]
  categories: Category[]
  addExpense: (expense: Omit<Expense, "id">) => void
  deleteExpense: (id: string) => void
  updateExpense: (id: string, expense: Partial<Expense>) => void
  setFilters: (filters: FilterCriteria) => void
  clearFilters: () => void
  addCategory: (category: Omit<Category, "id" | "createdAt" | "expenseCount">) => void
  deleteCategory: (id: string) => void
  updateCategory: (id: string, category: Partial<Category>) => void
}

export const ExpenseContext = createContext<ExpenseContextType>({} as ExpenseContextType)

const STORAGE_KEY = "expenses-data"

const initialExpenses: Expense[] = [
  {
    id: "1",
    date: "2024-03-15",
    category: "Food & Dining",
    amount: 25.50,
    notes: "Lunch at cafe"
  },
  {
    id: "2",
    date: "2024-03-14",
    category: "Transportation",
    amount: 15.00,
    notes: "Bus fare"
  },
  {
    id: "3",
    date: "2024-03-13",
    category: "Entertainment",
    amount: 50.00,
    notes: "Movie tickets"
  },
  {
    id: "4",
    date: "2024-03-12",
    category: "Shopping",
    amount: 120.00,
    notes: "Groceries"
  },
  {
    id: "5",
    date: "2024-03-15",
    category: "Food & Dining",
    amount: 35.00,
    notes: "Dinner"
  }
]

function generatePastelColor(baseColor: string): string {
  // Convert hex to RGB
  const r = parseInt(baseColor.slice(1, 3), 16)
  const g = parseInt(baseColor.slice(3, 5), 16)
  const b = parseInt(baseColor.slice(5, 7), 16)

  // Mix with white to create pastel
  const mixWithWhite = (c: number) => Math.floor((c + 255 * 2) / 3)

  // Convert back to hex
  const rp = mixWithWhite(r).toString(16).padStart(2, '0')
  const gp = mixWithWhite(g).toString(16).padStart(2, '0')
  const bp = mixWithWhite(b).toString(16).padStart(2, '0')

  return `#${rp}${gp}${bp}`
}

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [filters, setFilterCriteria] = useState<FilterCriteria>({})
  const [categories, setCategories] = useState<Category[]>([])

  // Load expenses from localStorage on initial render
  useEffect(() => {
    const savedExpenses = localStorage.getItem(STORAGE_KEY)
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses))
    } else {
      setExpenses(initialExpenses)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialExpenses))
    }
  }, [])

  // Initialize default categories
  useEffect(() => {
    const defaultCategories: Category[] = [
      {
        id: "1",
        name: "Food & Dining",
        description: "Restaurants, groceries, and dining expenses",
        color: "#ffd6d6", // Soft red
        createdAt: new Date().toISOString(),
        expenseCount: 0
      },
      {
        id: "2",
        name: "Transportation",
        description: "Public transport, fuel, and vehicle maintenance",
        color: "#d6e4ff", // Soft blue
        createdAt: new Date().toISOString(),
        expenseCount: 0
      },
      {
        id: "3",
        name: "Entertainment",
        description: "Movies, events, and recreational activities",
        color: "#d6ffe1", // Soft green
        createdAt: new Date().toISOString(),
        expenseCount: 0
      },
      {
        id: "4",
        name: "Shopping",
        description: "Retail purchases and general shopping",
        color: "#f2d6ff", // Soft purple
        createdAt: new Date().toISOString(),
        expenseCount: 0
      },
      {
        id: "5",
        name: "Utilities",
        description: "Bills, services, and monthly utilities",
        color: "#fff3d6", // Soft yellow
        createdAt: new Date().toISOString(),
        expenseCount: 0
      }
    ]
    setCategories(defaultCategories)
  }, [])

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    if (expenses.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
    }
  }, [expenses])

  // Update expense counts for categories
  const categoriesWithCounts = categories.map(cat => ({
    ...cat,
    expenseCount: expenses.filter(exp => exp.category === cat.name).length
  }))

  const filteredExpenses = expenses.filter(expense => {
    if (filters.dateRange?.from && filters.dateRange?.to) {
      const expenseDate = parseISO(expense.date)
      if (!isWithinInterval(expenseDate, {
        start: filters.dateRange.from,
        end: filters.dateRange.to
      })) {
        return false
      }
    } else if (filters.dateRange?.from) {
      const expenseDate = parseISO(expense.date)
      if (expenseDate < filters.dateRange.from) {
        return false
      }
    }

    if (filters.category && expense.category !== filters.category) {
      return false
    }

    return true
  })

  const addExpense = (expense: Omit<Expense, "id">) => {
    const newExpense = {
      ...expense,
      id: Math.random().toString(36).substr(2, 9)
    }
    setExpenses(prev => [newExpense, ...prev])
  }

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id))
  }

  const updateExpense = (id: string, updatedExpense: Partial<Expense>) => {
    setExpenses(prev => prev.map(expense =>
      expense.id === id ? { ...expense, ...updatedExpense } : expense
    ))
  }

  const setFilters = (newFilters: FilterCriteria) => {
    setFilterCriteria(newFilters)
  }

  const clearFilters = () => {
    setFilterCriteria({})
  }

  const addCategory = (category: Omit<Category, "id" | "createdAt" | "expenseCount">) => {
    const newCategory = {
      ...category,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      expenseCount: 0
    }
    setCategories(prev => [...prev, newCategory])
  }

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id))
  }

  const updateCategory = (id: string, updatedCategory: Partial<Category>) => {
    setCategories(prev => prev.map(cat =>
      cat.id === id ? { ...cat, ...updatedCategory } : cat
    ))
  }

  const value = {
    expenses,
    filteredExpenses,
    categories: categoriesWithCounts,
    addExpense,
    deleteExpense,
    updateExpense,
    setFilters,
    clearFilters,
    addCategory,
    deleteCategory,
    updateCategory
  }

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  )
}

export function useExpenses() {
  const context = useContext(ExpenseContext)
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpenseProvider')
  }
  return context
}