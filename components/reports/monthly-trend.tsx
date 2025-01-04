"use client"

import { useExpenses } from "@/contexts/ExpenseContext"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { subMonths, format, startOfMonth, endOfMonth, parseISO } from "date-fns"

interface MonthlyTrendChartProps {
    showDetails?: boolean
}

export function MonthlyTrendChart({ showDetails }: MonthlyTrendChartProps) {
    const { expenses } = useExpenses()

    const monthlyData = Array.from({ length: showDetails ? 12 : 6 }, (_, i) => {
        const date = subMonths(new Date(), i)
        const monthStart = startOfMonth(date)
        const monthEnd = endOfMonth(date)

        const monthExpenses = expenses.filter(expense => {
            const expenseDate = parseISO(expense.date)
            return expenseDate >= monthStart && expenseDate <= monthEnd
        })

        return {
            name: format(date, 'MMM yyyy'),
            total: monthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
        }
    }).reverse()

    if (monthlyData.every(data => data.total === 0)) {
        return (
            <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
                No expenses to show
            </div>
        )
    }

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={monthlyData}
                    margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                    {showDetails && <CartesianGrid strokeDasharray="3 3" />}
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
                        width={showDetails ? 60 : 50}
                    />
                    <Tooltip
                        cursor={{ fill: 'hsl(var(--muted))' }}
                        formatter={(value: number) => [`$${value.toFixed(2)}`, 'Total']}
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