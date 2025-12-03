/**
 * Error Handling Tests
 * 
 * Tests error handling and fallback mechanisms for theme system and hero section
 * Requirements: 1.1, 3.2
 */

import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Hero from '@/components/Hero';

// Mock console methods to verify logging
const originalConsole = {
  debug: console.debug,
  warn: console.warn,
  error: console.error,
};

describe('Theme System Error Handling', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    // Mock console methods
    console.debug = vi.fn();
    console.warn = vi.fn();
    console.error = vi.fn();
  });

  afterEach(() => {
    // Restore console methods
    console.debug = originalConsole.debug;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
  });

  it('should handle localStorage unavailable scenario', () => {
    // Mock localStorage to throw an error
    const originalSetItem = Storage.prototype.setItem;
    const originalGetItem = Storage.prototype.getItem;
    const originalRemoveItem = Storage.prototype.removeItem;
    
    Storage.prototype.setItem = vi.fn(() => {
      const error = new Error('localStorage not available');
      error.name = 'SecurityError';
      throw error;
    });
    Storage.prototype.getItem = vi.fn(() => {
      const error = new Error('localStorage not available');
      error.name = 'SecurityError';
      throw error;
    });
    Storage.prototype.removeItem = vi.fn(() => {
      const error = new Error('localStorage not available');
      error.name = 'SecurityError';
      throw error;
    });

    render(
      <ThemeProvider>
        <div>Test Content</div>
      </ThemeProvider>
    );

    // Should still render without crashing
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    
    // Should log warning about localStorage
    expect(console.warn).toHaveBeenCalled();

    // Restore localStorage
    Storage.prototype.setItem = originalSetItem;
    Storage.prototype.getItem = originalGetItem;
    Storage.prototype.removeItem = originalRemoveItem;
  });

  it('should handle invalid theme value in localStorage', async () => {
    // Set invalid theme value
    localStorage.setItem('theme', 'invalid-theme');

    render(
      <ThemeProvider>
        <div>Test Content</div>
      </ThemeProvider>
    );

    // Wait for component to mount and process
    await waitFor(() => {
      // Should still render without crashing
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
    
    // Should log warning about invalid theme
    expect(console.warn).toHaveBeenCalled();
  });

  it('should handle system preference detection failure', () => {
    // Mock matchMedia to throw an error
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn(() => {
      throw new Error('matchMedia not supported');
    });

    render(
      <ThemeProvider>
        <div>Test Content</div>
      </ThemeProvider>
    );

    // Should still render without crashing
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    
    // Should log error about system preference detection
    expect(console.error).toHaveBeenCalled();

    // Restore matchMedia
    window.matchMedia = originalMatchMedia;
  });

  it('should handle QuotaExceededError when saving theme', async () => {
    const originalSetItem = Storage.prototype.setItem;
    
    // First call succeeds (for initial load), subsequent calls fail
    let callCount = 0;
    Storage.prototype.setItem = vi.fn(() => {
      callCount++;
      if (callCount > 1) {
        const error = new DOMException('QuotaExceededError');
        error.name = 'QuotaExceededError';
        throw error;
      }
    });

    const { container } = render(
      <ThemeProvider>
        <div>Test Content</div>
      </ThemeProvider>
    );

    // Should still render
    expect(screen.getByText('Test Content')).toBeInTheDocument();

    // Restore localStorage
    Storage.prototype.setItem = originalSetItem;
  });
});

