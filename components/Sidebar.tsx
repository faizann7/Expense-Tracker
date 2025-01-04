'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Receipt, PieChart, Tags } from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname()

    return (
        <div className={cn("pb-12", className)}>
            <div className="flex h-14 items-center border-b px-6">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                        <span className="font-semibold text-primary-foreground">E</span>
                    </div>
                    <span className="font-semibold">Expensee</span>
                </div>
            </div>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <div className="space-y-1">
                        <Link href="/dashboard">
                            <Button
                                variant={pathname === "/dashboard" ? "secondary" : "ghost"}
                                className="w-full justify-start"
                            >
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                Dashboard
                            </Button>
                        </Link>
                        <Link href="/expenses">
                            <Button
                                variant={pathname === "/expenses" ? "secondary" : "ghost"}
                                className="w-full justify-start"
                            >
                                <Receipt className="mr-2 h-4 w-4" />
                                Expenses
                            </Button>
                        </Link>
                        <Link href="/reports">
                            <Button
                                variant={pathname === "/reports" ? "secondary" : "ghost"}
                                className="w-full justify-start"
                            >
                                <PieChart className="mr-2 h-4 w-4" />
                                Reports
                            </Button>
                        </Link>
                        <Link href="/categories">
                            <Button
                                variant={pathname === "/categories" ? "secondary" : "ghost"}
                                className="w-full justify-start"
                            >
                                <Tags className="mr-2 h-4 w-4" />
                                Categories
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
} 