'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { motion } from 'framer-motion';
import { GraduationCap, ArrowRight, Mail, Lock, CheckCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/language-switcher';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const t = useTranslations('auth.login');
    const tCommon = useTranslations('common');
    const tAuth = useTranslations('auth');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await signIn(email, password);
            toast({
                title: '✅ Success',
                description: 'Welcome back!',
            });
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: '❌ Error',
                description: tAuth('loginFailed'),
            });
        } finally {
            setLoading(false);
        }
    };

    const fillDemoCredentials = (role: 'student' | 'teacher' | 'parent' | 'admin') => {
        const credentials = {
            student: { email: 'student@school.com', password: 'password123' },
            teacher: { email: 'teacher@kfis.edu.sa', password: 'password123' },
            parent: { email: 'parent1@example.com', password: 'password123' },
            admin: { email: 'admin@test.com', password: 'password123' }
        };
        setEmail(credentials[role].email);
        setPassword(credentials[role].password);
    };

    return (
        <div className="min-h-screen w-full flex bg-white dark:bg-gray-900 overflow-hidden">
            {/* Right Side - Form */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative z-10"
            >
                <div className="w-full max-w-md space-y-8">
                    {/* Language Switcher - Top Right */}
                    <div className="absolute top-8 right-8">
                        <LanguageSwitcher />
                    </div>

                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/20">
                            <GraduationCap className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{tCommon('appName')}</span>
                    </div>

                    {/* Header */}
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                            {t('title')}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            {t('subtitle')}
                        </p>
                    </div>

                    {/* Demo Credentials */}
                    <div className="glass-card p-4 rounded-2xl border border-primary-100 dark:border-primary-900">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            {t('demoCredentials')}
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            {['student', 'teacher', 'parent', 'admin'].map((role) => (
                                <button
                                    key={role}
                                    onClick={() => fillDemoCredentials(role as any)}
                                    className="px-3 py-2 text-xs font-medium rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all capitalize"
                                >
                                    {role}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t('email')}
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 h-12 rounded-xl border-2 focus:border-primary-500"
                                        placeholder={tAuth('emailPlaceholder')}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t('password')}
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 h-12 rounded-xl border-2 focus:border-primary-500"
                                        placeholder={tAuth('passwordPlaceholder')}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">{t('rememberMe')}</span>
                            </label>
                            <Link href="/forgot-password" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                                {t('forgotPassword')}
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 hover:-translate-y-0.5 transition-all"
                        >
                            {loading ? t('signingIn') : t('signIn')}
                            {!loading && <ArrowRight className="mr-2 w-5 h-5" />}
                        </Button>
                    </form>

                    {/* Register Link */}
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                        {t('noAccount')}{' '}
                        <Link href="/register" className="font-semibold text-primary-600 hover:text-primary-700">
                            {t('createAccount')}
                        </Link>
                    </p>
                </div>
            </motion.div>

            {/* Left Side - Branding */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 p-16 flex-col justify-between relative overflow-hidden"
            >
                {/* Animated Background */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-5xl font-bold text-white leading-tight">
                            {t('heroTitle')} <br />
                            <span className="text-secondary-200">{t('heroTitleHighlight')}</span>
                        </h2>
                        <p className="text-xl text-primary-100 max-w-lg leading-relaxed">
                            {t('heroDescription')}
                        </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-4 pt-8">
                        {[
                            'Smart Learning Analytics',
                            'Real-time Collaboration',
                            'Personalized Content'
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                className="flex items-center gap-3 text-white"
                            >
                                <CheckCircle className="w-6 h-6 text-secondary-300" />
                                <span className="text-lg">{feature}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Trust Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="relative z-10 flex items-center gap-4 text-white"
                >
                    <div className="flex -space-x-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-10 h-10 rounded-full bg-white/20 border-2 border-white"></div>
                        ))}
                    </div>
                    <div>
                        <p className="font-semibold">{t('studentsCount')}</p>
                        <p className="text-sm text-primary-200">{t('trustBadge')}</p>
                    </div>
                </motion.div>

                {/* Floating Elements */}
                <motion.div
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/3 right-12 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 flex items-center justify-center"
                >
                    <GraduationCap className="w-8 h-8 text-white" />
                </motion.div>
            </motion.div>

            <Toaster />
        </div>
    );
}
