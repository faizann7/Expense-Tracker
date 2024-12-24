"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { useExpenses } from "@/contexts/ExpenseContext"

export function ExpenseChart() {
  const { expenses } = useExpenses()

  const monthlyData = expenses.reduce((acc, expense) => {
    const date = new Date(expense.date)
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

    if (!acc[monthYear]) {
      acc[monthYear] = 0
    }
    acc[monthYear] += expense.amount
    return acc
  }, {} as Record<string, number>)

  const data = Object.entries(monthlyData)
    .map(([monthYear, total]) => ({
      name: monthYear,
      total: total
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          formatter={(value: number) => [`$${value.toFixed(2)}`, 'Total']}
          labelFormatter={(label) => {
            const [year, month] = label.split('-')
            return `${new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { month: 'long' })} ${year}`
          }}
        />
        <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}