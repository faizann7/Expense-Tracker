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
                    initialData={{
                        ...transaction,
                        amount: transaction.amount.toString(),
                        date: new Date(transaction.date).toISOString().split('T')[0]
                    }}
                    onSuccess={onClose}
                />
            </DialogContent>
        </Dialog>
    )
} 