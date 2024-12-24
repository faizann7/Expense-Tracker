"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useExpenses } from "@/contexts/ExpenseContext"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  amount: z.string().min(1, "Amount is required.").refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    "Amount must be a positive number."
  ),
  category: z.string().min(1, "Category is required."),
  notes: z.string().optional(),
  date: z.string().min(1, "Date is required."),
})

export function EditExpenseDialog({ expenseId, onClose }: { expenseId: string; onClose: () => void }) {
  const { expenses, updateExpense } = useExpenses()
  const { toast } = useToast()
  const expense = expenses.find((e) => e.id === expenseId)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: expense ? expense.amount.toString() : "",
      category: expense ? expense.category : "",
      notes: expense ? expense.notes : "",
      date: expense ? expense.date : "",
    },
  })

  useEffect(() => {
    if (expense) {
      form.reset({
        amount: expense.amount.toString(),
        category: expense.category,
        notes: expense.notes,
        date: expense.date,
      })
    }
  }, [expense, form])

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (expense) {
      updateExpense(expense.id, {
        amount: parseFloat(values.amount),
        category: values.category,
        notes: values.notes,
        date: values.date,
      })
      toast({
        title: "Expense updated",
        description: "Your expense has been successfully updated.",
      })
      onClose()
    }
  }

  if (!expense) return null

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the expense amount.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="food">Food & Dining</SelectItem>
                      <SelectItem value="transportation">Transportation</SelectItem>
                      <SelectItem value="utilities">Utilities</SelectItem>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the expense category.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add any additional notes here." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Update Expense</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

