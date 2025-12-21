import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    hasWeatherApiKey: !!process.env.WEATHER_API_KEY,
    weatherApiKeyLength: process.env.WEATHER_API_KEY?.length || 0,
    weatherApiKeyFirst4: process.env.WEATHER_API_KEY?.substring(0, 4) || 'none',
    allEnvKeys: Object.keys(process.env).filter(key => 
      key.includes('WEATHER') || 
      key.includes('SUPABASE') || 
      key.startsWith('NEXT_PUBLIC_')
    ),
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV || 'not-vercel'
  })
}