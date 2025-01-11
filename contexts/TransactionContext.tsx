'use client'

import { createContext, useContext, ReactNode, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { categories as defaultCategories } from '@/config/categories'
import { DateRange } from "react-day-picker"

interface TransactionBreakdown {
    id: string
    description: string
    amount: number
}

interface Transaction {
    id: string
    type: 'income' | 'expense'
    amount: number
    description: string
    category: string
    date: Date
    createdAt: Date
    updatedAt: Date
    breakdowns?: TransactionBreakdown[]
}

interface Category {
    value: string
    label: string
    type: 'income' | 'expense' | 'both'
}

type FilterCriteria = {
    dateRange?: DateRange
    category?: string
    type?: 'income' | 'expense'
}

interface TransactionContextType {
    transactions: Transaction[]
    categories: Category[]
    isLoading: boolean
    addTransaction: (data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void
    deleteTransaction: (id: string) => void
    updateTransaction: (id: string, data: Partial<Transaction>) => void
    addCategory: (category: Category) => void
    updateCategory: (oldValue: string, category: Category) => void
    deleteCategory: (value: string) => void
    setFilters: (filters: FilterCriteria) => void
    clearFilters: () => void
    filteredTransactions: Transaction[]
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined)

const STORAGE_KEY = 'transactions'
const CATEGORIES_STORAGE_KEY = 'transaction-categories'

export function TransactionProvider({ children }: { children: ReactNode }) {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const searchParams = useSearchParams()
    const [filters, setFilterCriteria] = useState<FilterCriteria>({})

    // Load data from localStorage
    useEffect(() => {
        const savedTransactions = localStorage.getItem(STORAGE_KEY)
        const savedCategories = localStorage.getItem(CATEGORIES_STORAGE_KEY)

        if (savedTransactions) {
            setTransactions(JSON.parse(savedTransactions))
        }

        if (savedCategories) {
            setCategories(JSON.parse(savedCategories))
        } else {
            setCategories(defaultCategories)
            localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(defaultCategories))
        }

        setIsLoading(false)
    }, [])

    // Filter transactions based on search params
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const category = searchParams.get('category')
    const type = searchParams.get('type')

    const filteredTransactions = transactions.filter(transaction => {
        if (filters.dateRange?.from && filters.dateRange?.to) {
            const transactionDate = new Date(transaction.date)
            if (!(transactionDate >= filters.dateRange.from &&
                transactionDate <= filters.dateRange.to)) {
                return false
            }
        }

        if (filters.category && transaction.category !== filters.category) {
            return false
        }

        if (filters.type && transaction.type !== filters.type) {
            return false
        }

        return true
    })

    // Transaction management functions
    const addTransaction = (data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newTransaction = {
            ...data,
            id: crypto.randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date()
        }
        const updatedTransactions = [newTransaction, ...transactions]
        setTransactions(updatedTransactions)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTransactions))
    }

    const deleteTransaction = (id: string) => {
        const updatedTransactions = transactions.filter(t => t.id !== id)
        setTransactions(updatedTransactions)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTransactions))
    }

    const updateTransaction = (id: string, data: Partial<Transaction>) => {
        const updatedTransactions = transactions.map(transaction =>
            transaction.id === id
                ? { ...transaction, ...data, updatedAt: new Date() }
                : transaction
        )
        setTransactions(updatedTransactions)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTransactions))
    }

    // Category management functions
    const addCategory = (category: Category) => {
        const updatedCategories = [...categories, category]
        setCategories(updatedCategories)
        localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(updatedCategories))
    }

    const updateCategory = (oldValue: string, category: Category) => {
        // First update categories
        const updatedCategories = categories.map(cat =>
            cat.value === oldValue ? category : cat
        )
        setCategories(updatedCategories)
        localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(updatedCategories))

        // Then update all transactions using this category
        const updatedTransactions = transactions.map(transaction => {
            if (transaction.category === oldValue) {
                return {
                    ...transaction,
                    category: category.value,
                    type: category.type === 'both' ? transaction.type : category.type
                }
            }
            return transaction
        })
        setTransactions(updatedTransactions)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTransactions))
    }

    const deleteCategory = (value: string) => {
        // First update categories
        const updatedCategories = categories.filter(cat => cat.value !== value)
        setCategories(updatedCategories)
        localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(updatedCategories))

        // Then update transactions that used this category
        const updatedTransactions = transactions.map(transaction => {
            if (transaction.category === value) {
                return {
                    ...transaction,
                    category: 'other-expense',
                    type: 'expense' // Set type to expense when moving to other-expense
                }
            }
            return transaction
        })
        setTransactions(updatedTransactions)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTransactions))
    }

    const setFilters = (newFilters: FilterCriteria) => {
        setFilterCriteria(newFilters)
    }

    const clearFilters = () => {
        setFilterCriteria({})
    }

    // Add this sample data to your initial transactions
    const sampleTransactions = [
        {
            id: "1",
            type: "expense",
            amount: 60,
            description: "Uber rides",
            category: "transport",
            date: new Date(),
            breakdowns: [
                {
                    id: "1-1",
                    description: "Home to Store",
                    amount: 25
                },
                {
                    id: "1-2",
                    description: "Store to Friend's House",
                    amount: 15
                },
                {
                    id: "1-3",
                    description: "Friend's House to Home",
                    amount: 20
                }
            ]
        }
    ]

    return (
        <TransactionContext.Provider
            value={{
                transactions: filteredTransactions,
                categories,
                isLoading,
                addTransaction,
                deleteTransaction,
                updateTransaction,
                addCategory,
                updateCategory,
                deleteCategory,
                setFilters,
                clearFilters,
                filteredTransactions,
            }}
        >
            {children}
        </TransactionContext.Provider>
    )
}

export function useTransactions() {
    const context = useContext(TransactionContext)
    if (context === undefined) {
        throw new Error('useTransactions must be used within a TransactionProvider')
    }
    return context
}