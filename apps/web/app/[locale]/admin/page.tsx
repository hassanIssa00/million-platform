'use client'

import { motion } from 'framer-motion'
import { Users, BookOpen, School, TrendingUp, DollarSign, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatCard } from '@/components/dashboard/stat-card'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from 'recharts'

import { useEffect, useState } from 'react'
import { analyticsApi, ChartData } from '@/lib/api/analytics'

const MOCK_ENROLLMENT_DATA = [
    { name: 'Jan', students: 450 },
    { name: 'Feb', students: 520 },
    { name: 'Mar', students: 610 },
    { name: 'Apr', students: 690 },
    { name: 'May', students: 800 },
    { name: 'Jun', students: 950 },
    { name: 'Jul', students: 1100 },
    { name: 'Aug', students: 1350 },
    { name: 'Sep', students: 1600 },
    { name: 'Oct', students: 1850 },
    { name: 'Nov', students: 2100 },
    { name: 'Dec', students: 2450 },
];

const MOCK_REVENUE_DATA = [
    { name: 'Jan', total: 15000 },
    { name: 'Feb', total: 18000 },
    { name: 'Mar', total: 22000 },
    { name: 'Apr', total: 21000 },
    { name: 'May', total: 25000 },
    { name: 'Jun', total: 32000 },
    { name: 'Jul', total: 28000 },
    { name: 'Aug', total: 35000 },
    { name: 'Sep', total: 42000 },
    { name: 'Oct', total: 38000 },
    { name: 'Nov', total: 45000 },
    { name: 'Dec', total: 55000 },
];

export default function AdminDashboard() {
    const [enrollmentData, setEnrollmentData] = useState<ChartData[]>(MOCK_ENROLLMENT_DATA)
    const [revenueData, setRevenueData] = useState<ChartData[]>(MOCK_REVENUE_DATA)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [enrollment, revenue] = await Promise.all([
                    analyticsApi.getEnrollmentStats(),
                    analyticsApi.getFinancialStats()
                ])

                // Only override mock data if real data exists from API
                if (enrollment.data && enrollment.data.length > 0) {
                    setEnrollmentData(enrollment.data)
                }

                if (revenue.data && revenue.data.length > 0) {
                    setRevenueData(revenue.data)
                }
            } catch (error) {
                console.warn("Using mock data as backup since API is unreachable", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
    )

    const totalRevenue = revenueData.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0)
    const totalStudents = enrollmentData.reduce((acc, curr) => acc + (Number(curr.students) || 0), 0)

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="إجمالي المستخدمين"
                    value={totalStudents}
                    icon={Users}
                    trend={{ value: 12, isPositive: true }}
                    color="primary"
                />
                <StatCard
                    title="الفصول الدراسية"
                    value={24}
                    icon={School}
                    color="secondary"
                />
                <StatCard
                    title="الإيرادات الشهرية"
                    value={totalRevenue.toLocaleString() + ' ر.س'}
                    icon={DollarSign}
                    trend={{ value: 8, isPositive: true }}
                    color="success"
                />
                <StatCard
                    title="نشاط النظام"
                    value="98%"
                    icon={Activity}
                    color="warning"
                />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Student Growth Chart */}
                <Card className="overflow-hidden border-none shadow-xl bg-white/50 backdrop-blur-sm">
                    <CardHeader className="border-b border-gray-100 bg-gray-50/50">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl font-bold text-gray-800">نمو الطلاب</CardTitle>
                            <div className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold">
                                +{totalStudents > 0 ? "24%" : "0%"} سنوياً
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="h-[350px] pt-6 pr-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={enrollmentData}>
                                <defs>
                                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ stroke: '#2563eb', strokeWidth: 2 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="students"
                                    name="الطلاب"
                                    stroke="#2563eb"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorStudents)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Financial Revenue Chart */}
                <Card className="overflow-hidden border-none shadow-xl bg-white/50 backdrop-blur-sm">
                    <CardHeader className="border-b border-gray-100 bg-gray-50/50">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl font-bold text-gray-800">الإيرادات المالية</CardTitle>
                            <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                {totalRevenue.toLocaleString()} ر.س
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="h-[350px] pt-6 pr-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.4} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar
                                    dataKey="total"
                                    name="الإيرادات"
                                    fill="url(#colorTotal)"
                                    radius={[6, 6, 0, 0]}
                                    barSize={40}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
