"use client"

import { useExpenses } from "@/contexts/ExpenseContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { format, parseISO, startOfMonth, endOfMonth, subMonths } from "date-fns"
import { ArrowDown, ArrowUp, TrendingUp, AlertTriangle } from "lucide-react"

export function SpendingPatternAnalysis() {
    const { expenses } = useExpenses()

    // Calculate monthly averages and identify patterns
    const monthlyAverages = Array.from({ length: 6 }, (_, i) => {
        const date = subMonths(new Date(), i)
        const monthStart = startOfMonth(date)
        const monthEnd = endOfMonth(date)

        const monthExpenses = expenses.filter(expense => {
            const expenseDate = parseISO(expense.date)
            return expenseDate >= monthStart && expenseDate <= monthEnd
        })

        return {
            month: format(date, 'MMM yyyy'),
            total: monthExpenses.reduce((sum, expense) => sum + expense.amount, 0),
            count: monthExpenses.length
        }
    }).reverse()

    // Calculate trends and patterns
    const currentMonth = monthlyAverages[monthlyAverages.length - 1]
    const previousMonth = monthlyAverages[monthlyAverages.length - 2]
    const monthlyChange = previousMonth?.total
        ? ((currentMonth.total - previousMonth.total) / previousMonth.total) * 100
        : 0

    // Calculate average transaction size
    const avgTransactionSize = currentMonth.count > 0
        ? currentMonth.total / currentMonth.count
        : 0

    // Identify spending anomalies
    const averageMonthlySpend = monthlyAverages.reduce((sum, month) => sum + month.total, 0) / monthlyAverages.length
    const isCurrentMonthAnomalous = Math.abs(currentMonth.total - averageMonthlySpend) > (averageMonthlySpend * 0.5)

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Monthly Trend
                    </CardTitle>
                    {monthlyChange > 0 ? (
                        <ArrowUp className="h-4 w-4 text-red-500" />
                    ) : (
                        <ArrowDown className="h-4 w-4 text-green-500" />
                    )}
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {monthlyChange > 0 ? '+' : ''}{monthlyChange.toFixed(1)}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                        vs previous month
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Average Transaction
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        ${avgTransactionSize.toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {currentMonth.count} transactions this month
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Monthly Average
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        ${averageMonthlySpend.toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Last 6 months average
                    </p>
                </CardContent>
            </Card>

            <Card className={isCurrentMonthAnomalous ? "border-red-500" : ""}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Spending Anomaly
                    </CardTitle>
                    <AlertTriangle className={`h-4 w-4 ${isCurrentMonthAnomalous ? 'text-red-500' : 'text-muted-foreground'}`} />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {isCurrentMonthAnomalous ? 'Detected' : 'Normal'}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {isCurrentMonthAnomalous
                            ? 'Unusual spending pattern detected'
                            : 'Spending within normal range'}
                    </p>
                </CardContent>
            </Card>
        </div>
    )
} 