import { Variants } from "framer-motion"
import React from "react"

// Detect prefers-reduced-motion
export const prefersReducedMotion = (): boolean => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Hook to listen for reduced motion preference changes
export const usePrefersReducedMotion = (): boolean => {
    const [reducedMotion, setReducedMotion] = React.useState(() => {
        if (typeof window === 'undefined') return false
        return prefersReducedMotion()
    })
    
    React.useEffect(() => {
        if (typeof window === 'undefined') return
        
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
        const handleChange = () => setReducedMotion(mediaQuery.matches)
        
        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [])
    
    return reducedMotion
}

// Animation duration constraints (Requirements 4.1)
export const durations = {
    instant: 0,
    fast: 150,        // < 200ms for quick feedback
    normal: 300,      // Standard transitions
    pageTransition: 300, // 200-400ms for page transitions
    slow: 500,        // Longer animations
} as const

// Premium easing curves
export const easings = {
    smooth: [0.22, 1, 0.36, 1] as const,
    bounce: [0.68, -0.55, 0.265, 1.55] as const,
    elastic: [0.175, 0.885, 0.32, 1.275] as const,
    snappy: [0.4, 0, 0.2, 1] as const,
    spring: [0.22, 1, 0.36, 1] as const,
}

// Utility to get animation config based on reduced motion preference
export const getAnimationConfig = (reducedMotion: boolean) => ({
    duration: reducedMotion ? 0 : durations.normal,
    ease: reducedMotion ? 'linear' : easings.smooth,
})

// Micro-interaction timing (< 16ms for immediate feedback - Requirements 4.3)
export const microInteraction = {
    duration: 0.15, // 150ms feels immediate
    ease: easings.snappy,
}

// Create reduced motion variant
export const createReducedMotionVariant = (variant: Variants): Variants => {
    const reduced = prefersReducedMotion()
    if (!reduced) return variant
    
    // Return instant transitions for reduced motion
    return Object.keys(variant).reduce((acc, key) => {
        acc[key] = {
            ...variant[key],
            transition: { duration: 0 }
        }
        return acc
    }, {} as Variants)
}

// Fade in from bottom
export const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: easings.smooth }
    }
}

// Fade in with scale
export const fadeInScale: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5, ease: easings.smooth }
    }
}

// Fade in with scale and blur
export const fadeInScaleBlur: Variants = {
    hidden: { opacity: 0, scale: 0.9, filter: "blur(10px)" },
    visible: {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        transition: { duration: 0.7, ease: easings.smooth }
    }
}

// Stagger children
export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
}

// Fast stagger for quick reveals
export const staggerFast: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1
        }
    }
}

// Slide in from left
export const slideInLeft: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: easings.smooth }
    }
}

// Slide in from right
export const slideInRight: Variants = {
    hidden: { opacity: 0, x: 30 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: easings.smooth }
    }
}

// Slide in from top
export const slideInTop: Variants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: easings.smooth }
    }
}

// Parallax effect (use with scroll)
export const parallax = {
    initial: { y: 0 },
    animate: (custom: number = 50) => ({
        y: custom,
        transition: { duration: 0.8, ease: easings.smooth }
    })
}

// Reveal with clip path
export const revealClip: Variants = {
    hidden: { clipPath: "inset(0 100% 0 0)" },
    visible: {
        clipPath: "inset(0 0% 0 0)",
        transition: { duration: 0.8, ease: easings.smooth }
    }
}

// Text reveal (for splitting text)
export const textReveal: Variants = {
    hidden: { opacity: 0, y: 20, rotateX: -90 },
    visible: {
        opacity: 1,
        y: 0,
        rotateX: 0,
        transition: { duration: 0.5, ease: easings.smooth }
    }
}

// Rotate and fade in
export const rotateIn: Variants = {
    hidden: { opacity: 0, rotate: -10, scale: 0.9 },
    visible: {
        opacity: 1,
        rotate: 0,
        scale: 1,
        transition: { duration: 0.6, ease: easings.smooth }
    }
}

// Bounce in
export const bounceIn: Variants = {
    hidden: { opacity: 0, scale: 0.3 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.6, ease: easings.bounce }
    }
}

