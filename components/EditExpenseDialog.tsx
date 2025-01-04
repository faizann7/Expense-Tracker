"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Expense } from "@/contexts/ExpenseContext"
import { AddExpenseForm } from "./AddExpenseForm"

interface EditExpenseDialogProps {
  expense: Expense
  open: boolean
  onClose: () => void
}

export function EditExpenseDialog({ expense, open, onClose }: EditExpenseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
        </DialogHeader>
        <AddExpenseForm
          onSuccess={onClose}
          initialData={expense}
          mode="edit"
        />
      </DialogContent>
    </Dialog>
  )
}

