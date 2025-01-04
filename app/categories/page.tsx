'use client'

import { AddCategoryDialog } from "@/components/AddCategoryDialog"
import { CategoryDataTable } from "@/components/CategoryDataTable"

export default function Categories() {
    return (
        <div className="p-6">
            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Categories</h1>
                        <p className="text-muted-foreground mt-2">
                            Manage your expense categories here.
                        </p>
                    </div>
                    <AddCategoryDialog />
                </div>
                <CategoryDataTable />
            </div>
        </div>
    )
} 