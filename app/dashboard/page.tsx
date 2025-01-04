'use client'

import { ExpenseDashboard } from "@/components/expense-dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart } from "@/components/PieChart"
import { ExpenseTrendChart } from "@/components/charts/expense-trend"
import { ViewOnlyExpenseTable } from "@/components/ViewOnlyExpenseTable"
import { DashboardDateRange } from "@/components/dashboard/date-range"
import { PageHeader } from "@/components/page-header"
import { useState } from "react"
import { DateRange } from "react-day-picker"

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your expenses"
      >
        <DashboardDateRange onRangeChange={setDateRange} />
      </PageHeader>
      <ExpenseDashboard dateRange={dateRange} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">
              Expense Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart dateRange={dateRange} />
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">
              Monthly Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ExpenseTrendChart dateRange={dateRange} />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <ViewOnlyExpenseTable
            limit={5}
            showRecent={true}
            dateRange={dateRange}
          />
        </CardContent>
      </Card>
    </div>
  )
}

