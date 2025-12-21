import { NextRequest, NextResponse } from 'next/server'

interface ExchangeRateAPIResponse {
  success: boolean
  timestamp: number
  base: string
  date: string
  rates: {
    [key: string]: number
  }
}

interface CurrencyLayerResponse {
  success: boolean
  terms: string
  privacy: string
  timestamp: number
  source: string
  quotes: {
    [key: string]: number
  }
}

// Mock exchange rates as fallback
const mockExchangeRates = {
  "USD": 0.0012,
  "GBP": 0.00095,
  "EUR": 0.0011,
  "CAD": 0.0016,
  "AUD": 0.0018,
  "ZAR": 0.022,
  "GHS": 0.0074,
  "KES": 0.16,
  "JPY": 0.18,
  "CHF": 0.0011,
  "CNY": 0.0087,
  "INR": 0.10
}

const currencyNames: { [key: string]: string } = {
  "USD": "US Dollar",
  "GBP": "British Pound",
  "EUR": "Euro",
  "CAD": "Canadian Dollar",
  "AUD": "Australian Dollar",
  "ZAR": "South African Rand",
  "GHS": "Ghanaian Cedi",
  "KES": "Kenyan Shilling",
  "JPY": "Japanese Yen",
  "CHF": "Swiss Franc",
  "CNY": "Chinese Yuan",
  "INR": "Indian Rupee"
}

const currencySymbols: { [key: string]: string } = {
  "USD": "$",
  "GBP": "£",
  "EUR": "€",
  "CAD": "C$",
  "AUD": "A$",
  "ZAR": "R",
  "GHS": "₵",
  "KES": "KSh",
  "JPY": "¥",
  "CHF": "CHF",
  "CNY": "¥",
  "INR": "₹"
}

