"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets, Eye, Compass, MapPin, Search } from "lucide-react";
import { useState, useEffect } from "react";

interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  pressure: number;
  forecast: DayForecast[];
}

interface DayForecast {
  day: string;
  date: string;
  high: number;
  low: number;
  condition: string;
  precipitation: number;
}

const mockWeatherData: { [key: string]: WeatherData } = {
  "lagos": {
    city: "Lagos",
    country: "Nigeria",
    temperature: 28,
    condition: "Partly Cloudy",
    description: "Warm with occasional clouds",
    humidity: 75,
    windSpeed: 12,
    visibility: 10,
    pressure: 1013,
    forecast: [
      { day: "Today", date: "Dec 16", high: 30, low: 24, condition: "Partly Cloudy", precipitation: 20 },
      { day: "Tomorrow", date: "Dec 17", high: 29, low: 23, condition: "Sunny", precipitation: 10 },
      { day: "Wednesday", date: "Dec 18", high: 31, low: 25, condition: "Thunderstorms", precipitation: 80 },
      { day: "Thursday", date: "Dec 19", high: 27, low: 22, condition: "Rainy", precipitation: 90 },
      { day: "Friday", date: "Dec 20", high: 29, low: 24, condition: "Partly Cloudy", precipitation: 30 }
    ]
  },
  "accra": {
    city: "Accra",
    country: "Ghana",
    temperature: 26,
    condition: "Sunny",
    description: "Clear skies with gentle breeze",
    humidity: 68,
    windSpeed: 15,
    visibility: 12,
    pressure: 1015,
    forecast: [
      { day: "Today", date: "Dec 16", high: 28, low: 22, condition: "Sunny", precipitation: 5 },
      { day: "Tomorrow", date: "Dec 17", high: 27, low: 21, condition: "Partly Cloudy", precipitation: 15 },
      { day: "Wednesday", date: "Dec 18", high: 29, low: 23, condition: "Sunny", precipitation: 0 },
      { day: "Thursday", date: "Dec 19", high: 30, low: 24, condition: "Partly Cloudy", precipitation: 20 },
      { day: "Friday", date: "Dec 20", high: 28, low: 22, condition: "Cloudy", precipitation: 40 }
    ]
  },
  "cape town": {
    city: "Cape Town",
    country: "South Africa",
    temperature: 22,
    condition: "Windy",
    description: "Cool with strong winds",
    humidity: 60,
    windSpeed: 25,
    visibility: 15,
    pressure: 1018,
    forecast: [
      { day: "Today", date: "Dec 16", high: 24, low: 18, condition: "Windy", precipitation: 10 },
      { day: "Tomorrow", date: "Dec 17", high: 26, low: 19, condition: "Sunny", precipitation: 0 },
      { day: "Wednesday", date: "Dec 18", high: 25, low: 17, condition: "Partly Cloudy", precipitation: 15 },
      { day: "Thursday", date: "Dec 19", high: 23, low: 16, condition: "Rainy", precipitation: 70 },
      { day: "Friday", date: "Dec 20", high: 21, low: 15, condition: "Cloudy", precipitation: 50 }
    ]
  },
  "nairobi": {
    city: "Nairobi",
    country: "Kenya",
    temperature: 20,
    condition: "Cloudy",
    description: "Overcast with mild temperatures",
    humidity: 70,
    windSpeed: 8,
    visibility: 8,
    pressure: 1020,
    forecast: [
      { day: "Today", date: "Dec 16", high: 22, low: 16, condition: "Cloudy", precipitation: 60 },
      { day: "Tomorrow", date: "Dec 17", high: 24, low: 17, condition: "Partly Cloudy", precipitation: 30 },
      { day: "Wednesday", date: "Dec 18", high: 23, low: 15, condition: "Rainy", precipitation: 85 },
      { day: "Thursday", date: "Dec 19", high: 21, low: 14, condition: "Thunderstorms", precipitation: 95 },
      { day: "Friday", date: "Dec 20", high: 25, low: 18, condition: "Sunny", precipitation: 10 }
    ]
  }
};

const popularDestinations = [
  { name: "Lagos", country: "Nigeria", flag: "🇳🇬" },
  { name: "Accra", country: "Ghana", flag: "🇬🇭" },
  { name: "Cape Town", country: "South Africa", flag: "🇿🇦" },
  { name: "Nairobi", country: "Kenya", flag: "🇰🇪" }
];

