"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { CategoryForm } from "./CategoryForm"

interface Category {
    value: string
    label: string
    type: 'income' | 'expense' | 'both'
}

interface EditCategoryDialogProps {
    category: Category
    onClose: () => void
}

export function EditCategoryDialog({ category, onClose }: EditCategoryDialogProps) {
    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Category</DialogTitle>
                </DialogHeader>
                <CategoryForm
                    mode="edit"
                    initialData={category}
                    onSuccess={onClose}
                />
            </DialogContent>
        </Dialog>
    )
} 