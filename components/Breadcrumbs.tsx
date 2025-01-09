'use client'

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const routeNameMap: { [key: string]: string } = {
    'dashboard': 'Dashboard',
    'expenses': 'Expenses',
    'categories': 'Categories',
    'reports': 'Reports',
    'settings': 'Settings',
    'add': 'Add',
    'edit': 'Edit',
    'analytics': 'Analytics',
    'monthly': 'Monthly',
    'annual': 'Annual',
    'general': 'General',
    'notifications': 'Notifications',
    'security': 'Security'
}

export function Breadcrumbs() {
    const pathname = usePathname()
    const segments = pathname.split('/').filter(Boolean)

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {segments.map((segment, index) => {
                    const path = `/${segments.slice(0, index + 1).join('/')}`
                    const isLast = index === segments.length - 1
                    const name = routeNameMap[segment] || segment

                    return (
                        <BreadcrumbItem key={path}>
                            {!isLast ? (
                                <>
                                    <BreadcrumbLink asChild>
                                        <Link href={path}>{name}</Link>
                                    </BreadcrumbLink>
                                    <BreadcrumbSeparator />
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