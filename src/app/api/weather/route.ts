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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city') || 'lagos'
    
    // WeatherAPI.com API key - get your free key at https://www.weatherapi.com/
    const API_KEY = process.env.WEATHER_API_KEY
    
    if (!API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: 'Weather API key not configured. Please add WEATHER_API_KEY to your environment variables.',
          instructions: 'Get a free API key from https://www.weatherapi.com/ and add it to your .env.local file'
        },
        { status: 500 }
      )
    }

    console.log(`[Weather API] Fetching live weather data for: ${city}`)
    
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
      if (response.status === 400) {
        return NextResponse.json(
          {
            success: false,
            error: 'City not found. Please check the city name and try again.',
          },
          { status: 404 }
        )
      }
      
      if (response.status === 401) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid API key. Please check your WEATHER_API_KEY configuration.',
          },
          { status: 401 }
        )
      }
      
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
        
        // Get the correct day name based on the actual date
        let dayName: string
        if (index === 0) {
          dayName = 'Today'
        } else if (index === 1) {
          dayName = 'Tomorrow'
        } else {
          dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
        }
        
        return {
          day: dayName,
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
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch live weather data',
        details: error instanceof Error ? error.message : 'Unknown error',
        instructions: 'Please ensure you have a valid WEATHER_API_KEY in your environment variables'
      },
      { status: 500 }
    )
  }
}