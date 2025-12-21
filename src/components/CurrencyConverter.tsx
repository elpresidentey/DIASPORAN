"use client"

import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { ArrowUpDown, RefreshCw, Calculator, Copy, Check } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { useClientTime } from "@/lib/hooks/useClientTime"

interface ExchangeRate {
  currency: string;
  rate: number;
  change24h: number;
  symbol: string;
  flag: string;
  name: string;
}

interface CurrencyConverterProps {
  className?: string;
  showHeader?: boolean;
  compact?: boolean;
}

export function CurrencyConverter({ className = "", showHeader = true, compact = false }: CurrencyConverterProps) {
  const [amount, setAmount] = useState<string>("1000");
  const [fromCurrency, setFromCurrency] = useState<string>("NGN");
  const [toCurrency, setToCurrency] = useState<string>("USD");
  const [convertedAmount, setConvertedAmount] = useState<number>(0);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [copied, setCopied] = useState<boolean>(false);
  
  const formattedTime = useClientTime(lastUpdated);

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
      }
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

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
  }, [amount, fromCurrency, toCurrency, exchangeRates]);

  useEffect(() => {
    fetchExchangeRates();
  }, [fetchExchangeRates]);

  useEffect(() => {
    convertCurrency();
  }, [convertCurrency]);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const refreshRates = () => {
    fetchExchangeRates();
  };

  const getCurrencySymbol = (currency: string) => {
    if (currency === "NGN") return "₦";
    return exchangeRates.find(r => r.currency === currency)?.symbol || currency;
  };

  const getCurrencyFlag = (currency: string) => {
    if (currency === "NGN") return "🇳🇬";
    return exchangeRates.find(r => r.currency === currency)?.flag || "🌍";
  };

  const getCurrencyName = (currency: string) => {
    if (currency === "NGN") return "Nigerian Naira";
    return exchangeRates.find(r => r.currency === currency)?.name || currency;
  };

  const allCurrencies = [
    { code: "NGN", name: "Nigerian Naira", symbol: "₦", flag: "🇳🇬" },
    ...exchangeRates.map(r => ({ code: r.currency, name: r.name, symbol: r.symbol, flag: r.flag }))
  ];

  const copyResult = async () => {
    const resultText = `${getCurrencySymbol(fromCurrency)}${parseFloat(amount).toLocaleString()} ${fromCurrency} = ${getCurrencySymbol(toCurrency)}${convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })} ${toCurrency}`;
    
    try {
      await navigator.clipboard.writeText(resultText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const quickAmounts = [100, 500, 1000, 5000, 10000, 50000];

  return (
    <Card className={className}>
      {showHeader && (
        <CardHeader className="text-center">
          <CardTitle className={`flex items-center justify-center gap-2 ${compact ? 'text-lg' : 'text-2xl'}`}>
            <Calculator className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
            Currency Converter
          </CardTitle>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>Updated: {formattedTime}</span>
            <Button variant="ghost" size="sm" onClick={refreshRates} className="p-1" disabled={isLoading}>
              <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
      )}
      
      <CardContent className="space-y-6">
        {/* Quick Amount Buttons */}
        {!compact && (
          <div className="flex flex-wrap gap-2 justify-center">
            {quickAmounts.map((quickAmount) => (
              <Button
                key={quickAmount}
                variant={amount === quickAmount.toString() ? "default" : "outline"}
                size="sm"
                onClick={() => setAmount(quickAmount.toString())}
                className="text-xs"
              >
                ₦{quickAmount.toLocaleString()}
              </Button>
            ))}
          </div>
        )}

        <div className={`grid gap-4 items-end ${compact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
          {/* From Currency */}
          <div className="space-y-2">
            <label className="text-sm font-medium">From</label>
            <div className="space-y-2">
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full p-3 border border-border rounded-md bg-background text-sm"
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
                className={`font-semibold ${compact ? 'text-base' : 'text-lg'}`}
              />
            </div>
          </div>

          {/* Swap Button */}
          {!compact && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={swapCurrencies}
                className="rounded-full p-3"
                title="Swap currencies"
              >
                <ArrowUpDown className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* To Currency */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">To</label>
              {compact && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={swapCurrencies}
                  className="p-1"
                  title="Swap currencies"
                >
                  <ArrowUpDown className="w-3 h-3" />
                </Button>
              )}
            </div>
            <div className="space-y-2">
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full p-3 border border-border rounded-md bg-background text-sm"
              >
                {allCurrencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.flag} {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
              <div className="relative">
                <div className={`p-3 bg-muted rounded-md ${compact ? 'text-lg' : 'text-2xl'} font-bold`}>
                  {getCurrencySymbol(toCurrency)}{convertedAmount.toLocaleString(undefined, { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 6 
                  })}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyResult}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                  title="Copy result"
                >
                  {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Exchange Rate Info */}
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">Exchange Rate</div>
          <div className="font-semibold text-sm">
            1 {getCurrencyFlag(fromCurrency)} {fromCurrency} = {getCurrencySymbol(toCurrency)}{(convertedAmount / parseFloat(amount || "1")).toFixed(6)} {toCurrency}
          </div>
        </div>

        {/* Conversion History */}
        {!compact && (
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">Popular Conversions</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-muted/30 rounded">
                <div className="font-medium">₦1,000 → ${(1000 * (exchangeRates.find(r => r.currency === 'USD')?.rate || 0.0012)).toFixed(2)}</div>
              </div>
              <div className="p-2 bg-muted/30 rounded">
                <div className="font-medium">₦10,000 → £{(10000 * (exchangeRates.find(r => r.currency === 'GBP')?.rate || 0.00095)).toFixed(2)}</div>
              </div>
              <div className="p-2 bg-muted/30 rounded">
                <div className="font-medium">₦50,000 → €{(50000 * (exchangeRates.find(r => r.currency === 'EUR')?.rate || 0.0011)).toFixed(2)}</div>
              </div>
              <div className="p-2 bg-muted/30 rounded">
                <div className="font-medium">₦100,000 → R{(100000 * (exchangeRates.find(r => r.currency === 'ZAR')?.rate || 0.022)).toFixed(0)}</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}