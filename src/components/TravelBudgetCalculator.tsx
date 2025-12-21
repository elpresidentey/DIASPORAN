"use client"

import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { DollarSign, Plane, Bed, Utensils, Car, MapPin, Calculator } from "lucide-react"
import { useState, useEffect, useCallback } from "react"

interface ExchangeRate {
  currency: string;
  rate: number;
  symbol: string;
  flag: string;
  name: string;
}

interface BudgetItem {
  category: string;
  amount: number;
  icon: React.ReactNode;
  description: string;
}

interface TravelBudgetCalculatorProps {
  className?: string;
}

export function TravelBudgetCalculator({ className = "" }: TravelBudgetCalculatorProps) {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    { category: "Accommodation", amount: 15000, icon: <Bed className="w-4 h-4" />, description: "Hotels, hostels, Airbnb" },
    { category: "Food & Drinks", amount: 8000, icon: <Utensils className="w-4 h-4" />, description: "Meals, snacks, beverages" },
    { category: "Transportation", amount: 5000, icon: <Car className="w-4 h-4" />, description: "Local transport, taxis" },
    { category: "Activities", amount: 7000, icon: <MapPin className="w-4 h-4" />, description: "Tours, attractions, entertainment" },
    { category: "Shopping", amount: 3000, icon: <DollarSign className="w-4 h-4" />, description: "Souvenirs, personal items" },
    { category: "Miscellaneous", amount: 2000, icon: <Calculator className="w-4 h-4" />, description: "Tips, emergencies, extras" }
  ]);
  
  const [days, setDays] = useState<number>(7);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>(["USD", "GBP", "EUR"]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchExchangeRates = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/currency?base=NGN');
      const result = await response.json();
      
      if (result.success) {
        setExchangeRates(result.data.exchangeRates);
      }
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExchangeRates();
  }, [fetchExchangeRates]);

  const updateBudgetItem = (category: string, amount: number) => {
    setBudgetItems(prev => 
      prev.map(item => 
        item.category === category ? { ...item, amount } : item
      )
    );
  };

  const totalDailyBudget = budgetItems.reduce((sum, item) => sum + item.amount, 0);
  const totalTripBudget = totalDailyBudget * days;

  const convertAmount = (amount: number, toCurrency: string): number => {
    const rate = exchangeRates.find(r => r.currency === toCurrency)?.rate || 0;
    return amount * rate;
  };

  const getCurrencySymbol = (currency: string): string => {
    return exchangeRates.find(r => r.currency === currency)?.symbol || currency;
  };

  const getCurrencyFlag = (currency: string): string => {
    return exchangeRates.find(r => r.currency === currency)?.flag || "🌍";
  };

  const availableCurrencies = exchangeRates.filter(rate => 
    ["USD", "GBP", "EUR", "CAD", "AUD", "ZAR", "GHS", "KES"].includes(rate.currency)
  );

  const toggleCurrency = (currency: string) => {
    setSelectedCurrencies(prev => 
      prev.includes(currency) 
        ? prev.filter(c => c !== currency)
        : [...prev, currency].slice(0, 4) // Limit to 4 currencies
    );
  };

  const presetBudgets = [
    { name: "Budget Traveler", multiplier: 0.6 },
    { name: "Mid-Range", multiplier: 1.0 },
    { name: "Luxury", multiplier: 2.0 },
    { name: "Backpacker", multiplier: 0.4 }
  ];

  const applyPreset = (multiplier: number) => {
    setBudgetItems(prev => 
      prev.map(item => ({
        ...item,
        amount: Math.round(item.amount * multiplier)
      }))
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Travel Budget Calculator
        </CardTitle>
        <CardDescription>
          Plan your travel expenses with real-time currency conversion
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Trip Duration */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium min-w-fit">Trip Duration:</label>
          <Input
            type="number"
            value={days}
            onChange={(e) => setDays(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-20"
            min="1"
          />
          <span className="text-sm text-muted-foreground">days</span>
        </div>

        {/* Budget Presets */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Quick Presets:</label>
          <div className="flex flex-wrap gap-2">
            {presetBudgets.map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                size="sm"
                onClick={() => applyPreset(preset.multiplier)}
                className="text-xs"
              >
                {preset.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Budget Items */}
        <div className="space-y-4">
          <h3 className="font-semibold">Daily Budget Breakdown (NGN)</h3>
          <div className="space-y-3">
            {budgetItems.map((item) => (
              <div key={item.category} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                <div className="flex items-center gap-2 flex-1">
                  {item.icon}
                  <div>
                    <div className="font-medium text-sm">{item.category}</div>
                    <div className="text-xs text-muted-foreground">{item.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">₦</span>
                  <Input
                    type="number"
                    value={item.amount}
                    onChange={(e) => updateBudgetItem(item.category, parseInt(e.target.value) || 0)}
                    className="w-24 text-right"
                    min="0"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Currency Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Show in currencies:</label>
          <div className="flex flex-wrap gap-2">
            {availableCurrencies.map((currency) => (
              <Button
                key={currency.currency}
                variant={selectedCurrencies.includes(currency.currency) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleCurrency(currency.currency)}
                className="text-xs"
              >
                {currency.flag} {currency.currency}
              </Button>
            ))}
          </div>
        </div>

        {/* Budget Summary */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Daily Total */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2">Daily Total</h4>
              <div className="space-y-1">
                <div className="text-xl font-bold">₦{totalDailyBudget.toLocaleString()}</div>
                {selectedCurrencies.map((currency) => (
                  <div key={currency} className="text-sm text-muted-foreground">
                    {getCurrencyFlag(currency)} {getCurrencySymbol(currency)}{convertAmount(totalDailyBudget, currency).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                ))}
              </div>
            </div>

            {/* Trip Total */}
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-2">Trip Total ({days} days)</h4>
              <div className="space-y-1">
                <div className="text-xl font-bold text-primary">₦{totalTripBudget.toLocaleString()}</div>
                {selectedCurrencies.map((currency) => (
                  <div key={currency} className="text-sm text-muted-foreground">
                    {getCurrencyFlag(currency)} {getCurrencySymbol(currency)}{convertAmount(totalTripBudget, currency).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="space-y-2">
            <h4 className="font-semibold">Category Breakdown (Trip Total)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {budgetItems.map((item) => {
                const categoryTotal = item.amount * days;
                const percentage = ((item.amount / totalDailyBudget) * 100).toFixed(1);
                
                return (
                  <div key={item.category} className="p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      {item.icon}
                      <span className="font-medium text-sm">{item.category}</span>
                    </div>
                    <div className="text-lg font-bold">₦{categoryTotal.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{percentage}% of budget</div>
                    {selectedCurrencies.slice(0, 1).map((currency) => (
                      <div key={currency} className="text-xs text-muted-foreground">
                        {getCurrencySymbol(currency)}{convertAmount(categoryTotal, currency).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Budget Tips */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">💡 Budget Tips</h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Add 10-20% buffer for unexpected expenses</li>
            <li>• Consider seasonal price variations</li>
            <li>• Check if your destination accepts card payments</li>
            <li>• Research local tipping customs</li>
            <li>• Book accommodations and flights early for better rates</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}