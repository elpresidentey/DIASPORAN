# Complete Supabase Setup for Diasporan

This guide will walk you through setting up Supabase from scratch for the Diasporan project.

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign in or create a free account
3. Click **"New Project"**
4. Fill in:
   - **Name**: `diasporan-app`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users (e.g., `us-east-1` for US)
5. Click **"Create new project"**
6. Wait 2-3 minutes for provisioning

### Step 2: Get Your Credentials

1. In your project dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Step 3: Update Environment Variables

Replace the contents of your `.env.local` file with your real credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### Step 4: Set Up Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Copy and paste the following SQL:

```sql
-- First, create the users_profiles table and trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Create users_profiles table
CREATE TABLE IF NOT EXISTS public.users_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  bio TEXT,
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users_profiles ENABLE ROW LEVEL SECURITY;

-- Create trigger
CREATE TRIGGER update_users_profiles_updated_at
  BEFORE UPDATE ON public.users_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create profile automatically when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $
BEGIN
  INSERT INTO public.users_profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant permissions
GRANT SELECT ON public.users_profiles TO authenticated, anon;
GRANT INSERT, UPDATE, DELETE ON public.users_profiles TO authenticated;
```

4. Click **"Run"**
5. You should see "Success. No rows returned"

### Step 5: Add Complete Database Schema

1. Create another new query in SQL Editor
2. Copy the entire contents of `supabase/migrations/consolidated_migrations.sql` 
3. Paste it and click **"Run"**
4. This will create all tables (flights, accommodations, events, etc.)

### Step 6: Add Sample Data (Optional)

1. Create another new query
2. Copy and paste this sample data:

```sql
-- Insert sample flights
INSERT INTO public.flights (
  airline, flight_number, origin_airport, destination_airport,
  departure_time, arrival_time, duration_minutes, price, currency, class_type, available_seats
) VALUES
  ('British Airways', 'BA075', 'LHR', 'LOS', '2024-12-20 10:30:00+00', '2024-12-20 17:45:00+00', 435, 850000, 'NGN', 'Economy', 45),
  ('Virgin Atlantic', 'VS411', 'LHR', 'LOS', '2024-12-20 14:15:00+00', '2024-12-20 21:30:00+00', 435, 920000, 'NGN', 'Economy', 32),
  ('Air France', 'AF878', 'CDG', 'LOS', '2024-12-20 16:45:00+00', '2024-12-21 00:15:00+00', 450, 780000, 'NGN', 'Economy', 28),
  ('Emirates', 'EK783', 'DXB', 'LOS', '2024-12-20 08:20:00+00', '2024-12-20 13:45:00+00', 325, 1200000, 'NGN', 'Business', 12),
  ('Turkish Airlines', 'TK1830', 'IST', 'LOS', '2024-12-20 12:10:00+00', '2024-12-20 18:35:00+00', 385, 650000, 'NGN', 'Economy', 67),
  ('KLM', 'KL587', 'AMS', 'LOS', '2024-12-20 11:25:00+00', '2024-12-20 18:50:00+00', 445, 890000, 'NGN', 'Economy', 23);

-- Insert sample accommodations
INSERT INTO public.accommodations (
  name, description, property_type, address, city, country,
  bedrooms, bathrooms, max_guests, price_per_night, currency, amenities, images
) VALUES
  ('Lagos Island Luxury Apartment', 'Modern 2-bedroom apartment in the heart of Lagos Island with stunning lagoon views', 'Apartment', '15 Broad Street', 'Lagos', 'Nigeria', 2, 2, 4, 45000, 'NGN', ARRAY['WiFi', 'Air Conditioning', 'Kitchen', 'Balcony'], ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267']),
  ('Victoria Island Penthouse', 'Luxurious penthouse with panoramic city views and premium amenities', 'Penthouse', '23 Ahmadu Bello Way', 'Lagos', 'Nigeria', 3, 3, 6, 85000, 'NGN', ARRAY['WiFi', 'Air Conditioning', 'Pool', 'Gym', 'Concierge'], ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2']),
  ('Ikoyi Garden Villa', 'Beautiful 4-bedroom villa with private garden and pool', 'Villa', '12 Banana Island Road', 'Lagos', 'Nigeria', 4, 4, 8, 120000, 'NGN', ARRAY['WiFi', 'Air Conditioning', 'Pool', 'Garden', 'Security'], ARRAY['https://images.unsplash.com/photo-1564013799919-ab600027ffc6']);

-- Insert sample events
INSERT INTO public.events (
  title, description, category, start_date, end_date, location, address, city, country,
  capacity, available_spots, ticket_types, images
) VALUES
  ('Detty December Lagos Festival', 'The biggest end-of-year celebration in Lagos with top artists and DJs', 'Music', '2024-12-28 18:00:00+00', '2024-12-29 06:00:00+00', 'Eko Atlantic', 'Eko Atlantic City', 'Lagos', 'Nigeria', 10000, 7500, ARRAY['{"type": "Regular", "price": 15000, "currency": "NGN"}'::jsonb, '{"type": "VIP", "price": 50000, "currency": "NGN"}'::jsonb], ARRAY['https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3']),
  ('Lagos Food & Wine Festival', 'Celebrate Nigerian cuisine with top chefs and wine tastings', 'Food', '2024-12-30 12:00:00+00', '2024-12-30 22:00:00+00', 'Federal Palace Hotel', '26 Ahmadu Bello Way', 'Lagos', 'Nigeria', 500, 320, ARRAY['{"type": "Standard", "price": 25000, "currency": "NGN"}'::jsonb, '{"type": "Premium", "price": 45000, "currency": "NGN"}'::jsonb], ARRAY['https://images.unsplash.com/photo-1414235077428-338989a2e8c0']);
```

3. Click **"Run"**

### Step 7: Test the Connection

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Visit `http://localhost:3000/flights`
3. You should now see real flight data from Supabase instead of mock data!

## ✅ Verification Checklist

- [ ] Supabase project created
- [ ] Environment variables updated in `.env.local`
- [ ] Database schema applied (all tables created)
- [ ] Sample data inserted
- [ ] Development server restarted
- [ ] Flights page shows real data
- [ ] No console errors in browser

## 🔧 Troubleshooting

### "Failed to fetch from /api/flights"
- Check that your environment variables are correct
- Restart your development server after updating `.env.local`
- Verify the Supabase project is active (not paused)

### "relation does not exist" errors
- Make sure you ran both SQL scripts (users_profiles first, then consolidated_migrations)
- Check the SQL Editor for any error messages

### Authentication issues
- Verify your `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- Check that RLS policies are enabled on tables

## 🎯 Next Steps

Once Supabase is working:

1. **Set up Authentication**: Users can sign up/login
2. **Enable Bookings**: Users can book flights, accommodations, events
3. **Add Reviews**: Users can leave reviews after bookings
4. **Implement Saved Items**: Users can save favorites
5. **Add Real-time Features**: Live updates for bookings and availability

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js with Supabase Guide](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Database Schema Overview](./supabase/SCHEMA_OVERVIEW.md)

---

**🎉 Congratulations!** Your Diasporan app now has a fully functional backend with Supabase!