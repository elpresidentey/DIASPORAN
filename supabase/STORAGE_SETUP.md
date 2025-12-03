# Supabase Storage Setup Guide

This guide explains how to set up storage buckets for Diasporan.

## Storage Buckets Overview

Diasporan uses Supabase Storage for file uploads:

1. **avatars** - User profile pictures
2. **listing-images** - Images for dining venues, accommodations, events, etc.

## Step 1: Create the Avatars Bucket

### Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the sidebar
3. Click **"New bucket"**
4. Configure the bucket:
   - **Name**: `avatars`
   - **Public bucket**: ✅ Enable (so profile pictures are publicly accessible)
   - **File size limit**: 5 MB
   - **Allowed MIME types**: `image/jpeg`, `image/jpg`, `image/png`, `image/webp`
5. Click **"Create bucket"**

### Using SQL (Alternative)

You can also create the bucket using SQL in the SQL Editor:

```sql
-- Create avatars bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);
```

## Step 2: Configure Storage Policies for Avatars

The avatars bucket needs policies to control who can upload, update, and delete files.

### Policy 1: Allow authenticated users to upload their own avatar

```sql
CREATE POLICY "Users can upload their own avatar"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

### Policy 2: Allow authenticated users to update their own avatar

```sql
CREATE POLICY "Users can update their own avatar"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

### Policy 3: Allow authenticated users to delete their own avatar

```sql
CREATE POLICY "Users can delete their own avatar"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

### Policy 4: Allow public read access to all avatars

```sql
CREATE POLICY "Anyone can view avatars"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');
```

## Step 3: Create the Listing Images Bucket

### Using Supabase Dashboard

1. Navigate to **Storage** in the sidebar
2. Click **"New bucket"**
3. Configure the bucket:
   - **Name**: `listing-images`
   - **Public bucket**: ✅ Enable
   - **File size limit**: 10 MB
   - **Allowed MIME types**: `image/jpeg`, `image/jpg`, `image/png`, `image/webp`
4. Click **"Create bucket"**

### Using SQL (Alternative)

```sql
-- Create listing-images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-images', 'listing-images', true);
```

## Step 4: Configure Storage Policies for Listing Images

### Policy 1: Allow admins to upload listing images

```sql
CREATE POLICY "Admins can upload listing images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'listing-images'
  AND EXISTS (
    SELECT 1 FROM users_profiles
    WHERE id = auth.uid()
    AND (preferences->>'is_admin')::boolean = true
  )
);
```

### Policy 2: Allow admins to update listing images

```sql
CREATE POLICY "Admins can update listing images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'listing-images'
  AND EXISTS (
    SELECT 1 FROM users_profiles
    WHERE id = auth.uid()
    AND (preferences->>'is_admin')::boolean = true
  )
)
WITH CHECK (
  bucket_id = 'listing-images'
  AND EXISTS (
    SELECT 1 FROM users_profiles
    WHERE id = auth.uid()
    AND (preferences->>'is_admin')::boolean = true
  )
);
```

### Policy 3: Allow admins to delete listing images

```sql
CREATE POLICY "Admins can delete listing images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'listing-images'
  AND EXISTS (
    SELECT 1 FROM users_profiles
    WHERE id = auth.uid()
    AND (preferences->>'is_admin')::boolean = true
  )
);
```

### Policy 4: Allow public read access to all listing images

```sql
CREATE POLICY "Anyone can view listing images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'listing-images');
```

## Step 5: Apply All Storage Policies

You can apply all policies at once by running this SQL script:

```sql
-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Avatars bucket policies
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text)
WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'avatars');

-- Listing images bucket policies
CREATE POLICY "Admins can upload listing images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'listing-images'
  AND EXISTS (
    SELECT 1 FROM users_profiles
    WHERE id = auth.uid() AND (preferences->>'is_admin')::boolean = true
  )
);

