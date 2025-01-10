"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useTransactions } from "@/contexts/TransactionContext"

const formSchema = z.object({
    label: z.string().min(1, "Name is required"),
    value: z.string().min(1, "Value is required"),
    type: z.enum(['income', 'expense', 'both'])
})

interface Category {
    value: string
    label: string
    type: 'income' | 'expense' | 'both'
}

interface CategoryFormProps {
    onSuccess?: () => void
    initialData?: Category
    mode?: "add" | "edit"
}

export function CategoryForm({ onSuccess, initialData, mode = "add" }: CategoryFormProps) {
    const { addCategory, updateCategory } = useTransactions()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            label: "",
            value: "",
            type: "expense"
        }
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (mode === "edit" && initialData) {
            updateCategory(initialData.value, values)
        } else {
            addCategory(values)
        }
        form.reset()
        onSuccess?.()
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="label"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Category name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Value</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="category-name"
                                    {...field}
                                    disabled={mode === "edit"}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="income">Income</SelectItem>
                                    <SelectItem value="expense">Expense</SelectItem>
                                    <SelectItem value="both">Both</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full">
                    {mode === "edit" ? "Update" : "Add"} Category
                </Button>
            </form>
        </Form>
    )
} 