// Page transition
export const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: easings.smooth }
}

// Hover scale
export const hoverScale = {
    rest: { scale: 1 },
    hover: {
        scale: 1.05,
        transition: { duration: 0.3, ease: easings.smooth }
    }
}

// Hover lift (y-axis movement)
export const hoverLift = {
    rest: { y: 0 },
    hover: {
        y: -8,
        transition: { duration: 0.3, ease: easings.smooth }
    }
}

// Glow effect on hover
export const glowHover = {
    rest: {
        boxShadow: "0 0 0px rgba(168, 85, 247, 0)"
    },
    hover: {
        boxShadow: "0 0 30px rgba(168, 85, 247, 0.4)",
        transition: { duration: 0.3 }
    }
}

// Magnetic hover effect (for buttons)
export const magneticHover = {
    rest: { x: 0, y: 0 },
    hover: {
        scale: 1.05,
        transition: { duration: 0.3, ease: easings.smooth }
    }
}

// Shimmer animation
export const shimmer = {
    initial: { backgroundPosition: "-200% 0" },
    animate: {
        backgroundPosition: "200% 0",
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "linear"
        }
    }
}

// Pulse animation
export const pulse = {
    animate: {
        scale: [1, 1.05, 1],
        opacity: [1, 0.8, 1],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: easings.smooth
        }
    }
}

// Float animation
export const float = {
    animate: {
        y: [0, -10, 0],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: easings.smooth
        }
    }
}

// Spin animation
export const spin = {
    animate: {
        rotate: 360,
        transition: {
            duration: 20,
            repeat: Infinity,
            ease: "linear"
        }
    }
}

// ============================================
// SCROLL-TRIGGERED ANIMATIONS (Requirements 4.2)
// ============================================

// Scroll reveal with stagger
export const scrollReveal: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: easings.smooth
        }
    }
}

// Scroll stagger container - reveals children with stagger
export const scrollStaggerContainer: Variants = {
    hidden: { opacity: 1 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1, // 100ms stagger between children
            delayChildren: 0.2
        }
    }
}

// Fast scroll stagger for quick reveals
export const scrollStaggerFast: Variants = {
    hidden: { opacity: 1 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05, // 50ms stagger
            delayChildren: 0.1
        }
    }
}

// Slow scroll stagger for dramatic effect
export const scrollStaggerSlow: Variants = {
    hidden: { opacity: 1 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15, // 150ms stagger
            delayChildren: 0.3
        }
    }
}

// Scroll reveal from left
export const scrollRevealLeft: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: easings.smooth
        }
    }
}

// Scroll reveal from right
export const scrollRevealRight: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: easings.smooth
        }
    }
}

// Scroll reveal with scale
export const scrollRevealScale: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.6,
            ease: easings.smooth
        }
    }
}

// ============================================
// MICRO-INTERACTIONS (Requirements 4.3)
// ============================================

// Button press micro-interaction
export const buttonPress = {
    rest: { scale: 1 },
    press: {
        scale: 0.95,
        transition: microInteraction
    }
}

// Button hover micro-interaction
export const buttonHover = {
    rest: { scale: 1, boxShadow: "0 0 0px rgba(168, 85, 247, 0)" },
    hover: {
        scale: 1.02,
        boxShadow: "0 0 20px rgba(168, 85, 247, 0.3)",
        transition: microInteraction
    }
}

// Input focus micro-interaction
export const inputFocus = {
    rest: { 
        scale: 1,
        borderColor: "rgba(156, 163, 175, 0.5)"
    },
    focus: {
        scale: 1.01,
        borderColor: "rgba(168, 85, 247, 1)",
        transition: microInteraction
    }
}

// Card hover micro-interaction
export const cardHover = {
    rest: { 
        y: 0,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
    },
    hover: {
        y: -4,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
        transition: microInteraction
    }
}

// Toggle switch micro-interaction
export const toggleSwitch = {
    off: { x: 0 },
    on: {
        x: 20,
        transition: microInteraction
    }
}

