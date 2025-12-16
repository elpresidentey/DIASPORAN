"use client"

import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Shield, Phone, MapPin, AlertTriangle, Share2, Heart, Users } from "lucide-react"
import { motion } from "framer-motion"
import { fadeInUp, fadeInScale, staggerContainer, staggerFast, slideInLeft, slideInRight, pulse } from "@/lib/animations"

export default function SafetyPage() {
    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Hero Section */}
            <section className="relative py-20 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1599827092575-29e248039774?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 dark:opacity-10 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background pointer-events-none" />

                {/* Animated background elements */}
                <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-red-600/20 blur-3xl opacity-30" />
                <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-orange-600/20 blur-3xl opacity-30" />

                <motion.div
                    className="relative z-10 container mx-auto max-w-5xl text-center"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-strong mb-6"
                        variants={fadeInScale}
                    >
                        <Shield className="w-5 h-5 text-red-400" />
                        <span className="text-sm font-semibold text-red-400">Your Safety Matters</span>
                    </motion.div>

                    <motion.h1
                        className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
                        variants={fadeInUp}
                    >
                        Safety <span className="text-gray-700 dark:text-gray-300">First</span>
                    </motion.h1>
                    <motion.p
                        className="text-muted-foreground text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed"
                        variants={fadeInUp}
                    >
                        Essential tools and contacts to keep you safe during your stay.
                        <span className="block mt-2 text-foreground font-semibold">We&apos;ve got your back, always.</span>
                    </motion.p>

                    {/* Stats */}
                    <motion.div
                        className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-12"
                        variants={staggerFast}
                    >
                        <StatCard icon={<Shield className="w-6 h-6" />} value="24/7" label="Protection" />
                        <StatCard icon={<Users className="w-6 h-6" />} value="50K+" label="Safe Users" />
                        <StatCard icon={<Heart className="w-6 h-6" />} value="100%" label="Verified" />
                    </motion.div>
                </motion.div>
            </section>

            {/* Safety Tools */}
            <section className="container mx-auto px-4">
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {/* Emergency Contacts */}
                    <SafetyCard variant="emergency">
                        <Card className="h-full bg-red-500/10 border-red-500/20 hover:border-red-500/40 transition-all duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-red-500">
                                    <Phone className="w-6 h-6" /> Emergency Contacts
                                </CardTitle>
                                <CardDescription>One-tap access to local emergency services.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <EmergencyButton
                                    title="Police"
                                    subtitle="Emergency Response"
                                    number="112"
                                />
                                <EmergencyButton
                                    title="Ambulance"
                                    subtitle="Medical Emergency"
                                    number="112"
                                />
                                <EmergencyButton
                                    title="Fire Service"
                                    subtitle="Fire Emergency"
                                    number="112"
                                />
                            </CardContent>
                        </Card>
                    </SafetyCard>

                    {/* Location Sharing */}
                    <SafetyCard variant="location">
                        <Card className="h-full glass border-white/10 hover:border-blue-500/30 transition-all duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-blue-500">
                                    <Share2 className="w-6 h-6" /> Live Location
                                </CardTitle>
                                <CardDescription>Share your real-time location with trusted contacts.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="p-6 bg-blue-500/10 rounded-xl border border-blue-500/20 mb-6 text-center">
                                    <div>
                                        <MapPin className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Generate a secure link to share your live location for the next hour.
                                    </p>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100">
                                            Share Location
                                        </Button>
                                    </motion.div>
                                </div>
                            </CardContent>
                        </Card>
                    </SafetyCard>

                    {/* Report Scam */}
                    <SafetyCard variant="report">
                        <Card className="h-full glass border-white/10 hover:border-yellow-500/30 transition-all duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-yellow-500">
                                    <AlertTriangle className="w-6 h-6" /> Report Issue
                                </CardTitle>
                                <CardDescription>Report scams or safety concerns in your area.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="p-6 bg-yellow-500/10 rounded-xl border border-yellow-500/20 mb-6">
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Help keep the community safe by reporting suspicious activities or scams.
                                    </p>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button variant="outline" className="w-full border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10">
                                            File Report
                                        </Button>
                                    </motion.div>
                                </div>
                            </CardContent>
                        </Card>
                    </SafetyCard>
                </motion.div>

                {/* Safety Tips Section */}
                <motion.div
                    className="mt-20 max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">
                            Stay <span className="text-gray-700 dark:text-gray-300">Safe</span> Out There
                        </h2>
                        <p className="text-muted-foreground text-lg">Quick tips to ensure your safety during Detty December</p>
                    </div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <TipCard
                            title="Stay Connected"
                            description="Always keep your phone charged and share your location with trusted friends."
                            icon="📱"
                        />
                        <TipCard
                            title="Trust Your Instincts"
                            description="If something feels off, it probably is. Don't hesitate to leave or ask for help."
                            icon="🧠"
                        />
                        <TipCard
                            title="Verify Venues"
                            description="Check reviews and ratings before visiting new places. Stick to verified locations."
                            icon="✅"
                        />
                        <TipCard
                            title="Travel in Groups"
                            description="There's safety in numbers. Coordinate with friends when going out at night."
                            icon="👥"
                        />
                    </motion.div>
                </motion.div>
            </section>
        </div>
    )
}

function StatCard({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) {
    return (
        <motion.div
            className="text-center p-4 rounded-xl glass-strong"
            variants={fadeInScale}
            whileHover={{ scale: 1.05, y: -5 }}
        >
            <div className="text-red-400 mb-2 flex justify-center">{icon}</div>
            <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">{value}</div>
            <div className="text-xs text-muted-foreground font-medium">{label}</div>
        </motion.div>
    )
}

function SafetyCard({ children, variant }: { children: React.ReactNode, variant: 'emergency' | 'location' | 'report' }) {
    return (
        <motion.div
            variants={fadeInUp}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3 }}
        >
            {children}
        </motion.div>
    )
}

function EmergencyButton({ title, subtitle, number }: { title: string, subtitle: string, number: string }) {
    return (
        <motion.div
            className="flex items-center justify-between p-4 bg-red-500/10 rounded-lg border border-red-500/20 hover:bg-red-500/20 transition-all duration-300"
            whileHover={{ scale: 1.02, x: 5 }}
        >
            <div>
                <div className="font-bold text-foreground">{title}</div>
                <div className="text-xs text-red-400">{subtitle}</div>
            </div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button size="sm" variant="destructive" className="shadow-glow-pink">
                    Call {number}
                </Button>
            </motion.div>
        </motion.div>
    )
}

function TipCard({ title, description, icon }: { title: string, description: string, icon: string }) {
    return (
        <motion.div
            className="p-6 rounded-2xl glass-strong border border-white/10 hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-300"
            variants={fadeInUp}
            whileHover={{ scale: 1.03, y: -5 }}
        >
            <div className="text-4xl mb-4">{icon}</div>
            <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        </motion.div>
    )
}
