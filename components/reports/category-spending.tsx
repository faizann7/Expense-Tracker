"use client"

import { useExpenses } from "@/contexts/ExpenseContext"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface CategorySpendingChartProps {
    showDetails?: boolean
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export function CategorySpendingChart({ showDetails }: CategorySpendingChartProps) {
    const { expenses } = useExpenses()

    const data = expenses.reduce((acc, expense) => {
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
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={showDetails ? 100 : 80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                        showDetails ? `${name} (${(percent * 100).toFixed(0)}%)` : ''
                    }
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                        />
                    ))}
                </Pie>
                <Tooltip
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Total']}
                />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    )
} 