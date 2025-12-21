"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { fadeInUp, staggerContainer } from "@/lib/animations"
import { signIn } from "@/lib/services/auth.service"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/components/ui/ToastProvider"

export default function LoginPage() {
    const router = useRouter();
    const { user } = useAuth();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        const result = await signIn({
            email: formData.email,
            password: formData.password,
        });

        if (result.user && !result.error) {
            const firstName = result.user.user_metadata?.first_name || 'there';
            addToast({
                type: 'success',
                title: 'Welcome Back!',
                message: `Good to see you, ${firstName}!`,
            });
            router.push('/');
        } else {
            const errorMessage = result.error?.message || 'Login failed';
            setErrors({ general: errorMessage });
            addToast({
                type: 'error',
                title: 'Login Failed',
                message: errorMessage,
            });
        }

        setLoading(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.id]: e.target.value
        }));
        // Clear error for this field
        if (errors[e.target.id]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[e.target.id];
                return newErrors;
            });
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 dark:opacity-5 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background pointer-events-none" />

            {/* Animated Gradient Orbs */}
            <motion.div
                className="absolute top-20 left-20 w-96 h-96 bg-gray-500/10 rounded-full blur-3xl"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.3, 0.2],
                }}
                transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
                className="absolute bottom-20 right-20 w-96 h-96 bg-slate-500/10 rounded-full blur-3xl"
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.3, 0.2, 0.3],
                }}
                transition={{ duration: 8, repeat: Infinity, delay: 1 }}
            />

            <motion.div
                className="relative z-10 w-full max-w-md p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Link>

                <motion.div
                    className="glass-strong rounded-2xl p-6 sm:p-8 shadow-2xl"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div className="text-center mb-6 sm:mb-8" variants={fadeInUp}>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                            Welcome Back
                        </h1>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Sign in to access your Detty December plans
                        </p>
                    </motion.div>

                    <motion.form className="space-y-4" variants={staggerContainer} onSubmit={handleSubmit}>
                        {errors.general && (
                            <motion.div 
                                className="bg-gray-500/10 border border-gray-500/50 rounded-lg p-3 text-sm text-gray-500"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                {errors.general}
                            </motion.div>
                        )}
                        
                        <motion.div className="space-y-2" variants={fadeInUp}>
                            <label className="text-sm font-medium text-foreground" htmlFor="email">
                                Email
                            </label>
                            <Input 
                                id="email" 
                                placeholder="hello@example.com" 
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </motion.div>
                        <motion.div className="space-y-2" variants={fadeInUp}>
                            <label className="text-sm font-medium text-foreground" htmlFor="password">
                                Password
                            </label>
                            <Input 
                                id="password" 
                                placeholder="••••••••" 
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </motion.div>

                        <motion.div variants={fadeInUp} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button 
                                type="submit"
                                className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 border-0" 
                                size="lg"
                                loading={loading}
                                disabled={loading}
                            >
                                {loading ? 'Signing In...' : 'Sign In'}
                            </Button>
                        </motion.div>
                    </motion.form>

                    <motion.div
                        className="mt-6 text-center text-sm text-muted-foreground"
                        variants={fadeInUp}
                    >
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium">
                            Sign up
                        </Link>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    )
}
