# Responsive Design System

This document describes the responsive design system implementation for DettyConnect, including breakpoints, utilities, hooks, and touch gesture support.

## Breakpoints

The application uses three main breakpoints:

- **Mobile**: `< 640px` - Optimized for phones
- **Tablet**: `640px - 1024px` - Optimized for tablets
- **Desktop**: `> 1024px` - Optimized for desktop screens

### Tailwind Breakpoints

```typescript
'sm': '640px',   // mobile breakpoint
'md': '768px',   // tablet intermediate
'lg': '1024px',  // desktop breakpoint
'xl': '1280px',
'2xl': '1536px',
```

## Responsive Hooks

### useBreakpoint()

Returns the current breakpoint based on window width.

```typescript
import { useBreakpoint } from '@/lib/responsive';

function MyComponent() {
  const breakpoint = useBreakpoint(); // 'mobile' | 'tablet' | 'desktop'
  
  return (
    <div>
      Current breakpoint: {breakpoint}
    </div>
  );
}
```

### useMediaQuery(query)

Checks if a media query matches the current viewport.

```typescript
import { useMediaQuery } from '@/lib/responsive';

function MyComponent() {
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  
  return (
    <div>
      {isLargeScreen ? 'Large screen' : 'Small screen'}
    </div>
  );
}
```

### useIsMobile(), useIsTablet(), useIsDesktop()

Convenience hooks for checking specific breakpoints.

```typescript
import { useIsMobile, useIsTablet, useIsDesktop } from '@/lib/responsive';

function MyComponent() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();
  
  return (
    <div>
      {isMobile && <MobileLayout />}
      {isTablet && <TabletLayout />}
      {isDesktop && <DesktopLayout />}
    </div>
  );
}
```

### useOrientation()

Returns the current device orientation.

```typescript
import { useOrientation } from '@/lib/responsive';

function MyComponent() {
  const orientation = useOrientation(); // 'portrait' | 'landscape'
  
  return (
    <div className={orientation === 'portrait' ? 'flex-col' : 'flex-row'}>
      Content adapts to orientation
    </div>
  );
}
```

### useViewport()

Returns the current viewport dimensions.

```typescript
import { useViewport } from '@/lib/responsive';

function MyComponent() {
  const { width, height } = useViewport();
  
  return (
    <div>
      Viewport: {width}x{height}
    </div>
  );
}
```

### useIsTouchDevice()

Detects if the device supports touch input.

```typescript
import { useIsTouchDevice } from '@/lib/responsive';

function MyComponent() {
  const isTouch = useIsTouchDevice();
  
  return (
    <button className={isTouch ? 'min-h-[44px]' : 'min-h-[32px]'}>
      Touch-optimized button
    </button>
  );
}
```

### useResponsiveValue(values)

Returns different values based on the current breakpoint.

```typescript
import { useResponsiveValue } from '@/lib/responsive';

function MyComponent() {
  const columns = useResponsiveValue({
    mobile: 1,
    tablet: 2,
    desktop: 3,
  });
  
  return (
    <div className={`grid grid-cols-${columns}`}>
      Responsive grid
    </div>
  );
}
```

## Touch Gesture Support

### useGestures(handlers, options)

Comprehensive gesture detection hook.

```typescript
import { useGestures } from '@/lib/gestures';

function MyComponent() {
  const gestureRef = useGestures({
    onSwipe: (event) => {
      console.log(`Swiped ${event.direction}`);
    },
    onPinch: (event) => {
      console.log(`Pinched to scale ${event.scale}`);
    },
    onTap: (event) => {
      console.log(`Tapped at ${event.x}, ${event.y}`);
    },
    onDoubleTap: (event) => {
      console.log('Double tapped');
    },
    onLongPress: (event) => {
      console.log('Long pressed');
    },
  }, {
    swipeThreshold: 50,
    velocityThreshold: 0.3,
    doubleTapDelay: 300,
    longPressDelay: 500,
    pinchThreshold: 0.1,
  });
  
  return (
    <div ref={gestureRef as any}>
      Swipe, pinch, or tap me!
    </div>
  );
}
```

