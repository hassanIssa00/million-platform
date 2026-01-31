'use client'

import { Bell, Search, Menu, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useTheme } from 'next-themes'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EnhancedNotifications } from '@/components/dashboard/notifications-popover'
import { GlobalSearch } from '@/components/search/global-search'

interface DashboardHeaderProps {
    title: string
    onMenuClick?: () => void
}

export function DashboardHeader({ title, onMenuClick }: DashboardHeaderProps) {
    const { setTheme } = useTheme()

    return (
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-6 h-20 flex items-center justify-between transition-all duration-200">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onMenuClick}
                    className="lg:hidden text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    <Menu className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white hidden lg:block">
                    {title}
                </h1>
            </div>

            <div className="flex items-center gap-3">
                {/* Global Search */}
                <GlobalSearch />

                {/* Enhanced Notifications */}
                <EnhancedNotifications />

                {/* Theme Toggle */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                            Light
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                            Dark
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")}>
                            System
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
