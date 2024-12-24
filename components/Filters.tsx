"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function Filters() {
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [category, setCategory] = useState("all")

  const handleFilter = () => {
    console.log("Filtering with:", { dateFrom, dateTo, category })
  }

  return (
    <div className="flex flex-wrap items-center gap-4 mb-4">
      <div className="flex items-center gap-2">
        <Input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="w-auto"
        />
        <span>to</span>
        <Input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="w-auto"
        />
      </div>
      <Select value={category} onValueChange={setCategory}>
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
      <Button onClick={handleFilter}>Apply Filters</Button>
    </div>
  )
}