const currencyFlags: { [key: string]: string } = {
  // Major currencies
  "USD": "🇺🇸", // United States Dollar
  "EUR": "🇪🇺", // Euro
  "GBP": "🇬🇧", // British Pound
  "JPY": "🇯🇵", // Japanese Yen
  "CHF": "🇨🇭", // Swiss Franc
  "CAD": "🇨🇦", // Canadian Dollar
  "AUD": "🇦🇺", // Australian Dollar
  "CNY": "🇨🇳", // Chinese Yuan
  "INR": "🇮🇳", // Indian Rupee
  
  // African currencies
  "ZAR": "🇿🇦", // South African Rand
  "NGN": "🇳🇬", // Nigerian Naira
  "GHS": "🇬🇭", // Ghanaian Cedi
  "KES": "🇰🇪", // Kenyan Shilling
  "EGP": "🇪🇬", // Egyptian Pound
  "MAD": "🇲🇦", // Moroccan Dirham
  "TND": "🇹🇳", // Tunisian Dinar
  "ETB": "🇪🇹", // Ethiopian Birr
  "UGX": "🇺🇬", // Ugandan Shilling
  "TZS": "🇹🇿", // Tanzanian Shilling
  "RWF": "🇷🇼", // Rwandan Franc
  "MWK": "🇲🇼", // Malawian Kwacha
  "ZMW": "🇿🇲", // Zambian Kwacha
  "BWP": "🇧🇼", // Botswana Pula
  "NAD": "🇳🇦", // Namibian Dollar
  "SZL": "🇸🇿", // Swazi Lilangeni
  "LSL": "🇱🇸", // Lesotho Loti
  "MZN": "🇲🇿", // Mozambican Metical
  "AOA": "🇦🇴", // Angolan Kwanza
  "XAF": "🇨🇲", // Central African CFA Franc (using Cameroon flag)
  "XOF": "🇸🇳", // West African CFA Franc (using Senegal flag)
  "DZD": "🇩🇿", // Algerian Dinar
  "LYD": "🇱🇾", // Libyan Dinar
  "SDG": "🇸🇩", // Sudanese Pound
  "SSP": "🇸🇸", // South Sudanese Pound
  "SOS": "🇸🇴", // Somali Shilling
  "DJF": "🇩🇯", // Djiboutian Franc
  "ERN": "🇪🇷", // Eritrean Nakfa
  "BIF": "🇧🇮", // Burundian Franc
  "RUB": "🇷🇺", // Russian Ruble
  "CDF": "🇨🇩", // Congolese Franc
  "GMD": "🇬🇲", // Gambian Dalasi
  "GNF": "🇬🇳", // Guinean Franc
  "LRD": "🇱🇷", // Liberian Dollar
  "SLL": "🇸🇱", // Sierra Leonean Leone
  "CVE": "🇨🇻", // Cape Verdean Escudo
  "STN": "🇸🇹", // São Tomé and Príncipe Dobra
  "KMF": "🇰🇲", // Comorian Franc
  "SCR": "🇸🇨", // Seychellois Rupee
  "MUR": "🇲🇺", // Mauritian Rupee
  "MGA": "🇲🇬", // Malagasy Ariary
  
  // Middle East currencies
  "AED": "🇦🇪", // UAE Dirham
  "SAR": "🇸🇦", // Saudi Riyal
  "QAR": "🇶🇦", // Qatari Riyal
  "KWD": "🇰🇼", // Kuwaiti Dinar
  "BHD": "🇧🇭", // Bahraini Dinar
  "OMR": "🇴🇲", // Omani Rial
  "JOD": "🇯🇴", // Jordanian Dinar
  "LBP": "🇱🇧", // Lebanese Pound
  "SYP": "🇸🇾", // Syrian Pound
  "IQD": "🇮🇶", // Iraqi Dinar
  "IRR": "🇮🇷", // Iranian Rial
  "AFN": "🇦🇫", // Afghan Afghani
  "PKR": "🇵🇰", // Pakistani Rupee
  "BDT": "🇧🇩", // Bangladeshi Taka
  "LKR": "🇱🇰", // Sri Lankan Rupee
  "MVR": "🇲🇻", // Maldivian Rufiyaa
  "BTN": "🇧🇹", // Bhutanese Ngultrum
  "NPR": "🇳🇵", // Nepalese Rupee
  
  // European currencies
  "NOK": "🇳🇴", // Norwegian Krone
  "SEK": "🇸🇪", // Swedish Krona
  "DKK": "🇩🇰", // Danish Krone
  "ISK": "🇮🇸", // Icelandic Krona
  "PLN": "🇵🇱", // Polish Zloty
  "CZK": "🇨🇿", // Czech Koruna
  "HUF": "🇭🇺", // Hungarian Forint
  "RON": "🇷🇴", // Romanian Leu
  "BGN": "🇧🇬", // Bulgarian Lev
  "HRK": "🇭🇷", // Croatian Kuna
  "RSD": "🇷🇸", // Serbian Dinar
  "BAM": "🇧🇦", // Bosnia and Herzegovina Convertible Mark
  "MKD": "🇲🇰", // Macedonian Denar
  "ALL": "🇦🇱", // Albanian Lek
  "MDL": "🇲🇩", // Moldovan Leu
  "UAH": "🇺🇦", // Ukrainian Hryvnia
  "BYN": "🇧🇾", // Belarusian Ruble
  "GEL": "🇬🇪", // Georgian Lari
  "AMD": "🇦🇲", // Armenian Dram
  "AZN": "🇦🇿", // Azerbaijani Manat
  "KZT": "🇰🇿", // Kazakhstani Tenge
  "KGS": "🇰🇬", // Kyrgyzstani Som
  "UZS": "🇺🇿", // Uzbekistani Som
  "TJS": "🇹🇯", // Tajikistani Somoni
  "TMT": "🇹🇲", // Turkmenistani Manat
  "MNT": "🇲🇳", // Mongolian Tugrik
  
  // Asian currencies
  "KRW": "🇰🇷", // South Korean Won
  "TWD": "🇹🇼", // Taiwan Dollar
  "HKD": "🇭🇰", // Hong Kong Dollar
  "SGD": "🇸🇬", // Singapore Dollar
  "MYR": "🇲🇾", // Malaysian Ringgit
  "THB": "🇹🇭", // Thai Baht
  "IDR": "🇮🇩", // Indonesian Rupiah
  "PHP": "🇵🇭", // Philippine Peso
  "VND": "🇻🇳", // Vietnamese Dong
  "LAK": "🇱🇦", // Lao Kip
  "KHR": "🇰🇭", // Cambodian Riel
  "MMK": "🇲🇲", // Myanmar Kyat
  "BND": "🇧🇳", // Brunei Dollar
  "FJD": "🇫🇯", // Fijian Dollar
  "PGK": "🇵🇬", // Papua New Guinean Kina
  "SBD": "🇸🇧", // Solomon Islands Dollar
  "VUV": "🇻🇺", // Vanuatu Vatu
  "WST": "🇼🇸", // Samoan Tala
  "TOP": "🇹🇴", // Tongan Pa'anga
  "NZD": "🇳🇿", // New Zealand Dollar
  
  // Americas currencies
  "MXN": "🇲🇽", // Mexican Peso
  "GTQ": "🇬🇹", // Guatemalan Quetzal
  "BZD": "🇧🇿", // Belize Dollar
  "HNL": "🇭🇳", // Honduran Lempira
  "NIO": "🇳🇮", // Nicaraguan Córdoba
  "CRC": "🇨🇷", // Costa Rican Colón
  "PAB": "🇵🇦", // Panamanian Balboa
  "COP": "🇨🇴", // Colombian Peso
  "VES": "🇻🇪", // Venezuelan Bolívar
  "GYD": "🇬🇾", // Guyanese Dollar
  "SRD": "🇸🇷", // Surinamese Dollar
  "BRL": "🇧🇷", // Brazilian Real
  "UYU": "🇺🇾", // Uruguayan Peso
  "ARS": "🇦🇷", // Argentine Peso
  "CLP": "🇨🇱", // Chilean Peso
  "BOB": "🇧🇴", // Bolivian Boliviano
  "PEN": "🇵🇪", // Peruvian Sol
  "PYG": "🇵🇾", // Paraguayan Guaraní
  "JMD": "🇯🇲", // Jamaican Dollar
  "HTG": "🇭🇹", // Haitian Gourde
  "DOP": "🇩🇴", // Dominican Peso
  "CUP": "🇨🇺", // Cuban Peso
  "BBD": "🇧🇧", // Barbadian Dollar
  "TTD": "🇹🇹", // Trinidad and Tobago Dollar
  "XCD": "🇦🇬", // East Caribbean Dollar (using Antigua flag)
  
  // Other currencies
  "ILS": "🇮🇱", // Israeli Shekel
  "TRY": "🇹🇷", // Turkish Lira
  "CYP": "🇨🇾", // Cypriot Pound (legacy)
  "MTL": "🇲🇹", // Maltese Lira (legacy)
  
  // Special cases and territories
  "GGP": "🇬🇬", // Guernsey Pound
  "JEP": "🇯🇪", // Jersey Pound
  "IMP": "🇮🇲", // Isle of Man Pound
  "SHP": "🇸🇭", // Saint Helena Pound
  "FKP": "🇫🇰", // Falkland Islands Pound
  "GIP": "🇬🇮", // Gibraltar Pound
  "KYD": "🇰🇾", // Cayman Islands Dollar
  "BMD": "🇧🇲", // Bermudian Dollar
  "BSD": "🇧🇸", // Bahamian Dollar
  "AWG": "🇦🇼", // Aruban Florin
  "ANG": "🇳🇱", // Netherlands Antillean Guilder
  "MOP": "🇲🇴", // Macanese Pataca
  
  // Default fallback for unknown currencies
  "DEFAULT": "🌍"
}

