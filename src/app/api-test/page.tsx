"use client"

import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { useState } from "react"

export default function APITestPage() {
  const [weatherData, setWeatherData] = useState<any>(null)
  const [currencyData, setCurrencyData] = useState<any>(null)
  const [loading, setLoading] = useState<{ weather: boolean; currency: boolean }>({
    weather: false,
    currency: false
  })

  const testWeatherAPI = async () => {
    setLoading(prev => ({ ...prev, weather: true }))
    try {
      const response = await fetch('/api/weather?city=lagos')
      const data = await response.json()
      setWeatherData(data)
    } catch (error) {
      console.error('Weather API test failed:', error)
    } finally {
      setLoading(prev => ({ ...prev, weather: false }))
    }
  }

  const testCurrencyAPI = async () => {
    setLoading(prev => ({ ...prev, currency: true }))
    try {
      const response = await fetch('/api/currency?base=NGN')
      const data = await response.json()
      setCurrencyData(data)
    } catch (error) {
      console.error('Currency API test failed:', error)
    } finally {
      setLoading(prev => ({ ...prev, currency: false }))
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Real-Time APIs Test Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Weather API Test */}
          <Card>
            <CardHeader>
              <CardTitle>🌤️ Weather API Test</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={testWeatherAPI} 
                disabled={loading.weather}
                className="w-full"
              >
                {loading.weather ? 'Testing...' : 'Test Weather API'}
              </Button>
              
              {weatherData && (
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">API Response:</h3>
                  <div className="text-sm space-y-1">
                    <p><strong>Status:</strong> {weatherData.success ? '✅ Success' : '❌ Failed'}</p>
                    <p><strong>Source:</strong> {weatherData.source || 'Unknown'}</p>
                    {weatherData.data && (
                      <>
                        <p><strong>City:</strong> {weatherData.data.city}, {weatherData.data.country}</p>
                        <p><strong>Temperature:</strong> {weatherData.data.temperature}°C</p>
                        <p><strong>Condition:</strong> {weatherData.data.condition}</p>
                        <p><strong>Humidity:</strong> {weatherData.data.humidity}%</p>
                      </>
                    )}
                    {weatherData.error && (
                      <p className="text-gray-500"><strong>Error:</strong> {weatherData.error}</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Currency API Test */}
          <Card>
            <CardHeader>
              <CardTitle>💱 Currency API Test</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={testCurrencyAPI} 
                disabled={loading.currency}
                className="w-full"
              >
                {loading.currency ? 'Testing...' : 'Test Currency API'}
              </Button>
              
              {currencyData && (
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">API Response:</h3>
                  <div className="text-sm space-y-1">
                    <p><strong>Status:</strong> {currencyData.success ? '✅ Success' : '❌ Failed'}</p>
                    <p><strong>Source:</strong> {currencyData.data?.source || 'Unknown'}</p>
                    <p><strong>Base Currency:</strong> {currencyData.data?.baseCurrency}</p>
                    <p><strong>Rates Count:</strong> {currencyData.data?.exchangeRates?.length || 0}</p>
                    {currencyData.data?.exchangeRates?.slice(0, 3).map((rate: any) => (
                      <p key={rate.currency}>
                        <strong>{rate.currency}:</strong> {rate.symbol}{rate.rate.toFixed(6)} 
                        <span className={rate.change24h >= 0 ? 'text-green-600' : 'text-gray-600'}>
                          ({rate.change24h >= 0 ? '+' : ''}{rate.change24h}%)
                        </span>
                      </p>
                    ))}
                    {currencyData.error && (
                      <p className="text-gray-500"><strong>Error:</strong> {currencyData.error}</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* API Setup Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>🔧 API Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Weather API Setup</h3>
                <ol className="text-sm space-y-1 list-decimal list-inside">
                  <li>Visit <a href="https://www.weatherapi.com/" target="_blank" className="text-blue-600 hover:underline">WeatherAPI.com</a></li>
                  <li>Sign up for a free account</li>
                  <li>Get your API key</li>
                  <li>Add to .env.local: <code className="bg-muted px-1 rounded">WEATHER_API_KEY=your_key</code></li>
                  <li>Restart the server</li>
                </ol>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Currency API Setup</h3>
                <ol className="text-sm space-y-1 list-decimal list-inside">
                  <li>Currency API works without setup (uses exchangerate.host)</li>
                  <li>For backup APIs, get keys from:</li>
                  <li>• <a href="https://app.exchangerate-api.com/" target="_blank" className="text-blue-600 hover:underline">ExchangeRate-API</a></li>
                  <li>• <a href="https://currencylayer.com/" target="_blank" className="text-blue-600 hover:underline">CurrencyLayer</a></li>
                  <li>• <a href="https://fixer.io/" target="_blank" className="text-blue-600 hover:underline">Fixer.io</a></li>
                </ol>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
              <p className="text-sm">
                <strong>Note:</strong> Both APIs work with mock data as fallback, so the app functions perfectly even without API keys. 
                Real API keys provide live data for any city worldwide and current exchange rates.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}