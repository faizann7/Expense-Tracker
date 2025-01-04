"use client"

import { useExpenses } from "@/contexts/ExpenseContext"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { subDays, format, parseISO, startOfDay, endOfDay } from "date-fns"

export function DailySpendingChart() {
    const { expenses } = useExpenses()

    const dailyData = Array.from({ length: 30 }, (_, i) => {
        const date = subDays(new Date(), i)
        const dayStart = startOfDay(date)
        const dayEnd = endOfDay(date)

        const dayExpenses = expenses.filter(expense => {
            const expenseDate = parseISO(expense.date)
            return expenseDate >= dayStart && expenseDate <= dayEnd
        })

        return {
            name: format(date, 'MMM dd'),
            total: dayExpenses.reduce((sum, expense) => sum + expense.amount, 0)
        }
    }).reverse()

    if (dailyData.every(data => data.total === 0)) {
        return (
            <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
                No daily spending data to show
            </div>
        )
    }

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={dailyData}
                    margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
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
                        width={60}
                    />
                    <Tooltip
                        formatter={(value: number) => [`$${value.toFixed(2)}`, 'Total']}
                    />
                    <Line
                        type="monotone"
                        dataKey="total"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
} 