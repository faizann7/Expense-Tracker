'use client'

import { PageHeader } from "@/components/page-header"
import { RecurringExpenseTable } from "@/components/recurring/recurring-expense-table"
import { AddRecurringExpenseDialog } from "@/components/recurring/add-recurring-expense-dialog"

export default function RecurringExpensesPage() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Recurring Expenses"
                subtitle="Manage your recurring bills and subscriptions"
            >
                <AddRecurringExpenseDialog />
            </PageHeader>
            <RecurringExpenseTable />
        </div>
    )
} 