/**
 * Design System Utilities
 * 
 * This module enforces design system consistency across all components by providing:
 * - Spacing system (8px base unit)
 * - Typography scale
 * - Border radius values
 * - Shadow elevation system
 * - Color palette validation
 */

// ============================================================================
// SPACING SYSTEM (8px base unit)
// ============================================================================

export const spacing = {
  0: '0',
  1: '0.5rem',   // 8px
  2: '1rem',     // 16px
  3: '1.5rem',   // 24px
  4: '2rem',     // 32px
  5: '2.5rem',   // 40px
  6: '3rem',     // 48px
  8: '4rem',     // 64px
  10: '5rem',    // 80px
  12: '6rem',    // 96px
  16: '8rem',    // 128px
  20: '10rem',   // 160px
} as const;

export type SpacingKey = keyof typeof spacing;

/**
 * Validates that a spacing value is from the design system
 */
export function isValidSpacing(value: string): boolean {
  return Object.values(spacing).includes(value as any);
}

/**
 * Gets spacing value by key
 */
export function getSpacing(key: SpacingKey): string {
  return spacing[key];
}

// ============================================================================
// TYPOGRAPHY SCALE
// ============================================================================

export const typography = {
  fontFamily: {
    sans: ['Inter', 'sans-serif'],
    display: ['Space Grotesk', 'Inter', 'sans-serif'],
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
    '7xl': '4.5rem',   // 72px
    '8xl': '6rem',     // 96px
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

export type FontSizeKey = keyof typeof typography.fontSize;

/**
 * Validates that a font size is from the typography scale
 */
export function isValidFontSize(value: string): boolean {
  return Object.values(typography.fontSize).includes(value as any);
}

/**
 * Gets font size by key
 */
export function getFontSize(key: FontSizeKey): string {
  return typography.fontSize[key];
}

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
} as const;

export type BorderRadiusKey = keyof typeof borderRadius;

/**
 * Validates that a border radius is from the design system
 */
export function isValidBorderRadius(value: string): boolean {
  return Object.values(borderRadius).includes(value as any);
}

/**
 * Gets border radius by key
 */
export function getBorderRadius(key: BorderRadiusKey): string {
  return borderRadius[key];
}

// ============================================================================
// SHADOW ELEVATION SYSTEM
// ============================================================================

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  glow: {
    purple: '0 0 40px rgba(139, 92, 246, 0.3)',
    pink: '0 0 40px rgba(236, 72, 153, 0.3)',
  },
} as const;

export type ShadowKey = keyof typeof shadows;

/**
 * Validates that a shadow is from the elevation system
 */
export function isValidShadow(value: string): boolean {
  const flatShadows: string[] = [];
  
  Object.entries(shadows).forEach(([key, v]) => {
    if (typeof v === 'string') {
      flatShadows.push(v);
    } else if (key === 'glow' && typeof v === 'object') {
      Object.values(v).forEach(glowValue => {
        flatShadows.push(glowValue);
      });
    }
  });
  
  return flatShadows.includes(value);
}

/**
 * Gets shadow by elevation level
 */
export function getShadow(key: Exclude<ShadowKey, 'glow'>): string {
  return shadows[key] as string;
}

/**
 * Gets glow shadow by color
 */
export function getGlowShadow(color: 'purple' | 'pink'): string {
  return shadows.glow[color];
}

// ============================================================================
// COLOR PALETTE
// ============================================================================

export const colors = {
  // Brand Colors
  primary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',  // Main purple
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
  },
  secondary: {
    50: '#fdf2f8',
    100: '#fce7f3',
    200: '#fbcfe8',
    300: '#f9a8d4',
    400: '#f472b6',
    500: '#ec4899',  // Main pink
    600: '#db2777',
    700: '#be185d',
    800: '#9d174d',
    900: '#831843',
  },
  
  // Semantic Colors
  success: {
    50: '#f0fdf4',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
  },
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },
  error: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },
  info: {
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
  
  // Neutral Colors
  gray: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  
  // Background
  background: '#000000',
  foreground: '#ffffff',
} as const;

export type ColorCategory = keyof typeof colors;
export type ColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

/**
 * Gets color by category and shade
 */
export function getColor(category: ColorCategory, shade?: ColorShade): string {
  const colorValue = colors[category];
  
  if (typeof colorValue === 'string') {
    return colorValue;
  }
  
  if (shade && shade in colorValue) {
    return colorValue[shade as keyof typeof colorValue];
  }
  
  // Default to 500 shade if available
  if ('500' in colorValue) {
    return colorValue['500'];
  }
  
  throw new Error(`Invalid color: ${category}${shade ? `.${shade}` : ''}`);
}

/**
 * Validates that a color is from the design system palette
 */
export function isValidColor(value: string): boolean {
  const allColors: string[] = [];
  
  Object.values(colors).forEach(colorValue => {
    if (typeof colorValue === 'string') {
      allColors.push(colorValue);
    } else {
      Object.values(colorValue).forEach(shade => {
        allColors.push(shade);
      });
    }
  });
  
  return allColors.includes(value);
}

/**
 * Gets semantic color by type
 */
export function getSemanticColor(type: 'success' | 'warning' | 'error' | 'info', shade: ColorShade = 500): string {
  return colors[type][shade as keyof typeof colors[typeof type]];
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Validates that a CSS value uses design system tokens
 */
export interface DesignSystemValidation {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates spacing values in a style object
 */
export function validateSpacing(styles: Record<string, any>): DesignSystemValidation {
  const errors: string[] = [];
  const spacingProps = ['margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 
                        'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
                        'gap', 'rowGap', 'columnGap'];
  
  spacingProps.forEach(prop => {
    if (prop in styles) {
      const value = styles[prop];
      if (typeof value === 'string' && value !== '0' && !isValidSpacing(value)) {
        errors.push(`Invalid spacing value for ${prop}: ${value}`);
      }
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates typography values in a style object
 */
export function validateTypography(styles: Record<string, any>): DesignSystemValidation {
  const errors: string[] = [];
  
  if ('fontSize' in styles) {
    const value = styles.fontSize;
    if (typeof value === 'string' && !isValidFontSize(value)) {
      errors.push(`Invalid font size: ${value}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates all design system tokens in a style object
 */
export function validateDesignSystem(styles: Record<string, any>): DesignSystemValidation {
  const spacingValidation = validateSpacing(styles);
  const typographyValidation = validateTypography(styles);
  
  return {
    isValid: spacingValidation.isValid && typographyValidation.isValid,
    errors: [...spacingValidation.errors, ...typographyValidation.errors],
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Converts pixel value to rem based on 16px base
 */
export function pxToRem(px: number): string {
  return `${px / 16}rem`;
}

/**
 * Converts rem value to pixels based on 16px base
 */
export function remToPx(rem: string): number {
  return parseFloat(rem) * 16;
}

/**
 * Checks if a value is a multiple of 8px (base unit)
 */
export function isMultipleOfBaseUnit(px: number): boolean {
  return px % 8 === 0;
}
