'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/page-header"
import { ProfileSettings } from "@/components/settings/profile-settings"
import { AppSettings } from "@/components/settings/app-settings"

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Settings"
                subtitle="Manage your account and app preferences"
            />
            <Tabs defaultValue="profile" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="app">App Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="profile">
                    <ProfileSettings />
                </TabsContent>
                <TabsContent value="app">
                    <AppSettings />
                </TabsContent>
            </Tabs>
        </div>
    )
} 