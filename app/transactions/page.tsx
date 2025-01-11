'use client'

import { useState } from "react"
import { AddTransactionDialog } from "@/components/AddTransactionDialog"
import { TransactionDataTable } from "@/components/TransactionDataTable"
import { TransactionTimeline } from "@/components/TransactionTimeline"
import { ViewSwitcher } from "@/components/ViewSwitcher"
import { TransactionProvider } from "@/contexts/TransactionContext"
import { TransactionFilters } from "@/components/TransactionFilters"
import { PageHeader } from "@/components/page-header"

export default function TransactionsPage() {
    const [view, setView] = useState<'table' | 'grid' | 'timeline'>('table')
    const [transactionToEdit, setTransactionToEdit] = useState<any>(null)

    const onEdit = (transaction: any) => {
        setTransactionToEdit(transaction)
    }

    return (
        <TransactionProvider>
            <div className="space-y-6 w-full">
                <PageHeader
                    title="Transactions"
                    subtitle="Manage and track your transactions"
                >
                    <AddTransactionDialog />
                </PageHeader>
                <div className="flex justify-between items-center gap-4">
                    <TransactionFilters />
                    <ViewSwitcher view={view} onViewChange={setView} />
                </div>
                {view === 'table' && <TransactionDataTable onEdit={onEdit} />}
                {view === 'timeline' && <TransactionTimeline onEdit={onEdit} />}
            </div>
        </TransactionProvider>
    )
} 