"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { useExpenses } from "@/contexts/ExpenseContext"
import { Card } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const CHART_COLORS = [
  { label: "Jan", color: "hsl(var(--chart-1))" },
  { label: "Feb", color: "hsl(var(--chart-2))" },
  { label: "Mar", color: "hsl(var(--chart-3))" },
  { label: "Apr", color: "hsl(var(--chart-4))" },
  { label: "May", color: "hsl(var(--chart-5))" },
  { label: "Jun", color: "hsl(var(--chart-6))" },
  { label: "Jul", color: "hsl(var(--chart-7))" },
  { label: "Aug", color: "hsl(var(--chart-8))" },
  { label: "Sep", color: "hsl(var(--chart-9))" },
  { label: "Oct", color: "hsl(var(--chart-10))" },
  { label: "Nov", color: "hsl(var(--chart-11))" },
  { label: "Dec", color: "hsl(var(--chart-12))" },
]

export function ExpenseChart() {
  const { expenses } = useExpenses()

  const monthlyData = expenses.reduce((acc, expense) => {
    const date = new Date(expense.date)
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const monthIndex = date.getMonth()

    if (!acc[monthYear]) {
      acc[monthYear] = {
        name: monthYear,
        total: 0,
        color: CHART_COLORS[monthIndex].color
      }
    }
    acc[monthYear].total += expense.amount
    return acc
  }, {} as Record<string, { name: string; total: number; color: string }>)

  const data = Object.values(monthlyData)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(item => ({
      name: item.name,
      total: item.total
    }))

  const chartConfig = data.reduce((config, _, index) => {
    const monthIndex = index % 12
    const key = `month${monthIndex + 1}`
    config[key] = {
      label: CHART_COLORS[monthIndex].label,
      color: CHART_COLORS[monthIndex].color,
    }
    return config
  }, {} as Record<string, { label: string; color: string }>)

  return (
    <ChartContainer config={chartConfig} className="h-[350px]">
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => {
            const [year, month] = value.split('-')
            return `${new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { month: 'short' })} ${year}`
          }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar
          dataKey="total"
          radius={[4, 4, 0, 0]}
          fill="var(--chart-1)"
        />
        <ChartTooltip
          content={({ active, payload }) => {
            if (!active || !payload) return null
            const data = payload[0]
            return (
              <ChartTooltipContent>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">Total:</span>
                    <span>${data.value?.toFixed(2)}</span>
                  </div>
                </div>
              </ChartTooltipContent>
            )
          }}
        />
      </BarChart>
    </ChartContainer>
  )
}

