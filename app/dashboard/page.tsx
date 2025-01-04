'use client'

import { ExpenseDashboard } from "@/components/expense-dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart } from "@/components/PieChart"
import { ExpenseChart } from "@/components/ExpenseChart"
import { ViewOnlyExpenseTable } from "@/components/ViewOnlyExpenseTable"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <ExpenseDashboard />
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
      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <ViewOnlyExpenseTable limit={5} showRecent={true} />
        </CardContent>
      </Card>
    </div>
  )
}

