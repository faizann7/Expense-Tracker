"use client"

import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { useExpenses } from "@/contexts/ExpenseContext"
import { DateRange } from "react-day-picker"

interface PieChartProps {
  dateRange?: DateRange
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export function PieChart({ dateRange }: PieChartProps) {
  const { expenses } = useExpenses()

  const filteredExpenses = expenses.filter(expense => {
    if (!dateRange?.from || !dateRange?.to) return true
    const expenseDate = new Date(expense.date)
    return expenseDate >= dateRange.from && expenseDate <= dateRange.to
  })

  const data = filteredExpenses.reduce((acc, expense) => {
    const existingCategory = acc.find(item => item.name === expense.category)
    if (existingCategory) {
      existingCategory.value += expense.amount
    } else {
      acc.push({ name: expense.category, value: expense.amount })
    }
    return acc
  }, [] as { name: string; value: number }[])

  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
        No expense data to display
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RePieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </RePieChart>
    </ResponsiveContainer>
  )
}

