"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { CategoryForm } from "./CategoryForm"
import { Category } from "@/contexts/ExpenseContext"

interface EditCategoryDialogProps {
    category: Category
    open: boolean
    onClose: () => void
}

export function EditCategoryDialog({ category, open, onClose }: EditCategoryDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Category</DialogTitle>
                </DialogHeader>
                <CategoryForm
                    onSuccess={onClose}
                    initialData={category}
                    mode="edit"
                />
            </DialogContent>
        </Dialog>
    )
} 