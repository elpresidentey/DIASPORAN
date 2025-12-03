# Design System Documentation

This document describes the DettyConnect design system and how to use it consistently across all components.

## Overview

The design system enforces consistency through:
- **8px spacing system** - All spacing uses multiples of 8px
- **Typography scale** - Predefined font sizes from xs (12px) to 8xl (96px)
- **Border radius values** - Consistent corner rounding from sm (2px) to 3xl (24px)
- **Shadow elevation** - 5 levels of elevation plus glow effects
- **Color palette** - Semantic colors with consistent meaning

## Usage

### In Tailwind Classes

The design system tokens are configured in `tailwind.config.ts` and can be used directly in Tailwind classes:

```tsx
// Spacing (8px base unit)
<div className="p-4 m-2 gap-3">  // 32px padding, 16px margin, 24px gap

// Typography
<h1 className="text-5xl">        // 48px
<p className="text-base">         // 16px

// Colors
<div className="bg-purple-500 text-white">
<button className="bg-pink-600 hover:bg-pink-700">

// Border Radius
<div className="rounded-2xl">    // 16px
<button className="rounded-lg">  // 8px

// Shadows
<div className="shadow-lg">
<div className="shadow-glow-purple">
```

### In JavaScript/TypeScript

Import utilities from `@/lib/design-system`:

```typescript
import { 
  spacing, 
  typography, 
  borderRadius, 
  shadows, 
  colors,
  getSpacing,
  getFontSize,
  getColor,
  validateDesignSystem
} from '@/lib/design-system';

// Get values
const padding = getSpacing(4);        // '2rem' (32px)
const fontSize = getFontSize('2xl');  // '1.5rem' (24px)
const color = getColor('purple', 500); // '#a855f7'

// Validate styles
const styles = { padding: '2rem', fontSize: '1.5rem' };
const validation = validateDesignSystem(styles);
if (!validation.isValid) {
  console.error(validation.errors);
}
```

## Design Tokens

### Spacing System (8px base)

All spacing values are multiples of 8px:

| Key | Value | Pixels |
|-----|-------|--------|
| 0   | 0     | 0px    |
| 1   | 0.5rem | 8px   |
| 2   | 1rem  | 16px   |
| 3   | 1.5rem | 24px  |
| 4   | 2rem  | 32px   |
| 5   | 2.5rem | 40px  |
| 6   | 3rem  | 48px   |
| 8   | 4rem  | 64px   |
| 10  | 5rem  | 80px   |
| 12  | 6rem  | 96px   |
| 16  | 8rem  | 128px  |
| 20  | 10rem | 160px  |

**Usage:**
```tsx
<div className="p-4">      {/* 32px padding */}
<div className="m-2">      {/* 16px margin */}
<div className="gap-3">    {/* 24px gap */}
```

### Typography Scale

Font sizes follow a consistent scale:

| Key  | Value    | Pixels |
|------|----------|--------|
| xs   | 0.75rem  | 12px   |
| sm   | 0.875rem | 14px   |
| base | 1rem     | 16px   |
| lg   | 1.125rem | 18px   |
| xl   | 1.25rem  | 20px   |
| 2xl  | 1.5rem   | 24px   |
| 3xl  | 1.875rem | 30px   |
| 4xl  | 2.25rem  | 36px   |
| 5xl  | 3rem     | 48px   |
| 6xl  | 3.75rem  | 60px   |
| 7xl  | 4.5rem   | 72px   |
| 8xl  | 6rem     | 96px   |

**Usage:**
```tsx
<h1 className="text-5xl">  {/* 48px */}
<h2 className="text-3xl">  {/* 30px */}
<p className="text-base">  {/* 16px */}
```

### Border Radius

Consistent corner rounding:

| Key  | Value     | Pixels |
|------|-----------|--------|
| none | 0         | 0px    |
| sm   | 0.125rem  | 2px    |
| base | 0.25rem   | 4px    |
| md   | 0.375rem  | 6px    |
| lg   | 0.5rem    | 8px    |
| xl   | 0.75rem   | 12px   |
| 2xl  | 1rem      | 16px   |
| 3xl  | 1.5rem    | 24px   |
| full | 9999px    | Full   |

