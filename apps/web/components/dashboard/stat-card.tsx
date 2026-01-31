import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import { Link } from '@/i18n/routing'

interface StatCardProps {
    title: string
    value: string | number
    icon: LucideIcon
    trend?: {
        value: number
        isPositive: boolean
    }
    color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning'
    href?: string
}

export function StatCard({ title, value, icon: Icon, trend, color = 'primary', href }: StatCardProps) {
    const colorClasses = {
        primary: 'bg-primary-100 text-primary-500 dark:bg-primary-900',
        secondary: 'bg-secondary-100 text-secondary-500 dark:bg-secondary-900',
        accent: 'bg-accent-100 text-accent-500 dark:bg-accent-900',
        success: 'bg-green-100 text-green-500 dark:bg-green-900',
        warning: 'bg-yellow-100 text-yellow-500 dark:bg-yellow-900',
    }

    const cardContent = (
        <Card className={href ? 'hover:shadow-lg transition-all duration-300 cursor-pointer' : ''}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {title}
                </CardTitle>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">{value}</div>
                {trend && (
                    <p className={`text-xs ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {trend.isPositive ? '+' : ''}{trend.value}% من الشهر الماضي
                    </p>
                )}
            </CardContent>
        </Card>
    )

    if (href) {
        return <Link href={href}>{cardContent}</Link>
    }

    return cardContent
}
