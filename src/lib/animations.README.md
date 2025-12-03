# Animation System Documentation

## Overview

This animation system provides a comprehensive set of utilities, variants, and hooks for creating performant, accessible animations in the DettyConnect application. It fully implements Requirements 4.1-4.5 from the UI Enhancement specification.

## Key Features

### 1. Reduced Motion Support (Requirement 4.4)
The system automatically detects and respects the user's `prefers-reduced-motion` setting.

```typescript
import { usePrefersReducedMotion, withReducedMotion } from '@/lib/animations'

// In a component
const reducedMotion = usePrefersReducedMotion()

// Apply to variants
const safeVariant = withReducedMotion(fadeInUp)
```

### 2. Timing Constraints (Requirement 4.1)
All page transitions are constrained to 200-400ms for optimal UX.

```typescript
import { pageTransitionVariants, durations } from '@/lib/animations'

// Page transitions use 300ms (within 200-400ms range)
<motion.div variants={pageTransitionVariants} />
```

### 3. Scroll-Triggered Animations with Stagger (Requirement 4.2)
Reveal elements as they scroll into view with staggered timing.

```typescript
import { useScrollAnimation } from '@/lib/useAnimations'
import { scrollStaggerContainer, scrollReveal } from '@/lib/animations'

const MyComponent = () => {
    const ref = useRef(null)
    const { controls } = useScrollAnimation(ref)
    
    return (
        <motion.div
            ref={ref}
            variants={scrollStaggerContainer}
            initial="hidden"
            animate={controls}
        >
            {items.map((item, i) => (
                <motion.div key={i} variants={scrollReveal}>
                    {item}
                </motion.div>
            ))}
        </motion.div>
    )
}
```

### 4. Micro-Interactions (Requirement 4.3)
Immediate feedback for all user actions (< 16ms perceived, 150ms actual).

```typescript
import { buttonPress, buttonHover, cardHover } from '@/lib/animations'

<motion.button
    variants={buttonHover}
    initial="rest"
    whileHover="hover"
    whileTap="press"
>
    Click me
</motion.button>
```

### 5. Performance Optimization (Requirement 4.5)
All animations use GPU-accelerated properties (transform, opacity) for 60fps.

```typescript
import { optimizedFade, optimizedSlide, willChangeTransform } from '@/lib/animations'

// These variants only animate transform and opacity
<motion.div 
    variants={optimizedSlide}
    style={willChangeTransform}
/>
```

## Animation Variants

### Basic Animations
- `fadeInUp` - Fade in from bottom
- `fadeInScale` - Fade in with scale
- `fadeInScaleBlur` - Fade in with scale and blur
- `slideInLeft/Right/Top` - Slide in from direction

### Scroll Animations
- `scrollReveal` - Basic scroll reveal
- `scrollRevealLeft/Right` - Directional scroll reveals
- `scrollRevealScale` - Scroll reveal with scale
- `scrollStaggerContainer` - Container for staggered children
- `scrollStaggerFast/Slow` - Faster/slower stagger timing

### Micro-Interactions
- `buttonPress` - Button press feedback
- `buttonHover` - Button hover effect
- `inputFocus` - Input focus effect
- `cardHover` - Card hover elevation
- `toggleSwitch` - Toggle switch animation
- `checkboxCheck` - Checkbox check animation

### Page Transitions
- `pageTransitionVariants` - Standard page transition (300ms)
- `fadePageTransition` - Fade only transition
- `slidePageTransition` - Slide transition

### Performance Optimized
- `optimizedFade` - GPU-accelerated fade
- `optimizedSlide` - GPU-accelerated slide
- `optimizedScale` - GPU-accelerated scale

## Hooks

### `usePrefersReducedMotion()`
Detects if user prefers reduced motion.

```typescript
const reducedMotion = usePrefersReducedMotion()
```

### `useScrollAnimation(ref, options)`
Triggers animations when element scrolls into view.

```typescript
const { isInView, shouldAnimate, controls } = useScrollAnimation(ref, {
    once: true,
    amount: 0.3,
    margin: '0px 0px -100px 0px'
})
```

### `useAnimationPerformance()`
Monitors animation FPS for performance debugging.

```typescript
const { fps, isOptimal } = useAnimationPerformance()
console.log(`Current FPS: ${fps}, Optimal: ${isOptimal}`)
```

