"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { CategoryForm } from "./CategoryForm"
import { Plus } from "lucide-react"

export function AddCategoryDialog() {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Category
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                    <DialogDescription>
                        Enter the details of your new category here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <CategoryForm onSuccess={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    )
} 