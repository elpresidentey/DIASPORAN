"use client";

import { Button } from "@/components/ui/Button";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  TrendingUp,
  Calendar,
  Plane,
  Hotel,
  Music,
  MapPin,
  Globe,
  Heart,
  Users,
  Star,
  Clock,
  CheckCircle,
  Gift,
  Headphones,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";

import { smoothScrollTo } from "@/lib/smoothScroll";

const features = [
  {
    icon: Plane,
    title: "Flights",
    description: "Find the best flight deals to African destinations with our exclusive partner airlines.",
    href: "/flights",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    icon: Hotel,
    title: "Stays",
    description: "Discover handpicked accommodations from luxury resorts to cozy apartments.",
    href: "/stays",
    gradient: "from-gray-500 to-slate-500",
  },
  {
    icon: Music,
    title: "Events",
    description: "Never miss out on the hottest parties, concerts, and cultural events.",
    href: "/events",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: Shield,
    title: "Safety",
    description: "Travel with confidence using our verified safety guides and local tips.",
    href: "/safety",
    gradient: "from-emerald-500 to-teal-500",
  },
];

const stats = [
  { number: "50K+", label: "Happy Travelers" },
  { number: "1K+", label: "Events" },
  { number: "10K+", label: "Accommodations" },
  { number: "24/7", label: "Support" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Clean Background - Optimized for LCP */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/60 via-white to-slate-50/60 dark:from-slate-900/40 dark:via-slate-900 dark:to-slate-800/40" />
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating Orbs */}
          <motion.div
            className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-gray-400/20 to-slate-400/20 rounded-full blur-xl"
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-slate-400/15 to-gray-400/15 rounded-full blur-lg"
            animate={{
              x: [0, -25, 0],
              y: [0, 15, 0],
              scale: [1, 0.9, 1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          <motion.div
            className="absolute bottom-32 left-1/4 w-20 h-20 bg-gradient-to-r from-gray-300/10 to-slate-300/10 rounded-full blur-md"
            animate={{
              x: [0, 20, 0],
              y: [0, -10, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
              delay: 2,
            }}
          />
          
          {/* Animated Grid Pattern */}
          <motion.div
            className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0 0 0) 1px, transparent 0)`,
              backgroundSize: '50px 50px',
            }}
            animate={{
              backgroundPosition: ['0px 0px', '50px 50px'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        {/* Subtle Overlays - Theme Aware */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/90 to-white/95 dark:from-slate-900/80 dark:via-slate-900/60 dark:to-slate-900/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-500/5 via-transparent to-slate-500/5 dark:from-gray-700/10 dark:via-transparent dark:to-slate-700/10" />

        {/* Floating Interactive Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Floating Icons */}
          <motion.div
            className="absolute top-1/4 left-10 hidden lg:block"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="w-16 h-16 bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-gray-200/20 dark:border-gray-600/30">
              <Plane className="w-8 h-8 text-gray-700 dark:text-gray-300" />
            </div>
          </motion.div>
          
          <motion.div
            className="absolute top-1/3 right-16 hidden lg:block"
            animate={{
              y: [0, 15, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            <div className="w-14 h-14 bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl flex items-center justify-center border border-gray-200/20 dark:border-gray-600/30">
              <Music className="w-7 h-7 text-gray-700 dark:text-gray-300" />
            </div>
          </motion.div>
          
          <motion.div
            className="absolute bottom-1/3 left-20 hidden lg:block"
            animate={{
              y: [0, -10, 0],
              x: [0, 10, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          >
            <div className="w-12 h-12 bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm rounded-lg flex items-center justify-center border border-gray-200/20 dark:border-gray-600/30">
              <Hotel className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </div>
          </motion.div>

          <motion.div
            className="absolute bottom-1/4 right-12 hidden lg:block"
            animate={{
              y: [0, 12, 0],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          >
            <div className="w-10 h-10 bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-gray-200/20 dark:border-gray-600/30">
              <MapPin className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </div>
          </motion.div>
        </div>

        {/* Content - Priority for LCP */}
        <div className="relative z-10 container mx-auto px-6 max-w-7xl">
          <motion.div
            className="text-center space-y-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div 
              className="flex justify-center" 
              variants={fadeInUp} 
              transition={{ duration: 0.5, delay: 0 }}
            >
              <motion.div 
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-slate-600 relative overflow-hidden group cursor-default"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                </motion.div>
                <span className="text-sm font-semibold relative z-10">
                  Your Ultimate Detty December Guide
                </span>
                {/* Animated background shimmer */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-gray-600/20"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            </motion.div>

            {/* Main Heading */}
            <motion.div variants={fadeInUp} className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight tracking-tight text-center">
                <motion.span 
                  className="block text-gray-950 dark:text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  {/* Animated word reveal */}
                  {["Your", "Ultimate", "Detty", "December", "Guide"].map((word, index) => (
                    <motion.span
                      key={word}
                      className={`inline-block mr-4 ${word === "December" ? "text-primary font-extrabold" : ""} hover:text-primary transition-colors duration-200`}
                      initial={{ opacity: 0, y: 50, rotateX: -90 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: 0.3 + index * 0.1,
                        ease: "easeOut",
                      }}
                      whileHover={{
                        scale: 1.05,
                        transition: { duration: 0.2 }
                      }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.span>
                <motion.span 
                  className="block text-gray-900 dark:text-gray-50 text-2xl md:text-3xl lg:text-4xl mt-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 1.0 }}
                >
                  <motion.span
                    className="inline-block dark:hidden"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{
                      background: "linear-gradient(90deg, #111827, #1f2937, #111827)",
                      backgroundSize: "200% 100%",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      color: "#1f2937", // Fallback color for better contrast
                    }}
                  >
                    Book flights, stays, events & more
                  </motion.span>
                  <motion.span
                    className="hidden dark:inline-block"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{
                      background: "linear-gradient(90deg, #ffffff, #f3f4f6, #ffffff)",
                      backgroundSize: "200% 100%",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      color: "#f9fafb", // Fallback color for better contrast
                    }}
                  >
                    Book flights, stays, events & more
                  </motion.span>
                  <motion.span
                    className="inline-block ml-2"
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.5,
                    }}
                  >
                    🌍
                  </motion.span>
                </motion.span>
              </h1>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
              variants={fadeInUp}
            >
              <Link href="/events" prefetch={true}>
                <motion.div
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                >
                  <Button
                    size="lg"
                    className="w-full sm:w-auto min-w-[200px] bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 relative overflow-hidden group"
                  >
                    <motion.span 
                      className="inline-flex items-center relative z-10"
                      whileHover={{ x: 2 }}
                    >
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="mr-2 w-4 h-4" />
                      </motion.div>
                      Start Planning
                    </motion.span>
                    <motion.div
                      className="ml-2 w-5 h-5"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                    {/* Animated background effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-700 dark:from-gray-100 dark:to-gray-200"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "0%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/events" prefetch={true}>
                <motion.div
                  whileHover={{ 
                    scale: 1.05,
                    borderColor: "#6b7280",
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto min-w-[200px] group relative overflow-hidden border-2 hover:border-gray-400 dark:hover:border-gray-500"
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Calendar className="mr-2 w-4 h-4" />
                    </motion.div>
                    <span className="relative z-10">Browse Events</span>
                    {/* Multiple animated shine effects */}
                    <motion.span 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-gray-50/0 via-gray-50/10 to-gray-50/0 dark:from-white/0 dark:via-white/5 dark:to-white/0"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div className="pt-6" variants={fadeInUp}>
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
                <div className="flex items-center gap-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                  ))}
                  <span className="ml-1 text-sm text-gray-700 dark:text-gray-300">4.9/5</span>
                </div>
                <div className="h-4 w-px bg-gray-300 dark:bg-gray-700"></div>
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <Users className="w-4 h-4 text-gray-800 dark:text-gray-200" />
                  <span>50K+ Travelers</span>
                </div>
                <div className="h-4 w-px bg-gray-300 dark:bg-gray-700"></div>
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <CheckCircle className="w-4 h-4 text-gray-800 dark:text-gray-200" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scrolling Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center group cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          onClick={() => {
            smoothScrollTo('#stats', { duration: 600, offset: 80 });
          }}
        >
          <span className="text-sm text-gray-700 dark:text-gray-300 mb-2 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Scroll to explore</span>
          <div className="w-8 h-12 border-2 border-gray-500 dark:border-gray-500 rounded-full flex justify-center p-1 group-hover:border-gray-700 dark:group-hover:border-gray-300 transition-colors">
            <motion.div
              className="w-1 h-3 bg-gray-600 dark:bg-gray-300 rounded-full"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 bg-gray-50 dark:bg-slate-900 relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300"
                whileHover={{ y: -2 }}
              >
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.number}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-slate-900 relative">

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <motion.h2
              className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Your Complete Detty December Experience
            </motion.h2>
            <motion.p
              className="text-lg text-gray-600 dark:text-gray-400"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Everything you need for an unforgettable holiday season in Africa, all in one place
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="group relative bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 overflow-hidden hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -2 }}
              >
                <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{feature.description}</p>
                  <Link
                    href={feature.href}
                    prefetch={true}
                    className="inline-flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white group-hover:translate-x-1 transition-transform"
                  >
                    Learn more
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50 dark:bg-slate-900 relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <motion.h2
              className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              How It Works
            </motion.h2>
            <motion.p
              className="text-lg text-gray-600 dark:text-gray-400"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Get started in just a few simple steps
            </motion.p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gray-300 dark:bg-gray-600"></div>

            {/* Steps */}
            <div className="space-y-12 md:space-y-24">
              {[
                {
                  step: "01",
                  title: "Create Your Account",
                  description: "Sign up in seconds and set up your travel preferences to get personalized recommendations.",
                  icon: <Users className="w-6 h-6 text-white" />,
                  direction: "left"
                },
                {
                  step: "02",
                  title: "Browse & Book",
                  description: "Explore curated flights, accommodations, and events. Book everything in one place.",
                  icon: <Calendar className="w-6 h-6 text-white" />,
                  direction: "right"
                },
                {
                  step: "03",
                  title: "Plan Your Itinerary",
                  description: "Use our trip planner to organize your schedule and get the most out of your trip.",
                  icon: <MapPin className="w-6 h-6 text-white" />,
                  direction: "left"
                },
                {
                  step: "04",
                  title: "Enjoy Your Trip",
                  description: "Travel with confidence using our safety features and 24/7 support.",
                  icon: <Heart className="w-6 h-6 text-white" />,
                  direction: "right"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className={`relative flex flex-col md:flex-row items-center gap-6 ${item.direction === 'right' ? 'md:flex-row-reverse' : ''
                    }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {/* Content Card */}
                  <div className="w-full md:w-5/12">
                    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-8 h-full">
                      <div className="flex items-center mb-4">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          {item.step}
                        </span>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white ml-3">{item.title}</h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                    </div>
                  </div>

                  {/* Center Circle */}
                  <div className="flex md:w-2/12 justify-center flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center text-white dark:text-gray-900 font-bold text-xl z-10 shadow-lg">
                      {item.step}
                    </div>
                  </div>

                  {/* Empty Space (for alignment) */}
                  <div className="hidden md:block md:w-5/12"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white dark:bg-slate-900 relative">

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <motion.h2
              className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              What Our Travelers Say
            </motion.h2>
            <motion.p
              className="text-lg text-gray-600 dark:text-gray-400"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Don&apos;t just take our word for it
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "Diasporan made my trip to Ghana unforgettable! From flights to events, everything was seamless.",
                author: "Ama K.",
                role: "Traveler from UK",
                rating: 5
              },
              {
                quote: "The safety features gave me peace of mind as a solo female traveler. Will definitely use again!",
                author: "Chioma N.",
                role: "Solo Traveler",
                rating: 5
              },
              {
                quote: "Best platform for finding authentic African experiences. The events they recommended were spot on!",
                author: "Kwame O.",
                role: "Frequent Traveler",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-8 hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -2 }}
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic mb-6">&quot;{testimonial.quote}&quot;</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center text-white dark:text-gray-900 font-bold">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.author}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="relative bg-gray-50 dark:bg-slate-900">

        <div className="container mx-auto px-6 py-24 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Ready for the Ultimate Detty December?
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of travelers experiencing the best of Africa this holiday season. Your adventure starts here.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/signup" prefetch={true} className="group">
                <Button
                  size="lg"
                  className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Get Started for Free
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/events" prefetch={true} className="group">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  <Calendar className="mr-2 w-4 h-4" />
                  Browse Events
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">No credit card required. Cancel anytime.</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center p-4">
      <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-slate-600 mb-2">
        {number}
      </div>
      <div className="text-gray-400">{label}</div>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  href,
  gradient,
}: {
  icon: any;
  title: string;
  description: string;
  href: string;
  gradient: string;
}) {
  return (
    <Link href={href}>
      <motion.div
        className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 overflow-hidden hover:border-gray-500/30 hover:shadow-lg hover:shadow-gray-500/10 transition-all duration-300 h-full"
        whileHover={{ y: -5 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 to-slate-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative z-10">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6`}>
            <Icon className="w-6 h-6 text-white" />
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-gradient-neutral transition-all">
            {title}
          </h3>

          {/* Description */}
          <p className="text-gray-400 text-base leading-relaxed group-hover:text-gray-300 transition-colors">
            {description}
          </p>

          {/* Arrow Icon */}
          <motion.div
            className="mt-6 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
            initial={{ x: -10 }}
            whileHover={{ x: 0 }}
          >
            <ArrowRight className="w-6 h-6" />
          </motion.div>
        </div>
      </motion.div>
    </Link>
  );
}
