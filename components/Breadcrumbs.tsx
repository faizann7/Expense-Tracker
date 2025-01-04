'use client'

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const routeNameMap: { [key: string]: string } = {
    '': 'Dashboard',
    'dashboard': 'Dashboard',
    'expenses': 'Expenses',
    'trends': 'Trends',
    'add': 'Add Expense',
    'edit': 'Edit Expense',
    'categories': 'Categories',
    'settings': 'Settings',
    'profile': 'Profile',
}

export function Breadcrumbs() {
    const pathname = usePathname()
    const segments = pathname.split('/').filter(Boolean)

    if (pathname === '/') {
        return (
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Dashboard</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        )
    }

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                    <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                {segments.map((segment, index) => {
                    const path = `/${segments.slice(0, index + 1).join('/')}`
                    const isLast = index === segments.length - 1
                    const name = routeNameMap[segment] || segment

                    return (
                        <BreadcrumbItem key={path}>
                            {!isLast ? (
                                <>
                                    <BreadcrumbLink href={path}>
                                        {name}
                                    </BreadcrumbLink>
                                    <BreadcrumbSeparator>
                                        <ChevronRight className="h-4 w-4" />
                                    </BreadcrumbSeparator>
                                </>
                            ) : (
                                <BreadcrumbPage>{name}</BreadcrumbPage>
                            )}
                        </BreadcrumbItem>
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
} 