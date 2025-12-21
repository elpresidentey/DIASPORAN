import { NextRequest, NextResponse } from 'next/server'

interface WeatherAPIResponse {
  location: {
    name: string
    country: string
    region: string
    lat: number
    lon: number
    tz_id: string
    localtime_epoch: number
    localtime: string
  }
  current: {
    last_updated_epoch: number
    last_updated: string
    temp_c: number
    temp_f: number
    is_day: number
    condition: {
      text: string
      icon: string
      code: number
    }
    wind_mph: number
    wind_kph: number
    wind_degree: number
    wind_dir: string
    pressure_mb: number
    pressure_in: number
    precip_mm: number
    precip_in: number
    humidity: number
    cloud: number
    feelslike_c: number
    feelslike_f: number
    vis_km: number
    vis_miles: number
    uv: number
    gust_mph: number
    gust_kph: number
  }
  forecast: {
    forecastday: Array<{
      date: string
      date_epoch: number
      day: {
        maxtemp_c: number
        maxtemp_f: number
        mintemp_c: number
        mintemp_f: number
        avgtemp_c: number
        avgtemp_f: number
        maxwind_mph: number
        maxwind_kph: number
        totalprecip_mm: number
        totalprecip_in: number
        totalsnow_cm: number
        avgvis_km: number
        avgvis_miles: number
        avghumidity: number
        daily_will_it_rain: number
        daily_chance_of_rain: number
        daily_will_it_snow: number
        daily_chance_of_snow: number
        condition: {
          text: string
          icon: string
          code: number
        }
        uv: number
      }
      astro: {
        sunrise: string
        sunset: string
        moonrise: string
        moonset: string
        moon_phase: string
        moon_illumination: string
      }
      hour: Array<{
        time_epoch: number
        time: string
        temp_c: number
        temp_f: number
        is_day: number
        condition: {
          text: string
          icon: string
          code: number
        }
        wind_mph: number
        wind_kph: number
        wind_degree: number
        wind_dir: string
        pressure_mb: number
        pressure_in: number
        precip_mm: number
        precip_in: number
        humidity: number
        cloud: number
        feelslike_c: number
        feelslike_f: number
        windchill_c: number
        windchill_f: number
        heatindex_c: number
        heatindex_f: number
        dewpoint_c: number
        dewpoint_f: number
        will_it_rain: number
        chance_of_rain: number
        will_it_snow: number
        chance_of_snow: number
        vis_km: number
        vis_miles: number
        gust_mph: number
        gust_kph: number
        uv: number
      }>
    }>
  }
}

// Mock data fallback
const mockWeatherData = {
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
      { day: "Today", date: "Dec 18", high: 30, low: 24, condition: "Partly Cloudy", precipitation: 20 },
      { day: "Tomorrow", date: "Dec 19", high: 29, low: 23, condition: "Sunny", precipitation: 10 },
      { day: "Friday", date: "Dec 20", high: 31, low: 25, condition: "Thunderstorms", precipitation: 80 },
      { day: "Saturday", date: "Dec 21", high: 27, low: 22, condition: "Rainy", precipitation: 90 },
      { day: "Sunday", date: "Dec 22", high: 29, low: 24, condition: "Partly Cloudy", precipitation: 30 }
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
      { day: "Today", date: "Dec 18", high: 28, low: 22, condition: "Sunny", precipitation: 5 },
      { day: "Tomorrow", date: "Dec 19", high: 27, low: 21, condition: "Partly Cloudy", precipitation: 15 },
      { day: "Friday", date: "Dec 20", high: 29, low: 23, condition: "Sunny", precipitation: 0 },
      { day: "Saturday", date: "Dec 21", high: 30, low: 24, condition: "Partly Cloudy", precipitation: 20 },
      { day: "Sunday", date: "Dec 22", high: 28, low: 22, condition: "Cloudy", precipitation: 40 }
    ]
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city') || 'lagos'
    
    // WeatherAPI.com free tier API key (you can get one at https://www.weatherapi.com/)
    const API_KEY = process.env.WEATHER_API_KEY
    
    if (!API_KEY) {
      console.log('[Weather API] No API key found, using mock data')
      const mockData = mockWeatherData[city.toLowerCase() as keyof typeof mockWeatherData]
      if (mockData) {
        return NextResponse.json({ success: true, data: mockData })
      } else {
        return NextResponse.json({ success: false, error: 'City not found in mock data' }, { status: 404 })
      }
    }

    console.log(`[Weather API] Fetching weather for: ${city}`)
    
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=5&aqi=no&alerts=no`,
      {
        headers: {
          'User-Agent': 'Diasporan-Weather-App/1.0',
        },
        next: { revalidate: 1800 } // Cache for 30 minutes
      }
    )

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status} ${response.statusText}`)
    }

    const weatherData: WeatherAPIResponse = await response.json()
    
    // Transform the API response to match our interface
    const transformedData = {
      city: weatherData.location.name,
      country: weatherData.location.country,
      temperature: Math.round(weatherData.current.temp_c),
      condition: weatherData.current.condition.text,
      description: `${weatherData.current.condition.text.toLowerCase()} with ${weatherData.current.humidity}% humidity`,
      humidity: weatherData.current.humidity,
      windSpeed: Math.round(weatherData.current.wind_kph),
      visibility: Math.round(weatherData.current.vis_km),
      pressure: Math.round(weatherData.current.pressure_mb),
      forecast: weatherData.forecast.forecastday.map((day, index) => {
        const date = new Date(day.date)
        const dayNames = ['Today', 'Tomorrow', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday']
        
        return {
          day: index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : date.toLocaleDateString('en-US', { weekday: 'long' }),
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          high: Math.round(day.day.maxtemp_c),
          low: Math.round(day.day.mintemp_c),
          condition: day.day.condition.text,
          precipitation: day.day.daily_chance_of_rain
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: transformedData,
      source: 'weatherapi.com',
      lastUpdated: new Date().toISOString()
    })

  } catch (error) {
    console.error('[Weather API] Error:', error)
    
    // Fallback to mock data on error
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city') || 'lagos'
    const mockData = mockWeatherData[city.toLowerCase() as keyof typeof mockWeatherData]
    
    if (mockData) {
      return NextResponse.json({
        success: true,
        data: mockData,
        source: 'mock',
        error: 'Using fallback data due to API error'
      })
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch weather data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}