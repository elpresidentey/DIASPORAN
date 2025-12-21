"use client"

import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react"
import { CurrencyConverter } from "@/components/CurrencyConverter"
import { TravelBudgetCalculator } from "@/components/TravelBudgetCalculator"
import { useState, useEffect, useCallback } from "react"

interface ExchangeRate {
  currency: string;
  rate: number;
  change24h: number;
  symbol: string;
  flag: string;
}

const mockExchangeRates: ExchangeRate[] = [
  { currency: "USD", rate: 0.0012, change24h: -0.5, symbol: "$", flag: "🇺🇸" },
  { currency: "GBP", rate: 0.00095, change24h: 0.3, symbol: "£", flag: "🇬🇧" },
  { currency: "EUR", rate: 0.0011, change24h: -0.2, symbol: "€", flag: "🇪🇺" },
  { currency: "CAD", rate: 0.0016, change24h: 0.1, symbol: "C$", flag: "🇨🇦" },
  { currency: "AUD", rate: 0.0018, change24h: -0.4, symbol: "A$", flag: "🇦🇺" },
  { currency: "ZAR", rate: 0.022, change24h: 0.8, symbol: "R", flag: "🇿🇦" },
  { currency: "GHS", rate: 0.0074, change24h: -0.1, symbol: "₵", flag: "🇬🇭" },
  { currency: "KES", rate: 0.16, change24h: 0.2, symbol: "KSh", flag: "🇰🇪" }
];

export default function CurrencyPage() {
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>(mockExchangeRates);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchExchangeRates = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/currency?base=NGN');
      const result = await response.json();
      
      if (result.success) {
        setExchangeRates(result.data.exchangeRates);
        setLastUpdated(new Date(result.data.lastUpdated));
      } else {
        console.error('Currency API error:', result.error);
        setExchangeRates(mockExchangeRates);
      }
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
      setExchangeRates(mockExchangeRates);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExchangeRates();
  }, [fetchExchangeRates]);

  const refreshRates = () => {
    fetchExchangeRates();
  };

  function getCurrencyName(code: string): string {
    const names: { [key: string]: string } = {
      "USD": "US Dollar",
      "GBP": "British Pound",
      "EUR": "Euro",
      "CAD": "Canadian Dollar",
      "AUD": "Australian Dollar",
      "ZAR": "South African Rand",
      "GHS": "Ghanaian Cedi",
      "KES": "Kenyan Shilling"
    };
    return names[code] || code;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
        
        <div className="relative z-10 container mx-auto max-w-6xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Currency <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Converter</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-3xl mx-auto">
            Get real-time exchange rates for Nigerian Naira and major world currencies. 
            Plan your travel budget with accurate currency conversions.
          </p>
        </div>
      </section>

      {/* Currency Converter */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <CurrencyConverter className="mb-8" />

          {/* Exchange Rates Table */}
          <Card>
            <CardHeader>
              <CardTitle>Current Exchange Rates</CardTitle>
              <CardDescription>1 NGN equals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {exchangeRates.map((rate) => (
                  <div key={rate.currency} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{rate.flag}</span>
                        <span className="font-semibold">{rate.currency}</span>
                      </div>
                      <div className={`flex items-center gap-1 text-sm ${rate.change24h >= 0 ? 'text-green-600' : 'text-gray-600'}`}>
                        {rate.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {Math.abs(rate.change24h)}%
                      </div>
                    </div>
                    <div className="text-lg font-bold">
                      {rate.symbol}{rate.rate.toFixed(rate.rate < 0.01 ? 6 : 4)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {getCurrencyName(rate.currency)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Travel Budget Calculator */}
          <TravelBudgetCalculator className="mt-8" />
        </div>
      </section>
    </div>
  )
}