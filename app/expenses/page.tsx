'use client'

import { AddExpenseDialog } from "@/components/AddExpenseDialog"
import { ExpenseDataTable } from "@/components/ExpenseDataTable"
import { Filters } from "@/components/Filters"

export default function Expenses() {
    return (
        <div className="p-6">
            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Expenses</h1>
                    <AddExpenseDialog />
                </div>
                <p className="text-muted-foreground">
                    Here's a list of your expenses for this month!
                </p>
                <Filters />
                <ExpenseDataTable />
            </div>
        </div>
    )
} 