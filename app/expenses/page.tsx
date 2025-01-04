'use client'

import { AddExpenseDialog } from "@/components/AddExpenseDialog"
import { ExpenseDataTable } from "@/components/ExpenseDataTable"
import { Filters } from "@/components/Filters"
import { PageHeader } from "@/components/page-header"

export default function ExpensesPage() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Expenses"
                subtitle="Manage and track your expenses"
            >
                <AddExpenseDialog />
            </PageHeader>
            <Filters />
            <ExpenseDataTable />
        </div>
    )
} 