import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: 'class',
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        screens: {
            'sm': '640px',   // mobile breakpoint
            'md': '768px',   // tablet intermediate
            'lg': '1024px',  // desktop breakpoint
            'xl': '1280px',
            '2xl': '1536px',
        },
        extend: {
            // Design System: Typography
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Space Grotesk', 'Inter', 'sans-serif'],
            },
            fontSize: {
                'xs': '0.75rem',    // 12px
                'sm': '0.875rem',   // 14px
                'base': '1rem',     // 16px
                'lg': '1.125rem',   // 18px
                'xl': '1.25rem',    // 20px
                '2xl': '1.5rem',    // 24px
                '3xl': '1.875rem',  // 30px
                '4xl': '2.25rem',   // 36px
                '5xl': '3rem',      // 48px
                '6xl': '3.75rem',   // 60px
                '7xl': '4.5rem',    // 72px
                '8xl': '6rem',      // 96px
            },
            // Design System: Spacing (8px base unit)
            spacing: {
                '0': '0',
                '1': '0.5rem',   // 8px
                '2': '1rem',     // 16px
                '3': '1.5rem',   // 24px
                '4': '2rem',     // 32px
                '5': '2.5rem',   // 40px
                '6': '3rem',     // 48px
                '8': '4rem',     // 64px
                '10': '5rem',    // 80px
                '12': '6rem',    // 96px
                '16': '8rem',    // 128px
                '20': '10rem',   // 160px
            },
            // Design System: Colors
            colors: {
                // Brand Colors
                purple: {
                    50: '#faf5ff',
                    100: '#f3e8ff',
                    200: '#e9d5ff',
                    300: '#d8b4fe',
                    400: '#c084fc',
                    500: '#a855f7',  // Main purple
                    600: '#9333ea',
                    700: '#7e22ce',
                    800: '#6b21a8',
                    900: '#581c87',
                },
                pink: {
                    50: '#fdf2f8',
                    100: '#fce7f3',
                    200: '#fbcfe8',
                    300: '#f9a8d4',
                    400: '#f472b6',
                    500: '#ec4899',  // Main pink
                    600: '#db2777',
                    700: '#be185d',
                    800: '#9d174d',
                    900: '#831843',
                },
                // Semantic Colors
                success: {
                    50: '#f0fdf4',
                    500: '#10b981',
                    600: '#059669',
                    700: '#047857',
                },
                warning: {
                    50: '#fffbeb',
                    500: '#f59e0b',
                    600: '#d97706',
                    700: '#b45309',
                },
                error: {
                    50: '#fef2f2',
                    500: '#ef4444',
                    600: '#dc2626',
                    700: '#b91c1c',
                },
                info: {
                    50: '#eff6ff',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                },
                // Neutral Colors
                gray: {
                    50: '#fafafa',
                    100: '#f5f5f5',
                    200: '#e5e5e5',
                    300: '#d1d5db',
                    400: '#9ca3af',
                    500: '#6b7280',
                    600: '#4b5563',
                    700: '#374151',
                    800: '#1f2937',
                    900: '#111827',
                },
                // Legacy support
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            // Design System: Border Radius
            borderRadius: {
                'none': '0',
                'sm': '0.125rem',   // 2px
                'base': '0.25rem',  // 4px
                'md': '0.375rem',   // 6px
                'lg': '0.5rem',     // 8px
                'xl': '0.75rem',    // 12px
                '2xl': '1rem',      // 16px
                '3xl': '1.5rem',    // 24px
                'full': '9999px',
            },
            // Design System: Shadow Elevation
            boxShadow: {
                'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                'glow-purple': '0 0 40px rgba(139, 92, 246, 0.3)',
                'glow-pink': '0 0 40px rgba(236, 72, 153, 0.3)',
            },
        },
    },
    plugins: [],
};
export default config;
