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
import { useExpenses } from "@/contexts/ExpenseContext"
import { ArrowUpDown, CalendarIcon } from 'lucide-react'
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export function Filters() {
  const { filters, setFilters, sort, setSort } = useExpenses()

  const handleFilterChange = (field: string, value: string) => {
    setFilters({ ...filters, [field]: value })
  }

  const toggleSort = (field: string) => {
    setSort({
      field: field as any,
      direction: sort.direction === 'asc' ? 'desc' : 'asc'
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-4 mb-4">
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[200px] justify-start text-left font-normal",
                !filters.dateFrom && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dateFrom ? format(new Date(filters.dateFrom), "PPP") : <span>Pick start date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={filters.dateFrom ? new Date(filters.dateFrom) : undefined}
              onSelect={(date) => handleFilterChange('dateFrom', date ? format(date, 'yyyy-MM-dd') : '')}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <span>to</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[200px] justify-start text-left font-normal",
                !filters.dateTo && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dateTo ? format(new Date(filters.dateTo), "PPP") : <span>Pick end date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={filters.dateTo ? new Date(filters.dateTo) : undefined}
              onSelect={(date) => handleFilterChange('dateTo', date ? format(date, 'yyyy-MM-dd') : '')}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <Select
        value={filters.category}
        onValueChange={(value) => handleFilterChange('category', value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="food">Food & Dining</SelectItem>
          <SelectItem value="transportation">Transportation</SelectItem>
          <SelectItem value="utilities">Utilities</SelectItem>
          <SelectItem value="entertainment">Entertainment</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => toggleSort('date')}
          className={sort.field === 'date' ? 'bg-accent' : ''}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => toggleSort('amount')}
          className={sort.field === 'amount' ? 'bg-accent' : ''}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => toggleSort('category')}
          className={sort.field === 'category' ? 'bg-accent' : ''}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

