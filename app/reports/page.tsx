'use client'

import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CategorySpendingChart } from "@/components/reports/category-spending"
import { MonthlyTrendChart } from "@/components/reports/monthly-trend"
import { DailySpendingChart } from "@/components/reports/daily-spending"
import { SpendingHeatmap } from "@/components/reports/spending-heatmap"

export default function ReportsPage() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Reports"
                subtitle="Analyze your spending patterns"
            />
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="trends">Trends</TabsTrigger>
                    <TabsTrigger value="categories">Categories</TabsTrigger>
                    <TabsTrigger value="daily">Daily</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle className="text-base font-medium">
                                    Monthly Spending Trend
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <MonthlyTrendChart />
                            </CardContent>
                        </Card>
                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle className="text-base font-medium">
                                    Category Distribution
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CategorySpendingChart />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                <TabsContent value="trends" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Spending Trends</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <MonthlyTrendChart showDetails />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="categories" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Category Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CategorySpendingChart showDetails />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="daily" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Daily Spending Patterns</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DailySpendingChart />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Spending Heatmap</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <SpendingHeatmap />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
} 