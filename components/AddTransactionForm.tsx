'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useTransactions } from "@/contexts/TransactionContext"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useState } from "react"

const breakdownSchema = z.object({
    description: z.string().min(1, "Description is required"),
    amount: z.string().min(1, "Amount is required")
})

const formSchema = z.object({
    type: z.enum(['income', 'expense']),
    amount: z.string().min(1, "Amount is required"),
    description: z.string().min(1),
    category: z.string().min(1, "Category is required"),
    date: z.string().min(1, "Date is required"),
    breakdowns: z.array(breakdownSchema).optional()
}).refine((data) => {
    if (!data.breakdowns || data.breakdowns.length === 0) return true;

    const breakdownTotal = data.breakdowns.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    const transactionAmount = parseFloat(data.amount);

    console.log("Breakdown Total:", breakdownTotal);
    console.log("Transaction Amount:", transactionAmount);

    return Math.abs(breakdownTotal - transactionAmount) < 0.01;
}, {
    message: "Breakdown amounts must equal the total transaction amount",
    path: ["breakdowns"]
})

interface AddTransactionFormProps {
    onSuccess: () => void
    mode?: 'add' | 'edit'
    initialData?: any
}

export function AddTransactionForm({ onSuccess, mode = 'add', initialData }: AddTransactionFormProps) {
    const { addTransaction, updateTransaction, categories } = useTransactions()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            type: 'expense',
            amount: '',
            description: '',
            category: '',
            date: new Date().toISOString().split('T')[0],
            breakdowns: []
        }
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "breakdowns"
    })

    const breakdowns = form.watch("breakdowns") || []
    const transactionAmount = parseFloat(form.watch("amount") || "0")
    const breakdownsTotal = breakdowns.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
    const hasBreakdownError = Math.abs(breakdownsTotal - transactionAmount) >= 0.01

    const [breakdownError, setBreakdownError] = useState<string | null>(null)

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const dataToSubmit = {
                ...values,
                amount: Number(values.amount),
                date: values.date,
                breakdowns: values.breakdowns?.map(b => ({
                    ...b,
                    amount: Number(b.amount)
                })) || []
            }

            if (mode === 'edit' && initialData) {
                await updateTransaction(initialData.id, dataToSubmit)
            } else {
                await addTransaction(dataToSubmit)
            }
            form.reset()
            onSuccess()
        } catch (error) {
            console.error('Failed to handle transaction:', error)
        }
    }

    const type = form.watch('type') as 'income' | 'expense'
    const filteredCategories = categories.filter(category =>
        category.type === type || category.type === 'both'
    )

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newAmount = parseFloat(e.target.value) || 0
        const currentBreakdowns = form.getValues("breakdowns") || []

        if (currentBreakdowns.length > 0) {
            const allButLastTotal = currentBreakdowns.slice(0, -1)
                .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)

            const remainingAmount = newAmount - allButLastTotal
            if (remainingAmount >= 0) {
                form.setValue(`breakdowns.${currentBreakdowns.length - 1}.amount`,
                    remainingAmount.toString())
            }
        }
        validateBreakdownTotal()
    }

    const validateBreakdownTotal = () => {
        if (fields.length === 0) {
            setBreakdownError(null)
            return true
        }

        const total = breakdowns.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
        const difference = Math.abs(total - transactionAmount)

        if (difference >= 0.01) {
            const deficit = transactionAmount - total
            setBreakdownError(
                deficit > 0
                    ? `Breakdown total is $${Math.abs(deficit).toFixed(2)} less than transaction amount`
                    : `Breakdown total is $${Math.abs(deficit).toFixed(2)} more than transaction amount`
            )
            return false
        }

        setBreakdownError(null)
        return true
    }

    const handleBreakdownAmountChange = (index: number, value: string) => {
        form.setValue(`breakdowns.${index}.amount`, value)
        validateBreakdownTotal()
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel>Transaction Type</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={(value) => {
                                        field.onChange(value)
                                        form.setValue('category', '')
                                    }}
                                    defaultValue={field.value}
                                    className="flex flex-row space-x-4"
                                >
                                    <FormItem className="flex items-center space-x-2">
                                        <FormControl>
                                            <RadioGroupItem value="expense" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Expense</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2">
                                        <FormControl>
                                            <RadioGroupItem value="income" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Income</FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    {...field}
                                    onChange={(e) => {
                                        field.onChange(e)
                                        handleAmountChange(e)
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input placeholder="Transaction description" {...field} />
                            </FormControl>
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
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {filteredCategories.map((category) => (
                                        <SelectItem key={category.value} value={category.value}>
                                            {category.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem className="flex items-center">
                            <FormLabel className="mr-2">Date</FormLabel>
                            <FormControl className="flex-1">
                                <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <FormLabel>Breakdowns</FormLabel>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => append({ description: '', amount: '' })}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Item
                        </Button>
                    </div>

                    {fields.length > 0 && (
                        <Card className={cn(
                            "border",
                            hasBreakdownError ? "border-red-500" : "border-input"
                        )}>
                            <CardContent className="p-4 space-y-4">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="flex gap-3">
                                        <FormField
                                            control={form.control}
                                            name={`breakdowns.${index}.description`}
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Description"
                                                            {...field}
                                                            className={cn(
                                                                form.formState.errors.breakdowns?.[index]?.description && "border-red-500"
                                                            )}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`breakdowns.${index}.amount`}
                                            render={({ field }) => (
                                                <FormItem className="w-[120px]">
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            placeholder="Amount"
                                                            {...field}
                                                            className={cn(
                                                                hasBreakdownError && "border-red-500"
                                                            )}
                                                            onChange={(e) => {
                                                                field.onChange(e)
                                                                handleBreakdownAmountChange(index, e.target.value)
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                remove(index)
                                                validateBreakdownTotal()
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}

                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between pt-2 text-sm border-t">
                                        <span className="text-muted-foreground">Total Breakdown</span>
                                        <span className={cn(
                                            "font-medium",
                                            hasBreakdownError ? "text-red-500" : "text-green-600"
                                        )}>
                                            ${breakdownsTotal.toFixed(2)}
                                        </span>
                                    </div>
                                    {fields.length > 0 && breakdownError && (
                                        <p className="text-sm font-medium text-destructive">
                                            {breakdownError}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    disabled={fields.length > 0 && hasBreakdownError}
                >
                    {mode === 'edit' ? 'Update' : 'Add'} Transaction
                </Button>
            </form>
        </Form>
    )
} 