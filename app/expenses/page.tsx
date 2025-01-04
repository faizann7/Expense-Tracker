'use client'

import { AddExpenseDialog } from "@/components/AddExpenseDialog"
import { ExpenseList } from "@/components/ExpenseList"
import { Filters } from "@/components/Filters"

export default function Expenses() {
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Expenses</h1>
                <AddExpenseDialog />
            </div>
            <Filters />
            <ExpenseList />
        </div>
    )
} 