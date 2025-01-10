'use client'

import { useTransactions } from "@/contexts/TransactionContext"
import { formatCurrency } from "@/lib/utils"
import { format, isSameDay } from "date-fns"
import { Edit, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { Separator } from "@/components/ui/separator"

interface TransactionGridProps {
    onEdit: (transaction: any) => void
}

interface GroupedTransactions {
    [key: string]: {
        date: Date
        transactions: any[]
        totalIncome: number
        totalExpense: number
    }
}

export function TransactionGrid({ onEdit }: TransactionGridProps) {
    const { transactions, categories, deleteTransaction } = useTransactions()

    // Group transactions by date
    const groupedTransactions = transactions.reduce((acc: GroupedTransactions, transaction) => {
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

    if (!transactions.length) {
        return (
            <div className="text-center py-10 text-muted-foreground">
                No transactions found.
            </div>
        )
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(groupedTransactions)
                .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
                .map(([dateKey, group]) => (
                    <Card key={dateKey} className="relative">
                        <CardHeader className="pb-4">
                            <div className="flex flex-col space-y-2">
                                <div className="text-lg font-semibold">
                                    {format(group.date, "MMMM d, yyyy")}
                                </div>
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <div>Income: <span className="text-green-600 font-medium">{formatCurrency(group.totalIncome)}</span></div>
                                    <div>Expense: <span className="text-red-600 font-medium">{formatCurrency(group.totalExpense)}</span></div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {group.transactions
                                .sort((a: any, b: any) => b.amount - a.amount)
                                .map((transaction: any, index: number) => {
                                    const category = categories.find(cat => cat.value === transaction.category)
                                    return (
                                        <div key={transaction.id}>
                                            {index > 0 && <Separator className="my-4" />}
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <Badge
                                                            variant={transaction.type === 'income' ? 'default' : 'destructive'}
                                                            className="capitalize"
                                                        >
                                                            {transaction.type}
                                                        </Badge>
                                                        <span className="text-sm font-medium">
                                                            {category?.label || transaction.category}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        {transaction.description}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className={`text-right font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                                        }`}>
                                                        {formatCurrency(transaction.amount)}
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => onEdit(transaction)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8"
                                                                >
                                                                    <Trash className="h-4 w-4" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Are you sure you want to delete this transaction? This action cannot be undone.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() => deleteTransaction(transaction.id)}
                                                                    >
                                                                        Delete
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                        </CardContent>
                    </Card>
                ))}
        </div>
    )
} 