async function fetchFromExchangeRateAPI(): Promise<any> {
  const API_KEY = process.env.EXCHANGE_RATE_API_KEY
  if (!API_KEY) return null

  const response = await fetch(
    `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/NGN`,
    {
      headers: {
        'User-Agent': 'Diasporan-Currency-App/1.0',
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    }
  )

  if (!response.ok) throw new Error(`ExchangeRate-API error: ${response.status}`)
  return await response.json()
}

async function fetchFromCurrencyLayer(): Promise<any> {
  const API_KEY = process.env.CURRENCY_LAYER_API_KEY
  if (!API_KEY) return null

  const response = await fetch(
    `https://api.currencylayer.com/live?access_key=${API_KEY}&source=NGN&format=1`,
    {
      headers: {
        'User-Agent': 'Diasporan-Currency-App/1.0',
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    }
  )

  if (!response.ok) throw new Error(`CurrencyLayer error: ${response.status}`)
  return await response.json()
}

async function fetchFromFixer(): Promise<any> {
  const API_KEY = process.env.FIXER_API_KEY
  if (!API_KEY) return null

  const response = await fetch(
    `https://api.fixer.io/latest?access_key=${API_KEY}&base=NGN&symbols=USD,GBP,EUR,CAD,AUD,ZAR,GHS,KES,JPY,CHF,CNY,INR`,
    {
      headers: {
        'User-Agent': 'Diasporan-Currency-App/1.0',
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    }
  )

  if (!response.ok) throw new Error(`Fixer.io error: ${response.status}`)
  return await response.json()
}

// Free API alternative - using exchangerate.host (no API key required)
async function fetchFromExchangeRateHost(): Promise<any> {
  const response = await fetch(
    `https://api.exchangerate.host/latest?base=NGN&symbols=USD,GBP,EUR,CAD,AUD,ZAR,GHS,KES,JPY,CHF,CNY,INR`,
    {
      headers: {
        'User-Agent': 'Diasporan-Currency-App/1.0',
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    }
  )

  if (!response.ok) throw new Error(`ExchangeRate.host error: ${response.status}`)
  return await response.json()
}

// Alternative free API - using exchangerate-api.com free tier (no key required for basic usage)
async function fetchFromFreeExchangeRateAPI(): Promise<any> {
  const response = await fetch(
    `https://open.er-api.com/v6/latest/NGN`,
    {
      headers: {
        'User-Agent': 'Diasporan-Currency-App/1.0',
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    }
  )

  if (!response.ok) throw new Error(`Open ExchangeRate API error: ${response.status}`)
  return await response.json()
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const baseCurrency = searchParams.get('base') || 'NGN'
    const targetCurrency = searchParams.get('target')
    const amount = parseFloat(searchParams.get('amount') || '1')

    console.log(`[Currency API] Fetching rates for base: ${baseCurrency}`)

    let exchangeData = null
    let dataSource = 'mock'

    // Try multiple APIs in order of preference
    try {
      // Try free exchangerate-api.com first (no API key required)
      exchangeData = await fetchFromFreeExchangeRateAPI()
      dataSource = 'open.er-api.com'
      console.log('[Currency API] Using open.er-api.com')
    } catch (error) {
      console.log('[Currency API] open.er-api.com failed:', error)
      
      try {
        // Try exchangerate.host (free, no API key required)
        exchangeData = await fetchFromExchangeRateHost()
        dataSource = 'exchangerate.host'
        console.log('[Currency API] Using exchangerate.host')
      } catch (error) {
        console.log('[Currency API] exchangerate.host failed:', error)
        
        try {
          // Try ExchangeRate-API (with key)
          exchangeData = await fetchFromExchangeRateAPI()
          dataSource = 'exchangerate-api.com'
          console.log('[Currency API] Using exchangerate-api.com')
        } catch (error) {
          console.log('[Currency API] exchangerate-api.com failed:', error)
          
          try {
            // Try CurrencyLayer
            exchangeData = await fetchFromCurrencyLayer()
            dataSource = 'currencylayer.com'
            console.log('[Currency API] Using currencylayer.com')
          } catch (error) {
            console.log('[Currency API] currencylayer.com failed:', error)
            
            try {
              // Try Fixer.io
              exchangeData = await fetchFromFixer()
              dataSource = 'fixer.io'
              console.log('[Currency API] Using fixer.io')
            } catch (error) {
              console.log('[Currency API] All APIs failed, using mock data')
            }
          }
        }
      }
    }

    let rates: { [key: string]: number } = {}

    if (exchangeData && exchangeData.success !== false) {
      // Handle different API response formats
      if (exchangeData.rates) {
        // ExchangeRate-API or Fixer.io format
        rates = exchangeData.rates
      } else if (exchangeData.quotes) {
        // CurrencyLayer format
        Object.keys(exchangeData.quotes).forEach(key => {
          const currency = key.replace('NGN', '')
          rates[currency] = exchangeData.quotes[key]
        })
      }
    } else {
      // Use mock data
      rates = mockExchangeRates
      dataSource = 'mock'
    }

    // Generate some realistic random changes for 24h (between -2% and +2%)
    const generateChange = () => (Math.random() - 0.5) * 4

    // Transform rates into our format
    const exchangeRates = Object.keys(rates)
      .filter(currency => currency !== baseCurrency)
      .map(currency => ({
        currency,
        rate: rates[currency],
        change24h: parseFloat(generateChange().toFixed(2)),
        symbol: currencySymbols[currency] || currency,
        flag: currencyFlags[currency] || currencyFlags["DEFAULT"],
        name: currencyNames[currency] || currency
      }))

    // Handle specific conversion if requested
    let conversionResult = null
    if (targetCurrency && amount) {
      const targetRate = rates[targetCurrency]
      if (targetRate) {
        conversionResult = {
          from: baseCurrency,
          to: targetCurrency,
          amount: amount,
          result: amount * targetRate,
          rate: targetRate
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        baseCurrency,
        exchangeRates,
        conversion: conversionResult,
        lastUpdated: new Date().toISOString(),
        source: dataSource
      }
    })

  } catch (error) {
    console.error('[Currency API] Error:', error)

    // Fallback to mock data
    const generateChange = () => (Math.random() - 0.5) * 4
    
    const exchangeRates = Object.keys(mockExchangeRates).map(currency => ({
      currency,
      rate: mockExchangeRates[currency as keyof typeof mockExchangeRates],
      change24h: parseFloat(generateChange().toFixed(2)),
      symbol: currencySymbols[currency] || currency,
      flag: currencyFlags[currency] || currencyFlags["DEFAULT"],
      name: currencyNames[currency] || currency
    }))

    return NextResponse.json({
      success: true,
      data: {
        baseCurrency: 'NGN',
        exchangeRates,
        conversion: null,
        lastUpdated: new Date().toISOString(),
        source: 'mock',
        error: 'Using fallback data due to API error'
      }
    })
  }
}