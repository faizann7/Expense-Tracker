"use client"

import { useExpenses } from "@/contexts/ExpenseContext"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { subMonths, format, startOfMonth, endOfMonth, parseISO } from "date-fns"
import { DateRange } from "react-day-picker"

interface ExpenseTrendChartProps {
    dateRange?: DateRange
}

export function ExpenseTrendChart({ dateRange }: ExpenseTrendChartProps) {
    const { expenses } = useExpenses()

    const filteredExpenses = expenses.filter(expense => {
        if (!dateRange?.from || !dateRange?.to) return true
        const expenseDate = new Date(expense.date)
        return expenseDate >= dateRange.from && expenseDate <= dateRange.to
    })

    const monthlyData = Array.from({ length: 6 }, (_, i) => {
        const date = subMonths(new Date(), i)
        const monthStart = startOfMonth(date)
        const monthEnd = endOfMonth(date)
        const monthKey = format(date, 'yyyy-MM')

        const monthExpenses = filteredExpenses.filter(expense => {
            const expenseDate = parseISO(expense.date)
            return format(expenseDate, 'yyyy-MM') === monthKey
        })

        return {
            name: format(date, 'MMM'),
            total: monthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
        }
    }).reverse()

    if (monthlyData.every(data => data.total === 0)) {
        return (
            <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
                No expenses to show in this period
            </div>
        )
    }

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={monthlyData}
                    margin={{ top: 0, right: 15, left: -20, bottom: 0 }}
                >
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
                        width={50}
                    />
                    <Tooltip
                        formatter={(value: number) => [`$${value.toFixed(2)}`, 'Total']}
                        contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '6px'
                        }}
                    />
                    <Bar
                        dataKey="total"
                        fill="currentColor"
                        radius={[4, 4, 0, 0]}
                        className="fill-primary"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
} 