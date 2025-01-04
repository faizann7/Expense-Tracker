'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, LineChart, Receipt, Wallet, Tags } from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname()

    return (
        <div className={cn("pb-12", className)}>
            {/* Enterprise Header */}
            <div className="flex h-14 items-center border-b px-6">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                        <Wallet className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold">Expensee</span>
                        <span className="text-xs text-muted-foreground">Enterprise</span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <div className="space-y-1">
                        <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground">
                            Main
                        </h2>
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
                        <Link href="/categories">
                            <Button
                                variant={pathname === "/categories" ? "secondary" : "ghost"}
                                className="w-full justify-start"
                            >
                                <Tags className="mr-2 h-4 w-4" />
                                Categories
                            </Button>
                        </Link>
                        <Link href="/trends">
                            <Button
                                variant={pathname === "/trends" ? "secondary" : "ghost"}
                                className="w-full justify-start"
                            >
                                <LineChart className="mr-2 h-4 w-4" />
                                Trends
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
} 