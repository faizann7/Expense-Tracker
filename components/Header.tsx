'use client'

import { Separator } from "@/components/ui/separator"
import { Breadcrumbs } from "./Breadcrumbs"

export function Header() {
    return (
        <header className="sticky top-0 z-10 flex h-14 items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center gap-4 px-6 w-full">
                <Breadcrumbs />
            </div>
        </header>
    )
} 