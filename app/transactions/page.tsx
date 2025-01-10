'use client'

import { AddTransactionDialog } from "@/components/AddTransactionDialog"
import { TransactionDataTable } from "@/components/TransactionDataTable"
import { TransactionGrid } from "@/components/TransactionGrid"
import { ViewSwitcher } from "@/components/ViewSwitcher"
import { Filters } from "@/components/Filters"
import { PageHeader } from "@/components/page-header"
import { TransactionProvider } from "@/contexts/TransactionContext"
import { useState } from "react"
import { EditTransactionDialog } from "@/components/EditTransactionDialog"

type ViewType = 'table' | 'grid'

export default function TransactionsPage() {
    const [view, setView] = useState<ViewType>('table')
    const [transactionToEdit, setTransactionToEdit] = useState<any>(null)

    return (
        <TransactionProvider>
            <div className="space-y-6 w-full">
                <PageHeader
                    title="Transactions"
                    subtitle="Manage and track your income and expenses"
                >
                    <div className="flex items-center gap-2">
                        <ViewSwitcher view={view} onViewChange={setView} />
                        <AddTransactionDialog />
                    </div>
                </PageHeader>
                <Filters />
                {view === 'table' ? (
                    <TransactionDataTable onEdit={setTransactionToEdit} />
                ) : (
                    <TransactionGrid onEdit={setTransactionToEdit} />
                )}
                {transactionToEdit && (
                    <EditTransactionDialog
                        transaction={transactionToEdit}
                        onClose={() => setTransactionToEdit(null)}
                    />
                )}
            </div>
        </TransactionProvider>
    )
} 