CREATE POLICY "Admins can update listing images"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'listing-images'
  AND EXISTS (
    SELECT 1 FROM users_profiles
    WHERE id = auth.uid() AND (preferences->>'is_admin')::boolean = true
  )
)
WITH CHECK (
  bucket_id = 'listing-images'
  AND EXISTS (
    SELECT 1 FROM users_profiles
    WHERE id = auth.uid() AND (preferences->>'is_admin')::boolean = true
  )
);

CREATE POLICY "Admins can delete listing images"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'listing-images'
  AND EXISTS (
    SELECT 1 FROM users_profiles
    WHERE id = auth.uid() AND (preferences->>'is_admin')::boolean = true
  )
);

CREATE POLICY "Anyone can view listing images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'listing-images');
```

## Verify Storage Setup

### Test Avatar Upload

```typescript
import { createClient } from '@/lib/supabase/client'

async function testAvatarUpload(file: File) {
  const supabase = createClient()
  const user = await supabase.auth.getUser()
  
  if (!user.data.user) {
    console.error('Not authenticated')
    return
  }
  
  const fileName = `${user.data.user.id}-${Date.now()}.jpg`
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(`avatars/${fileName}`, file)
  
  if (error) {
    console.error('Upload failed:', error)
  } else {
    console.log('Upload successful:', data)
  }
}
```

### Check Bucket Configuration

1. Go to **Storage** in Supabase dashboard
2. Click on the bucket name
3. Verify:
   - ✅ Public bucket is enabled
   - ✅ File size limits are set
   - ✅ MIME types are configured

### Check Storage Policies

1. Go to **Storage** > **Policies** in Supabase dashboard
2. You should see policies for both buckets
3. Test by:
   - Uploading a file as an authenticated user
   - Trying to access the file's public URL
   - Attempting to delete another user's file (should fail)

## File Organization

### Avatars Bucket Structure
```
avatars/
  ├── {user_id}-{timestamp}.jpg
  ├── {user_id}-{timestamp}.png
  └── ...
```

### Listing Images Bucket Structure
```
listing-images/
  ├── dining/
  │   ├── {venue_id}-1.jpg
  │   └── {venue_id}-2.jpg
  ├── accommodations/
  │   ├── {property_id}-1.jpg
  │   └── {property_id}-2.jpg
  ├── events/
  │   └── {event_id}-1.jpg
  └── ...
```

## Usage in Code

### Upload Profile Picture

```typescript
// In a client component
import { uploadProfilePicture } from '@/lib/services/profile.service'

async function handleUpload(file: File) {
  const { url, error } = await uploadProfilePicture(userId, file)
  
  if (error) {
    console.error('Upload failed:', error)
  } else {
    console.log('New avatar URL:', url)
  }
}
```

### Get Public URL

```typescript
const supabase = createClient()
const { data } = supabase.storage
  .from('avatars')
  .getPublicUrl('avatars/user-123-1234567890.jpg')

console.log('Public URL:', data.publicUrl)
```

## Troubleshooting

### "new row violates row-level security policy"
- Check that RLS policies are correctly configured
- Verify the user is authenticated
- Ensure the file path matches the policy conditions

### "Bucket not found"
- Verify the bucket was created successfully
- Check the bucket name matches exactly (case-sensitive)

### "File too large"
- Check the bucket's file size limit
- Compress images before uploading
- Consider using image optimization

### Public URL not working
- Ensure the bucket is marked as public
- Check that the SELECT policy allows public access
- Verify the file was uploaded successfully

## Security Best Practices

1. ✅ Always validate file types on the server
2. ✅ Enforce file size limits
3. ✅ Use RLS policies to control access
4. ✅ Store files with user ID in the path for user-specific files
5. ✅ Sanitize file names to prevent path traversal
6. ✅ Consider virus scanning for user uploads
7. ✅ Implement rate limiting on upload endpoints

## Resources

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Storage RLS Policies](https://supabase.com/docs/guides/storage/security/access-control)
- [Image Transformations](https://supabase.com/docs/guides/storage/serving/image-transformations)

---

**Next Steps**: After setting up storage, proceed with implementing the admin management features (Task 16).
