'use client'

import { useExpenses } from "@/contexts/ExpenseContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExpenseList } from "@/components/ExpenseList"
import { ExpenseChart } from "@/components/ExpenseChart"
import { Filters } from "@/components/Filters"
import { PieChart } from "@/components/PieChart"
import { TrendChart } from "@/components/TrendChart"
import { AddExpenseDialog } from "@/components/AddExpenseDialog"

export default function Dashboard() {
  const { expenses } = useExpenses()

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const averageDailyExpense = totalExpenses / 30 // Assuming 30 days

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Expense Tracker</h1>
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
      <Tabs defaultValue="overview" className="mt-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
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
          <ExpenseList limit={5} />
        </TabsContent>
        <TabsContent value="expenses">
          <Filters />
          <ExpenseList />
        </TabsContent>
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Expense Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <TrendChart />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

