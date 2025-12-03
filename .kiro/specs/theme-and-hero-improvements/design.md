# Design Document - Theme and Hero Improvements

## Overview

This design document outlines the implementation approach for adding a light/dark theme toggle system and enhancing the hero section of the Diasporan web application. The solution will provide users with a seamless theme switching experience while maintaining accessibility standards and improving the visual impact of the homepage.

## Architecture

### Theme System Architecture

The theme system will follow a React Context-based architecture:

1. **ThemeContext**: Centralized state management for theme preferences
2. **ThemeProvider**: Wraps the application to provide theme state globally
3. **useTheme Hook**: Custom hook for accessing theme state and actions
4. **ThemeToggle Component**: UI control for switching themes
5. **CSS Variables**: Dynamic styling based on active theme

### Component Hierarchy

```
App Layout
├── ThemeProvider (Context)
│   ├── Navbar
│   │   └── ThemeToggle
│   ├── HomePage
│   │   └── Enhanced Hero Section
│   └── Other Pages
```

## Components and Interfaces

### 1. Theme Context (`src/contexts/ThemeContext.tsx`)

**Interface:**
```typescript
type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}
```

**Responsibilities:**
- Detect system theme preference on mount
- Persist theme selection to localStorage
- Listen for system theme changes
- Apply theme class to document root
- Update meta theme-color for mobile browsers

### 2. Theme Toggle Component (`src/components/ui/ThemeToggle.tsx`)

**Props:**
```typescript
interface ThemeToggleProps {
  className?: string;
}
```

**Features:**
- Dropdown menu with three options: Light, Dark, System
- Visual indicator for current selection
- Smooth animations using Framer Motion
- Touch-friendly for mobile devices
- Accessible keyboard navigation

### 3. Enhanced Hero Section

**Structure:**
- Full-screen hero with video background
- Animated floating particles
- Gradient overlays
- Badge component with announcement
- Large typography with gradient text
- Dual CTA buttons with hover effects
- Trust badges (ratings, user count, support)
- Animated scroll indicator

## Data Models

### Theme Preference Storage

**LocalStorage Schema:**
```typescript
{
  theme: 'light' | 'dark' | 'system'
}
```

### CSS Custom Properties

**Light Theme:**
```css
:root {
  --background: 255 255 255;
  --foreground: 15 15 35;
  --card: 255 255 255;
  --card-foreground: 15 15 35;
  --primary: 147 51 234;
  --primary-foreground: 255 255 255;
  --muted: 243 244 246;
  --muted-foreground: 107 114 128;
  --border: 229 231 235;
}
```

