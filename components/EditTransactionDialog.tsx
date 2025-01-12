'use client'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { AddTransactionForm } from "./AddTransactionForm"
import { Transaction } from "@/contexts/TransactionContext"

interface EditTransactionDialogProps {
    transaction: Transaction
    onClose: () => void
}

export function EditTransactionDialog({ transaction, onClose }: EditTransactionDialogProps) {
    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Transaction</DialogTitle>
                </DialogHeader>
                <AddTransactionForm
                    mode="edit"
                    initialData={transaction}
                    onSuccess={onClose}
                />
            </DialogContent>
        </Dialog>
    )
} 