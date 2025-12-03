# Row Level Security (RLS) Policies

This document describes the Row Level Security policies implemented for the Diasporan backend.

## Overview

Row Level Security (RLS) is a PostgreSQL feature that allows you to control which rows users can access in database tables. Supabase leverages RLS to provide fine-grained access control at the database level.

## Policy Summary

### users_profiles

**Access Rules:**
- Users can view, insert, update, and delete their own profile
- Anonymous users can view all profiles (for public listing attribution)

**Policies:**
- `Users can view own profile` - SELECT for authenticated users on their own profile
- `Users can insert own profile` - INSERT for authenticated users on their own profile
- `Users can update own profile` - UPDATE for authenticated users on their own profile
- `Users can delete own profile` - DELETE for authenticated users on their own profile
- `Anonymous users can view profiles` - SELECT for anonymous users on all profiles

### bookings

**Access Rules:**
- Users can only view and manage their own bookings
- No cross-user access allowed

**Policies:**
- `Users can view own bookings` - SELECT for authenticated users on their own bookings
- `Users can create own bookings` - INSERT for authenticated users on their own bookings
- `Users can update own bookings` - UPDATE for authenticated users on their own bookings
- `Users can delete own bookings` - DELETE for authenticated users on their own bookings

### reviews

**Access Rules:**
- Anyone (authenticated or anonymous) can read all reviews
- Users can only create, update, and delete their own reviews

**Policies:**
- `Anyone can view reviews` - SELECT for all users on all reviews
- `Users can create own reviews` - INSERT for authenticated users on their own reviews
- `Users can update own reviews` - UPDATE for authenticated users on their own reviews
- `Users can delete own reviews` - DELETE for authenticated users on their own reviews

### saved_items

**Access Rules:**
- Users can only view and manage their own saved items
- Complete isolation between users

**Policies:**
- `Users can view own saved items` - SELECT for authenticated users on their own saved items
- `Users can create own saved items` - INSERT for authenticated users on their own saved items
- `Users can update own saved items` - UPDATE for authenticated users on their own saved items
- `Users can delete own saved items` - DELETE for authenticated users on their own saved items

### Listing Tables (dining_venues, accommodations, events, transport_options, flights)

**Access Rules:**
- Anyone can view active (non-deleted) listings
- Authenticated users can create, update, and delete listings
- Soft-deleted items are hidden from regular queries

**Policies (per table):**
- `Anyone can view active [listings]` - SELECT for all users on non-deleted listings
- `Authenticated users can create [listings]` - INSERT for authenticated users
- `Authenticated users can update [listings]` - UPDATE for authenticated users
- `Authenticated users can delete [listings]` - DELETE for authenticated users

**Note:** Admin-only write access will be implemented in a future update using custom JWT claims.

### safety_information

**Access Rules:**
- Anyone can view safety information
- Authenticated users can create, update, and delete safety information

**Policies:**
- `Anyone can view safety information` - SELECT for all users
- `Authenticated users can create safety information` - INSERT for authenticated users
- `Authenticated users can update safety information` - UPDATE for authenticated users
- `Authenticated users can delete safety information` - DELETE for authenticated users

### safety_reports

**Access Rules:**
- Users can only view and manage their own safety reports
- Admin access for viewing all reports will be implemented later

**Policies:**
- `Users can view own safety reports` - SELECT for authenticated users on their own reports
- `Users can create own safety reports` - INSERT for authenticated users on their own reports
- `Users can update own safety reports` - UPDATE for authenticated users on their own reports
- `Users can delete own safety reports` - DELETE for authenticated users on their own reports

## Admin Access

An `is_admin()` helper function has been created to check for admin roles. Currently, it checks for a `role` claim in the JWT with value `'admin'`.

To implement admin access:

1. Set up custom claims in Supabase Auth
2. Add admin role to user JWT claims
3. Update policies to use `is_admin()` function for admin-specific access

Example admin policy:
```sql
CREATE POLICY "Admins can view all safety reports"
  ON public.safety_reports
  FOR SELECT
  TO authenticated
  USING (public.is_admin() OR auth.uid() = user_id);
```

## Testing RLS Policies

### Manual Testing via Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to Table Editor
3. Select a table
4. Try to insert/update/delete rows
5. Check that policies are enforced

### Automated Testing

Run the RLS test suite:

```bash
npm run test tests/rls-policies.test.ts
```

The test suite verifies:
- Users can only access their own data
- Cross-user access is prevented
- Public data is accessible to all
- Anonymous access works where intended
- Soft-deleted items are hidden

### Testing with Different Users

To test RLS policies with different user roles:

1. Create test users via Supabase Auth
2. Sign in as each user
3. Attempt various operations
4. Verify that RLS policies are enforced correctly

## Security Considerations

1. **Never bypass RLS** - Always use authenticated clients, even for admin operations
2. **Test thoroughly** - RLS policies are your last line of defense
3. **Principle of least privilege** - Grant only necessary permissions
4. **Audit regularly** - Review policies as requirements change
5. **Use SECURITY DEFINER carefully** - Functions with SECURITY DEFINER bypass RLS

## Common Patterns

### User-owned data
```sql
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id)
```

### Public read, authenticated write
```sql
-- Read policy
USING (true)

-- Write policy
TO authenticated
WITH CHECK (true)
```

### Soft delete filtering
```sql
USING (deleted_at IS NULL)
```

### Admin access
```sql
USING (public.is_admin() OR <user_condition>)
```

## Troubleshooting

### Policy not working
1. Verify RLS is enabled: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`
2. Check policy syntax and conditions
3. Verify user authentication state
4. Check JWT claims

### Performance issues
1. Add indexes on columns used in policies
2. Simplify policy conditions
3. Use materialized views for complex queries
4. Monitor query performance

### Access denied errors
1. Check if user is authenticated
2. Verify policy conditions match user state
3. Check for typos in policy names
4. Review policy USING and WITH CHECK clauses

## Migration

The RLS policies are defined in:
- `supabase/migrations/20240101000010_create_rls_policies.sql`

To apply the migration:
```bash
supabase db push
```

To rollback (if needed):
```bash
supabase db reset
```

## References

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers)
