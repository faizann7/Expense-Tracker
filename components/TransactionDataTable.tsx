'use client'

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
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
import { useState } from "react"
import { useTransactions } from "@/contexts/TransactionContext"
import { formatCurrency } from "@/lib/utils"
import { Edit, Trash, MoreHorizontal, ChevronDown } from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { EditTransactionDialog } from "@/components/EditTransactionDialog"
import { ConfirmationDialog } from "@/components/ConfirmationDialog"

interface Transaction {
    id: string
    type: 'income' | 'expense'
    amount: number
    description: string
    category: string
    date: Date
    breakdowns?: { description: string; amount: number }[];
}

interface TransactionDataTableProps {
    onEdit: (transaction: Transaction) => void
}

export function TransactionDataTable({ onEdit }: TransactionDataTableProps) {
    const { filteredTransactions, categories, deleteTransaction } = useTransactions()
    const [sorting, setSorting] = useState<SortingState>([
        { id: 'date', desc: true }
    ])
    const [expandedBreakdown, setExpandedBreakdown] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 10
    const [isEditDialogOpen, setEditDialogOpen] = useState(false)
    const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null)
    const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false)
    const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null)

    const columns: ColumnDef<Transaction>[] = [
        {
            accessorKey: "date",
            header: "Date",
            cell: ({ row }) => {
                const date = new Date(row.getValue("date"))
                return (
                    <span className="text-gray-600 whitespace-nowrap">
                        {format(date, "MMM dd, yyyy")}
                    </span>
                )
            },
        },
        {
            accessorKey: "type",
            header: "Type",
            cell: ({ row }) => {
                const type = row.getValue("type") as 'income' | 'expense'
                return (
                    <Badge variant={type === 'income' ? 'green' : 'red'} className="text-xs font-medium">
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Badge>
                )
            },
        },
        {
            accessorKey: "category",
            header: "Category",
            cell: ({ row }) => {
                const category = categories.find(cat => cat.value === row.getValue("category"))
                return (
                    <span className="font-medium">{category?.label || row.getValue("category")}</span>
                )
            },
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ row }) => (
                <span className="text-gray-600">{row.getValue("description")}</span>
            ),
        },
        {
            accessorKey: "amount",
            header: "Amount",
            cell: ({ row }) => {
                const amount = row.getValue("amount") as number;
                const type = row.getValue("type") as 'income' | 'expense';
                const breakdownCount = row.original.breakdowns?.length || 0; // Get the breakdown count

                return (
                    <div className="flex items-center">
                        <span className={cn(
                            "font-medium",
                            type === 'income' ? 'text-green-600' : 'text-black'
                        )}>
                            {type === 'income' ? '+' : '-'}
                            {formatCurrency(amount)}
                        </span>
                        {breakdownCount > 0 && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                                {breakdownCount} items
                            </Badge>
                        )}
                    </div>
                );
            },
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <div className="flex justify-end items-center">
                    {row.original.breakdowns?.length > 0 && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setExpandedBreakdown(expandedBreakdown === row.original.id ? null : row.original.id)
                            }}
                            className="ml-2 flex items-center border-none shadow-none"
                        >
                            {expandedBreakdown === row.original.id ? 'Hide Breakdown' : 'View Breakdown'}
                            <ChevronDown className={cn(
                                "ml-1 h-4 w-4 transition-transform",
                                expandedBreakdown === row.original.id && "rotate-180"
                            )} />
                        </Button>
                    )}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-400 hover:text-gray-600 ml-2"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                            <DropdownMenuItem onClick={() => handleEdit(row.original)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleDelete(row.original)}
                                className="text-red-600 hover:text-red-700"
                            >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ]

    const table = useReactTable({
        data: filteredTransactions,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        state: {
            sorting,
            pagination: {
                pageIndex: currentPage - 1,
                pageSize,
            },
        },
    })

    const totalPages = Math.ceil(filteredTransactions.length / pageSize)

    // Function to generate page numbers array
    const getPageNumbers = () => {
        const pages = []
        const maxVisiblePages = 5
        const halfVisible = Math.floor(maxVisiblePages / 2)

        let startPage = Math.max(currentPage - halfVisible, 1)
        let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages)

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(endPage - maxVisiblePages + 1, 1)
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i)
        }

        return pages
    }

    const handleEdit = (transaction: Transaction) => {
        setTransactionToEdit(transaction)
        setEditDialogOpen(true)
    }

    const handleDelete = (transaction: Transaction) => {
        setTransactionToDelete(transaction)
        setConfirmDialogOpen(true)
    }

    const confirmDelete = () => {
        if (transactionToDelete) {
            deleteTransaction(transactionToDelete.id)
            setTransactionToDelete(null)
        }
    }

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="min-w-[150px]">Date</TableHead>
                            <TableHead className="w-1/4">Type</TableHead>
                            <TableHead className="w-1/4">Category</TableHead>
                            <TableHead className="w-1/4">Description</TableHead>
                            <TableHead className="w-1/4">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <>
                                    <TableRow
                                        key={row.id}
                                        className={cn(
                                            "group hover:bg-gray-50/50",
                                            row.original.type === 'income' ? 'hover:border-l-green-200' : 'hover:border-l-gray-200'
                                        )}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                    {/* Breakdown Row */}
                                    {expandedBreakdown === row.original.id && row.original.breakdowns?.length > 0 && (
                                        <TableRow className="hover:bg-transparent">
                                            <TableCell
                                                colSpan={columns.length}
                                                className="p-0 border-none"
                                            >
                                                <div className="mx-4 my-2">
                                                    <div className="relative p-4">
                                                        {/* Connector line */}
                                                        <div className="absolute -top-3 left-8 h-3 w-px bg-gray-200" />

                                                        {/* Header */}
                                                        <div className="mb-3 flex items-center justify-between text-sm text-gray-500">
                                                            <span>Breakdown Details</span>
                                                            <span>Total: {formatCurrency(
                                                                row.original.breakdowns.reduce((sum, b) => sum + b.amount, 0)
                                                            )}</span>
                                                        </div>

                                                        {/* Breakdown Items */}
                                                        <div className="space-y-2">
                                                            {row.original.breakdowns.map((breakdown, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="flex items-center gap-3 rounded-md bg-white p-3 shadow-sm"
                                                                >
                                                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-50 text-xs font-medium text-gray-600 ring-1 ring-gray-200/50">
                                                                        {index + 1}
                                                                    </div>
                                                                    <div className="flex flex-1 items-center justify-between">
                                                                        <div className="flex flex-col">
                                                                            <span className="font-medium text-gray-700">
                                                                                {breakdown.description}
                                                                            </span>
                                                                            <span className="text-xs text-gray-500">
                                                                                {((breakdown.amount / row.original.amount) * 100).toFixed(0)}% of total
                                                                            </span>
                                                                        </div>
                                                                        <span className={cn(
                                                                            "font-medium",
                                                                            row.original.type === 'income' ? 'text-green-600' : 'text-gray-900'
                                                                        )}>
                                                                            {row.original.type === 'income' ? '+' : '-'}
                                                                            {formatCurrency(breakdown.amount)}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No transactions found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Add pagination controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-2">
                    <div className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                    </div>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    className={cn(
                                        "cursor-pointer",
                                        currentPage === 1 && "pointer-events-none opacity-50"
                                    )}
                                />
                            </PaginationItem>

                            {currentPage > 2 && (
                                <>
                                    <PaginationItem>
                                        <PaginationLink onClick={() => setCurrentPage(1)}>
                                            1
                                        </PaginationLink>
                                    </PaginationItem>
                                    {currentPage > 3 && (
                                        <PaginationItem>
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                    )}
                                </>
                            )}

                            {getPageNumbers().map((pageNumber) => (
                                <PaginationItem key={pageNumber}>
                                    <PaginationLink
                                        onClick={() => setCurrentPage(pageNumber)}
                                        isActive={currentPage === pageNumber}
                                    >
                                        {pageNumber}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            {currentPage < totalPages - 1 && (
                                <>
                                    {currentPage < totalPages - 2 && (
                                        <PaginationItem>
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                    )}
                                    <PaginationItem>
                                        <PaginationLink onClick={() => setCurrentPage(totalPages)}>
                                            {totalPages}
                                        </PaginationLink>
                                    </PaginationItem>
                                </>
                            )}

                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    className={cn(
                                        "cursor-pointer",
                                        currentPage === totalPages && "pointer-events-none opacity-50"
                                    )}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}

            {isEditDialogOpen && transactionToEdit && (
                <EditTransactionDialog
                    transaction={transactionToEdit}
                    onClose={() => setEditDialogOpen(false)}
                />
            )}

            <ConfirmationDialog
                isOpen={isConfirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
                onConfirm={confirmDelete}
                title="Confirm Deletion"
                description="Are you sure you want to delete this transaction? This action cannot be undone."
            />
        </div>
    )
}