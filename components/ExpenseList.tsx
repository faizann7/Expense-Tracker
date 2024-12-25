"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash } from 'lucide-react'
import { useExpenses } from "@/contexts/ExpenseContext"
import { EditExpenseDialog } from "./EditExpenseDialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"

export function ExpenseList({ limit }: { limit?: number }) {
  const { filteredExpenses, deleteExpense } = useExpenses()
  const [editingExpense, setEditingExpense] = useState<string | null>(null)
  const { toast } = useToast()

  const displayedExpenses = limit ? filteredExpenses.slice(0, limit) : filteredExpenses

  const handleDelete = (id: string) => {
    deleteExpense(id)
    toast({
      title: "Expense deleted",
      description: "Your expense has been successfully deleted.",
    })
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedExpenses.map((expense) => (
            <TableRow key={expense.id} className="hover:bg-muted/50 transition-colors">
              <TableCell>{expense.date}</TableCell>
              <TableCell>{expense.category}</TableCell>
              <TableCell>${expense.amount.toFixed(2)}</TableCell>
              <TableCell>{expense.notes}</TableCell>
              <TableCell className="text-right">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => setEditingExpense(expense.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Edit expense
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(expense.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Delete expense
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {editingExpense && (
        <EditExpenseDialog
          expenseId={editingExpense}
          onClose={() => setEditingExpense(null)}
        />
      )}
    </>
  )
}

