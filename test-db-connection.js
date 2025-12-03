// Quick test to verify database connection and data
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gdbdtpsfuftmcpvczyra.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkYmR0cHNmdWZ0bWNwdmN6eXJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMzUxMzUsImV4cCI6MjA3OTgxMTEzNX0.jSopu5M3IOEwd7y2Ux6cZyCob8tOr6d-P4iG-rMjNpw'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  console.log('Testing Supabase connection...')
  console.log('URL:', supabaseUrl)
  console.log('Key:', supabaseAnonKey.substring(0, 20) + '...')
  
  // Test flights
  console.log('\n--- Testing Flights ---')
  const { data: flights, error: flightsError, count: flightsCount } = await supabase
    .from('flights')
    .select('*', { count: 'exact' })
    .limit(5)
  
  console.log('Flights count:', flightsCount)
  console.log('Flights error:', flightsError)
  console.log('Flights data:', flights?.length || 0, 'records')
  if (flights && flights.length > 0) {
    console.log('Sample flight:', flights[0])
  }
  
  // Test accommodations
  console.log('\n--- Testing Accommodations ---')
  const { data: accommodations, error: accError, count: accCount } = await supabase
    .from('accommodations')
    .select('*', { count: 'exact' })
    .limit(5)
  
  console.log('Accommodations count:', accCount)
  console.log('Accommodations error:', accError)
  console.log('Accommodations data:', accommodations?.length || 0, 'records')
  
  // Test events
  console.log('\n--- Testing Events ---')
  const { data: events, error: eventsError, count: eventsCount } = await supabase
    .from('events')
    .select('*', { count: 'exact' })
    .limit(5)
  
  console.log('Events count:', eventsCount)
  console.log('Events error:', eventsError)
  console.log('Events data:', events?.length || 0, 'records')
  
  // Test dining venues
  console.log('\n--- Testing Dining Venues ---')
  const { data: dining, error: diningError, count: diningCount } = await supabase
    .from('dining_venues')
    .select('*', { count: 'exact' })
    .limit(5)
  
  console.log('Dining venues count:', diningCount)
  console.log('Dining venues error:', diningError)
  console.log('Dining venues data:', dining?.length || 0, 'records')
  
  // Test transport
  console.log('\n--- Testing Transport Options ---')
  const { data: transport, error: transportError, count: transportCount } = await supabase
    .from('transport_options')
    .select('*', { count: 'exact' })
    .limit(5)
  
  console.log('Transport options count:', transportCount)
  console.log('Transport options error:', transportError)
  console.log('Transport options data:', transport?.length || 0, 'records')
}

testConnection().catch(console.error)