### useSwipe(onSwipe, options)

Simple swipe detection.

```typescript
import { useSwipe } from '@/lib/gestures';

function MyComponent() {
  const swipeRef = useSwipe((direction) => {
    if (direction === 'left') {
      // Navigate to next
    } else if (direction === 'right') {
      // Navigate to previous
    }
  });
  
  return (
    <div ref={swipeRef as any}>
      Swipe left or right
    </div>
  );
}
```

### usePinch(onPinch, options)

Pinch zoom detection.

```typescript
import { usePinch } from '@/lib/gestures';

function MyComponent() {
  const [scale, setScale] = useState(1);
  const pinchRef = usePinch((newScale) => {
    setScale(newScale);
  });
  
  return (
    <div ref={pinchRef as any} style={{ transform: `scale(${scale})` }}>
      Pinch to zoom
    </div>
  );
}
```

### useTap(onTap, onDoubleTap, options)

Tap detection.

```typescript
import { useTap } from '@/lib/gestures';

function MyComponent() {
  const tapRef = useTap(
    () => console.log('Single tap'),
    () => console.log('Double tap')
  );
  
  return (
    <div ref={tapRef as any}>
      Tap or double tap me
    </div>
  );
}
```

## Responsive Utilities

### responsiveClass(base, responsive)

Generate responsive class names.

```typescript
import { responsiveClass } from '@/lib/responsive';

const className = responsiveClass('text-base', {
  mobile: 'text-sm',
  tablet: 'text-base',
  desktop: 'text-lg',
});
// Result: "text-base max-sm:text-sm sm:max-lg:text-base lg:text-lg"
```

## Best Practices

### 1. Mobile-First Approach

Always design for mobile first, then enhance for larger screens:

```tsx
<div className="flex flex-col sm:flex-row lg:gap-8">
  {/* Mobile: column, Desktop: row */}
</div>
```

### 2. Touch Target Sizes

Ensure interactive elements meet minimum touch target size (44x44px):

```tsx
import { useIsTouchDevice } from '@/lib/responsive';

function Button() {
  const isTouch = useIsTouchDevice();
  
  return (
    <button className={isTouch ? 'min-h-[44px] min-w-[44px]' : 'min-h-[32px]'}>
      Click me
    </button>
  );
}
```

### 3. Orientation Handling

Adapt layouts based on orientation:

```tsx
import { useOrientation } from '@/lib/responsive';

function Gallery() {
  const orientation = useOrientation();
  
  return (
    <div className={orientation === 'portrait' ? 'grid-cols-2' : 'grid-cols-4'}>
      {/* Adjust grid based on orientation */}
    </div>
  );
}
```

### 4. Responsive Images

Use responsive images with proper sizing:

```tsx
<img
  src="/image.jpg"
  srcSet="/image-mobile.jpg 640w, /image-tablet.jpg 1024w, /image-desktop.jpg 1920w"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  alt="Responsive image"
/>
```

### 5. Performance Considerations

- Use CSS media queries for styling when possible
- Debounce resize handlers if needed
- Lazy load content for mobile devices
- Optimize images for different screen sizes

## Testing Responsive Layouts

### Manual Testing

Test at all breakpoints:
- Mobile: 375px, 414px, 390px
- Tablet: 768px, 834px, 1024px
- Desktop: 1280px, 1440px, 1920px

### Orientation Testing

Test both portrait and landscape orientations on mobile and tablet devices.

### Touch Gesture Testing

Test all touch gestures on actual touch devices:
- Swipe (left, right, up, down)
- Pinch (zoom in, zoom out)
- Tap (single, double)
- Long press

## Browser Support

The responsive system supports:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

All responsive features maintain accessibility:
- Focus indicators remain visible at all breakpoints
- Touch targets meet WCAG 2.1 AA standards (44x44px minimum)
- Keyboard navigation works across all layouts
- Screen readers announce orientation changes
