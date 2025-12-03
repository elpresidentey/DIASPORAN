# How to See Naira Prices in Your App

## Quick Start (3 Steps)

### Step 1: Update Your Database (REQUIRED)

Your seed file has been updated with Naira prices, but you need to load it into your database:

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your Diasporan project

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "+ New query"

3. **Clear Old Data**
   ```sql
   DELETE FROM flights;
   DELETE FROM accommodations;
   ```
   - Click "Run" (or press Ctrl+Enter)

4. **Load New Data**
   - Open the file `supabase/seed.sql` in your code editor
   - Copy EVERYTHING (Ctrl+A, then Ctrl+C)
   - Paste into the SQL Editor
   - Click "Run" (or press Ctrl+Enter)
   - Wait for "Success" message

### Step 2: Restart Your App

```bash
# In your terminal, stop the server (Ctrl+C if running)
# Then start it again:
npm run dev
```

### Step 3: Clear Browser Cache & Check

1. **Hard Refresh Your Browser**
   - Windows/Linux: Press `Ctrl + Shift + R`
   - Mac: Press `Cmd + Shift + R`

2. **Check These Pages:**
   - Go to http://localhost:3000/flights
   - Go to http://localhost:3000/stays
   - Go to http://localhost:3000/transport

3. **What You Should See:**
   - ✅ Flights: **₦1,275,000** (not $850 or NGN1275000)
   - ✅ Stays: **₦375,000** (not $250 or NGN375000)
   - ✅ Transport: **₦8,000** (already correct)

## Still Not Working?

### Verify Database Was Updated

Run this in Supabase SQL Editor:

```sql
-- Check flights
SELECT airline, price, currency FROM flights LIMIT 3;

-- Check accommodations  
SELECT name, price_per_night, currency FROM accommodations LIMIT 3;
```

**Expected Results:**
- All `currency` columns should show `NGN`
- Prices should be large numbers (e.g., 1275000, not 850)

### Check API Responses

1. Open your app in browser
2. Press F12 to open Developer Tools
3. Go to "Network" tab
4. Visit `/flights` page
5. Look for request to `/api/flights`
6. Click on it and check the "Response" tab

**You should see:**
```json
{
  "success": true,
  "data": [
    {
      "airline": "British Airways",
      "price": 1275000,
      "currency": "NGN",
      ...
    }
  ]
}
```

If you see `"currency": "USD"` or `"price": 850`, the database wasn't updated.

### Try Incognito/Private Window

Sometimes browser cache is stubborn:
- Chrome: Ctrl+Shift+N
- Firefox: Ctrl+Shift+P
- Safari: Cmd+Shift+N

Then visit your app in the private window.

## What Changed?

### Database (seed.sql)
- ✅ All flight prices converted to NGN (×1,500 rate)
- ✅ All accommodation prices converted to NGN
- ✅ Transport was already in NGN
- ✅ Events were already in NGN

### Frontend Code
- ✅ `src/app/flights/page.tsx` - Shows ₦ symbol
- ✅ `src/app/stays/page.tsx` - Shows ₦ symbol
- ✅ `src/app/transport/page.tsx` - Shows ₦ symbol
- ✅ `src/app/profile/page.tsx` - Shows ₦ symbol
- ✅ `src/lib/currency.ts` - New utility functions

### Price Examples

| Item | Old (USD) | New (NGN) |
|------|-----------|-----------|
| Lagos to London flight | $850 | ₦1,275,000 |
| Luxury Villa/night | $250 | ₦375,000 |
| Lekki Apartment/night | $120 | ₦180,000 |
| Lagos-Abuja bus | ₦8,000 | ₦8,000 (unchanged) |

## Common Issues

### Issue: Prices show as "NGN1275000"

**Cause:** Frontend code not updated or browser cache

**Fix:**
1. Make sure you pulled latest code
2. Hard refresh browser (Ctrl+Shift+R)
3. Restart dev server

### Issue: Prices still show "$850"

**Cause:** Database not updated

**Fix:**
1. Go back to Step 1 above
2. Make sure you ran the seed.sql in Supabase
3. Verify with the SQL query above

### Issue: No prices showing at all

**Cause:** API error or database connection issue

**Fix:**
1. Check browser console (F12) for errors
2. Check terminal for server errors
3. Verify .env.local has correct Supabase credentials

## Need More Help?

Check these files:
- `NAIRA_PRICING_UPDATE.md` - Detailed technical guide
- `CURRENCY_UPDATE_SUMMARY.md` - Summary of all changes
- `src/lib/currency.ts` - Currency formatting utilities

## Quick Test

Run this in your browser console (F12 → Console tab):

```javascript
fetch('/api/flights?limit=1')
  .then(r => r.json())
  .then(d => console.log('Currency:', d.data[0]?.currency, 'Price:', d.data[0]?.price))
```

**Expected output:**
```
Currency: NGN Price: 1275000
```

If you see `Currency: USD Price: 850`, your database needs updating (go back to Step 1).

---

**That's it!** Once you complete Step 1 (update database), Step 2 (restart server), and Step 3 (clear cache), you should see beautiful Naira prices with the ₦ symbol throughout your app! 🎉
