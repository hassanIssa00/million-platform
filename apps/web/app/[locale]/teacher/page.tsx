'use client'

import { motion } from 'framer-motion'
import { Users, BookOpen, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { StatCard } from '@/components/dashboard/stat-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default function TeacherDashboard() {
    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-primary-600 to-primary-400 rounded-lg p-6 text-white"
            >
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">مرحباً بك، أ. محمد 👋</h2>
                        <p className="text-primary-100">لديك 5 واجبات تحتاج للتصحيح اليوم</p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/teacher/assignments/create">
                            <Button variant="secondary" size="sm">
                                + واجب جديد
                            </Button>
                        </Link>
                        <Link href="/teacher/notifications">
                            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" size="sm">
                                إرسال تنبيه
                            </Button>
                        </Link>
                    </div>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="إجمالي الطلاب"
                    value={120}
                    icon={Users}
                    color="primary"
                />
                <StatCard
                    title="الفصول الدراسية"
                    value={5}
                    icon={BookOpen}
                    color="secondary"
                />
                <StatCard
                    title="واجبات للتصحيح"
                    value={15}
                    icon={AlertCircle}
                    trend={{ value: 3, isPositive: false }}
                    color="warning"
                />
                <StatCard
                    title="متوسط الحضور"
                    value="94%"
                    icon={CheckCircle}
                    trend={{ value: 2, isPositive: true }}
                    color="success"
                />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Submissions */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>أحدث التسليمات</CardTitle>
                        <Link href="/teacher/grading">
                            <Button variant="ghost" size="sm">عرض الكل</Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {recentSubmissions.map((sub, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                                        {sub.student[0]}
                                    </div>
                                    <div>
                                        <p className="font-medium">{sub.student}</p>
                                        <p className="text-xs text-muted-foreground">{sub.assignment}</p>
                                    </div>
                                </div>
                                <div className="text-left">
                                    <span className="text-xs text-gray-500 block">{sub.time}</span>
                                    <Badge variant="outline" className="mt-1">قيد الانتظار</Badge>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Today's Schedule */}
                <Card>
                    <CardHeader>
                        <CardTitle>جدول اليوم</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {schedule.map((item, index) => (
                            <div key={index} className="flex items-center gap-4 p-3 border-r-4 border-primary-500 bg-gray-50 dark:bg-gray-800 rounded-r-lg">
                                <div className="text-center min-w-[60px]">
                                    <p className="font-bold text-gray-900 dark:text-gray-100">{item.time.split(' ')[0]}</p>
                                    <p className="text-xs text-gray-500">{item.time.split(' ')[1]}</p>
                                </div>
                                <div>
                                    <h4 className="font-medium">{item.class}</h4>
                                    <p className="text-sm text-gray-500">{item.subject} • القاعة {item.room}</p>
                                </div>
                                <div className="mr-auto">
                                    <Link href="/teacher/attendance">
                                        <Button size="sm" variant="ghost">تحضير</Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

const recentSubmissions = [
    { student: 'أحمد علي', assignment: 'واجب الرياضيات #3', time: 'منذ 10 دقائق' },
    { student: 'سارة محمد', assignment: 'تقرير الفيزياء', time: 'منذ 30 دقيقة' },
    { student: 'خالد عمر', assignment: 'واجب الرياضيات #3', time: 'منذ ساعة' },
    { student: 'نورة سعيد', assignment: 'مشروع الكيمياء', time: 'منذ ساعتين' },
]

const schedule = [
    { time: '08:00 ص', class: 'الصف 10 - أ', subject: 'الرياضيات', room: '101' },
    { time: '09:30 ص', class: 'الصف 11 - ب', subject: 'الفيزياء', room: 'Lab 2' },
    { time: '11:00 ص', class: 'الصف 10 - ج', subject: 'الرياضيات', room: '102' },
]
