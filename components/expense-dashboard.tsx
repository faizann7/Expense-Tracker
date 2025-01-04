"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, DollarSign, TrendingUp, TrendingDown } from 'lucide-react'

export function ExpenseDashboard() {
  // This would typically come from a database or API
  const totalExpenses = 2500
  const monthlyBudget = 3000
  const topExpenseCategory = "Food & Dining"

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalExpenses}</div>
          <p className="text-xs text-muted-foreground">
            +20.1% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Budget</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${monthlyBudget}</div>
          <p className="text-xs text-muted-foreground">
            {((totalExpenses / monthlyBudget) * 100).toFixed(1)}% used
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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          <PlusCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Button className="w-full">Add New Expense</Button>
        </CardContent>
      </Card>
    </div>
  )
}

