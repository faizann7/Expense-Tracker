"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react'
import { useExpenses } from "@/contexts/ExpenseContext"

export function ExpenseDashboard() {
  const { expenses } = useExpenses()

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const previousMonthExpenses = expenses
    .filter(expense => {
      const date = new Date(expense.date)
      const now = new Date()
      return date.getMonth() === now.getMonth() - 1
    })
    .reduce((sum, expense) => sum + expense.amount, 0)

  const monthlyChange = previousMonthExpenses ?
    ((totalExpenses - previousMonthExpenses) / previousMonthExpenses) * 100 : 0

  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {} as Record<string, number>)

  const topExpenseCategory = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || "No expenses"

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            +20.1% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Change</CardTitle>
          {monthlyChange > 0 ? (
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{monthlyChange}%</div>
          <p className="text-xs text-muted-foreground">
            Compared to previous month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Expense Category</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{topExpenseCategory}</div>
          <p className="text-xs text-muted-foreground">
            30% of total expenses
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

