import { useEffect, useState } from 'react'
import { useInView } from 'framer-motion'
import { RefObject } from 'react'

/**
 * Hook to detect if user prefers reduced motion
 * Requirements: 4.4 - Respect prefers-reduced-motion settings
 */
export const usePrefersReducedMotion = (): boolean => {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

    useEffect(() => {
        if (typeof window === 'undefined') return

        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
        setPrefersReducedMotion(mediaQuery.matches)

        const handleChange = (event: MediaQueryListEvent) => {
            setPrefersReducedMotion(event.matches)
        }

        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [])

    return prefersReducedMotion
}

/**
 * Hook for scroll-triggered animations with stagger
 * Requirements: 4.2 - Scroll-triggered animations with stagger
 */
export const useScrollAnimation = (
    ref: RefObject<Element>,
    options?: {
        once?: boolean
        amount?: number
    }
) => {
    const isInView = useInView(ref, {
        once: options?.once ?? true,
        amount: options?.amount ?? 0.3
    })

    const prefersReducedMotion = usePrefersReducedMotion()

    return {
        isInView,
        shouldAnimate: isInView && !prefersReducedMotion,
        controls: isInView ? 'visible' : 'hidden'
    }
}

/**
 * Hook to measure animation performance (FPS)
 * Requirements: 4.5 - Optimize animations for 60fps performance
 */
export const useAnimationPerformance = () => {
    const [fps, setFps] = useState(60)
    const [isOptimal, setIsOptimal] = useState(true)

    useEffect(() => {
        if (typeof window === 'undefined') return

        let frameCount = 0
        let lastTime = performance.now()
        let animationFrameId: number

        const measureFPS = (currentTime: number) => {
            frameCount++

            if (currentTime >= lastTime + 1000) {
                const currentFps = Math.round((frameCount * 1000) / (currentTime - lastTime))
                setFps(currentFps)
                setIsOptimal(currentFps >= 55) // Allow small margin below 60fps
                frameCount = 0
                lastTime = currentTime
            }

            animationFrameId = requestAnimationFrame(measureFPS)
        }

        animationFrameId = requestAnimationFrame(measureFPS)

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId)
            }
        }
    }, [])

    return { fps, isOptimal }
}

/**
 * Hook for staggered children animations
 * Requirements: 4.2 - Stagger animations
 */
export const useStaggerAnimation = (
    itemCount: number,
    baseDelay: number = 0.1
) => {
    const getDelay = (index: number) => index * baseDelay

    return {
        getDelay,
        totalDuration: itemCount * baseDelay
    }
}

/**
 * Hook to get animation configuration based on reduced motion
 * Requirements: 4.4 - Respect prefers-reduced-motion
 */
export const useAnimationConfig = () => {
    const prefersReducedMotion = usePrefersReducedMotion()

    return {
        duration: prefersReducedMotion ? 0 : 300,
        ease: prefersReducedMotion ? 'linear' : [0.22, 1, 0.36, 1],
        shouldAnimate: !prefersReducedMotion
    }
}

/**
 * Hook for micro-interactions with immediate feedback
 * Requirements: 4.3 - Immediate micro-interaction feedback
 */
export const useMicroInteraction = () => {
    const prefersReducedMotion = usePrefersReducedMotion()

    return {
        duration: prefersReducedMotion ? 0 : 150, // 150ms for immediate feel
        ease: [0.4, 0, 0.2, 1], // Snappy easing
        shouldAnimate: !prefersReducedMotion
    }
}

/**
 * Hook for page transitions with timing constraints
 * Requirements: 4.1 - Page transitions 200-400ms
 */
export const usePageTransition = () => {
    const prefersReducedMotion = usePrefersReducedMotion()

    return {
        duration: prefersReducedMotion ? 0 : 300, // 300ms within 200-400ms range
        ease: [0.22, 1, 0.36, 1],
        shouldAnimate: !prefersReducedMotion
    }
}
