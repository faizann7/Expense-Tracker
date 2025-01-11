"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarIcon, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useTransactions } from "@/contexts/TransactionContext"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import { DateRange } from "react-day-picker"
import { Badge } from "@/components/ui/badge"

export function TransactionFilters() {
    const { categories, setFilters, clearFilters } = useTransactions()
    const [date, setDate] = useState<DateRange | undefined>()
    const [category, setCategory] = useState<string>("all")
    const [type, setType] = useState<string>("all")

    const handleDateSelect = (dateRange: DateRange | undefined) => {
        setDate(dateRange)
        setFilters({
            dateRange,
            category: category === "all" ? undefined : category,
            type: type === "all" ? undefined : type as 'income' | 'expense'
        })
    }

    const handleCategorySelect = (selectedCategory: string) => {
        setCategory(selectedCategory)
        setFilters({
            dateRange: date,
            category: selectedCategory === "all" ? undefined : selectedCategory,
            type: type === "all" ? undefined : type as 'income' | 'expense'
        })
    }

    const handleTypeSelect = (selectedType: string) => {
        setType(selectedType)
        setFilters({
            dateRange: date,
            category: category === "all" ? undefined : category,
            type: selectedType === "all" ? undefined : selectedType as 'income' | 'expense'
        })
    }

    const handleReset = () => {
        setDate(undefined)
        setCategory("all")
        setType("all")
        clearFilters()
    }

    return (
        <div className="flex items-center gap-2">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "w-[300px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date range</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={handleDateSelect}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>

            <Select
                value={type}
                onValueChange={handleTypeSelect}
            >
                <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="income">
                        <div className="flex items-center">
                            Income
                            <Badge variant="green" className="ml-2">Income</Badge>
                        </div>
                    </SelectItem>
                    <SelectItem value="expense">
                        <div className="flex items-center">
                            Expense
                            <Badge variant="red" className="ml-2">Expense</Badge>
                        </div>
                    </SelectItem>
                </SelectContent>
            </Select>

            <Select
                value={category}
                onValueChange={handleCategorySelect}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                            {category.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {(date || category !== "all" || type !== "all") && (
                <Button
                    variant="ghost"
                    onClick={handleReset}
                    className="h-8 px-2 lg:px-3"
                >
                    Reset
                    <X className="ml-2 h-4 w-4" />
                </Button>
            )}
        </div>
    )
}