### `useStaggerAnimation(itemCount, baseDelay)`
Calculates stagger delays for multiple items.

```typescript
const { getDelay, totalDuration } = useStaggerAnimation(5, 0.1)
// getDelay(0) = 0, getDelay(1) = 0.1, getDelay(2) = 0.2, etc.
```

### `useAnimationConfig()`
Gets animation config respecting reduced motion.

```typescript
const { duration, ease, shouldAnimate } = useAnimationConfig()
```

### `useMicroInteraction()`
Gets micro-interaction config (150ms).

```typescript
const { duration, ease, shouldAnimate } = useMicroInteraction()
```

### `usePageTransition()`
Gets page transition config (300ms).

```typescript
const { duration, ease, shouldAnimate } = usePageTransition()
```

## Utility Functions

### `withReducedMotion(variant)`
Wraps a variant to respect reduced motion.

```typescript
const safeVariant = withReducedMotion(fadeInUp)
```

### `createStaggerContainer(staggerDelay, delayChildren)`
Creates custom stagger container.

```typescript
const customStagger = createStaggerContainer(0.15, 0.2)
```

### `getStaggerDelay(index, baseDelay)`
Calculates stagger delay for an index.

```typescript
const delay = getStaggerDelay(2, 0.1) // 0.2
```

### `getAnimationProps(reducedMotion)`
Gets animation props based on reduced motion.

```typescript
const props = getAnimationProps(reducedMotion)
// Returns { initial: false, animate: false, exit: false } if reduced motion
```

## Duration Constants

```typescript
durations.instant    // 0ms
durations.fast       // 150ms
durations.normal     // 300ms
durations.pageTransition // 300ms (200-400ms range)
durations.slow       // 500ms
```

## Easing Functions

```typescript
easings.smooth   // [0.22, 1, 0.36, 1] - Smooth spring
easings.snappy   // [0.4, 0, 0.2, 1] - Quick and snappy
easings.bounce   // [0.68, -0.55, 0.265, 1.55] - Bounce effect
easings.elastic  // [0.175, 0.885, 0.32, 1.275] - Elastic effect
easings.spring   // [0.22, 1, 0.36, 1] - Spring effect
```

## Performance Best Practices

1. **Use GPU-accelerated properties**: Always prefer `transform` and `opacity` over `width`, `height`, `top`, `left`, etc.

2. **Add will-change**: For complex animations, add `will-change` hint:
   ```typescript
   style={willChangeTransform}
   ```

3. **Respect reduced motion**: Always use hooks or utilities that check reduced motion preference.

4. **Limit simultaneous animations**: Don't animate too many elements at once.

5. **Use stagger wisely**: Keep stagger delays reasonable (50-150ms).

6. **Monitor performance**: Use `useAnimationPerformance()` hook during development.

## Examples

### Scroll-triggered card grid
```typescript
import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/lib/useAnimations'
import { scrollStaggerContainer, scrollReveal } from '@/lib/animations'

const CardGrid = ({ cards }) => {
    const ref = useRef(null)
    const { controls } = useScrollAnimation(ref)
    
    return (
        <motion.div
            ref={ref}
            variants={scrollStaggerContainer}
            initial="hidden"
            animate={controls}
            className="grid grid-cols-3 gap-4"
        >
            {cards.map((card, i) => (
                <motion.div
                    key={card.id}
                    variants={scrollReveal}
                    className="card"
                >
                    {card.content}
                </motion.div>
            ))}
        </motion.div>
    )
}
```

### Interactive button with micro-interactions
```typescript
import { motion } from 'framer-motion'
import { buttonHover, buttonPress } from '@/lib/animations'

const Button = ({ children, onClick }) => {
    return (
        <motion.button
            variants={buttonHover}
            initial="rest"
            whileHover="hover"
            whileTap="press"
            onClick={onClick}
        >
            {children}
        </motion.button>
    )
}
```

### Page with transition
```typescript
import { motion } from 'framer-motion'
import { pageTransitionVariants } from '@/lib/animations'

const Page = () => {
    return (
        <motion.div
            variants={pageTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            Page content
        </motion.div>
    )
}
```

## Testing

The animation system includes property-based tests to verify:
- Reduced motion respect (Property 6)
- Animation duration constraints (Property 10)
- Scroll animation stagger (Property 11)
- Immediate action feedback (Property 12)
- Animation performance (Property 13)

See test files in `/tests` directory for implementation details.
