'use client'

import { useState } from 'react'
import { Link, usePathname } from '@/i18n/routing'
import { cn } from '@/lib/utils'
import {
    LayoutDashboard,
    BookOpen,
    Users,
    Calendar,
    Award,
    Settings,
    ChevronLeft,
    GraduationCap,
    FileText,
    BarChart3,
    UserCircle,
    LogOut,
    Menu,
    Gamepad2,
    Video,
    Trophy,
    QrCode,
    Shield
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/auth-context'
import { UserProfileModal } from '@/components/dashboard/user-profile-modal'

interface SidebarProps {
    role: 'student' | 'teacher' | 'parent' | 'admin'
}

export function Sidebar({ role }: SidebarProps) {
    const [collapsed, setCollapsed] = useState(false)
    const pathname = usePathname()
    const { user, signOut } = useAuth()

    const navigation = getNavigationByRole(role)

    return (
        <motion.div
            initial={false}
            animate={{ width: collapsed ? 80 : 280 }}
            className={cn(
                'relative h-screen sticky top-0 flex flex-col',
                'bg-white dark:bg-gray-900 border-l border-gray-100 dark:border-gray-800',
                'shadow-xl shadow-gray-200/50 dark:shadow-none z-50'
            )}
        >
            {/* Header */}
            <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100 dark:border-gray-800">
                <AnimatePresence mode="wait">
                    {!collapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex items-center gap-3"
                        >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30">
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="font-bold text-lg text-gray-900 dark:text-white leading-tight">منصة مليون</h1>
                                <p className="text-[10px] text-gray-500 font-medium tracking-wide">EDTECH PLATFORM</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCollapsed(!collapsed)}
                    className={cn(
                        "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500",
                        collapsed && "mx-auto"
                    )}
                >
                    {collapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
                {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 cursor-pointer mb-1 relative',
                                isActive
                                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200',
                                collapsed && 'justify-center px-0'
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "w-5 h-5 transition-colors",
                                    isActive ? "text-primary-600 dark:text-primary-400" : "text-gray-400 group-hover:text-gray-600"
                                )}
                            />
                            {!collapsed && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-sm"
                                >
                                    {item.label}
                                </motion.span>
                            )}
                            {isActive && !collapsed && (
                                <motion.div
                                    layoutId="activeIndicator"
                                    className="absolute left-0 w-1 h-8 bg-primary-500 rounded-r-full"
                                />
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-secondary-400 to-secondary-600 flex items-center justify-center text-white font-bold shadow-md">
                            {user?.email?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                    </div>

                    {!collapsed && (
                        <UserProfileModal>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex-1 min-w-0 cursor-pointer hover:opacity-80 transition-opacity"
                            >
                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                    {user?.user_metadata?.full_name || 'المستخدم'}
                                </p>
                                <p className="text-xs text-gray-500 truncate capitalize">{role}</p>
                            </motion.div>
                        </UserProfileModal>
                    )}

                    {!collapsed && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={() => signOut()}
                        >
                            <LogOut className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

function getNavigationByRole(role: string) {
    const common = [
        { href: `/${role}`, label: 'لوحة التحكم', icon: LayoutDashboard },
    ]

    const settings = [
        { href: `/${role}/settings`, label: 'الإعدادات', icon: Settings },
    ]

    switch (role) {
        case 'student':
            return [
                ...common,
                { href: '/student/assignments' as any, label: 'الواجبات', icon: FileText },
                { href: '/student/grades' as any, label: 'الدرجات', icon: Award },
                { href: '/student/million' as any, label: 'مسابقة نكسس', icon: Trophy },
                { href: '/student/games' as any, label: 'الألعاب التعليمية', icon: Gamepad2 },
                { href: '/student/content' as any, label: 'المكتبة التعليمية', icon: Video },
                { href: '/student/attendance' as any, label: 'سجل الحضور', icon: QrCode },
                ...settings
            ]

        case 'teacher':
            return [
                ...common,
                { href: '/teacher/classes' as any, label: 'فصولي', icon: Users },
                { href: '/teacher/assignments/create' as any, label: 'إنشاء واجب', icon: FileText },
                { href: '/teacher/grading' as any, label: 'التصحيح', icon: Award },
                { href: '/teacher/attendance' as any, label: 'التحضير', icon: Calendar },
                { href: '/teacher/notifications' as any, label: 'التنبيهات', icon: BookOpen },
                ...settings
            ]

        case 'parent':
            return [
                ...common,
                { href: '/parent/notifications' as any, label: 'الإشعارات', icon: BookOpen },
                { href: '/parent/payments' as any, label: 'المدفوعات', icon: BarChart3 },
                ...settings
            ]

        case 'admin':
            return [
                ...common,
                { href: '/admin/users' as any, label: 'المستخدمين', icon: Users },
                { href: '/admin/classes' as any, label: 'الفصول الدراسية', icon: BookOpen },
                { href: '/admin/content' as any, label: 'إدارة المحتوى', icon: Video },
                { href: '/admin/games' as any, label: 'إدارة الألعاب', icon: Gamepad2 },
                { href: '/admin/permissions' as any, label: 'الصلاحيات', icon: Shield },
                ...settings
            ]

        default:
            return common
    }
}
