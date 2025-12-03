import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, Star, Users, HeadphonesIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/Button";

const Hero = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);

  // Detect device capabilities on mount with error handling
  useEffect(() => {
    console.debug('[Hero] Initializing hero section');
    
    const checkDevice = () => {
      try {
        const mobile = window.innerWidth < 768;
        setIsMobile(mobile);
        console.debug('[Hero] Device type:', mobile ? 'mobile' : 'desktop');

        // Detect low-end devices based on hardware concurrency and memory
        try {
          const hardwareConcurrency = navigator.hardwareConcurrency || 2;
          const deviceMemory = (navigator as any).deviceMemory || 4;
          const isLowEnd = hardwareConcurrency <= 2 || deviceMemory <= 2;
          setIsLowEndDevice(isLowEnd);
          console.debug('[Hero] Device capabilities:', {
            hardwareConcurrency,
            deviceMemory,
            isLowEnd
          });
        } catch (error) {
          console.warn('[Hero] Failed to detect device capabilities:', error);
          console.debug('[Hero] Assuming standard device capabilities');
          setIsLowEndDevice(false);
        }


      } catch (error) {
        console.error('[Hero] Error in device detection:', error);
        // Fallback to safe defaults
        setIsMobile(false);
        setIsLowEndDevice(false);
      }
    };

    try {
      checkDevice();
      window.addEventListener('resize', checkDevice);
      return () => window.removeEventListener('resize', checkDevice);
    } catch (error) {
      console.error('[Hero] Failed to set up device detection:', error);
    }
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  // Dynamically adjust particle count based on device capabilities - Reduced for performance
  const particleCount = isLowEndDevice ? 3 : isMobile ? 5 : 8;

  // Inline heading font size so tests (which don't process Tailwind CSS) can validate responsive typography
  const getHeadingFontSize = () => {
    if (typeof window === "undefined") return undefined;
    const width = window.innerWidth;
    if (width < 768) return 32; // mobile
    if (width < 1280) return 48; // tablet
    return 56; // desktop and above
  };

  const headingFontSize = getHeadingFontSize();
  
  // Generate floating particles with varied properties
  const particles = React.useMemo(() => {
    try {
      console.debug('[Hero] Generating', particleCount, 'particles');
      return Array.from({ length: particleCount }).map((_, i) => ({
        id: i,
        size: Math.random() * 30 + 10,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 4 + Math.random() * 6,
        color: i % 3 === 0 ? 'bg-purple-500/20' : i % 3 === 1 ? 'bg-pink-500/20' : 'bg-white/10',
        blur: i % 2 === 0 ? 'backdrop-blur-sm' : 'backdrop-blur-md',
      }));
    } catch (error) {
      console.error('[Hero] Failed to generate particles:', error);
      console.debug('[Hero] Returning empty particle array');
      return [];
    }
  }, [particleCount]);

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Hero section"
      role="banner"
    >
      {/* Gradient background - Theme Aware - Video removed for performance */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-200/30 via-white to-pink-200/30 dark:from-purple-900/40 dark:via-black dark:to-pink-900/40" />
      </div>

      {/* Overlay Gradients - Multiple layers for depth - Theme Aware */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/90 to-white/95 dark:from-black/80 dark:via-black/60 dark:to-black/90" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-pink-500/10 dark:from-purple-900/20 dark:via-transparent dark:to-pink-900/20" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-radial opacity-30 dark:opacity-50" aria-hidden="true" />

      {/* Animated Floating Particles - Optimized for performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className={`absolute rounded-full ${particle.color} ${particle.blur}`}
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              filter: 'blur(1px)',
              willChange: 'transform, opacity',
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "linear",
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div
        className="relative z-10 container mx-auto px-6 max-w-7xl"
        style={{ paddingLeft: 24, paddingRight: 24 }}
      >
        <motion.div
          className="text-center space-y-8"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Announcement Badge - Theme Aware */}
          <motion.div className="flex justify-center" variants={fadeInUp}>
            <motion.div 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-strong border border-white/30 dark:border-white/30 border-border/50 shadow-glow-purple theme-transition"
              style={{ willChange: 'transform' }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              role="status"
              aria-label="Announcement: Your Ultimate Detty December Guide"
            >
              <motion.span
                animate={!isLowEndDevice ? { rotate: [0, 14, -8, 14, -4, 10, 0] } : {}}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="text-lg"
                aria-hidden="true"
              >
                🎉
              </motion.span>
              <span className="text-sm font-semibold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 dark:from-purple-300 dark:via-pink-300 dark:to-purple-300 bg-clip-text text-transparent animate-gradient-x">
                Your Ultimate Detty December Guide
              </span>
              <motion.div
                className="w-2 h-2 rounded-full bg-green-400"
                style={{ willChange: 'transform, opacity' }}
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                aria-hidden="true"
              />
            </motion.div>
          </motion.div>

          {/* Main Heading with Enhanced Typography - Theme Aware */}
          <motion.div variants={fadeInUp} className="space-y-4">
            <h1
              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight tracking-tight text-center"
              style={headingFontSize ? { fontSize: `${headingFontSize}px` } : undefined}
            >
              <motion.span 
                className="block text-gradient-rainbow bg-clip-text text-transparent animate-gradient-x text-glow"
                style={{ willChange: 'opacity, transform' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Your Ultimate
              </motion.span>
              <motion.span 
                className="block text-gradient-rainbow bg-clip-text text-transparent animate-gradient-x"
                style={{ willChange: 'opacity, transform' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Detty December Guide
              </motion.span>
              <motion.span 
                className="block text-foreground/90 dark:text-white/90 text-2xl md:text-3xl lg:text-4xl mt-4 font-normal theme-transition"
                style={{ willChange: 'opacity' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Book flights, stays, events & more{" "}
                <motion.span
                  animate={!isLowEndDevice ? { rotate: [0, 14, -8, 14, -4, 10, 0] } : {}}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                  className="inline-block"
                  aria-hidden="true"
                >
                  🌍
                </motion.span>
              </motion.span>
            </h1>
          </motion.div>

          {/* Dual CTA Buttons with Hover Animations - Theme Aware */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            variants={fadeInUp}
          >
            <motion.div
              style={{ willChange: 'transform' }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link
                href="/events"
                style={{ minWidth: 44, minHeight: 44, display: 'inline-block' }}
              >
                <Button
                  size="lg"
                  className="group relative overflow-hidden px-8 py-6 text-lg font-semibold shadow-glow-purple hover:shadow-glow-pink theme-transition"
                  variant="primary"
                >
                  <span className="flex items-center">
                    Explore Events
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Button>
              </Link>
            </motion.div>

            <motion.div
              style={{ willChange: 'transform' }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link
                href="/how-it-works"
                style={{ minWidth: 44, minHeight: 44, display: 'inline-block' }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="group relative overflow-hidden px-8 py-6 text-lg font-semibold border-white/30 dark:border-white/30 hover:bg-white/10 dark:hover:bg-white/10 hover:border-white/50 dark:hover:border-white/50 theme-transition"
                >
                  <span className="flex items-center">
                    <Play className="mr-2 h-5 w-5" />
                    Watch Video
                  </span>
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Trust Badges and Social Proof - Theme Aware */}
          <motion.div
            className="pt-8 flex flex-wrap items-center justify-center gap-6 md:gap-8 opacity-90"
            variants={fadeInUp}
            role="group"
            aria-label="Trust indicators and social proof"
          >
            {/* User Count Badge */}
            <motion.div 
              className="flex items-center gap-2 glass-light px-4 py-2 rounded-full theme-transition"
              style={{ willChange: 'transform' }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              role="status"
              aria-label="Over 10,000 travelers have used our service"
            >
              <div className="flex -space-x-2" aria-hidden="true">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white/80 dark:border-white/80 bg-gradient-to-br from-purple-500 to-pink-500"
                    style={{ zIndex: 4 - i, willChange: 'transform' }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.05, duration: 0.3 }}
                  />
                ))}
              </div>
              <Users className="w-4 h-4 text-foreground/70 dark:text-white/70" aria-hidden="true" />
              <span className="text-sm font-medium text-foreground/80 dark:text-white/80 theme-transition">
                10,000+ travelers
              </span>
            </motion.div>

            <div className="h-6 w-px bg-border/30 dark:bg-white/20 theme-transition" aria-hidden="true" />

            {/* Rating Badge */}
            <motion.div 
              className="flex items-center gap-2 glass-light px-4 py-2 rounded-full theme-transition"
              style={{ willChange: 'transform' }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              role="status"
              aria-label="5 out of 5 star rating"
            >
              <div className="flex" aria-hidden="true">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    style={{ willChange: 'transform' }}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.6 + i * 0.03, type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  </motion.div>
                ))}
              </div>
              <span className="text-sm font-medium text-foreground/80 dark:text-white/80 theme-transition">
                5.0 Rating
              </span>
            </motion.div>

            <div className="h-6 w-px bg-border/30 dark:bg-white/20 theme-transition hidden sm:block" aria-hidden="true" />

            {/* Support Badge */}
            <motion.div 
              className="flex items-center gap-2 glass-light px-4 py-2 rounded-full theme-transition"
              style={{ willChange: 'transform' }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              role="status"
              aria-label="24/7 customer support available"
            >
              <HeadphonesIcon className="w-4 h-4 text-green-400" aria-hidden="true" />
              <span className="text-sm font-medium text-foreground/80 dark:text-white/80 theme-transition">
                24/7 Support
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Animated Scroll Indicator - Theme Aware */}
      <motion.button
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center cursor-pointer bg-transparent border-none min-w-[44px] min-h-[44px] px-4 py-4"
        style={{ willChange: 'opacity, transform', minWidth: 44, minHeight: 44 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.4 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => {
          window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
        }}
        aria-label="Scroll down to explore more content"
        type="button"
      >
        <motion.span 
          className="text-sm text-foreground/60 dark:text-white/60 mb-2 font-medium theme-transition"
          style={{ willChange: 'opacity' }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Scroll to explore
        </motion.span>
        <div className="w-6 h-10 border-2 border-border/50 dark:border-white/30 rounded-full flex justify-center p-1 theme-transition">
          <motion.div
            className="w-1 h-2 bg-primary dark:bg-white/80 rounded-full theme-transition"
            style={{ willChange: 'transform' }}
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.button>
    </section>
  );
};

export default Hero;
