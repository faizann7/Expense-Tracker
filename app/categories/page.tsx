'use client'

import { AddCategoryDialog } from "@/components/AddCategoryDialog"
import { CategoryDataTable } from "@/components/CategoryDataTable"
import { PageHeader } from "@/components/page-header"
import { TransactionProvider } from "@/contexts/TransactionContext"

export default function CategoriesPage() {
    return (
        <TransactionProvider>
            <div className="space-y-6 w-full">
                <PageHeader
                    title="Categories"
                    subtitle="Manage your transaction categories"
                >
                    <AddCategoryDialog />
                </PageHeader>
                <CategoryDataTable />
            </div>
        </TransactionProvider>
    )
} 