**Dark Theme:**
```css
.dark {
  --background: 15 15 35;
  --foreground: 255 255 255;
  --card: 31 41 55;
  --card-foreground: 255 255 255;
  --primary: 147 51 234;
  --primary-foreground: 255 255 255;
  --muted: 55 65 81;
  --muted-foreground: 156 163 175;
  --border: 55 65 81;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Theme persistence across sessions
*For any* theme selection (light, dark, or system), when a user sets a theme and returns to the application, the system should load the same theme preference from localStorage.
**Validates: Requirements 1.3, 1.4**

### Property 2: System theme detection accuracy
*For any* system theme preference, when the application loads with theme set to 'system', the resolved theme should match the user's OS preference.
**Validates: Requirements 1.1**

### Property 3: Theme application consistency
*For any* theme change, all UI components across all pages should update to reflect the new theme without requiring a page refresh.
**Validates: Requirements 1.5, 5.2**

### Property 4: Smooth theme transitions
*For any* theme switch, all color transitions should complete within 300ms with smooth easing.
**Validates: Requirements 1.5**

### Property 5: Accessibility contrast compliance
*For any* theme (light or dark), all text and interactive elements should maintain WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text).
**Validates: Requirements 2.2**

### Property 6: Hero section load performance
*For any* page load, the hero section should display the value proposition within 3 seconds on standard connections.
**Validates: Requirements 3.1**

### Property 7: Theme toggle accessibility
*For any* device type, the theme toggle should be keyboard navigable and screen reader accessible.
**Validates: Requirements 4.3, 4.5**

### Property 8: Layout stability during theme switch
*For any* theme change, no content layout shifts should occur (CLS = 0).
**Validates: Requirements 5.4**

## Error Handling

### Theme System Errors

1. **LocalStorage Unavailable**
   - Fallback to system preference
   - Log warning to console
   - Continue with in-memory state

2. **Invalid Theme Value**
   - Reset to 'system' default
   - Clear corrupted localStorage entry
   - Notify user via console

3. **System Preference Detection Failure**
   - Default to 'dark' theme
   - Log error for debugging
   - Allow manual theme selection

### Hero Section Errors

1. **Video Load Failure**
   - Display static gradient background
   - Log error for monitoring
   - Maintain visual hierarchy

2. **Animation Performance Issues**
   - Reduce particle count on low-end devices
   - Disable non-essential animations
   - Maintain core functionality

## Testing Strategy

### Unit Testing

**Theme Context Tests:**
- Theme state initialization
- Theme switching logic
- LocalStorage read/write operations
- System preference detection

**Theme Toggle Tests:**
- Dropdown open/close behavior
- Theme selection updates
- Visual indicator accuracy
- Keyboard navigation

**Hero Section Tests:**
- Component rendering
- Animation initialization
- Responsive behavior
- Accessibility attributes

### Property-Based Testing

We will use **fast-check** (JavaScript/TypeScript property-based testing library) for implementing correctness properties.

**Configuration:**
- Minimum 100 iterations per property test
- Each test tagged with format: `**Feature: theme-and-hero-improvements, Property {number}: {property_text}**`

**Property Test Examples:**

1. **Theme Persistence Property**
```typescript
// Feature: theme-and-hero-improvements, Property 1: Theme persistence across sessions
fc.assert(
  fc.property(
    fc.constantFrom('light', 'dark', 'system'),
    (theme) => {
      // Set theme
      localStorage.setItem('theme', theme);
      // Simulate reload
      const loaded = localStorage.getItem('theme');
      return loaded === theme;
    }
  ),
  { numRuns: 100 }
);
```

2. **Contrast Ratio Property**
```typescript
// Feature: theme-and-hero-improvements, Property 5: Accessibility contrast compliance
fc.assert(
  fc.property(
    fc.constantFrom('light', 'dark'),
    (theme) => {
      // Apply theme
      document.documentElement.classList.add(theme);
      // Check all text elements
      const elements = document.querySelectorAll('[class*="text-"]');
      return Array.from(elements).every(el => {
        const contrast = calculateContrast(el);
        return contrast >= 4.5;
      });
    }
  ),
  { numRuns: 100 }
);
```

### Integration Testing

- Theme switching across multiple pages
- Theme persistence after browser restart
- Hero section interaction with navigation
- Mobile responsiveness testing

### Accessibility Testing

- Keyboard navigation for theme toggle
- Screen reader announcements
- Color contrast validation
- Focus management

### Performance Testing

- Hero section load time measurement
- Animation frame rate monitoring
- Theme switch performance profiling
- Memory leak detection

## Implementation Notes

### Tailwind Configuration

Enable class-based dark mode:
```javascript
module.exports = {
  darkMode: 'class',
  // ... rest of config
}
```

### Next.js Layout Integration

Wrap application with ThemeProvider in root layout:
```typescript
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0f0f23" />
      </head>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Hero Section Optimizations

1. **Video Loading:**
   - Use `preload="metadata"` for faster initial load
   - Provide fallback gradient background
   - Lazy load video on mobile devices

2. **Animation Performance:**
   - Use CSS transforms for better performance
   - Implement `will-change` for animated elements
   - Reduce particle count on mobile

3. **Responsive Design:**
   - Mobile-first approach
   - Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
   - Touch-optimized interactions

### Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS custom properties support required
- LocalStorage API required
- Fallback for older browsers: default to dark theme

## Security Considerations

1. **XSS Prevention:**
   - Sanitize any user-generated content
   - Use React's built-in XSS protection

2. **LocalStorage:**
   - Only store theme preference (non-sensitive data)
   - Validate data before reading

3. **Video Sources:**
   - Host videos on trusted CDN
   - Implement CSP headers

## Performance Targets

- **Theme Switch:** < 100ms
- **Hero Section Load:** < 3s (3G connection)
- **Animation Frame Rate:** 60 FPS
- **Cumulative Layout Shift:** 0
- **First Contentful Paint:** < 1.5s

## Accessibility Requirements

- WCAG 2.1 Level AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Sufficient color contrast (4.5:1 minimum)
- Focus indicators on all interactive elements
- Reduced motion support for animations
