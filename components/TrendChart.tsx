"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useExpenses } from "@/contexts/ExpenseContext"

export function TrendChart() {
  const { expenses } = useExpenses()

  const monthlyData = expenses.reduce((acc, expense) => {
    const date = new Date(expense.date)
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

    if (!acc[monthYear]) {
      acc[monthYear] = {}
    }
    if (!acc[monthYear][expense.category]) {
      acc[monthYear][expense.category] = 0
    }
    acc[monthYear][expense.category] += expense.amount
    return acc
  }, {} as Record<string, Record<string, number>>)

  const data = Object.entries(monthlyData)
    .map(([monthYear, categories]) => ({
      name: monthYear,
      ...categories
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  const categories = Array.from(new Set(expenses.map(e => e.category)))

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          tickFormatter={(tick) => {
            const [year, month] = tick.split('-')
            return `${new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { month: 'short' })} ${year}`
          }}
        />
        <YAxis />
        <Tooltip
          formatter={(value: number) => `$${value.toFixed(2)}`}
          labelFormatter={(label) => {
            const [year, month] = label.split('-')
            return `${new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { month: 'long' })} ${year}`
          }}
        />
        <Legend />
        {categories.map((category, index) => (
          <Line
            key={category}
            type="monotone"
            dataKey={category}
            stroke={`hsl(${index * 360 / categories.length}, 70%, 50%)`}
            activeDot={{ r: 8 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

