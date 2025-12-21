'use client'

import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import {
    fadeInUp,
    scrollStaggerContainer,
    scrollReveal,
    buttonHover,
    buttonPress,
    cardHover,
    inputFocus,
    pageTransitionVariants,
    successCheck,
    durations,
    easings,
} from '@/lib/animations'
import {
    usePrefersReducedMotion,
    useScrollAnimation,
    useAnimationPerformance,
    useStaggerAnimation,
} from '@/lib/useAnimations'

export default function AnimationDemo() {
    const reducedMotion = usePrefersReducedMotion()
    const { fps, isOptimal } = useAnimationPerformance()
    const scrollRef = useRef(null)
    const { controls } = useScrollAnimation(scrollRef)
    const { getDelay } = useStaggerAnimation(6, 0.1)
    const [showSuccess, setShowSuccess] = useState(false)

    const demoCards = [
        { id: 1, title: 'Card 1', color: 'from-purple-500 to-pink-500' },
        { id: 2, title: 'Card 2', color: 'from-blue-500 to-cyan-500' },
        { id: 3, title: 'Card 3', color: 'from-green-500 to-emerald-500' },
        { id: 4, title: 'Card 4', color: 'from-orange-500 to-red-500' },
        { id: 5, title: 'Card 5', color: 'from-indigo-500 to-purple-500' },
        { id: 6, title: 'Card 6', color: 'from-pink-500 to-rose-500' },
    ]

    return (
        <motion.div
            variants={pageTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen bg-black text-white py-20 px-4"
        >
            <div className="max-w-6xl mx-auto space-y-20">
                {/* Header */}
                <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="text-center">
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Enhanced Animation System
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Demonstrating Requirements 4.1-4.5: Timing, Stagger, Micro-interactions, Reduced Motion & Performance
                    </p>
                </motion.div>

                {/* Performance Monitor */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6"
                >
                    <h2 className="text-2xl font-bold mb-4">Performance Monitor</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-800/50 rounded-lg p-4">
                            <div className="text-sm text-gray-400 mb-1">Current FPS</div>
                            <div className={`text-3xl font-bold ${isOptimal ? 'text-green-400' : 'text-gray-400'}`}>
                                {fps}
                            </div>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-4">
                            <div className="text-sm text-gray-400 mb-1">Performance Status</div>
                            <div className={`text-xl font-bold ${isOptimal ? 'text-green-400' : 'text-gray-400'}`}>
                                {isOptimal ? '✓ Optimal' : '⚠ Suboptimal'}
                            </div>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-4">
                            <div className="text-sm text-gray-400 mb-1">Reduced Motion</div>
                            <div className={`text-xl font-bold ${reducedMotion ? 'text-yellow-400' : 'text-green-400'}`}>
                                {reducedMotion ? '✓ Enabled' : '✗ Disabled'}
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-4">
                        Requirement 4.5: Animations maintain 60fps. Requirement 4.4: Respects prefers-reduced-motion.
                    </p>
                </motion.div>

                {/* Timing Constraints Demo */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6"
                >
                    <h2 className="text-2xl font-bold mb-4">Page Transition Timing (Requirement 4.1)</h2>
                    <p className="text-gray-400 mb-4">
                        Page transitions use {durations.pageTransition}ms (within 200-400ms constraint)
                    </p>
                    <div className="flex gap-4">
                        <div className="bg-gray-800/50 rounded-lg p-4 flex-1">
                            <div className="text-sm text-gray-400">Duration</div>
                            <div className="text-2xl font-bold text-purple-400">{durations.pageTransition}ms</div>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-4 flex-1">
                            <div className="text-sm text-gray-400">Easing</div>
                            <div className="text-sm font-mono text-purple-400">cubic-bezier({easings.smooth.join(', ')})</div>
                        </div>
                    </div>
                </motion.div>

                {/* Micro-interactions Demo */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6"
                >
                    <h2 className="text-2xl font-bold mb-4">Micro-interactions (Requirement 4.3)</h2>
                    <p className="text-gray-400 mb-6">
                        Immediate feedback for all actions (150ms for perceived immediacy)
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Button Hover */}
                        <motion.button
                            variants={buttonHover}
                            initial="rest"
                            whileHover="hover"
                            whileTap="press"
                            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold"
                            onClick={() => setShowSuccess(!showSuccess)}
                        >
                            Hover & Click Me
                        </motion.button>

                        {/* Card Hover */}
                        <motion.div
                            variants={cardHover}
                            initial="rest"
                            whileHover="hover"
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center cursor-pointer"
                        >
                            Hover Card
                        </motion.div>

                        {/* Success Animation */}
                        <div className="bg-gray-800/50 rounded-lg px-6 py-3 flex items-center justify-center">
                            {showSuccess && (
                                <svg width="40" height="40" viewBox="0 0 40 40">
                                    <motion.circle
                                        cx="20"
                                        cy="20"
                                        r="18"
                                        stroke="#10b981"
                                        strokeWidth="2"
                                        fill="none"
                                        variants={successCheck}
                                        initial="hidden"
                                        animate="visible"
                                    />
                                    <motion.path
                                        d="M12 20 L18 26 L28 14"
                                        stroke="#10b981"
                                        strokeWidth="2"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        variants={successCheck}
                                        initial="hidden"
                                        animate="visible"
                                    />
                                </svg>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Scroll-triggered Stagger Demo */}
                <motion.div
                    ref={scrollRef}
                    variants={scrollStaggerContainer}
                    initial="hidden"
                    animate={controls}
                    className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6"
                >
                    <h2 className="text-2xl font-bold mb-4">Scroll-triggered Stagger (Requirement 4.2)</h2>
                    <p className="text-gray-400 mb-6">
                        Elements reveal with 100ms stagger as you scroll
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {demoCards.map((card, index) => (
                            <motion.div
                                key={card.id}
                                variants={scrollReveal}
                                className={`bg-gradient-to-br ${card.color} rounded-lg p-6 text-white`}
                            >
                                <div className="text-sm opacity-75 mb-2">Delay: {getDelay(index)}s</div>
                                <div className="text-2xl font-bold">{card.title}</div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Input Focus Demo */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6"
                >
                    <h2 className="text-2xl font-bold mb-4">Input Focus Micro-interaction</h2>
                    <p className="text-gray-400 mb-6">
                        Focus on the input to see immediate feedback
                    </p>
                    <motion.input
                        variants={inputFocus}
                        initial="rest"
                        whileFocus="focus"
                        type="text"
                        placeholder="Focus me..."
                        className="w-full bg-gray-800/50 border-2 border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none"
                    />
                </motion.div>

                {/* Loading Spinner */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6"
                >
                    <h2 className="text-2xl font-bold mb-4">Loading Animation</h2>
                    <p className="text-gray-400 mb-6">
                        Optimized for 60fps using transform only
                    </p>
                    <div className="flex justify-center">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
                        />
                    </div>
                </motion.div>

                {/* Duration Reference */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6"
                >
                    <h2 className="text-2xl font-bold mb-4">Animation Duration Reference</h2>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="bg-gray-800/50 rounded-lg p-4">
                            <div className="text-sm text-gray-400">Instant</div>
                            <div className="text-xl font-bold text-purple-400">{durations.instant}ms</div>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-4">
                            <div className="text-sm text-gray-400">Fast</div>
                            <div className="text-xl font-bold text-purple-400">{durations.fast}ms</div>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-4">
                            <div className="text-sm text-gray-400">Normal</div>
                            <div className="text-xl font-bold text-purple-400">{durations.normal}ms</div>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-4">
                            <div className="text-sm text-gray-400">Page</div>
                            <div className="text-xl font-bold text-purple-400">{durations.pageTransition}ms</div>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-4">
                            <div className="text-sm text-gray-400">Slow</div>
                            <div className="text-xl font-bold text-purple-400">{durations.slow}ms</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}
