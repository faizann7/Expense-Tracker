'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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

const formSchema = z.object({
    type: z.enum(['income', 'expense']),
    amount: z.string().min(1).transform(val => parseFloat(val)),
    description: z.string().min(1),
    category: z.string().min(1),
    date: z.string().transform(val => new Date(val))
})

interface AddTransactionFormProps {
    onSuccess: () => void
    mode?: 'add' | 'edit'
    initialData?: any // You might want to type this properly
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
            date: new Date().toISOString().split('T')[0]
        }
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (mode === 'edit' && initialData) {
                await updateTransaction(initialData.id, values)
            } else {
                await addTransaction(values)
            }
            form.reset()
            onSuccess()
        } catch (error) {
            console.error('Failed to handle transaction:', error)
        }
    }

    // Get filtered categories based on selected type
    const type = form.watch('type') as 'income' | 'expense'
    const filteredCategories = categories.filter(category =>
        category.type === type || category.type === 'both'
    )

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                        // Reset category when type changes
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
                                <Input type="number" step="0.01" placeholder="0.00" {...field} />
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
                        <FormItem>
                            <FormLabel>Date</FormLabel>
                            <FormControl>
                                <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full">
                    {mode === 'edit' ? 'Update' : 'Add'} Transaction
                </Button>
            </form>
        </Form>
    )
} 