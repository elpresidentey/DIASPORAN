/**
 * Currency formatting utilities for Diasporan
 */

/**
 * Format a price with the appropriate currency symbol
 * @param amount - The numeric amount
 * @param currency - The currency code (e.g., 'NGN', 'USD', 'GBP')
 * @returns Formatted price string with symbol and thousand separators
 * 
 * @example
 * formatPrice(1275000, 'NGN') // "₦1,275,000"
 * formatPrice(850, 'USD') // "$850"
 * formatPrice(525000, 'NGN') // "₦525,000"
 */
export function formatPrice(amount: number, currency: string): string {
  const formattedAmount = amount.toLocaleString();
  
  const currencySymbols: Record<string, string> = {
    'NGN': '₦',
    'USD': '$',
    'GBP': '£',
    'EUR': '€',
    'AED': 'AED ',
  };
  
  const symbol = currencySymbols[currency] || currency;
  return `${symbol}${formattedAmount}`;
}

/**
 * Get the currency symbol for a given currency code
 * @param currency - The currency code
 * @returns The currency symbol
 * 
 * @example
 * getCurrencySymbol('NGN') // "₦"
 * getCurrencySymbol('USD') // "$"
 */
export function getCurrencySymbol(currency: string): string {
  const currencySymbols: Record<string, string> = {
    'NGN': '₦',
    'USD': '$',
    'GBP': '£',
    'EUR': '€',
    'AED': 'AED ',
  };
  
  return currencySymbols[currency] || currency;
}

/**
 * Format a price range
 * @param minAmount - Minimum amount
 * @param maxAmount - Maximum amount
 * @param currency - Currency code
 * @returns Formatted price range string
 * 
 * @example
 * formatPriceRange(100000, 500000, 'NGN') // "₦100,000 - ₦500,000"
 */
export function formatPriceRange(minAmount: number, maxAmount: number, currency: string): string {
  return `${formatPrice(minAmount, currency)} - ${formatPrice(maxAmount, currency)}`;
}

/**
 * Format price per unit (e.g., per night, per person)
 * @param amount - The numeric amount
 * @param currency - The currency code
 * @param unit - The unit (e.g., 'night', 'person', 'ticket')
 * @returns Formatted price string with unit
 * 
 * @example
 * formatPricePerUnit(375000, 'NGN', 'night') // "₦375,000 / night"
 * formatPricePerUnit(25000, 'NGN', 'ticket') // "₦25,000 / ticket"
 */
export function formatPricePerUnit(amount: number, currency: string, unit: string): string {
  return `${formatPrice(amount, currency)} / ${unit}`;
}
