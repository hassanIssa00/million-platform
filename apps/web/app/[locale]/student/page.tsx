'use client';

import { motion } from 'framer-motion'
import { BookOpen, Award, Calendar, TrendingUp, Sparkles, BrainCircuit, Target, Zap } from 'lucide-react'
import { StatCard } from '@/components/dashboard/stat-card'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/routing'
import { useAuth } from '@/contexts/auth-context'
import { QuickActions, RecentActivity } from '@/components/dashboard/quick-actions'
import { ScheduleWidget } from '@/components/dashboard/schedule-widget'
import {
    PerformanceChart,
    SubjectPerformanceChart,
    AttendanceChart,
    WeeklyActivityChart
} from '@/components/dashboard/charts'
import { cn } from '@/lib/utils'

// Mock data for charts (translated)
const performanceData = [
    { name: 'الأسبوع 1', score: 75, average: 70 },
    { name: 'الأسبوع 2', score: 82, average: 75 },
    { name: 'الأسبوع 3', score: 78, average: 76 },
    { name: 'الأسبوع 4', score: 85, average: 78 },
    { name: 'الأسبوع 5', score: 88, average: 80 },
    { name: 'الأسبوع 6', score: 92, average: 82 },
];

const subjectData = [
    { subject: 'الرياضيات', score: 92, color: '#3b82f6' },
    { subject: 'الفيزياء', score: 88, color: '#a855f7' },
    { subject: 'الكيمياء', score: 85, color: '#10b981' },
    { subject: 'اللغة العربية', score: 95, color: '#f59e0b' },
    { subject: 'اللغة الإنجليزية', score: 87, color: '#ef4444' },
];

const attendanceData = [
    { name: 'حاضر', value: 92 },
    { name: 'غائب', value: 5 },
    { name: 'متأخر', value: 3 },
];

const weeklyActivityData = [
    { day: 'إثن', hours: 4 },
    { day: 'ثلا', hours: 6 },
    { day: 'أرب', hours: 5 },
    { day: 'خمي', hours: 7 },
    { day: 'جمع', hours: 4 },
    { day: 'سبت', hours: 3 },
    { day: 'أحد', hours: 2 },
];