export default function WeatherPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("lagos");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    loadWeatherData(selectedCity);
  }, [selectedCity]);

  const loadWeatherData = (city: string) => {
    const data = mockWeatherData[city.toLowerCase()];
    setWeatherData(data || null);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const city = searchQuery.toLowerCase();
      if (mockWeatherData[city]) {
        setSelectedCity(city);
        setSearchQuery("");
      }
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "sunny":
        return <Sun className="w-8 h-8 text-yellow-500" />;
      case "partly-cloudy":
      case "partly cloudy":
        return <Cloud className="w-8 h-8 text-gray-500" />;
      case "cloudy":
        return <Cloud className="w-8 h-8 text-gray-600" />;
      case "rainy":
        return <CloudRain className="w-8 h-8 text-blue-500" />;
      case "thunderstorm":
      case "thunderstorms":
        return <CloudRain className="w-8 h-8 text-purple-500" />;
      case "windy":
        return <Wind className="w-8 h-8 text-gray-500" />;
      default:
        return <Sun className="w-8 h-8 text-yellow-500" />;
    }
  };

  const getSmallWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "sunny":
        return <Sun className="w-5 h-5 text-yellow-500" />;
      case "partly-cloudy":
      case "partly cloudy":
        return <Cloud className="w-5 h-5 text-gray-500" />;
      case "cloudy":
        return <Cloud className="w-5 h-5 text-gray-600" />;
      case "rainy":
        return <CloudRain className="w-5 h-5 text-blue-500" />;
      case "thunderstorm":
      case "thunderstorms":
        return <CloudRain className="w-5 h-5 text-purple-500" />;
      case "windy":
        return <Wind className="w-5 h-5 text-gray-500" />;
      default:
        return <Sun className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
        
        <div className="relative z-10 container mx-auto max-w-6xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Weather <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Forecast</span>
          </h1>
          <p className="text-blue-100 text-lg md:text-xl mb-8 max-w-3xl mx-auto">
            Get accurate weather forecasts for African destinations. Plan your travels with confidence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for a city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
            </div>
            <Button onClick={handleSearch} className="gap-2 bg-white text-blue-900 hover:bg-white/90">
              <Search className="w-4 h-4" />
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold mb-4">Popular Destinations</h2>
        <div className="flex flex-wrap gap-2">
          {popularDestinations.map((dest) => (
            <Button
              key={dest.name}
              variant={selectedCity === dest.name.toLowerCase() ? "primary" : "outline"}
              size="sm"
              onClick={() => setSelectedCity(dest.name.toLowerCase())}
              className="gap-2"
            >
              <span>{dest.flag}</span>
              {dest.name}
            </Button>
          ))}
        </div>
      </section>

      {/* Current Weather */}
      {weatherData && (
        <section className="container mx-auto px-4 pb-8">
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <h2 className="text-2xl font-bold">{weatherData.city}, {weatherData.country}</h2>
                  </div>
                  
                  <div className="flex items-center justify-center lg:justify-start gap-6 mb-6">
                    <div className="text-center">
                      {getWeatherIcon(weatherData.condition)}
                      <div className="text-5xl font-bold mt-2">{weatherData.temperature}°C</div>
                    </div>
                    <div className="text-left">
                      <div className="text-xl font-semibold">{weatherData.condition}</div>
                      <div className="text-muted-foreground">{weatherData.description}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Droplets className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="text-sm text-muted-foreground">Humidity</div>
                      <div className="font-semibold">{weatherData.humidity}%</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Wind className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="text-sm text-muted-foreground">Wind Speed</div>
                      <div className="font-semibold">{weatherData.windSpeed} km/h</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Eye className="w-5 h-5 text-green-500" />
                    <div>
                      <div className="text-sm text-muted-foreground">Visibility</div>
                      <div className="font-semibold">{weatherData.visibility} km</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Compass className="w-5 h-5 text-purple-500" />
                    <div>
                      <div className="text-sm text-muted-foreground">Pressure</div>
                      <div className="font-semibold">{weatherData.pressure} hPa</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 5-Day Forecast */}
          <Card>
            <CardHeader>
              <CardTitle>5-Day Forecast</CardTitle>
              <CardDescription>Extended weather forecast for {weatherData.city}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {weatherData.forecast.map((day, index) => (
                  <div key={index} className="text-center p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="font-semibold mb-2">{day.day}</div>
                    <div className="text-sm text-muted-foreground mb-3">{day.date}</div>
                    <div className="flex justify-center mb-3">
                      {getSmallWeatherIcon(day.condition)}
                    </div>
                    <div className="text-sm font-medium mb-2">{day.condition}</div>
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold">{day.high}°</span>
                      <span className="text-muted-foreground">{day.low}°</span>
                    </div>
                    <div className="flex items-center justify-center gap-1 mt-2 text-xs text-blue-500">
                      <Droplets className="w-3 h-3" />
                      {day.precipitation}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Weather Tips */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Weather Travel Tips</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Make the most of your African adventure with weather-smart travel planning.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Sun className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
                <CardTitle>Dry Season Travel</CardTitle>
                <CardDescription>
                  Best time for safaris and outdoor activities. Pack light, breathable clothing and sun protection.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <CloudRain className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                <CardTitle>Rainy Season Tips</CardTitle>
                <CardDescription>
                  Bring waterproof gear and quick-dry clothing. Great for photography with lush landscapes.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <Thermometer className="w-12 h-12 mx-auto mb-4 text-red-500" />
                <CardTitle>Temperature Guide</CardTitle>
                <CardDescription>
                  Layer clothing for temperature changes. Coastal areas are milder, inland can be extreme.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}