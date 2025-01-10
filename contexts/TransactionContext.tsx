'use client'

import { createContext, useContext, ReactNode, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { categories as defaultCategories } from '@/config/categories'

interface Transaction {
    id: string
    type: 'income' | 'expense'
    amount: number
    description: string
    category: string
    date: Date
    createdAt: Date
    updatedAt: Date
}

interface Category {
    value: string
    label: string
    type: 'income' | 'expense' | 'both'
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
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined)

const STORAGE_KEY = 'transactions'
const CATEGORIES_STORAGE_KEY = 'transaction-categories'

export function TransactionProvider({ children }: { children: ReactNode }) {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const searchParams = useSearchParams()

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
        if (dateFrom && new Date(transaction.date) < new Date(dateFrom)) return false
        if (dateTo && new Date(transaction.date) > new Date(dateTo)) return false
        if (category && transaction.category !== category) return false
        if (type && transaction.type !== type) return false
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
                deleteCategory
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