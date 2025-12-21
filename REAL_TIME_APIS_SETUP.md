# Real-Time Weather and Currency APIs Setup

This document explains how to set up real-time weather forecasts and currency exchange rates for the Diasporan travel platform.

## Features Added

### 🌤️ Real-Time Weather Forecast
- Current weather conditions for any city
- 5-day weather forecast
- Real weather data from WeatherAPI.com
- Fallback to mock data if API is unavailable
- Automatic caching (30 minutes)

### 💱 Real-Time Currency Exchange Rates
- Live exchange rates for NGN to major world currencies
- Multiple API providers for reliability
- Automatic refresh functionality
- Fallback to mock data if APIs are unavailable
- Automatic caching (1 hour)

## API Setup Instructions

### Weather API (WeatherAPI.com)

1. **Get a Free API Key:**
   - Visit [https://www.weatherapi.com/](https://www.weatherapi.com/)
   - Sign up for a free account
   - Get your API key from the dashboard
   - Free tier includes: 1 million calls/month, 7-day forecast

2. **Add to Environment Variables:**
   ```bash
   WEATHER_API_KEY=your_weather_api_key_here
   ```

### Currency APIs (Multiple Options)

The app tries multiple currency APIs in order of preference. You can use any or all of them:

#### Option 1: ExchangeRate.host (Recommended - Free, No API Key Required)
- **URL:** [https://exchangerate.host/](https://exchangerate.host/)
- **Features:** Free, no registration required, reliable
- **Already configured** - no setup needed!

#### Option 2: ExchangeRate-API (Backup)
1. **Get API Key:**
   - Visit [https://app.exchangerate-api.com/sign-up](https://app.exchangerate-api.com/sign-up)
   - Free tier: 1,500 requests/month

2. **Add to Environment Variables:**
   ```bash
   EXCHANGE_RATE_API_KEY=your_exchange_rate_api_key_here
   ```

#### Option 3: CurrencyLayer (Backup)
1. **Get API Key:**
   - Visit [https://currencylayer.com/](https://currencylayer.com/)
   - Free tier: 1,000 requests/month

2. **Add to Environment Variables:**
   ```bash
   CURRENCY_LAYER_API_KEY=your_currency_layer_api_key_here
   ```

#### Option 4: Fixer.io (Backup)
1. **Get API Key:**
   - Visit [https://fixer.io/](https://fixer.io/)
   - Free tier: 100 requests/month

2. **Add to Environment Variables:**
   ```bash
   FIXER_API_KEY=your_fixer_api_key_here
   ```

## Environment Variables Setup

Add these to your `.env.local` file:

```bash
# Weather API Configuration
WEATHER_API_KEY=your_weather_api_key_here

# Currency API Configuration (Optional - app will work without these)
EXCHANGE_RATE_API_KEY=your_exchange_rate_api_key_here
CURRENCY_LAYER_API_KEY=your_currency_layer_api_key_here
FIXER_API_KEY=your_fixer_api_key_here
```

## How It Works

### Weather API Flow
1. User searches for a city or selects from popular destinations
2. App calls `/api/weather?city=cityname`
3. API tries to fetch from WeatherAPI.com
4. If successful, returns real weather data
5. If API fails, falls back to mock data
6. Data is cached for 30 minutes

### Currency API Flow
1. App loads and calls `/api/currency?base=NGN`
2. API tries multiple providers in order:
   - ExchangeRate.host (free, no key required)
   - ExchangeRate-API (if key provided)
   - CurrencyLayer (if key provided)
   - Fixer.io (if key provided)
3. If all fail, falls back to mock data
4. Data is cached for 1 hour
5. User can manually refresh rates

## Supported Currencies

- **USD** - US Dollar 🇺🇸
- **GBP** - British Pound 🇬🇧
- **EUR** - Euro 🇪🇺
- **CAD** - Canadian Dollar 🇨🇦
- **AUD** - Australian Dollar 🇦🇺
- **ZAR** - South African Rand 🇿🇦
- **GHS** - Ghanaian Cedi 🇬🇭
- **KES** - Kenyan Shilling 🇰🇪
- **JPY** - Japanese Yen 🇯🇵
- **CHF** - Swiss Franc 🇨🇭
- **CNY** - Chinese Yuan 🇨🇳
- **INR** - Indian Rupee 🇮🇳

## Popular Weather Destinations

- **Lagos, Nigeria** 🇳🇬
- **Accra, Ghana** 🇬🇭
- **Cape Town, South Africa** 🇿🇦
- **Nairobi, Kenya** 🇰🇪
- Any city worldwide (with API key)

## Testing

### Without API Keys
- Weather: Shows mock data for Lagos, Accra, Cape Town, Nairobi
- Currency: Uses mock exchange rates with realistic values

### With API Keys
- Weather: Real-time data for any city worldwide
- Currency: Live exchange rates updated hourly

## Error Handling

Both APIs include comprehensive error handling:
- Network failures → fallback to mock data
- API rate limits → fallback to mock data
- Invalid responses → fallback to mock data
- Missing API keys → fallback to mock data

## Performance

- **Caching:** Weather (30 min), Currency (1 hour)
- **Fallback:** Always available with mock data
- **Loading states:** Spinner animations during API calls
- **Error recovery:** Automatic fallback ensures app always works

## Usage Examples

### Weather API
```javascript
// Get weather for Lagos
const response = await fetch('/api/weather?city=lagos');
const data = await response.json();

// Get weather for any city
const response = await fetch('/api/weather?city=London');
```

### Currency API
```javascript
// Get all exchange rates for NGN
const response = await fetch('/api/currency?base=NGN');
const data = await response.json();

// Convert specific amount
const response = await fetch('/api/currency?base=NGN&target=USD&amount=1000');
```

## Next Steps

1. **Get Weather API Key** (recommended for full functionality)
2. **Test the APIs** - visit `/weather` and `/currency` pages
3. **Monitor Usage** - check API provider dashboards
4. **Upgrade Plans** if needed for higher usage

The app is designed to work perfectly even without API keys, using realistic mock data as fallback!