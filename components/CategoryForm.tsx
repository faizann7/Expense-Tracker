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
import { useExpenses } from "@/contexts/ExpenseContext"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
        message: "Please enter a valid hex color code",
    }),
})

interface CategoryFormProps {
    onSuccess?: () => void
}

export function CategoryForm({ onSuccess }: CategoryFormProps) {
    const { addCategory } = useExpenses()
    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            color: "#000000",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Generate a pastel version of the selected color
        const pastelColor = generatePastelColor(values.color)

        addCategory({
            ...values,
            color: pastelColor
        })
        toast({
            title: "Category added",
            description: "Your new category has been created successfully.",
        })
        form.reset()
        onSuccess?.()
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
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
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl>
                                <Input placeholder="Category description" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Color</FormLabel>
                            <FormControl>
                                <div className="flex gap-2">
                                    <Input
                                        type="color"
                                        {...field}
                                        className="w-12 h-10 p-1"
                                    />
                                    <Input
                                        {...field}
                                        placeholder="#000000"
                                        onChange={(e) => {
                                            const value = e.target.value
                                            if (value.startsWith('#')) {
                                                field.onChange(value)
                                            } else {
                                                field.onChange(`#${value}`)
                                            }
                                        }}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit">Add Category</Button>
            </form>
        </Form>
    )
} 