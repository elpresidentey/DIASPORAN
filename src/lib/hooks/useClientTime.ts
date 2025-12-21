import { useState, useEffect } from 'react'

/**
 * Custom hook to handle client-side time formatting to prevent hydration mismatches
 * @param date - The date to format
 * @param options - Intl.DateTimeFormatOptions for formatting
 * @returns Formatted time string or placeholder during SSR
 */
export function useClientTime(
  date: Date, 
  options?: Intl.DateTimeFormatOptions
): string {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) {
    return '--:--:--' // Placeholder during SSR
  }
  
  return date.toLocaleTimeString(undefined, options)
}

/**
 * Custom hook for client-side date formatting
 * @param date - The date to format
 * @param options - Intl.DateTimeFormatOptions for formatting
 * @returns Formatted date string or placeholder during SSR
 */
export function useClientDate(
  date: Date, 
  options?: Intl.DateTimeFormatOptions
): string {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) {
    return '--/--/----' // Placeholder during SSR
  }
  
  return date.toLocaleDateString(undefined, options)
}

/**
 * Custom hook for client-side date and time formatting
 * @param date - The date to format
 * @param options - Intl.DateTimeFormatOptions for formatting
 * @returns Formatted date-time string or placeholder during SSR
 */
export function useClientDateTime(
  date: Date, 
  options?: Intl.DateTimeFormatOptions
): string {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) {
    return '--/--/---- --:--:--' // Placeholder during SSR
  }
  
  return date.toLocaleString(undefined, options)
}