'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

type UserRole = 'student' | 'teacher' | 'parent' | 'admin';

interface UserProfile {
    id: string;
    email: string;
    full_name: string;
    role: UserRole;
    avatar_url?: string;
}

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    session: Session | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, fullName: string, role: UserRole) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!supabase) {
            setLoading(false);
            return;
        }

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setLoading(false);
            }
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setProfile(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId: string) => {
        if (!supabase) return;
        try {
            const { data, error } = await supabase
                .from('users')
                .select('id, email, full_name, role, avatar_url')
                .eq('id', userId)
                .single();

            if (error) throw error;
            setProfile(data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    // Check if we are in demo mode (using placeholder credentials)
    const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') ||
        !supabase;

    const signIn = async (email: string, password: string) => {
        try {
            if (isDemoMode) {
                console.log('Using Demo Mode for login');
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Mock successful login
                const mockUser = {
                    id: 'mock-user-id',
                    email,
                    app_metadata: {},
                    user_metadata: {},
                    aud: 'authenticated',
                    created_at: new Date().toISOString(),
                } as User;

                // Determine role based on email for demo purposes
                let role: UserRole = 'student';
                if (email.toLowerCase().includes('admin')) role = 'admin';
                else if (email.toLowerCase().includes('teacher')) role = 'teacher';
                else if (email.toLowerCase().includes('parent')) role = 'parent';

                const mockProfile: UserProfile = {
                    id: 'mock-user-id',
                    email,
                    full_name: 'مستخدم تجريبي',
                    role,
                };

                setUser(mockUser);
                setProfile(mockProfile);
                localStorage.setItem('is_demo', 'true');
                return;
            }

            // Real API Login Fallback or Supabase
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });

                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('access_token', data.access_token);
                    localStorage.setItem('is_demo', 'false');

                    const userObj = {
                        id: data.user.id,
                        email: data.user.email,
                    } as User;

                    setUser(userObj);
                    setProfile({
                        id: data.user.id,
                        email: data.user.email,
                        full_name: data.user.name || data.user.email,
                        role: data.user.role.toLowerCase() as UserRole,
                    });
                    return;
                }
            } catch (apiError) {
                console.warn('NestJS API login failed, trying Supabase...', apiError);
            }

            // Original Supabase Login
            if (!supabase) throw new Error('Auth service not initialized');

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            // Fetch user profile
            if (data.user) {
                await fetchProfile(data.user.id);
            }
        } catch (error: any) {
            console.error('Login error:', error);
            throw new Error(error.message || 'حدث خطأ في تسجيل الدخول');
        }
    };

    const signUp = async (
        email: string,
        password: string,
        fullName: string,
        role: UserRole
    ) => {
        try {
            if (isDemoMode) {
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Mock successful signup
                const mockUser = {
                    id: 'mock-user-id',
                    email,
                    app_metadata: {},
                    user_metadata: {},
                    aud: 'authenticated',
                    created_at: new Date().toISOString(),
                } as User;

                const mockProfile: UserProfile = {
                    id: 'mock-user-id',
                    email,
                    full_name: fullName,
                    role,
                };

                setUser(mockUser);
                setProfile(mockProfile);
                return;
            }

            // Sign up with Supabase Auth
            const { data: authData, error: authError } = await supabase!.auth.signUp({
                email,
                password,
            });

            if (authError) throw authError;
            if (!authData.user) throw new Error('فشل إنشاء الحساب');

            // Create user profile in public.users
            const { error: profileError } = await supabase!.from('users').insert({
                id: authData.user.id,
                email,
                full_name: fullName,
                role,
            });

            if (profileError) throw profileError;

            // Fetch the created profile
            await fetchProfile(authData.user.id);
        } catch (error: any) {
            throw new Error(error.message || 'حدث خطأ في إنشاء الحساب');
        }
    };

    const signOut = async () => {
        try {
            if (isDemoMode) {
                setUser(null);
                setProfile(null);
                setSession(null);
                router.push('/login');
                return;
            }

            const { error } = await supabase!.auth.signOut();
            if (error) throw error;

            setUser(null);
            setProfile(null);
            setSession(null);
            router.push('/login');
        } catch (error: any) {
            throw new Error(error.message || 'حدث خطأ في تسجيل الخروج');
        }
    };

    const value = {
        user,
        profile,
        session,
        loading,
        signIn,
        signUp,
        signOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
