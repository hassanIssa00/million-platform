import { fontFamily } from 'tailwindcss/defaultTheme';
import tailwindcssAnimate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'Cairo', ...fontFamily.sans],
                arabic: ['Cairo', 'Tajawal', ...fontFamily.sans],
                display: ['Inter', 'Cairo', ...fontFamily.sans],
            },
            colors: {
                // Deep Blue - Primary Brand
                primary: {
                    50: '#E6EDF3',
                    100: '#C2D4E3',
                    200: '#9EBBD3',
                    300: '#7AA2C3',
                    400: '#4A7AAD',
                    500: '#0A2A43', // Main brand color
                    600: '#082235',
                    700: '#061A27',
                    800: '#041119',
                    900: '#02090C',
                },
                // Teal - Secondary
                secondary: {
                    50: '#E6F7F5',
                    100: '#B8EBE5',
                    200: '#8ADED5',
                    300: '#5CD2C5',
                    400: '#2EC6B5',
                    500: '#1AAE9F', // Main teal
                    600: '#158B7F',
                    700: '#10685F',
                    800: '#0B453F',
                    900: '#062320',
                },
                // Gold - Accent
                accent: {
                    50: '#FAF6E8',
                    100: '#F3EAC3',
                    200: '#ECDE9E',
                    300: '#E5D279',
                    400: '#DEC654',
                    500: '#D4AF37', // Main gold
                    600: '#B8992E',
                    700: '#8A7323',
                    800: '#5C4C18',
                    900: '#2E260C',
                },
                // Accessible text colors
                text: {
                    primary: {
                        light: '#0f172a',    // High contrast on light bg
                        dark: '#f1f5f9',     // High contrast on dark bg
                    },
                    secondary: {
                        light: '#475569',
                        dark: '#cbd5e1',
                    },
                    tertiary: {
                        light: '#64748b',
                        dark: '#94a3b8',
                    },
                },
                // Input-specific colors for better visibility
                input: {
                    bg: {
                        light: '#f8fafc',
                        dark: '#1e293b',
                    },
                    border: {
                        light: '#e2e8f0',
                        dark: '#334155',
                    },
                    placeholder: {
                        light: '#94a3b8',
                        dark: '#64748b',
                    },
                },
                // Surface colors
                surface: {
                    light: '#ffffff',
                    'light-elevated': '#f8fafc',
                    dark: '#0f172a',
                    'dark-elevated': '#1e293b',
                },
                // Original neutral colors
                border: 'hsl(var(--border))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
            },
            fontSize: {
                '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
                xs: ['0.75rem', { lineHeight: '1rem' }],
                sm: ['0.875rem', { lineHeight: '1.25rem' }],
                base: ['1rem', { lineHeight: '1.5rem' }],
                lg: ['1.125rem', { lineHeight: '1.75rem' }],
                xl: ['1.25rem', { lineHeight: '1.75rem' }],
                '2xl': ['1.5rem', { lineHeight: '2rem' }],
                '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
                '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
                '5xl': ['3rem', { lineHeight: '1.2' }],
                '6xl': ['3.75rem', { lineHeight: '1.1' }],
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            backdropBlur: {
                glass: '12px',
            },
            keyframes: {
                'accordion-down': {
                    from: { height: 0 },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: 0 },
                },
                'fade-in': {
                    '0%': { opacity: 0, transform: 'translateY(10px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                },
                'slide-in-right': {
                    '0%': { transform: 'translateX(100%)' },
                    '100%': { transform: 'translateX(0)' },
                },
                'slide-up': {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 20px rgba(14, 165, 233, 0.5)' },
                    '100%': { boxShadow: '0 0 30px rgba(14, 165, 233, 0.8)' },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'fade-in': 'fade-in 0.5s ease-out',
                'slide-in-right': 'slide-in-right 0.3s ease-out',
                'slide-up': 'slide-up 0.5s ease-out',
                float: 'float 6s ease-in-out infinite',
                glow: 'glow 2s ease-in-out infinite alternate',
            },
        },
    },
    plugins: [tailwindcssAnimate],
};
