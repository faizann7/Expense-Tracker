"use client"

import { useExpenses } from "@/contexts/ExpenseContext"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { format, parseISO, startOfMonth, endOfMonth, addMonths, subMonths } from "date-fns"

export function ExpenseForecast() {
    const { expenses } = useExpenses()

    // Get historical data
    const historicalData = Array.from({ length: 6 }, (_, i) => {
        const date = subMonths(new Date(), i)
        const monthStart = startOfMonth(date)
        const monthEnd = endOfMonth(date)

        const monthExpenses = expenses.filter(expense => {
            const expenseDate = parseISO(expense.date)
            return expenseDate >= monthStart && expenseDate <= monthEnd
        })

        return {
            month: format(date, 'MMM yyyy'),
            actual: monthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
        }
    }).reverse()

    // Simple forecasting using moving average
    const movingAverage = historicalData.reduce((sum, month) => sum + month.actual, 0) / historicalData.length
    const trend = (historicalData[historicalData.length - 1].actual - historicalData[0].actual) / historicalData.length

    // Generate forecast for next 3 months
    const forecastData = Array.from({ length: 3 }, (_, i) => {
        const date = addMonths(new Date(), i + 1)
        return {
            month: format(date, 'MMM yyyy'),
            forecast: movingAverage + (trend * (i + 1))
        }
    })

    // Combine historical and forecast data
    const chartData = [
        ...historicalData.map(d => ({ ...d, forecast: null })),
        ...forecastData.map(d => ({ actual: null, ...d }))
    ]

    return (
        <div className="space-y-4">
            <div className="flex justify-between">
                <div>
                    <h3 className="text-lg font-medium">Expense Forecast</h3>
                    <p className="text-sm text-muted-foreground">
                        Predicted spending for the next 3 months
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-medium">
                        Projected Next Month
                    </p>
                    <p className="text-2xl font-bold">
                        ${forecastData[0].forecast.toFixed(2)}
                    </p>
                </div>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="month"
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
                            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
                        />
                        <Line
                            type="monotone"
                            dataKey="actual"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            dot={true}
                        />
                        <Line
                            type="monotone"
                            dataKey="forecast"
                            stroke="hsl(var(--muted))"
                            strokeDasharray="5 5"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
} 