**Usage:**
```tsx
<div className="rounded-2xl">  {/* 16px - Cards */}
<button className="rounded-lg"> {/* 8px - Buttons */}
<input className="rounded-2xl"> {/* 16px - Inputs */}
```

### Shadow Elevation

5 levels of elevation plus glow effects:

| Key  | Description |
|------|-------------|
| sm   | Subtle shadow for slight elevation |
| md   | Medium shadow for cards |
| lg   | Large shadow for modals |
| xl   | Extra large for popovers |
| 2xl  | Maximum elevation |
| glow-purple | Purple glow effect |
| glow-pink | Pink glow effect |

**Usage:**
```tsx
<div className="shadow-lg">           {/* Cards */}
<div className="shadow-xl">           {/* Modals */}
<div className="shadow-glow-purple">  {/* Hover effects */}
```

### Color Palette

#### Brand Colors

**Purple (Primary):**
- 500: `#a855f7` - Main purple
- 600: `#9333ea` - Darker purple
- 700: `#7e22ce` - Darkest purple

**Pink (Secondary):**
- 500: `#ec4899` - Main pink
- 600: `#db2777` - Darker pink
- 700: `#be185d` - Darkest pink

#### Semantic Colors

**Success:** `#10b981` (green)
**Warning:** `#f59e0b` (orange)
**Error:** `#ef4444` (red)
**Info:** `#3b82f6` (blue)

**Usage:**
```tsx
<button className="bg-purple-600 hover:bg-purple-700">
<div className="text-success-500">
<p className="text-error-500">
```

## Component Guidelines

### Buttons

- Use `rounded-lg` (8px) for border radius
- Minimum height: `h-11` (44px) for touch targets
- Padding: `px-8 py-2.5` (horizontal 64px, vertical 20px)
- Hover: Scale 1.02 with shadow-lg

### Cards

- Use `rounded-3xl` (24px) for border radius
- Padding: `p-8` (64px) for content
- Background: `bg-white/5 backdrop-blur-md`
- Border: `border-white/10`
- Hover: Translate -4px with shadow-xl

### Inputs

- Use `rounded-2xl` (16px) for border radius
- Minimum height: `h-14` (56px) for touch targets
- Padding: `px-5 py-3` (horizontal 40px, vertical 24px)
- Focus: Ring with glow effect

## Validation

Use validation utilities to ensure design system compliance:

```typescript
import { validateDesignSystem } from '@/lib/design-system';

const styles = {
  padding: '2rem',    // Valid (32px = 8px * 4)
  margin: '1.5rem',   // Valid (24px = 8px * 3)
  fontSize: '1.5rem', // Valid (24px from scale)
};

const validation = validateDesignSystem(styles);
if (!validation.isValid) {
  console.error('Design system violations:', validation.errors);
}
```

## Best Practices

1. **Always use design system tokens** - Never use arbitrary values
2. **Spacing must be multiples of 8px** - Use the spacing scale
3. **Font sizes must be from the scale** - No custom font sizes
4. **Colors must be from the palette** - Use semantic colors
5. **Border radius must be consistent** - Use predefined values
6. **Shadows indicate elevation** - Use appropriate shadow level

## Examples

### Good ✅

```tsx
// Uses design system tokens
<div className="p-4 m-2 rounded-2xl shadow-lg bg-purple-500">
  <h2 className="text-3xl text-white">Title</h2>
  <p className="text-base text-gray-300">Description</p>
</div>
```

### Bad ❌

```tsx
// Uses arbitrary values
<div className="p-[27px] m-[13px] rounded-[19px] shadow-[0_5px_15px_rgba(0,0,0,0.15)]" 
     style={{ backgroundColor: '#a234f2' }}>
  <h2 className="text-[29px]">Title</h2>
  <p className="text-[15px]">Description</p>
</div>
```

## Migration Guide

If you have existing components with arbitrary values:

1. **Identify spacing values** - Round to nearest 8px multiple
2. **Map font sizes** - Find closest scale value
3. **Use palette colors** - Replace hex codes with semantic colors
4. **Standardize border radius** - Use predefined values
5. **Apply elevation shadows** - Use shadow scale

## Resources

- Design tokens: `src/lib/design-system.ts`
- Tailwind config: `tailwind.config.ts`
- Component examples: `src/components/ui/`
