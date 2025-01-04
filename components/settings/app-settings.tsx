"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { useSettings } from "@/contexts/SettingsContext"

const appSettingsSchema = z.object({
    currency: z.string({
        required_error: "Please select a currency.",
    }),
    notifications: z.boolean().default(true),
    weekStart: z.string({
        required_error: "Please select a week start day.",
    }),
})

type AppSettingsValues = z.infer<typeof appSettingsSchema>

export function AppSettings() {
    const [isLoading, setIsLoading] = useState(false)
    const { appSettings, updateAppSettings } = useSettings()

    const form = useForm<AppSettingsValues>({
        resolver: zodResolver(appSettingsSchema),
        defaultValues: {
            currency: appSettings.currency,
            notifications: appSettings.notifications,
            weekStart: appSettings.weekStart,
        },
    })

    function onSubmit(data: AppSettingsValues) {
        setIsLoading(true)
        updateAppSettings(data)
        setTimeout(() => {
            setIsLoading(false)
        }, 500)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>App Settings</CardTitle>
                <CardDescription>
                    Configure your expense tracking preferences.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="currency"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Currency</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a currency" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="USD">USD ($)</SelectItem>
                                            <SelectItem value="EUR">EUR (€)</SelectItem>
                                            <SelectItem value="GBP">GBP (£)</SelectItem>
                                            <SelectItem value="JPY">JPY (¥)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        This will be used for all expense amounts.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="notifications"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Notifications
                                        </FormLabel>
                                        <FormDescription>
                                            Receive notifications about your expenses.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="weekStart"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Week Starts On</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select start of week" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="monday">Monday</SelectItem>
                                            <SelectItem value="sunday">Sunday</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Choose when your week starts for reports.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save changes"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
} 