"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react'
import { useExpenses } from "@/contexts/ExpenseContext"
import { DateRange } from "react-day-picker"

interface ExpenseDashboardProps {
  dateRange?: DateRange
}

export function ExpenseDashboard({ dateRange }: ExpenseDashboardProps) {
  const { expenses } = useExpenses()

  const filteredExpenses = expenses.filter(expense => {
    if (!dateRange?.from || !dateRange?.to) return true
    const expenseDate = new Date(expense.date)
    return expenseDate >= dateRange.from && expenseDate <= dateRange.to
  })

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  // Calculate previous period for comparison
  const periodLength = dateRange?.from && dateRange?.to
    ? dateRange.to.getTime() - dateRange.from.getTime()
    : 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds

  const previousPeriodStart = dateRange?.from
    ? new Date(dateRange.from.getTime() - periodLength)
    : new Date(Date.now() - 2 * periodLength)
  const previousPeriodEnd = dateRange?.from
    ? new Date(dateRange.from)
    : new Date(Date.now() - periodLength)

  const previousPeriodExpenses = expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date)
      return expenseDate >= previousPeriodStart && expenseDate < previousPeriodEnd
    })
    .reduce((sum, expense) => sum + expense.amount, 0)

  const monthlyChange = previousPeriodExpenses
    ? ((totalExpenses - previousPeriodExpenses) / previousPeriodExpenses) * 100
    : 0

  const categoryTotals = filteredExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {} as Record<string, number>)

  const topExpenseCategory = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || "No expenses"

  const topCategoryPercentage = topExpenseCategory !== "No expenses"
    ? (categoryTotals[topExpenseCategory] / totalExpenses) * 100
    : 0

  const hasExpenses = filteredExpenses.length > 0

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {hasExpenses ? (
            <>
              <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                {monthlyChange > 0 ? '+' : ''}{monthlyChange.toFixed(1)}% from previous period
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No expenses in this period</p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Change</CardTitle>
          {monthlyChange > 0 ? (
            <TrendingUp className="h-4 w-4 text-red-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-green-500" />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Math.abs(monthlyChange).toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            Compared to previous period
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Category</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{topExpenseCategory}</div>
          <p className="text-xs text-muted-foreground">
            {topCategoryPercentage.toFixed(1)}% of total expenses
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

