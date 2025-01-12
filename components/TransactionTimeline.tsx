'use client'

import { useTransactions } from "@/contexts/TransactionContext"
import { formatCurrency } from "@/lib/utils"
import { format } from "date-fns"
import {
    Edit,
    Trash,
    ArrowDownCircle,
    ArrowUpCircle,
    ChevronDown,
    ChevronUp,
    Car,
    ShoppingBag,
    Home,
    Utensils,
    CreditCard,
    DollarSign,
    Briefcase,
    MapPin,
    MoreHorizontal
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Transaction } from "@/contexts/TransactionContext"

interface TransactionTimelineProps {
    onEdit: (transaction: any) => void
}

// Add a mapping of category values to icons
const categoryIcons: Record<string, any> = {
    'transport': Car,
    'shopping': ShoppingBag,
    'housing': Home,
    'food': Utensils,
    'bills': CreditCard,
    'salary': DollarSign,
    'freelance': Briefcase,
    // ... add more mappings as needed
}

export function TransactionTimeline({ onEdit }: TransactionTimelineProps) {
    const { filteredTransactions, categories, deleteTransaction } = useTransactions()
    const [expandedTransactions, setExpandedTransactions] = useState<Set<string>>(new Set())

    const toggleTransaction = (id: string) => {
        const newExpanded = new Set(expandedTransactions)
        if (newExpanded.has(id)) {
            newExpanded.delete(id)
        } else {
            newExpanded.add(id)
        }
        setExpandedTransactions(newExpanded)
    }

    // Group transactions by date
    const groupedTransactions = filteredTransactions.reduce((acc: any, transaction) => {
        const date = new Date(transaction.date)
        const dateKey = format(date, "yyyy-MM-dd")

        if (!acc[dateKey]) {
            acc[dateKey] = {
                date,
                transactions: [],
                totalIncome: 0,
                totalExpense: 0
            }
        }

        acc[dateKey].transactions.push(transaction)
        if (transaction.type === 'income') {
            acc[dateKey].totalIncome += transaction.amount
        } else {
            acc[dateKey].totalExpense += transaction.amount
        }

        return acc
    }, {})

    if (!filteredTransactions.length) {
        return (
            <div className="text-center py-10 text-muted-foreground">
                No transactions found.
            </div>
        )
    }

    return (
        <div className="relative">
            {/* Timeline line with gradient */}
            <div className="absolute left-[27px] top-0 h-full w-px bg-gradient-to-b from-gray-200 via-gray-200/70 to-transparent" />

            <div className="space-y-8">
                {Object.entries(groupedTransactions)
                    .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
                    .map(([dateKey, group]) => (
                        <div key={dateKey} className="relative">
                            {/* Date header with improved styling */}
                            <div className="mb-6 flex items-center">
                                <div className="z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border bg-white shadow-sm">
                                    <div className="text-center">
                                        <div className="text-lg font-semibold leading-none">
                                            {format(group.date, "dd")}
                                        </div>
                                        <div className="mt-1 text-xs text-gray-500 uppercase">
                                            {format(group.date, "MMM")}
                                        </div>
                                    </div>
                                </div>
                                <div className="ml-4 flex-1">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <h3 className="text-lg font-medium text-gray-900">
                                                {format(group.date, "EEEE")}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {format(group.date, "MMMM d, yyyy")}
                                            </p>
                                        </div>
                                        <div className="flex gap-6 text-sm">
                                            {group.totalIncome > 0 && (
                                                <div className="flex flex-col items-end">
                                                    <span className="text-xs text-gray-500">Income</span>
                                                    <span className="font-medium text-green-600">
                                                        +{formatCurrency(group.totalIncome)}
                                                    </span>
                                                </div>
                                            )}
                                            {group.totalExpense > 0 && (
                                                <div className="flex flex-col items-end">
                                                    <span className="text-xs text-gray-500">Expense</span>
                                                    <span className="font-medium text-gray-900">
                                                        -{formatCurrency(group.totalExpense)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Transactions list with improved spacing */}
                            <div className="ml-7 space-y-4">
                                {group.transactions
                                    .sort((a: Transaction, b: Transaction) => b.amount - a.amount)
                                    .map((transaction: Transaction) => {
                                        const category = categories.find(cat => cat.value === transaction.category)
                                        const IconComponent = categoryIcons[transaction.category] || DollarSign
                                        const hasBreakdowns = transaction.breakdowns?.length > 0
                                        const isExpanded = expandedTransactions.has(transaction.id)

                                        return (
                                            <div
                                                key={transaction.id}
                                                className={cn(
                                                    "group relative ml-7 rounded-lg border bg-white p-4 transition-all hover:shadow-sm",
                                                    transaction.type === 'income' ? 'hover:border-green-200' : 'hover:border-gray-200'
                                                )}
                                            >
                                                {/* Timeline connector */}
                                                <div className="absolute -left-7 top-1/2 h-px w-7 -translate-y-1/2 bg-gray-200" />

                                                <div className="flex items-start gap-4">
                                                    {/* Category icon */}
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-50 ring-1 ring-gray-200/50">
                                                        <IconComponent className="h-5 w-5 text-gray-600" />
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex flex-1 items-start justify-between gap-2">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2">
                                                                <h4 className="font-medium text-gray-900">
                                                                    {category?.label || transaction.category}
                                                                </h4>
                                                                {hasBreakdowns && (
                                                                    <Badge variant="secondary" className="text-xs">
                                                                        {transaction.breakdowns.length} items
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-gray-500">
                                                                {transaction.description}
                                                            </p>
                                                            {hasBreakdowns && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => toggleTransaction(transaction.id)}
                                                                    className="h-auto -ml-2 p-2 text-sm text-gray-500 hover:text-gray-900"
                                                                >
                                                                    {isExpanded ? 'Hide' : 'Show'} breakdown
                                                                    <ChevronDown className={cn(
                                                                        "ml-1 h-4 w-4 transition-transform",
                                                                        isExpanded && "rotate-180"
                                                                    )} />
                                                                </Button>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center gap-3">
                                                            <span className={cn(
                                                                "text-base font-semibold",
                                                                transaction.type === 'income' ? 'text-green-600' : 'text-gray-900'
                                                            )}>
                                                                {transaction.type === 'income' ? '+' : '-'}
                                                                {formatCurrency(transaction.amount)}
                                                            </span>

                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8 text-gray-400 hover:text-gray-600"
                                                                    >
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end" className="w-[160px]">
                                                                    <DropdownMenuItem onClick={() => {
                                                                        console.log("Edit clicked for transaction:", transaction); // Debugging line
                                                                        onEdit(transaction);
                                                                    }}>
                                                                        <Edit className="mr-2 h-4 w-4" />
                                                                        Edit
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        onClick={() => {
                                                                            console.log("Delete clicked for transaction:", transaction.id); // Debugging line
                                                                            deleteTransaction(transaction.id);
                                                                        }}
                                                                        className="text-red-600 hover:text-red-700"
                                                                    >
                                                                        <Trash className="mr-2 h-4 w-4" />
                                                                        Delete
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Breakdown section */}
                                                {hasBreakdowns && isExpanded && (
                                                    <div className="mt-4 rounded-lg border bg-gray-50/50">
                                                        <div className="divide-y divide-gray-100">
                                                            {transaction.breakdowns.map((breakdown: any, index: number) => (
                                                                <div
                                                                    key={breakdown.id}
                                                                    className="flex items-center gap-3 p-3 first:rounded-t-lg last:rounded-b-lg"
                                                                >
                                                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-medium shadow-sm ring-1 ring-gray-200/50">
                                                                        {index + 1}
                                                                    </div>
                                                                    <div className="flex flex-1 items-center justify-between">
                                                                        <span className="text-sm text-gray-600">
                                                                            {breakdown.description}
                                                                        </span>
                                                                        <span className="font-medium">
                                                                            {formatCurrency(breakdown.amount)}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    )
} 