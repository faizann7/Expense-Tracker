"use client"

import { useExpenses } from "@/contexts/ExpenseContext"
import { format, parseISO, eachDayOfInterval, subDays } from "date-fns"

export function SpendingHeatmap() {
    const { expenses } = useExpenses()

    const days = eachDayOfInterval({
        start: subDays(new Date(), 364),
        end: new Date()
    })

    const dailyTotals = days.map(day => {
        const dayExpenses = expenses.filter(expense => {
            const expenseDate = parseISO(expense.date)
            return format(expenseDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
        })

        return {
            date: format(day, 'yyyy-MM-dd'),
            total: dayExpenses.reduce((sum, expense) => sum + expense.amount, 0)
        }
    })

    if (dailyTotals.every(data => data.total === 0)) {
        return (
            <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
                No data available for heatmap
            </div>
        )
    }

    // TODO: Implement actual heatmap visualization
    // For now, showing a placeholder message
    return (
        <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
            Heatmap visualization coming soon
        </div>
    )
} 