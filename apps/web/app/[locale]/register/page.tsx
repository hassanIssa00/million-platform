'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student' as 'student' | 'teacher' | 'parent' | 'admin',
    });
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (formData.password !== formData.confirmPassword) {
            toast({
                variant: 'destructive',
                title: '❌ خطأ',
                description: 'كلمات المرور غير متطابقة',
            });
            return;
        }

        if (formData.password.length < 6) {
            toast({
                variant: 'destructive',
                title: '❌ خطأ',
                description: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
            });
            return;
        }

        setLoading(true);

        try {
            await signUp(
                formData.email,
                formData.password,
                formData.fullName,
                formData.role
            );

            toast({
                title: '✅ تم إنشاء الحساب بنجاح',
                description: 'مرحباً بك في منصة NEXUS ED',
            });
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: '❌ خطأ في إنشاء الحساب',
                description: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12" dir="rtl">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                {/* Logo & Title */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">
                        إنشاء حساب جديد 🚀
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        انضم لمنصة Million EdTech اليوم
                    </p>
                </div>

                {/* Form */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Full Name */}
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                                الاسم الكامل
                            </label>
                            <Input
                                id="fullName"
                                name="fullName"
                                type="text"
                                required
                                value={formData.fullName}
                                onChange={(e) =>
                                    setFormData({ ...formData, fullName: e.target.value })
                                }
                                placeholder="أحمد علي"
                                className="text-right"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                البريد الإلكتروني
                            </label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                                placeholder="ahmed@example.com"
                                className="text-right"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                كلمة المرور
                            </label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                                placeholder="••••••••"
                                className="text-right"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                6 أحرف على الأقل
                            </p>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                تأكيد كلمة المرور
                            </label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                value={formData.confirmPassword}
                                onChange={(e) =>
                                    setFormData({ ...formData, confirmPassword: e.target.value })
                                }
                                placeholder="••••••••"
                                className="text-right"
                            />
                        </div>

                        {/* Role Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                نوع الحساب
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <label
                                    className={`
                    flex items-center justify-center px-4 py-3 border-2 rounded-lg cursor-pointer transition
                    ${formData.role === 'student'
                                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                                            : 'border-gray-300 hover:border-gray-400'
                                        }
                  `}
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        value="student"
                                        checked={formData.role === 'student'}
                                        onChange={(e) =>
                                            setFormData({ ...formData, role: e.target.value as any })
                                        }
                                        className="sr-only"
                                    />
                                    <span className="text-sm font-medium">طالب 📚</span>
                                </label>

                                <label
                                    className={`
                    flex items-center justify-center px-4 py-3 border-2 rounded-lg cursor-pointer transition
                    ${formData.role === 'teacher'
                                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                                            : 'border-gray-300 hover:border-gray-400'
                                        }
                  `}
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        value="teacher"
                                        checked={formData.role === 'teacher'}
                                        onChange={(e) =>
                                            setFormData({ ...formData, role: e.target.value as any })
                                        }
                                        className="sr-only"
                                    />
                                    <span className="text-sm font-medium">معلم 👨‍🏫</span>
                                </label>

                                <label
                                    className={`
                    flex items-center justify-center px-4 py-3 border-2 rounded-lg cursor-pointer transition
                    ${formData.role === 'parent'
                                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                                            : 'border-gray-300 hover:border-gray-400'
                                        }
                  `}
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        value="parent"
                                        checked={formData.role === 'parent'}
                                        onChange={(e) =>
                                            setFormData({ ...formData, role: e.target.value as any })
                                        }
                                        className="sr-only"
                                    />
                                    <span className="text-sm font-medium">ولي أمر 👨‍👩‍👧</span>
                                </label>

                                <label
                                    className={`
                    flex items-center justify-center px-4 py-3 border-2 rounded-lg cursor-pointer transition
                    ${formData.role === 'admin'
                                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                                            : 'border-gray-300 hover:border-gray-400'
                                        }
                  `}
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        value="admin"
                                        checked={formData.role === 'admin'}
                                        onChange={(e) =>
                                            setFormData({ ...formData, role: e.target.value as any })
                                        }
                                        className="sr-only"
                                    />
                                    <span className="text-sm font-medium">مشرف 🛡️</span>
                                </label>
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="flex items-start">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                required
                                className="h-4 w-4 mt-1 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                            <label htmlFor="terms" className="mr-2 block text-sm text-gray-900">
                                أوافق على{' '}
                                <Link href="/terms" className="text-primary-600 hover:text-primary-500">
                                    شروط الخدمة
                                </Link>{' '}
                                و{' '}
                                <Link href="/privacy" className="text-primary-600 hover:text-primary-500">
                                    سياسة الخصوصية
                                </Link>
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={loading}
                    >
                        {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
                    </Button>
                </form>

                {/* Sign in link */}
                <div className="text-center text-sm">
                    <span className="text-gray-600">لديك حساب بالفعل؟ </span>
                    <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
                        تسجيل الدخول
                    </Link>
                </div>
            </div>
        </div>
    );
}
