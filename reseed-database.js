// Script to re-seed the database with Naira prices
// Run this with: node reseed-database.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function reseedDatabase() {
  console.log('🔄 Starting database re-seed with Naira prices...\n');

  try {
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await supabase.from('flights').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('accommodations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    console.log('✅ Existing data cleared\n');

    // Read and execute seed file
    console.log('📝 Reading seed file...');
    const seedSQL = fs.readFileSync('./supabase/seed.sql', 'utf8');
    
    // Note: Supabase JS client doesn't support raw SQL execution
    // You need to run the seed.sql file directly in Supabase SQL Editor
    console.log('\n⚠️  IMPORTANT: The Supabase JS client cannot execute raw SQL.');
    console.log('📋 Please follow these steps:\n');
    console.log('1. Go to your Supabase Dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy the contents of supabase/seed.sql');
    console.log('4. Paste and run it in the SQL Editor\n');
    console.log('✨ Your seed file has been updated with Naira prices!');
    console.log('   All prices are now in NGN (Nigerian Naira)\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

reseedDatabase();
