# Naira Pricing - Quick Reference Card

## ✅ What's Done

- ✅ Seed file updated with NGN prices
- ✅ Frontend components updated to show ₦ symbol
- ✅ Number formatting with commas added
- ✅ Currency utility functions created
- ✅ All code tested and error-free

## 🚀 To See Naira Prices (3 Steps)

### 1. Update Database
```
Supabase Dashboard → SQL Editor → Run supabase/seed.sql
```

### 2. Restart Server
```bash
npm run dev
```

### 3. Clear Cache
```
Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

## 💰 Price Examples

| Item | Price |
|------|-------|
| Lagos → London | ₦1,275,000 |
| Lagos → Dubai | ₦975,000 |
| Lagos → New York | ₦1,800,000 |
| Luxury Villa/night | ₦375,000 |
| Lekki Apartment/night | ₦180,000 |
| Lagos-Abuja Bus | ₦8,000 |

## 🔍 Quick Test

**In Supabase SQL Editor:**
```sql
SELECT price, currency FROM flights LIMIT 1;
```
Should return: `1275000, NGN`

**In Browser Console (F12):**
```javascript
fetch('/api/flights?limit=1').then(r=>r.json()).then(console.log)
```
Should show: `currency: "NGN", price: 1275000`

## 📁 Files Changed

1. `supabase/seed.sql` - Database prices
2. `src/app/flights/page.tsx` - Flight display
3. `src/app/stays/page.tsx` - Accommodation display
4. `src/app/transport/page.tsx` - Transport display
5. `src/app/profile/page.tsx` - Booking display
6. `src/lib/currency.ts` - Utility functions (NEW)

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Still see USD | Update database (Step 1) |
| See "NGN" not "₦" | Clear cache (Step 3) |
| No prices | Check console for errors |

## 📚 Full Guides

- `HOW_TO_SEE_NAIRA_PRICES.md` - Step-by-step guide
- `NAIRA_PRICING_UPDATE.md` - Technical details
- `CURRENCY_UPDATE_SUMMARY.md` - Complete summary

---

**Need help?** Read `HOW_TO_SEE_NAIRA_PRICES.md` for detailed instructions.
