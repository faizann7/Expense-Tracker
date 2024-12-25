"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

type Expense = {
  id: string
  amount: number
  category: string
  notes?: string
  date: string
}

type FilterCriteria = {
  dateFrom: string
  dateTo: string
  category: string
}

type SortCriteria = {
  field: keyof Expense
  direction: 'asc' | 'desc'
}

type ExpenseContextType = {
  expenses: Expense[]
  filteredExpenses: Expense[]
  addExpense: (expense: Omit<Expense, 'id'>) => void
  updateExpense: (id: string, expense: Omit<Expense, 'id'>) => void
  deleteExpense: (id: string) => void
  setFilters: (filters: FilterCriteria) => void
  setSort: (sort: SortCriteria) => void
  resetFilters: () => void
  filters: FilterCriteria
  sort: SortCriteria
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined)

export const useExpenses = () => {
  const context = useContext(ExpenseContext)
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider')
  }
  return context
}

const defaultFilters: FilterCriteria = {
  dateFrom: '',
  dateTo: '',
  category: 'all'
}

const defaultSort: SortCriteria = {
  field: 'date',
  direction: 'desc'
}

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const storedExpenses = localStorage.getItem('expenses')
    return storedExpenses ? JSON.parse(storedExpenses) : []
  })
  const [filters, setFilters] = useState<FilterCriteria>(defaultFilters)
  const [sort, setSort] = useState<SortCriteria>(defaultSort)

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses))
  }, [expenses])

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = { ...expense, id: Date.now().toString() }
    setExpenses((prevExpenses) => [...prevExpenses, newExpense])
  }

  const updateExpense = (id: string, updatedExpense: Omit<Expense, 'id'>) => {
    setExpenses((prevExpenses) =>
      prevExpenses.map((expense) =>
        expense.id === id ? { ...updatedExpense, id } : expense
      )
    )
  }

  const deleteExpense = (id: string) => {
    setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense.id !== id))
  }

  const resetFilters = () => {
    setFilters(defaultFilters)
    setSort(defaultSort)
  }

  const filteredExpenses = expenses.filter(expense => {
    if (filters.category !== 'all' && expense.category !== filters.category) {
      return false
    }

    if (filters.dateFrom && expense.date < filters.dateFrom) {
      return false
    }

    if (filters.dateTo && expense.date > filters.dateTo) {
      return false
    }

    return true
  }).sort((a, b) => {
    const aValue = a[sort.field]
    const bValue = b[sort.field]

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sort.direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sort.direction === 'asc'
        ? aValue - bValue
        : bValue - aValue
    }

    return 0
  })

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        filteredExpenses,
        addExpense,
        updateExpense,
        deleteExpense,
        setFilters,
        setSort,
        resetFilters,
        filters,
        sort
      }}
    >
      {children}
    </ExpenseContext.Provider>
  )
}