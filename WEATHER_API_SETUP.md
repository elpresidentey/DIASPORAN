# Weather API Setup Guide

## Get Live Weather Data with WeatherAPI.com

Your weather page is now configured to use **live weather data** from WeatherAPI.com. Follow these simple steps to get your free API key:

### Step 1: Sign Up for Free API Key

1. Go to **https://www.weatherapi.com/**
2. Click on **"Sign Up Free"** or **"Get API Key"**
3. Create a free account (no credit card required)
4. You'll receive an API key immediately

### Step 2: Add API Key to Your Project

1. Open your `.env.local` file in the project root
2. Find the line: `WEATHER_API_KEY=your_weather_api_key_here`
3. Replace `your_weather_api_key_here` with your actual API key
4. Save the file

Example:
```
WEATHER_API_KEY=abc123def456ghi789jkl012mno345
```

### Step 3: Restart Your Development Server

After adding the API key, restart your development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart it
npm run dev
```

## Features You'll Get

✅ **Real-time weather data** for any city worldwide
✅ **5-day weather forecast** with accurate dates and days
✅ **Current conditions** including temperature, humidity, wind speed
✅ **Automatic updates** every 30 minutes
✅ **Global city search** - search for any city in the world

## Free Tier Limits

The free tier includes:
- **1 million API calls per month**
- **5-day forecast**
- **Current weather conditions**
- **No credit card required**

This is more than enough for development and moderate production use!

## Troubleshooting

### If you see "Weather API key not configured"
- Make sure you've added the API key to `.env.local`
- Restart your development server after adding the key
- Check that there are no extra spaces in the API key

### If you see "Invalid API key"
- Double-check that you copied the entire API key correctly
- Make sure you're using the API key from WeatherAPI.com (not another weather service)
- Try generating a new API key from your WeatherAPI.com dashboard

### If you see "City not found"
- Check the spelling of the city name
- Try using the full city name (e.g., "New York" instead of "NY")
- Some cities may need the country name (e.g., "London, UK")

## API Documentation

For more information about the WeatherAPI.com API:
- Documentation: https://www.weatherapi.com/docs/
- Dashboard: https://www.weatherapi.com/my/
- Support: https://www.weatherapi.com/contact.aspx

## What Changed

✅ **Removed all mock data** - No more fake weather information
✅ **Fixed day names** - Days now show correctly (Today, Tomorrow, Monday, etc.)
✅ **Live updates** - Weather data refreshes every 30 minutes
✅ **Better error handling** - Clear messages if API key is missing or invalid
✅ **Global coverage** - Search for weather in any city worldwide

Enjoy your live weather updates! 🌤️