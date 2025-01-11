'use client'

import { LayoutGrid, Table2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ViewSwitcherProps {
    view: 'table' | 'grid' | 'timeline'
    onViewChange: (view: 'table' | 'grid' | 'timeline') => void
}

export function ViewSwitcher({ view, onViewChange }: ViewSwitcherProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-10">
                    {view === 'table' ? <Table2 className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
                    <span className="ml-2 capitalize">{view === 'grid' ? 'Grid View' : view === 'timeline' ? 'Timeline View' : 'Table View'}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewChange('table')}>
                    <Table2 className="mr-2 h-4 w-4" />
                    Table View
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => onViewChange('timeline')}>
                    <LayoutGrid className="mr-2 h-4 w-4" />
                    Timeline View
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
} 