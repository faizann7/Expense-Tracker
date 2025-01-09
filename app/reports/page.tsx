'use client'

import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CategorySpendingChart } from "@/components/reports/category-spending"
import { MonthlyTrendChart } from "@/components/reports/monthly-trend"
import { DailySpendingChart } from "@/components/reports/daily-spending"
import { SpendingHeatmap } from "@/components/reports/spending-heatmap"
import { SpendingPatternAnalysis } from "@/components/reports/spending-patterns"
import { ExpenseForecast } from "@/components/reports/expense-forecast"

export default function ReportsPage() {
    return (
        <div className="space-y-6 w-full">
            <PageHeader
                title="Reports"
                subtitle="View your expense reports and analytics"
            />
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="trends">Trends</TabsTrigger>
                    <TabsTrigger value="analysis">Analysis</TabsTrigger>
                    <TabsTrigger value="forecast">Forecast</TabsTrigger>
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
                <TabsContent value="analysis" className="space-y-6">
                    <SpendingPatternAnalysis />
                    <Card>
                        <CardHeader>
                            <CardTitle>Category Analysis</CardTitle>
                            <CardDescription>
                                Detailed breakdown of spending by category
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CategorySpendingChart showDetails />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="forecast" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Expense Forecast</CardTitle>
                            <CardDescription>
                                Predicted spending based on historical patterns
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ExpenseForecast />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
} 