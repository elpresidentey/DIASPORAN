"use client"

import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { ArrowUpDown, TrendingUp, TrendingDown, DollarSign, RefreshCw } from "lucide-react"
import { useState, useEffect, useCallback } from "react"

interface ExchangeRate {
  currency: string;
  rate: number;
  change24h: number;
  symbol: string;
  flag: string;
}

const exchangeRates: ExchangeRate[] = [
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
  const [amount, setAmount] = useState<string>("1000");
  const [fromCurrency, setFromCurrency] = useState<string>("NGN");
  const [toCurrency, setToCurrency] = useState<string>("USD");
  const [convertedAmount, setConvertedAmount] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const convertCurrency = useCallback(() => {
    const numAmount = parseFloat(amount) || 0;
    
    if (fromCurrency === "NGN") {
      const rate = exchangeRates.find(r => r.currency === toCurrency)?.rate || 1;
      setConvertedAmount(numAmount * rate);
    } else if (toCurrency === "NGN") {
      const rate = exchangeRates.find(r => r.currency === fromCurrency)?.rate || 1;
      setConvertedAmount(numAmount / rate);
    } else {
      // Convert through NGN
      const fromRate = exchangeRates.find(r => r.currency === fromCurrency)?.rate || 1;
      const toRate = exchangeRates.find(r => r.currency === toCurrency)?.rate || 1;
      const ngnAmount = numAmount / fromRate;
      setConvertedAmount(ngnAmount * toRate);
    }
  }, [amount, fromCurrency, toCurrency]);

  useEffect(() => {
    convertCurrency();
  }, [convertCurrency]);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const refreshRates = () => {
    setLastUpdated(new Date());
    // In a real app, you would fetch new rates from an API
  };

  const getCurrencySymbol = (currency: string) => {
    if (currency === "NGN") return "₦";
    return exchangeRates.find(r => r.currency === currency)?.symbol || currency;
  };

  const getCurrencyFlag = (currency: string) => {
    if (currency === "NGN") return "🇳🇬";
    return exchangeRates.find(r => r.currency === currency)?.flag || "🌍";
  };

  const allCurrencies = [
    { code: "NGN", name: "Nigerian Naira", symbol: "₦", flag: "🇳🇬" },
    ...exchangeRates.map(r => ({ code: r.currency, name: getCurrencyName(r.currency), symbol: r.symbol, flag: r.flag }))
  ];

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
          <Card className="mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Currency Converter</CardTitle>
              <CardDescription>
                Convert between Nigerian Naira and major world currencies
              </CardDescription>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
                <Button variant="ghost" size="sm" onClick={refreshRates} className="p-1">
                  <RefreshCw className="w-3 h-3" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                {/* From Currency */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">From</label>
                  <div className="space-y-2">
                    <select
                      value={fromCurrency}
                      onChange={(e) => setFromCurrency(e.target.value)}
                      className="w-full p-3 border border-border rounded-md bg-background"
                    >
                      {allCurrencies.map((currency) => (
                        <option key={currency.code} value={currency.code}>
                          {currency.flag} {currency.code} - {currency.name}
                        </option>
                      ))}
                    </select>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="text-lg font-semibold"
                    />
                  </div>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={swapCurrencies}
                    className="rounded-full p-3"
                  >
                    <ArrowUpDown className="w-4 h-4" />
                  </Button>
                </div>

                {/* To Currency */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">To</label>
                  <div className="space-y-2">
                    <select
                      value={toCurrency}
                      onChange={(e) => setToCurrency(e.target.value)}
                      className="w-full p-3 border border-border rounded-md bg-background"
                    >
                      {allCurrencies.map((currency) => (
                        <option key={currency.code} value={currency.code}>
                          {currency.flag} {currency.code} - {currency.name}
                        </option>
                      ))}
                    </select>
                    <div className="p-3 bg-muted rounded-md">
                      <div className="text-2xl font-bold">
                        {getCurrencySymbol(toCurrency)}{convertedAmount.toLocaleString(undefined, { 
                          minimumFractionDigits: 2, 
                          maximumFractionDigits: 6 
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Exchange Rate Info */}
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Exchange Rate</div>
                <div className="font-semibold">
                  1 {getCurrencyFlag(fromCurrency)} {fromCurrency} = {getCurrencySymbol(toCurrency)}{(convertedAmount / parseFloat(amount || "1")).toFixed(6)} {toCurrency}
                </div>
              </div>
            </CardContent>
          </Card>

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
                      <div className={`flex items-center gap-1 text-sm ${rate.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
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
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Travel Budget Calculator
              </CardTitle>
              <CardDescription>
                Estimate your travel expenses in different currencies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Daily Budget (NGN)</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Accommodation:</span>
                      <span className="font-medium">₦15,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Food & Drinks:</span>
                      <span className="font-medium">₦8,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Transportation:</span>
                      <span className="font-medium">₦5,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Activities:</span>
                      <span className="font-medium">₦7,000</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-bold">
                        <span>Total per day:</span>
                        <span>₦35,000</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">In USD</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Accommodation:</span>
                      <span className="font-medium">$18</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Food & Drinks:</span>
                      <span className="font-medium">$10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Transportation:</span>
                      <span className="font-medium">$6</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Activities:</span>
                      <span className="font-medium">$8</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-bold">
                        <span>Total per day:</span>
                        <span>$42</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">In GBP</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Accommodation:</span>
                      <span className="font-medium">£14</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Food & Drinks:</span>
                      <span className="font-medium">£8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Transportation:</span>
                      <span className="font-medium">£5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Activities:</span>
                      <span className="font-medium">£7</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-bold">
                        <span>Total per day:</span>
                        <span>£33</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}