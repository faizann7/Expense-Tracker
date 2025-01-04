"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useExpenses } from "@/contexts/ExpenseContext"
import { format } from "date-fns"

interface ExpenseListProps {
  limit?: number
  useFilters?: boolean
}

export function ExpenseList({ limit, useFilters = false }: ExpenseListProps) {
  const { expenses, filteredExpenses } = useExpenses()

  const sourceExpenses = useFilters ? filteredExpenses : expenses

  const displayExpenses = limit ?
    sourceExpenses.slice(0, limit) :
    sourceExpenses

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayExpenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell>{format(new Date(expense.date), 'MMM dd, yyyy')}</TableCell>
              <TableCell>{expense.category}</TableCell>
              <TableCell>${expense.amount.toFixed(2)}</TableCell>
              <TableCell>{expense.notes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

