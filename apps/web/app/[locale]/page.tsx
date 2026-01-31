'use client'

import {

    motion
} from 'framer-motion'
import Link from 'next/link'
import { GraduationCap, BookOpen, Users, Award, ArrowLeft, CheckCircle, Star, PlayCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from '@/components/language-switcher'

export default function LandingPage() {
    const t = useTranslations('landing')
    const tCommon = useTranslations('common')
    const tAuth = useTranslations('auth')

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 overflow-x-hidden">
            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
                <div className="container mx-auto px-4 h-24 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="NEXUS ED" className="h-20" />
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <nav className="flex gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
                            <Link href="#features" className="hover:text-primary-500 transition-colors">{t('nav.features')}</Link>
                            <Link href="#testimonials" className="hover:text-primary-500 transition-colors">{t('nav.testimonials')}</Link>
                            <Link href="#pricing" className="hover:text-primary-500 transition-colors">{t('nav.pricing')}</Link>
                        </nav>
                        <div className="flex items-center gap-3">
                            <LanguageSwitcher />
                            <Link href="/login">
                                <Button variant="ghost" className="font-medium">{tAuth('signIn')}</Button>
                            </Link>
                            <Link href="/register">
                                <Button className="shadow-lg shadow-primary-500/20">{tAuth('signUp')}</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-100/40 via-transparent to-transparent dark:from-primary-900/20"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-medium mb-6 border border-primary-100 dark:border-primary-800">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                                </span>
                                {t('hero.badge')}
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
                                {t('hero.title')} <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500">
                                    {t('hero.titleHighlight')}
                                </span>
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-lg">
                                {t('hero.description')}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/register">
                                    <Button size="lg" className="text-lg h-14 px-8 rounded-2xl shadow-xl shadow-primary-500/20 hover:shadow-primary-500/30 hover:-translate-y-1 transition-all">
                                        {t('hero.ctaPrimary')}
                                        <ArrowLeft className="mr-2 h-5 w-5 rotate-180" />
                                    </Button>
                                </Link>
                                <Button size="lg" variant="outline" className="text-lg h-14 px-8 rounded-2xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <PlayCircle className="ml-2 h-5 w-5" />
                                    {t('hero.ctaSecondary')}
                                </Button>
                            </div>

                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative lg:h-[600px]"
                        >
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-primary-500/10 to-secondary-500/10 rounded-full blur-3xl"></div>

                            {/* School Image */}
                            <div className="relative z-10 rounded-3xl shadow-2xl overflow-hidden transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                                <img src="/school-hero.png" alt="Modern Classroom" className="w-full h-auto rounded-3xl" />
                            </div>

                            {/* Floating Elements */}
                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-8 -right-8 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 z-20"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                        <CheckCircle className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Task Complete</p>
                                        <p className="font-bold text-gray-900 dark:text-white">Math Homework</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 15, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute -bottom-8 -left-8 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 z-20"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex -space-x-2 space-x-reverse">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white dark:border-gray-800"></div>
                                        ))}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">+500 students</p>
                                        <p className="text-xs text-gray-500">joined today</p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-gray-50 dark:bg-gray-900/50">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            {t('features.title')}
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            {t('features.subtitle')}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group"
                            >
                                <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t(`features.${feature.key}.title`)}</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{t(`features.${feature.key}.description`)}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-24 overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            {t('testimonials.title')}
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[0, 1, 2].map((index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-lg"
                            >
                                <div className="flex gap-1 mb-4">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">"{t(`testimonials.items.${index}.content`)}"</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?u=${index}`} alt={t(`testimonials.items.${index}.author`)} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white">{t(`testimonials.items.${index}.author`)}</h4>
                                        <p className="text-sm text-gray-500">{t(`testimonials.items.${index}.role`)}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 container mx-auto px-4">
                <div className="bg-primary-600 rounded-3xl p-12 lg:p-20 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6">{t('cta.title')}</h2>
                        <p className="text-xl text-primary-100 mb-10">
                            {t('cta.description')}
                        </p>
                        <Link href="/register">
                            <Button size="lg" variant="secondary" className="text-primary-700 font-bold text-lg h-14 px-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all">
                                {t('cta.button')}
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-16 border-t border-gray-800">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-12">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-2 mb-6">
                                <img src="/logo.png" alt="NEXUS ED" className="h-14" />
                            </div>
                            <p className="text-gray-400 max-w-sm leading-relaxed mb-8">
                                {t('footer.description')}
                            </p>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-500 transition-colors cursor-pointer">X</div>
                                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-500 transition-colors cursor-pointer">In</div>
                                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-500 transition-colors cursor-pointer">Fb</div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-6">{t('footer.quickLinks')}</h4>
                            <ul className="space-y-4">
                                <li><Link href="#" className="hover:text-primary-400 transition-colors">{t('footer.about')}</Link></li>
                                <li><Link href="#" className="hover:text-primary-400 transition-colors">{t('footer.features')}</Link></li>
                                <li><Link href="#" className="hover:text-primary-400 transition-colors">{t('footer.pricing')}</Link></li>
                                <li><Link href="#" className="hover:text-primary-400 transition-colors">{t('footer.blog')}</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-6">{t('footer.support')}</h4>
                            <ul className="space-y-4">
                                <li><Link href="#" className="hover:text-primary-400 transition-colors">{t('footer.helpCenter')}</Link></li>
                                <li><Link href="#" className="hover:text-primary-400 transition-colors">{t('footer.privacy')}</Link></li>
                                <li><Link href="#" className="hover:text-primary-400 transition-colors">{t('footer.terms')}</Link></li>
                                <li><Link href="#" className="hover:text-primary-400 transition-colors">{t('footer.contact')}</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-16 pt-8 text-center text-sm text-gray-500">
                        {t('footer.copyright')}
                    </div>
                </div>
            </footer>
        </div>
    )
}

const features = [
    {
        icon: <BookOpen className="w-6 h-6 text-primary-600" />,
        key: 'contentManagement',
        color: 'bg-primary-100'
    },
    {
        icon: <Users className="w-6 h-6 text-secondary-600" />,
        key: 'communication',
        color: 'bg-secondary-100'
    },
    {
        icon: <Award className="w-6 h-6 text-accent-600" />,
        key: 'evaluation',
        color: 'bg-accent-100'
    },
    {
        icon: <GraduationCap className="w-6 h-6 text-purple-600" />,
        key: 'virtualClasses',
        color: 'bg-purple-100'
    },
]
