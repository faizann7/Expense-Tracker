'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendChart } from "@/components/TrendChart"

export default function Trends() {
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Trends</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Expense Trends</CardTitle>
                </CardHeader>
                <CardContent>
                    <TrendChart />
                </CardContent>
            </Card>
        </div>
    )
} 