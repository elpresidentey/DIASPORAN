"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { fadeInUp, staggerContainer } from "@/lib/animations"
import { signUp } from "@/lib/services/auth.service"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/components/ui/ToastProvider"

export default function SignupPage() {
    const router = useRouter();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        const result = await signUp({
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
        });

        if (result.user && !result.error) {
            const firstName = result.user.user_metadata?.first_name || 'there';
            addToast({
                type: 'success',
                title: 'Account Created!',
                message: `Welcome to Diasporan, ${firstName}!`,
            });
            router.push('/');
        } else {
            const errorMessage = result.error?.message || 'Signup failed';
            setErrors({ general: errorMessage });
            addToast({
                type: 'error',
                title: 'Signup Failed',
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
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 dark:opacity-5 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background pointer-events-none" />

            {/* Animated Gradient Orbs */}
            <motion.div
                className="absolute top-20 right-20 w-96 h-96 bg-gray-500/10 rounded-full blur-3xl"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.3, 0.2],
                }}
                transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
                className="absolute bottom-20 left-20 w-96 h-96 bg-slate-500/10 rounded-full blur-3xl"
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
                            Join the Vibe
                        </h1>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Create an account to start planning your trip
                        </p>
                    </motion.div>

                    <motion.form className="space-y-4" variants={staggerContainer} onSubmit={handleSubmit}>
                        {errors.general && (
                            <motion.div 
                                className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-sm text-red-400"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                {errors.general}
                            </motion.div>
                        )}
                        
                        <motion.div className="grid grid-cols-2 gap-4" variants={fadeInUp}>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground" htmlFor="firstName">
                                    First Name
                                </label>
                                <Input 
                                    id="firstName" 
                                    placeholder="John" 
                                    type="text" 
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground" htmlFor="lastName">
                                    Last Name
                                </label>
                                <Input 
                                    id="lastName" 
                                    placeholder="Doe" 
                                    type="text"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </motion.div>
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
                                helperText="Minimum 6 characters"
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
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </Button>
                        </motion.div>
                    </motion.form>

                    <motion.div
                        className="mt-6 text-center text-sm text-muted-foreground"
                        variants={fadeInUp}
                    >
                        Already have an account?{" "}
                        <Link href="/login" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium">
                            Sign in
                        </Link>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    )
}
