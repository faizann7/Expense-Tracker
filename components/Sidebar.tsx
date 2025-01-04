'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Receipt, PieChart, Tags, Settings } from "lucide-react"
import { UserNav } from "@/components/user-nav"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname()

    return (
        <div className={cn(
            "flex flex-col h-screen sticky top-0 bg-[#fafafa] border-r pb-6",
            className
        )}>
            <div className="flex h-14 items-center border-b px-6">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                        <span className="font-semibold text-primary-foreground">E</span>
                    </div>
                    <span className="font-semibold">Expensee</span>
                </div>
            </div>
            <div className="flex-1 overflow-auto">
                <div className="space-y-4 py-4">
                    <div className="px-3 py-2">
                        <div className="space-y-1">
                            <Link href="/dashboard">
                                <Button
                                    variant={pathname === "/dashboard" ? "secondary" : "ghost"}
                                    className="w-full justify-start hover:bg-gray-100"
                                >
                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                    Dashboard
                                </Button>
                            </Link>
                            <Link href="/expenses">
                                <Button
                                    variant={pathname === "/expenses" ? "secondary" : "ghost"}
                                    className="w-full justify-start hover:bg-gray-100"
                                >
                                    <Receipt className="mr-2 h-4 w-4" />
                                    Expenses
                                </Button>
                            </Link>
                            <Link href="/reports">
                                <Button
                                    variant={pathname === "/reports" ? "secondary" : "ghost"}
                                    className="w-full justify-start hover:bg-gray-100"
                                >
                                    <PieChart className="mr-2 h-4 w-4" />
                                    Reports
                                </Button>
                            </Link>
                            <Link href="/categories">
                                <Button
                                    variant={pathname === "/categories" ? "secondary" : "ghost"}
                                    className="w-full justify-start hover:bg-gray-100"
                                >
                                    <Tags className="mr-2 h-4 w-4" />
                                    Categories
                                </Button>
                            </Link>
                            <Link href="/settings">
                                <Button
                                    variant={pathname === "/settings" ? "secondary" : "ghost"}
                                    className="w-full justify-start hover:bg-gray-100"
                                >
                                    <Settings className="mr-2 h-4 w-4" />
                                    Settings
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="border-t border-border mt-auto">
                <UserNav />
            </div>
        </div>
    )
} 