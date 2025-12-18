'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: ResolvedTheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('dark');

  // Get system theme preference with comprehensive error handling
  const getSystemTheme = (): ResolvedTheme => {
    if (typeof window === 'undefined') {
      console.debug('[ThemeContext] Running in SSR environment, defaulting to dark theme');
      return 'dark';
    }
    
    try {
      // Check if matchMedia is available
      if (!window.matchMedia) {
        console.warn('[ThemeContext] matchMedia API not available, defaulting to dark theme');
        return 'dark';
      }

      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      console.debug('[ThemeContext] System theme preference detected:', prefersDark ? 'dark' : 'light');
      return prefersDark ? 'dark' : 'light';
    } catch (error) {
      console.error('[ThemeContext] Failed to detect system theme preference:', error);
      console.debug('[ThemeContext] Falling back to dark theme');
      return 'dark';
    }
  };

  // Resolve theme based on current setting
  const resolveTheme = useCallback((currentTheme: Theme): ResolvedTheme => {
    if (currentTheme === 'system') {
      return getSystemTheme();
    }
    return currentTheme;
  }, []);

  // Apply theme to document - Optimized for performance
  const applyTheme = (resolved: ResolvedTheme) => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    
    // Use requestAnimationFrame for smoother transitions
    requestAnimationFrame(() => {
      // Remove both classes first
      root.classList.remove('light', 'dark');
      
      // Add the resolved theme class
      root.classList.add(resolved);
      
      // Update meta theme-color for mobile browsers
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute(
          'content',
          resolved === 'dark' ? '#0f0f23' : '#ffffff'
        );
      }
    });
  };

  // Load theme from localStorage on mount with comprehensive error handling
  useEffect(() => {
    console.debug('[ThemeContext] Initializing theme system');
    
    // Check if localStorage is available
    const isLocalStorageAvailable = (() => {
      try {
        const testKey = '__theme_test__';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        return true;
      } catch (error) {
        console.warn('[ThemeContext] localStorage is not available:', error);
        return false;
      }
    })();

    if (!isLocalStorageAvailable) {
      console.warn('[ThemeContext] localStorage unavailable, using system preference without persistence');
      const systemTheme = getSystemTheme();
      setResolvedTheme(systemTheme);
      applyTheme(systemTheme);
      return;
    }

    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
      console.debug('[ThemeContext] Stored theme value:', stored);
      
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        console.debug('[ThemeContext] Valid theme found in localStorage:', stored);
        setThemeState(stored);
        const resolved = resolveTheme(stored);
        setResolvedTheme(resolved);
        applyTheme(resolved);
      } else {
        if (stored) {
          console.warn('[ThemeContext] Invalid theme value in localStorage:', stored);
          console.debug('[ThemeContext] Clearing corrupted localStorage entry');
          try {
            localStorage.removeItem(THEME_STORAGE_KEY);
          } catch (clearError) {
            console.error('[ThemeContext] Failed to clear corrupted localStorage entry:', clearError);
          }
        }
        
        // Default to system preference
        console.debug('[ThemeContext] No valid stored theme, using system preference');
        const systemTheme = getSystemTheme();
        setResolvedTheme(systemTheme);
        applyTheme(systemTheme);
      }
    } catch (error) {
      console.error('[ThemeContext] Failed to load theme from localStorage:', error);
      console.debug('[ThemeContext] Falling back to system preference');
      // Fallback to system preference
      const systemTheme = getSystemTheme();
      setResolvedTheme(systemTheme);
      applyTheme(systemTheme);
    }
    
    console.debug('[ThemeContext] Theme system initialized');
  }, [resolveTheme]);

  // Listen for system theme changes with error handling
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      // Check if matchMedia is available
      if (!window.matchMedia) {
        console.warn('[ThemeContext] matchMedia API not available, cannot listen for system theme changes');
        return;
      }

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e: MediaQueryListEvent) => {
        try {
          if (theme === 'system') {
            const newResolvedTheme = e.matches ? 'dark' : 'light';
            console.debug('[ThemeContext] System theme changed to:', newResolvedTheme);
            setResolvedTheme(newResolvedTheme);
            applyTheme(newResolvedTheme);
          }
        } catch (error) {
          console.error('[ThemeContext] Error handling system theme change:', error);
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      console.debug('[ThemeContext] Listening for system theme changes');
      
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
        console.debug('[ThemeContext] Stopped listening for system theme changes');
      };
    } catch (error) {
      console.error('[ThemeContext] Failed to set up system theme change listener:', error);
    }
  }, [theme]);

  // Set theme function with comprehensive error handling
  const setTheme = (newTheme: Theme) => {
    console.debug('[ThemeContext] Setting theme to:', newTheme);
    
    try {
      // Validate theme value
      if (!['light', 'dark', 'system'].includes(newTheme)) {
        console.error('[ThemeContext] Invalid theme value:', newTheme);
        console.debug('[ThemeContext] Resetting to system theme');
        newTheme = 'system';
      }

      setThemeState(newTheme);
      
      // Persist to localStorage with error handling
      try {
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
        console.debug('[ThemeContext] Theme persisted to localStorage');
      } catch (error) {
        if (error instanceof DOMException) {
          if (error.name === 'QuotaExceededError') {
            console.warn('[ThemeContext] localStorage quota exceeded, theme will not persist');
          } else if (error.name === 'SecurityError') {
            console.warn('[ThemeContext] localStorage access denied (security error), theme will not persist');
          } else {
            console.warn('[ThemeContext] Failed to save theme to localStorage:', error.message);
          }
        } else {
          console.warn('[ThemeContext] Failed to save theme to localStorage:', error);
        }
      }

      // Resolve and apply theme
      const resolved = resolveTheme(newTheme);
      console.debug('[ThemeContext] Resolved theme:', resolved);
      setResolvedTheme(resolved);
      applyTheme(resolved);
      console.debug('[ThemeContext] Theme applied successfully');
    } catch (error) {
      console.error('[ThemeContext] Failed to set theme:', error);
      console.debug('[ThemeContext] Theme state may be inconsistent');
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