export default function StudentDashboard() {
    const { user, profile } = useAuth()
    const firstName = profile?.full_name?.split(' ')[0] || 'طالبي العزيز'

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-primary-600 via-indigo-600 to-primary-700 rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl"
            >
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h2 className="text-4xl font-bold mb-3">أهلاً بك مجدداً، {firstName}! 👋</h2>
                        <p className="text-primary-100 text-xl max-w-xl">لديك 3 واجبات بانتظارك هذا الأسبوع. أنت تبلي بلاءً حسناً، استمر في التقدم! 🚀</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl border border-white/30 text-center min-w-[200px]">
                        <div className="text-sm text-primary-50 font-semibold mb-1">المركز في الفصل</div>
                        <div className="text-4xl font-black">#3</div>
                        <div className="text-xs text-primary-100 mt-2">من أصل 32 طالب</div>
                    </div>
                </div>
            </motion.div>

            {/* AI Academic Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 overflow-hidden border-none shadow-xl bg-gradient-to-br from-white to-indigo-50/30 dark:from-gray-900 dark:to-gray-800">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-indigo-50/50 pb-6">
                        <div>
                            <CardTitle className="text-2xl font-bold flex items-center gap-3 text-indigo-900 dark:text-indigo-100">
                                <BrainCircuit className="w-8 h-8 text-primary-600" />
                                تحليلات الذكاء الاصطناعي الأكاديمية
                            </CardTitle>
                            <CardDescription className="text-lg mt-1">توقعات وتوصيات ذكية لتحسين أدائك</CardDescription>
                        </div>
                        <Badge className="bg-primary-100 text-primary-700 hover:bg-primary-200 border-none px-4 py-2 text-sm font-bold">
                            NEXUS AI ✨
                        </Badge>
                    </CardHeader>
                    <CardContent className="pt-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-indigo-50">
                                    <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                                        <Target className="w-5 h-5 text-red-500" />
                                        الدرجة المتوقعة لنهاية الفصل
                                    </h4>
                                    <div className="flex items-center gap-6">
                                        <div className="text-6xl font-black text-primary-600">94%</div>
                                        <div className="space-y-1">
                                            <div className="text-sm text-green-600 font-bold flex items-center gap-1">
                                                <TrendingUp className="w-4 h-4" />
                                                +4% تحسن متوقع
                                            </div>
                                            <div className="text-xs text-gray-500 font-medium">بناءً على نشاطك الأخير</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-indigo-50">
                                    <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                                        <Zap className="w-5 h-5 text-yellow-500" />
                                        نقاط القوة الحالية
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="secondary" className="bg-green-50 text-green-700 px-3 py-1 border-none rounded-lg">الرياضيات (جبر)</Badge>
                                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 px-3 py-1 border-none rounded-lg">اللغة العربية</Badge>
                                        <Badge variant="secondary" className="bg-purple-50 text-purple-700 px-3 py-1 border-none rounded-lg">سرعة البديهة</Badge>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-primary-600 p-8 rounded-3xl text-white shadow-lg relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                    <Sparkles className="w-32 h-32" />
                                </div>
                                <h4 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                    توصية NEXUS اليوم 💡
                                </h4>
                                <p className="text-primary-50 text-lg leading-relaxed mb-8">
                                    لقد لاحظت أنك تبلي بلاءً حسناً في الرياضيات، لكن درجتك في الفيزياء قد تتأثر إذا لم تراجع درس "الحركة القوية" قبل اختبار الغد.
                                </p>
                                <Button className="w-full bg-white text-primary-700 hover:bg-primary-50 font-black h-14 text-lg rounded-2xl shadow-xl">
                                    ابدأ مراجعة الفيزياء الآن
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <ScheduleWidget />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="المواد المسجلة"
                    value={6}
                    icon={BookOpen}
                    color="primary"
                    href="/student/courses"
                />
                <StatCard
                    title="متوسط الدرجات"
                    value="87%"
                    icon={Award}
                    trend={{ value: 5, isPositive: true }}
                    color="success"
                    href="/student/grades"
                />
                <StatCard
                    title="نسبة الحضور"
                    value="92%"
                    icon={Calendar}
                    trend={{ value: 2, isPositive: true }}
                    color="secondary"
                    href="/student/attendance"
                />
                <StatCard
                    title="التقدم الإجمالي"
                    value="76%"
                    icon={TrendingUp}
                    trend={{ value: 8, isPositive: true }}
                    color="accent"
                />
            </div>

            <QuickActions />

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-none shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-xl">الأداء الأكاديمي</CardTitle>
                        <CardDescription>مقارنة درجاتك مع متوسط الفصل خلال الـ 6 أسابيع الماضية</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <PerformanceChart data={performanceData} />
                    </CardContent>
                </Card>

                <Card className="border-none shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-xl">الأداء حسب المادة</CardTitle>
                        <CardDescription>أحدث الدرجات في جميع المواد</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SubjectPerformanceChart data={subjectData} />
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="border-none shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-xl">نظرة عامة على الحضور</CardTitle>
                        <CardDescription>توزيع الحضور والغياب لهذا الفصل</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AttendanceChart data={attendanceData} />
                    </CardContent>
                </Card>

                <Card className="border-none shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-xl">النشاط الأسبوعي</CardTitle>
                        <CardDescription>ساعات المذاكرة هذا الأسبوع</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <WeeklyActivityChart data={weeklyActivityData} />
                    </CardContent>
                </Card>

                <RecentActivity />
            </div>

            {/* Subjects Grid */}
            <div className="py-6">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white">موادي الدراسية</h2>
                    <Link href="/student/subjects">
                        <Button variant="outline" className="rounded-xl px-8 h-12 font-bold hover:bg-primary-50 hover:text-primary-700 transition-all">عرض الكل</Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {subjects.map((subject, index) => (
                        <motion.div
                            key={subject.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={`/student/subjects/${subject.id}`}>
                                <Card className="hover:shadow-2xl transition-all duration-500 cursor-pointer group border-none bg-white/50 backdrop-blur-sm shadow-lg hover:-translate-y-2 overflow-hidden rounded-3xl">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="text-2xl font-black group-hover:text-primary-600 transition-colors">
                                                    {subject.name}
                                                </CardTitle>
                                                <p className="text-sm text-gray-500 mt-2 font-medium">
                                                    المعلم: {subject.teacher}
                                                </p>
                                            </div>
                                            <Badge className={cn(
                                                "rounded-xl px-4 py-2 border-none font-bold shadow-sm",
                                                subject.status === 'active' ? "bg-primary-50 text-primary-700" : "bg-gray-100 text-gray-600"
                                            )}>
                                                {subject.status === 'active' ? 'نشط' : 'مكتمل'}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-6">
                                            {/* Progress Bar */}
                                            <div>
                                                <div className="flex justify-between text-sm mb-3">
                                                    <span className="text-gray-600 font-bold">التقدم المحرز</span>
                                                    <span className="font-black text-primary-700">
                                                        {subject.progress}%
                                                    </span>
                                                </div>
                                                <div className="h-3 bg-gray-100/80 rounded-full overflow-hidden shadow-inner">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${subject.progress}%` }}
                                                        transition={{ duration: 1.5, delay: index * 0.1, ease: "easeOut" }}
                                                        className={`h-full ${subject.progressColor} rounded-full shadow-lg`}
                                                    />
                                                </div>
                                            </div>

                                            {/* Stats */}
                                            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-50">
                                                <div className="p-3 bg-gray-50 rounded-2xl">
                                                    <p className="text-xs text-gray-500 font-bold mb-1">الدروس</p>
                                                    <p className="font-black text-gray-900 text-lg">
                                                        {subject.lessonsCompleted}/{subject.totalLessons}
                                                    </p>
                                                </div>
                                                <div className="p-3 bg-primary-50 rounded-2xl">
                                                    <p className="text-xs text-primary-600 font-bold mb-1">الدرجة</p>
                                                    <p className="font-black text-primary-700 text-lg">
                                                        {subject.grade}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}

const subjects = [
    {
        id: 1,
        name: 'الرياضيات',
        teacher: 'أ. أحمد علي',
        progress: 75,
        progressColor: 'bg-blue-500',
        lessonsCompleted: 15,
        totalLessons: 20,
        grade: 'A-',
        status: 'active'
    },
    {
        id: 2,
        name: 'الفيزياء',
        teacher: 'د. سارة محمد',
        progress: 60,
        progressColor: 'bg-purple-500',
        lessonsCompleted: 12,
        totalLessons: 20,
        grade: 'B+',
        status: 'active'
    },
    {
        id: 3,
        name: 'الكيمياء',
        teacher: 'أ. حسن خالد',
        progress: 80,
        progressColor: 'bg-green-500',
        lessonsCompleted: 16,
        totalLessons: 20,
        grade: 'A',
        status: 'active'
    },
    {
        id: 4,
        name: 'اللغة العربية',
        teacher: 'أ. فاطمة إبراهيم',
        progress: 90,
        progressColor: 'bg-orange-500',
        lessonsCompleted: 18,
        totalLessons: 20,
        grade: 'A',
        status: 'active'
    },
    {
        id: 5,
        name: 'التاريخ',
        teacher: 'د. عمر يوسف',
        progress: 70,
        progressColor: 'bg-red-500',
        lessonsCompleted: 14,
        totalLessons: 20,
        grade: 'B+',
        status: 'active'
    },
    {
        id: 6,
        name: 'علوم الحاسب',
        teacher: 'م. نور حسن',
        progress: 85,
        progressColor: 'bg-indigo-500',
        lessonsCompleted: 17,
        totalLessons: 20,
        grade: 'A',
        status: 'active'
    },
]
