# Naira Pricing Update Guide

## What Changed

All prices in the application have been updated from USD to Nigerian Naira (NGN):

### Flight Prices (₦)
- Lagos to London: ₦1,275,000 - ₦1,380,000
- Lagos to Dubai: ₦975,000
- Lagos to New York: ₦1,800,000
- Abuja to London: ₦1,170,000
- Business class to Doha: ₦4,200,000

### Accommodation Prices (per night in ₦)
- Luxury Villa Victoria Island: ₦375,000
- Modern Lekki Apartment: ₦180,000
- Executive Suites Maitama: ₦270,000
- Garden City Hotel Port Harcourt: ₦142,500
- London Townhouse: ₦525,000
- Dubai Marina Apartment: ₦300,000

### Frontend Updates
- ✅ Flights page now displays ₦ symbol with formatted numbers
- ✅ Stays page now displays ₦ symbol with formatted numbers
- ✅ Prices are formatted with thousand separators (e.g., ₦1,275,000)

## How to Apply the Changes

### Step 1: Update Your Database

You need to re-run the seed script in your Supabase dashboard:

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Clear Existing Data (Optional)**
   ```sql
   -- Only run this if you want to remove old USD data
   DELETE FROM flights;
   DELETE FROM accommodations;
   ```

4. **Run the Seed Script**
   - Open the file `supabase/seed.sql`
   - Copy ALL the contents
   - Paste into the SQL Editor
   - Click "Run" or press Ctrl+Enter

5. **Verify the Data**
   ```sql
   -- Check flights have NGN currency
   SELECT airline, price, currency FROM flights LIMIT 5;
   
   -- Check accommodations have NGN currency
   SELECT name, price_per_night, currency FROM accommodations LIMIT 5;
   ```

### Step 2: Restart Your Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart it
npm run dev
```

### Step 3: Clear Browser Cache

1. Open your browser's Developer Tools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

Or simply:
- Press Ctrl+Shift+R (Windows/Linux)
- Press Cmd+Shift+R (Mac)

### Step 4: Verify the Changes

1. **Check Flights Page**
   - Navigate to `/flights`
   - Prices should show as ₦1,275,000 format

2. **Check Stays Page**
   - Navigate to `/stays`
   - Prices should show as ₦375,000 format

3. **Check Events Page**
   - Navigate to `/events`
   - Ticket prices should already be in NGN (they were already correct)

## Troubleshooting

### Still Seeing USD Prices?

1. **Database not updated**
   - Make sure you ran the seed.sql script in Supabase
   - Check the database directly using the SQL query above

2. **Cache issue**
   - Clear your browser cache completely
   - Try in an incognito/private window

3. **API not returning new data**
   - Check the Network tab in Developer Tools
   - Look at the API responses for `/api/flights` and `/api/stays`
   - Verify the `currency` field shows "NGN"

### Prices Show as "NGN" Instead of "₦"?

This means the frontend update worked but you might need to refresh:
- The code now converts "NGN" to "₦" symbol automatically
- Hard refresh your browser (Ctrl+Shift+R)

## Files Modified

1. `supabase/seed.sql` - Updated all prices to NGN
2. `src/app/flights/page.tsx` - Added ₦ symbol formatting
3. `src/app/stays/page.tsx` - Added ₦ symbol formatting

## Exchange Rate Used

Approximately 1 USD = 1,500 NGN (rounded for realistic pricing)