// Checkbox check micro-interaction
export const checkboxCheck = {
    unchecked: { scale: 0, opacity: 0 },
    checked: {
        scale: 1,
        opacity: 1,
        transition: microInteraction
    }
}

// Icon spin micro-interaction (for loading states)
export const iconSpin = {
    animate: {
        rotate: 360,
        transition: {
            duration: 1,
            repeat: Infinity,
            ease: "linear"
        }
    }
}

// Success checkmark animation
export const successCheck = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
        pathLength: 1,
        opacity: 1,
        transition: {
            pathLength: { duration: 0.3, ease: easings.smooth },
            opacity: { duration: 0.1 }
        }
    }
}

// ============================================
// PAGE TRANSITIONS (Requirements 4.1)
// ============================================

// Page transition with timing constraints (200-400ms)
export const pageTransitionVariants: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
        opacity: 1, 
        y: 0,
        transition: {
            duration: durations.pageTransition / 1000, // 300ms
            ease: easings.smooth
        }
    },
    exit: { 
        opacity: 0, 
        y: -20,
        transition: {
            duration: durations.pageTransition / 1000, // 300ms
            ease: easings.smooth
        }
    }
}

// Fade page transition
export const fadePageTransition: Variants = {
    initial: { opacity: 0 },
    animate: { 
        opacity: 1,
        transition: {
            duration: durations.pageTransition / 1000,
            ease: easings.smooth
        }
    },
    exit: { 
        opacity: 0,
        transition: {
            duration: durations.pageTransition / 1000,
            ease: easings.smooth
        }
    }
}

// Slide page transition
export const slidePageTransition: Variants = {
    initial: { x: 100, opacity: 0 },
    animate: { 
        x: 0,
        opacity: 1,
        transition: {
            duration: durations.pageTransition / 1000,
            ease: easings.smooth
        }
    },
    exit: { 
        x: -100,
        opacity: 0,
        transition: {
            duration: durations.pageTransition / 1000,
            ease: easings.smooth
        }
    }
}

// ============================================
// PERFORMANCE OPTIMIZED ANIMATIONS (Requirements 4.5)
// ============================================

// Use transform and opacity for 60fps performance
// Avoid animating: width, height, top, left, margin, padding

// Optimized fade (opacity only)
export const optimizedFade: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.3,
            ease: easings.smooth
        }
    }
}

// Optimized slide (transform only)
export const optimizedSlide: Variants = {
    hidden: { opacity: 0, transform: "translateY(20px)" },
    visible: {
        opacity: 1,
        transform: "translateY(0px)",
        transition: {
            duration: 0.3,
            ease: easings.smooth
        }
    }
}

// Optimized scale (transform only)
export const optimizedScale: Variants = {
    hidden: { opacity: 0, transform: "scale(0.95)" },
    visible: {
        opacity: 1,
        transform: "scale(1)",
        transition: {
            duration: 0.3,
            ease: easings.smooth
        }
    }
}

// Will-change optimization for complex animations
export const willChangeTransform = {
    willChange: "transform"
}

export const willChangeOpacity = {
    willChange: "opacity"
}

export const willChangeTransformOpacity = {
    willChange: "transform, opacity"
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Get stagger delay for index
export const getStaggerDelay = (index: number, baseDelay: number = 0.1): number => {
    return index * baseDelay
}

// Create custom stagger container
export const createStaggerContainer = (
    staggerDelay: number = 0.1,
    delayChildren: number = 0
): Variants => ({
    hidden: { opacity: 1 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: staggerDelay,
            delayChildren
        }
    }
})

// Apply reduced motion to any variant
export const withReducedMotion = (variant: Variants): Variants => {
    if (prefersReducedMotion()) {
        return Object.keys(variant).reduce((acc, key) => {
            const state = variant[key]
            acc[key] = {
                ...state,
                transition: { duration: 0 }
            }
            return acc
        }, {} as Variants)
    }
    return variant
}

// Get animation props based on reduced motion
export const getAnimationProps = (reducedMotion: boolean) => {
    if (reducedMotion) {
        return {
            initial: false,
            animate: false,
            exit: false,
            transition: { duration: 0 }
        }
    }
    return {}
}