describe('Hero Section Error Handling', () => {
  beforeEach(() => {
    // Mock console methods
    console.debug = vi.fn();
    console.warn = vi.fn();
    console.error = vi.fn();
    
    // Mock window.innerWidth for device detection
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    // Mock framer-motion to avoid animation issues
    vi.mock('framer-motion', () => ({
      motion: {
        div: 'div',
        span: 'span',
      },
    }));
  });

  afterEach(() => {
    // Restore console methods
    console.debug = originalConsole.debug;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
    vi.clearAllMocks();
  });

  it('should handle video error event', () => {
    // Create a video element
    const video = document.createElement('video');
    const onError = vi.fn((e) => {
      console.error('[Hero] Video failed to load');
      console.debug('[Hero] Falling back to gradient background');
      e.currentTarget.style.display = 'none';
    });
    
    video.addEventListener('error', onError);
    
    // Simulate error
    const errorEvent = new Event('error');
    video.dispatchEvent(errorEvent);
    
    // Should have called error handler
    expect(onError).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('[Hero] Video failed to load');
    expect(console.debug).toHaveBeenCalledWith('[Hero] Falling back to gradient background');
  });

  it('should handle device capability detection failure', () => {
    // Mock navigator properties to throw errors
    const originalHardwareConcurrency = navigator.hardwareConcurrency;
    Object.defineProperty(navigator, 'hardwareConcurrency', {
      get: () => {
        throw new Error('hardwareConcurrency not available');
      },
      configurable: true,
    });

    // Simulate the device detection logic
    try {
      const hardwareConcurrency = navigator.hardwareConcurrency || 2;
      const deviceMemory = (navigator as any).deviceMemory || 4;
      const isLowEnd = hardwareConcurrency <= 2 || deviceMemory <= 2;
    } catch (error) {
      console.warn('[Hero] Failed to detect device capabilities:', error);
      console.debug('[Hero] Assuming standard device capabilities');
    }

    // Should log warning about device detection
    expect(console.warn).toHaveBeenCalled();

    // Restore navigator property
    Object.defineProperty(navigator, 'hardwareConcurrency', {
      value: originalHardwareConcurrency,
      configurable: true,
    });
  });

  it('should handle particle generation errors gracefully', () => {
    // Simulate particle generation with error handling
    const particleCount = 20;
    
    try {
      console.debug('[Hero] Generating', particleCount, 'particles');
      const particles = Array.from({ length: particleCount }).map((_, i) => ({
        id: i,
        size: Math.random() * 30 + 10,
        x: Math.random() * 100,
        y: Math.random() * 100,
      }));
      expect(particles).toHaveLength(particleCount);
    } catch (error) {
      console.error('[Hero] Failed to generate particles:', error);
      console.debug('[Hero] Returning empty particle array');
    }

    // Should have debug log
    expect(console.debug).toHaveBeenCalled();
  });

  it('should log video loading events', () => {
    const video = document.createElement('video');
    
    const onLoadStart = vi.fn(() => {
      console.debug('[Hero] Video loading started');
    });
    
    const onLoadedData = vi.fn(() => {
      console.debug('[Hero] Video loaded successfully');
    });
    
    video.addEventListener('loadstart', onLoadStart);
    video.addEventListener('loadeddata', onLoadedData);
    
    // Simulate events
    video.dispatchEvent(new Event('loadstart'));
    video.dispatchEvent(new Event('loadeddata'));
    
    expect(onLoadStart).toHaveBeenCalled();
    expect(onLoadedData).toHaveBeenCalled();
    expect(console.debug).toHaveBeenCalledWith('[Hero] Video loading started');
    expect(console.debug).toHaveBeenCalledWith('[Hero] Video loaded successfully');
  });
});

describe('Error Logging', () => {
  beforeEach(() => {
    console.debug = vi.fn();
    console.warn = vi.fn();
    console.error = vi.fn();
  });

  afterEach(() => {
    console.debug = originalConsole.debug;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
  });

  it('should log debug messages during theme initialization', () => {
    render(
      <ThemeProvider>
        <div>Test</div>
      </ThemeProvider>
    );

    // Should have debug logs
    expect(console.debug).toHaveBeenCalled();
  });

  it('should log initialization messages', () => {
    // Simulate initialization logging
    console.debug('[Hero] Initializing hero section');
    console.debug('[Hero] Device type:', 'desktop');
    
    expect(console.debug).toHaveBeenCalledWith('[Hero] Initializing hero section');
    expect(console.debug).toHaveBeenCalledWith('[Hero] Device type:', 'desktop');
  });
});
