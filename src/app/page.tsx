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

const features = [
  {
    icon: Plane,
    title: "Flights",
    description: "Find the best flight deals to African destinations with our exclusive partner airlines.",
    href: "/flights",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Hotel,
    title: "Stays",
    description: "Discover handpicked accommodations from luxury resorts to cozy apartments.",
    href: "/stays",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Music,
    title: "Events",
    description: "Never miss out on the hottest parties, concerts, and cultural events.",
    href: "/events",
    gradient: "from-amber-500 to-red-500",
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
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Gradient Background - Video removed for performance */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-200/30 via-white to-pink-200/30 dark:from-purple-900/40 dark:via-black dark:to-pink-900/40" />
        </div>

        {/* Gradient Overlays - Theme Aware */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/90 to-white/95 dark:from-black/80 dark:via-black/60 dark:to-black/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-pink-500/10 dark:from-purple-900/20 dark:via-transparent dark:to-pink-900/20" />

        {/* Simplified Animated Elements - Reduced for performance */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating elements - reduced from 15 to 6 */}
          {[...Array(6)].map((_, i) => {
            const size = Math.random() * 10 + 5;
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            const color = `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 100}, 255, 0.5)`;
            const duration = Math.random() * 5 + 5;
            const delay = Math.random() * 3;
            
            return (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: size + 'px',
                  height: size + 'px',
                  left: `${left}%`,
                  top: `${top}%`,
                  backgroundColor: color,
                }}
                animate={{
                  y: [0, -15, 0],
                  opacity: [0.2, 0.6, 0.2],
                }}
                transition={{
                  duration,
                  repeat: Infinity,
                  ease: "linear",
                  delay,
                }}
              />
            );
          })}
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 max-w-7xl">
          <motion.div
            className="text-center space-y-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div className="flex justify-center" variants={fadeInUp}>
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-semibold">
                  Your Ultimate Detty December Guide
                </span>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.div variants={fadeInUp} className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight tracking-tight text-center">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400">
                  Your Ultimate Detty December Guide
                </span>
                <span className="block text-gray-700 dark:text-white/90 text-2xl md:text-3xl lg:text-4xl mt-4">
                  Book flights, stays, events & more 🌍
                </span>
              </h1>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
              variants={fadeInUp}
            >
              <Link href="/events">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    variant="shimmer"
                    className="w-full sm:w-auto min-w-[200px]"
                  >
                    <span className="inline-flex items-center">
                      <Sparkles className="mr-2 w-4 h-4 text-white/80" /> Start
                      Planning
                    </span>
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/events">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto min-w-[200px] group relative overflow-hidden"
                  >
                    <Calendar className="mr-2 w-4 h-4" />
                    <span className="relative z-10">Browse Events</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
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
                  <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">4.9/5</span>
                </div>
                <div className="h-4 w-px bg-gray-300 dark:bg-gray-700"></div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Users className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                  <span>50K+ Travelers</span>
                </div>
                <div className="h-4 w-px bg-gray-300 dark:bg-gray-700"></div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
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
            window.scrollTo({
              top: window.innerHeight,
              behavior: 'smooth'
            });
          }}
        >
          <span className="text-sm text-gray-600 dark:text-gray-400 mb-2 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Scroll to explore</span>
          <div className="w-8 h-12 border-2 border-gray-400 dark:border-gray-600 rounded-full flex justify-center p-1 group-hover:border-purple-500 transition-colors">
            <motion.div 
              className="w-1 h-3 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-black dark:to-gray-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          {[...Array(20)].map((_, i) => {
            const size = Math.random() * 300 + 50;
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            const color1 = Math.random() * 100 + 155;
            const color2 = Math.random() * 100 + 100;
            
            return (
              <div 
                key={i}
                className="absolute rounded-full"
                style={{
                  width: size + 'px',
                  height: size + 'px',
                  left: `${left}%`,
                  top: `${top}%`,
                  background: `radial-gradient(circle, rgba(${color1}, ${color2}, 255, 0.1) 0%, rgba(0,0,0,0) 70%)`,
                  transform: `translate(-50%, -50%)`,
                }}
              />
            );
          })}
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                className="bg-white/80 dark:bg-gradient-to-br dark:from-gray-900/50 dark:to-black/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-xl p-4 text-center hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">
                  {stat.number}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-1/3 -right-20 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <motion.h2 
              className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
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
                className="group relative bg-white/90 dark:bg-gradient-to-br dark:from-gray-800/50 dark:to-gray-900/70 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-2xl p-6 overflow-hidden hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{feature.description}</p>
                  <Link 
                    href={feature.href}
                    className="inline-flex items-center text-sm font-medium text-purple-400 hover:text-purple-300 group-hover:translate-x-1 transition-transform"
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
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-black relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <motion.h2 
              className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
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
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500/20 via-pink-500/20 to-transparent"></div>
            
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
                  className={`relative flex flex-col md:flex-row items-center gap-6 ${
                    item.direction === 'right' ? 'md:flex-row-reverse' : ''
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {/* Content Card */}
                  <div className="w-full md:w-5/12">
                    <div className="bg-white/90 dark:bg-gradient-to-br dark:from-gray-800/50 dark:to-gray-900/70 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-2xl p-8 h-full">
                      <div className="flex items-center mb-4">
                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                          {item.step}
                        </span>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white ml-3">{item.title}</h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                    </div>
                  </div>
                  
                  {/* Center Circle */}
                  <div className="flex md:w-2/12 justify-center flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-xl z-10 shadow-lg shadow-purple-500/30">
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
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/images/pattern.svg')] bg-repeat opacity-30"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <motion.h2 
              className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
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
                className="bg-white/90 dark:bg-gradient-to-br dark:from-gray-900/50 dark:to-black/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-2xl p-8 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic mb-6">&quot;{testimonial.quote}&quot;</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
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
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-pink-900/20 to-purple-900/30"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-1/3 -right-20 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="container mx-auto px-6 py-24 relative z-10">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Ready for the Ultimate Detty December?
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of travelers experiencing the best of Africa this holiday season. Your adventure starts here.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/signup" className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-200 group-hover:duration-200"></div>
                <Button 
                  size="lg" 
                  className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Get Started for Free
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/events" className="group">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="relative overflow-hidden border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/30 transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  <Calendar className="mr-2 w-4 h-4" />
                  <span className="relative z-10">Browse Events</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
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
      <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
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
        className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 overflow-hidden hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 h-full"
        whileHover={{ y: -5 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative z-10">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6`}>
            <Icon className="w-6 h-6 text-white" />
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-gradient-purple-pink transition-all">
            {title}
          </h3>

          {/* Description */}
          <p className="text-gray-400 text-base leading-relaxed group-hover:text-gray-300 transition-colors">
            {description}
          </p>

          {/* Arrow Icon */}
          <motion.div
            className="mt-6 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"
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
