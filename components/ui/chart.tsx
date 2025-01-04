"use client"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export type ChartConfig = {
  [key: string]: {
    label: string
    color: string
  }
}

interface ChartContainerProps {
  config: ChartConfig
  children: React.ReactNode
}

export function ChartContainer({ config, children }: ChartContainerProps) {
  return (
    <div className="h-[350px] w-full">
      {children}
    </div>
  )
}

export const ChartTooltip = Tooltip

export function ChartTooltipContent({ hideLabel = false, ...props }) {
  return <TooltipContent {...props} />
}
