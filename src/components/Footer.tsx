"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Heart } from "lucide-react"
import { motion } from "framer-motion"
import { smoothScrollTo } from "@/lib/smoothScroll"
import { mockActions } from "@/lib/mockActions"
import { useState } from "react"

export default function Footer() {
    const currentYear = new Date().getFullYear()
    const pathname = usePathname()
    const [email, setEmail] = useState("")
    const [isSubscribed, setIsSubscribed] = useState(false)

    const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (pathname === '/') {
            e.preventDefault()
            smoothScrollTo(0, { duration: 600, offset: 0 })
        }
    }

    const handleNewsletterSignup = (e: React.FormEvent) => {
        e.preventDefault()
        const success = mockActions.subscribeNewsletter(email)
        if (success) {
            setIsSubscribed(true)
            setEmail("")
            setTimeout(() => setIsSubscribed(false), 3000)
        }
    }

    const handleSupportLink = (href: string) => {
        // Navigate to the actual page
        window.location.href = href;
    }

    const footerLinks = {
        product: [
            { label: "Flights", href: "/flights" },
            { label: "Stays", href: "/stays" },
            { label: "Events", href: "/events" },
            { label: "Transport", href: "/transport" },
            { label: "Safety", href: "/safety" },
        ],
        company: [
            { label: "About Us", href: "/about" },
            { label: "Careers", href: "/careers" },
            { label: "Press", href: "/press" },
            { label: "Blog", href: "/blog" },
            { label: "Partners", href: "/partners" },
        ],
        support: [
            { label: "Help Center", href: "/help" },
            { label: "Contact Us", href: "/contact" },
            { label: "FAQs", href: "/faqs" },
            { label: "Terms of Service", href: "/terms" },
            { label: "Privacy Policy", href: "/privacy" },
        ],
    }

    const socialLinks = [
        { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
        { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
        { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
        { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    ]

    return (
        <footer className="relative bg-background border-t border-border overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 dot-pattern opacity-30" />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/5 to-background/50" />

            <div className="relative z-10 container mx-auto px-4 py-16">
                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <Link
                                href="/"
                                onClick={handleLogoClick}
                                className="flex items-center gap-3 mb-6 w-fit hover:opacity-80 transition-opacity cursor-pointer"
                            >
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow-neutral flex-shrink-0">
                                    <span className="text-white font-bold text-2xl leading-none">D</span>
                                </div>
                                <span className="text-2xl font-bold text-gradient-rainbow leading-none">
                                    Diasporan
                                </span>
                            </Link>
                            <p className="text-muted-foreground mb-6 leading-relaxed max-w-md">
                                Your ultimate companion for Detty December. Book flights, find stays, discover events, and stay safe while experiencing the best of Africa.
                            </p>

                            {/* Contact Info */}
                            <div className="space-y-3">
                                <button 
                                    onClick={() => mockActions.sendEmail("hello@diasporan.com")}
                                    className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <Mail className="w-5 h-5" />
                                    <span>hello@diasporan.com</span>
                                </button>
                                <button 
                                    onClick={() => mockActions.callPhone("+2341234567890")}
                                    className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <Phone className="w-5 h-5" />
                                    <span>+234 123 456 7890</span>
                                </button>
                                <div className="flex items-center gap-3 text-muted-foreground">
                                    <MapPin className="w-5 h-5" />
                                    <span>Lagos, Nigeria</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Product Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <h3 className="text-foreground font-bold text-lg mb-4">Product</h3>
                        <ul className="space-y-3">
                            {footerLinks.product.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-muted-foreground hover:text-primary transition-colors inline-block hover:translate-x-1 transform duration-200"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Company Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h3 className="text-foreground font-bold text-lg mb-4">Company</h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-muted-foreground hover:text-primary transition-colors inline-block hover:translate-x-1 transform duration-200"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Support Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <h3 className="text-foreground font-bold text-lg mb-4">Support</h3>
                        <ul className="space-y-3">
                            {footerLinks.support.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-muted-foreground hover:text-primary transition-colors inline-block hover:translate-x-1 transform duration-200"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                {/* Divider */}
                <div className="divider-gradient mb-8" />

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Copyright */}
                    <motion.p
                        className="text-muted-foreground text-sm"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        © {currentYear} Diasporan. Made with{" "}
                        <Heart className="w-4 h-4 inline text-pink-500 animate-pulse" /> in Africa.
                    </motion.p>

                    {/* Social Links */}
                    <motion.div
                        className="flex items-center gap-4"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        {socialLinks.map((social) => (
                            <motion.button
                                key={social.label}
                                onClick={() => mockActions.openSocialMedia(social.label, social.href)}
                                className="w-10 h-10 rounded-lg glass-strong flex items-center justify-center text-muted-foreground hover:text-foreground hover:glass-stronger transition-all"
                                whileHover={{ scale: 1.1, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                aria-label={social.label}
                            >
                                <social.icon className="w-5 h-5" />
                            </motion.button>
                        ))}
                    </motion.div>
                </div>

                {/* Newsletter Section */}
                <motion.div
                    className="mt-12 p-8 rounded-2xl glass-strong border border-white/10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    <div className="max-w-2xl mx-auto text-center">
                        <h3 className="text-2xl font-bold text-foreground mb-3">
                            Stay Updated with Detty December
                        </h3>
                        <p className="text-muted-foreground mb-6">
                            Get exclusive deals, event updates, and travel tips delivered to your inbox.
                        </p>
                        <form onSubmit={handleNewsletterSignup} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="flex-1 px-4 py-3 rounded-lg bg-background/50 border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            />
                            <motion.button
                                type="submit"
                                disabled={isSubscribed}
                                className="px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-accent text-white font-semibold shadow-glow-neutral hover:shadow-glow-subtle transition-all disabled:opacity-50"
                                whileHover={{ scale: isSubscribed ? 1 : 1.05 }}
                                whileTap={{ scale: isSubscribed ? 1 : 0.95 }}
                            >
                                {isSubscribed ? "Subscribed!" : "Subscribe"}
                            </motion.button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </footer>
    )
}
