"use client"

import { createContext, useContext, useState, useEffect } from "react"

interface UserProfile {
    username: string
    email: string
    name: string
    avatar?: string
}

interface AppSettings {
    currency: string
    notifications: boolean
    weekStart: string
}

interface SettingsContextType {
    userProfile: UserProfile
    updateProfile: (profile: Partial<UserProfile>) => void
    appSettings: AppSettings
    updateAppSettings: (settings: Partial<AppSettings>) => void
}

const SettingsContext = createContext<SettingsContextType>({} as SettingsContextType)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false)
    const [userProfile, setUserProfile] = useState<UserProfile>({
        username: "shadcn",
        email: "m@example.com",
        name: "Shadcn",
        avatar: "/avatars/01.png"
    })

    const [appSettings, setAppSettings] = useState<AppSettings>({
        currency: "USD",
        notifications: true,
        weekStart: "monday"
    })

    useEffect(() => {
        const savedProfile = localStorage.getItem('user-profile')
        if (savedProfile) {
            setUserProfile(JSON.parse(savedProfile))
        }

        const savedSettings = localStorage.getItem('app-settings')
        if (savedSettings) {
            setAppSettings(JSON.parse(savedSettings))
        }
        setMounted(true)
    }, [])

    useEffect(() => {
        localStorage.setItem('user-profile', JSON.stringify(userProfile))
    }, [userProfile])

    useEffect(() => {
        localStorage.setItem('app-settings', JSON.stringify(appSettings))
    }, [appSettings])

    const updateProfile = (profile: Partial<UserProfile>) => {
        setUserProfile(prev => ({ ...prev, ...profile }))
    }

    const updateAppSettings = (settings: Partial<AppSettings>) => {
        setAppSettings(prev => ({ ...prev, ...settings }))
    }

    if (!mounted) {
        return null // or a loading state
    }

    return (
        <SettingsContext.Provider value={{
            userProfile,
            updateProfile,
            appSettings,
            updateAppSettings
        }}>
            {children}
        </SettingsContext.Provider>
    )
}

export function useSettings() {
    const context = useContext(SettingsContext)
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider')
    }
    return context
} 