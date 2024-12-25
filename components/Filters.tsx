"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useExpenses } from "@/contexts/ExpenseContext"
import { ArrowUpDown, CalendarIcon, X } from 'lucide-react'
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns"
import { cn } from "@/lib/utils"
import { DateRange } from "react-day-picker"
import { useState } from "react"

const datePresets = [
  { label: "Last 3 days", getValue: () => ({ from: subDays(new Date(), 2), to: new Date() }) },
  { label: "Last 7 days", getValue: () => ({ from: subDays(new Date(), 6), to: new Date() }) },
  { label: "Last 30 days", getValue: () => ({ from: subDays(new Date(), 29), to: new Date() }) },
  { label: "This week", getValue: () => ({ from: startOfWeek(new Date()), to: endOfWeek(new Date()) }) },
  { label: "This month", getValue: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) }) },
]

const categoryColors = {
  food: "bg-red-500",
  transportation: "bg-blue-500",
  utilities: "bg-green-500",
  entertainment: "bg-yellow-500",
  other: "bg-purple-500",
}

export function Filters() {
  const { filters, setFilters, sort, setSort, resetFilters } = useExpenses()
  const [date, setDate] = useState<DateRange | undefined>({
    from: filters.dateFrom ? new Date(filters.dateFrom) : undefined,
    to: filters.dateTo ? new Date(filters.dateTo) : undefined,
  })

  const handleFilterChange = (field: string, value: string) => {
    setFilters({ ...filters, [field]: value })
  }

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDate(range)
    setFilters({
      ...filters,
      dateFrom: range?.from ? format(range.from, 'yyyy-MM-dd') : '',
      dateTo: range?.to ? format(range.to, 'yyyy-MM-dd') : '',
    })
  }

  const toggleSort = (field: string) => {
    setSort({
      field: field as any,
      direction: sort.direction === 'asc' ? 'desc' : 'asc'
    })
  }

  const handleReset = () => {
    resetFilters()
    setDate(undefined)
  }

  return (
    <div className="space-y-4 mb-4">
      <div className="flex flex-wrap items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
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
            <div className="border-b border-gray-200 p-3">
              <div className="flex gap-2 flex-wrap">
                {datePresets.map((preset) => (
                  <Button
                    key={preset.label}
                    onClick={() => handleDateRangeChange(preset.getValue())}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleDateRangeChange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        <Select
          value={filters.category}
          onValueChange={(value) => handleFilterChange('category', value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {Object.entries(categoryColors).map(([category, color]) => (
              <SelectItem key={category} value={category}>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${color}`}></div>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" onClick={handleReset}>
                Reset Filters
                <X className="ml-2 h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear all filters and sorting</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex gap-2">
        {['date', 'amount', 'category'].map((field) => (
          <TooltipProvider key={field}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSort(field)}
                  className={sort.field === field ? 'bg-accent' : ''}
                >
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Sort by {field}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  )
}

