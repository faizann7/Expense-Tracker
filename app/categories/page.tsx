'use client'

import { AddCategoryDialog } from "@/components/AddCategoryDialog"
import { CategoryDataTable } from "@/components/CategoryDataTable"
import { PageHeader } from "@/components/page-header"

export default function CategoriesPage() {
    return (
        <div className="space-y-6 w-full">
            <PageHeader
                title="Categories"
                subtitle="Manage your expense categories"
            >
                <AddCategoryDialog />
            </PageHeader>
            <CategoryDataTable />
        </div>
    )
} 