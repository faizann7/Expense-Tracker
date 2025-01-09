"use client"

import * as React from "react"
import {
    ColumnDef,
    SortingState,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash } from "lucide-react"
import { useExpenses, Category } from "@/contexts/ExpenseContext"
import { EditCategoryDialog } from "./EditCategoryDialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { generatePastelColor, getContrastColor } from "@/utils/colors"

export const columns: ColumnDef<Category>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
            const category = row.original
            return (
                <div className="flex items-center gap-2">
                    <Badge
                        className="shadow-none"
                        style={{
                            backgroundColor: category.color,
                            color: getContrastColor(category.color),
                        }}
                    >
                        {category.name}
                    </Badge>
                </div>
            )
        },
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => row.getValue("description") || "-"
    },
    {
        accessorKey: "color",
        header: "Color",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: row.getValue("color") }}
                />
                <span>{row.getValue("color")}</span>
            </div>
        ),
    },
    {
        accessorKey: "expenseCount",
        header: "Expenses",
        cell: ({ row }) => row.getValue("expenseCount"),
    },
    {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => format(new Date(row.getValue("createdAt")), "MMM dd, yyyy"),
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const category = row.original
            const { deleteCategory } = useExpenses()
            const { toast } = useToast()
            const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
            const [showEditDialog, setShowEditDialog] = React.useState(false)

            const handleDelete = () => {
                deleteCategory(category.id)
                toast({
                    title: "Category deleted",
                    description: "The category has been successfully deleted.",
                })
                setShowDeleteDialog(false)
            }

            return (
                <>
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowEditDialog(true)}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowDeleteDialog(true)}
                        >
                            <Trash className="h-4 w-4" />
                        </Button>
                    </div>

                    <EditCategoryDialog
                        category={category}
                        open={showEditDialog}
                        onClose={() => setShowEditDialog(false)}
                    />

                    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently delete the category. This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </>
            )
        },
    },
]

export function CategoryDataTable() {
    const { categories } = useExpenses()
    const [sorting, setSorting] = React.useState<SortingState>([])

    const table = useReactTable({
        data: categories,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        state: {
            sorting,
        },
    })

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center"
                            >
                                No categories found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
} 