'use client'

import { useExpenses } from "@/contexts/ExpenseContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExpenseList } from "@/components/ExpenseList"
import { ExpenseChart } from "@/components/ExpenseChart"
import { PieChart } from "@/components/PieChart"
import { AddExpenseDialog } from "@/components/AddExpenseDialog"

export default function Overview() {
  const { expenses } = useExpenses()

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const averageDailyExpense = totalExpenses / 30

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Overview</h1>
        <AddExpenseDialog />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Daily Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageDailyExpense.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Monthly Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <ExpenseChart />
          </CardContent>
        </Card>
      </div>
      <div className="mt-6">
        <ExpenseList limit={5} />
      </div>
    </div>
  )
}

