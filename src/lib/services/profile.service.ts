/**
 * Profile Service
 * Handles all profile management operations
 */

import { createClient } from '@/lib/supabase/client'
import { createServerClient } from '@/lib/supabase/server'
import type { Database } from '@/types/supabase'

type UserProfile = Database['public']['Tables']['users_profiles']['Row']
type UserProfileInsert = Database['public']['Tables']['users_profiles']['Insert']
type UserProfileUpdate = Database['public']['Tables']['users_profiles']['Update']

export interface ProfileWithStats extends UserProfile {
  total_bookings: number
  total_reviews: number
  total_saved_items: number
}

export interface UpdateProfileData {
  full_name?: string
  phone?: string
  bio?: string
  preferences?: Record<string, any>
}

export interface ProfileServiceError {
  code: string
  message: string
  details?: any
}

/**
 * Initialize a profile for a new user
 * This is typically called after user signup
 */
export async function initializeProfile(
  userId: string,
  email: string,
  fullName?: string
): Promise<{ profile: UserProfile | null; error: ProfileServiceError | null }> {
  const supabase = createClient()

  const { data: profile, error } = await supabase
    .from('users_profiles')
    .insert({
      id: userId,
      email,
      full_name: fullName || null,
      preferences: {},
    })
    .select()
    .single()

  if (error) {
    return {
      profile: null,
      error: {
        code: 'PROFILE_INIT_FAILED',
        message: 'Failed to initialize profile',
        details: error,
      },
    }
  }

  return { profile, error: null }
}

/**
 * Get user profile by ID
 */
export async function getProfile(
  userId: string
): Promise<{ profile: UserProfile | null; error: ProfileServiceError | null }> {
  const supabase = createClient()

  const { data: profile, error } = await supabase
    .from('users_profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    return {
      profile: null,
      error: {
        code: 'PROFILE_NOT_FOUND',
        message: 'Profile not found',
        details: error,
      },
    }
  }

  return { profile, error: null }
}

/**
 * Get user profile with statistics (bookings, reviews, saved items count)
 */
export async function getProfileWithStats(
  userId: string
): Promise<{ profile: ProfileWithStats | null; error: ProfileServiceError | null }> {
  const supabase = createClient()

  // Get profile
  const { data: profile, error: profileError } = await supabase
    .from('users_profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (profileError) {
    return {
      profile: null,
      error: {
        code: 'PROFILE_NOT_FOUND',
        message: 'Profile not found',
        details: profileError,
      },
    }
  }

  // Get statistics in parallel
  const [bookingsResult, reviewsResult, savedItemsResult] = await Promise.all([
    supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('saved_items').select('id', { count: 'exact', head: true }).eq('user_id', userId),
  ])

  const profileWithStats: ProfileWithStats = {
    ...profile,
    total_bookings: bookingsResult.count || 0,
    total_reviews: reviewsResult.count || 0,
    total_saved_items: savedItemsResult.count || 0,
  }

  return { profile: profileWithStats, error: null }
}

/**
 * Update user profile
 */
export async function updateProfile(
  userId: string,
  data: UpdateProfileData
): Promise<{ profile: UserProfile | null; error: ProfileServiceError | null }> {
  const supabase = createClient()

  const updateData: UserProfileUpdate = {
    ...data,
    updated_at: new Date().toISOString(),
  }

  const { data: profile, error } = await supabase
    .from('users_profiles')
    .update(updateData)
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    return {
      profile: null,
      error: {
        code: 'PROFILE_UPDATE_FAILED',
        message: 'Failed to update profile',
        details: error,
      },
    }
  }

  return { profile, error: null }
}

/**
 * Upload profile picture to Supabase Storage
 * Returns the public URL of the uploaded image
 */
export async function uploadProfilePicture(
  userId: string,
  file: File
): Promise<{ url: string | null; error: ProfileServiceError | null }> {
  const supabase = createClient()

  // Generate unique filename
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}-${Date.now()}.${fileExt}`
  const filePath = `avatars/${fileName}`

  // Upload file to storage
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    })

  if (uploadError) {
    return {
      url: null,
      error: {
        code: 'UPLOAD_FAILED',
        message: 'Failed to upload profile picture',
        details: uploadError,
      },
    }
  }

  // Get public URL
  const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath)

  // Update profile with new avatar URL
  const { error: updateError } = await supabase
    .from('users_profiles')
    .update({ avatar_url: urlData.publicUrl, updated_at: new Date().toISOString() })
    .eq('id', userId)

  if (updateError) {
    return {
      url: null,
      error: {
        code: 'PROFILE_UPDATE_FAILED',
        message: 'Failed to update profile with avatar URL',
        details: updateError,
      },
    }
  }

  return { url: urlData.publicUrl, error: null }
}

/**
 * Delete user account and all associated data
 * This performs a cascade delete of bookings, reviews, and saved items
 */
export async function deleteAccount(
  userId: string
): Promise<{ success: boolean; error: ProfileServiceError | null }> {
  const supabase = createClient()

  // Delete profile (cascade will handle related data via database constraints)
  const { error: deleteError } = await supabase
    .from('users_profiles')
    .delete()
    .eq('id', userId)

  if (deleteError) {
    return {
      success: false,
      error: {
        code: 'DELETE_FAILED',
        message: 'Failed to delete account',
        details: deleteError,
      },
    }
  }

  // Delete auth user
  const { error: authError } = await supabase.auth.admin.deleteUser(userId)

  if (authError) {
    return {
      success: false,
      error: {
        code: 'AUTH_DELETE_FAILED',
        message: 'Failed to delete authentication account',
        details: authError,
      },
    }
  }

  return { success: true, error: null }
}

/**
 * Server-side version of getProfile for use in API routes
 */
export async function getProfileServer(
  userId: string
): Promise<{ profile: UserProfile | null; error: ProfileServiceError | null }> {
  const supabase = createServerClient()

  const { data: profile, error } = await supabase
    .from('users_profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    return {
      profile: null,
      error: {
        code: 'PROFILE_NOT_FOUND',
        message: 'Profile not found',
        details: error,
      },
    }
  }

  return { profile, error: null }
}

/**
 * Server-side version of updateProfile for use in API routes
 */
export async function updateProfileServer(
  userId: string,
  data: UpdateProfileData
): Promise<{ profile: UserProfile | null; error: ProfileServiceError | null }> {
  const supabase = createServerClient()

  const updateData: UserProfileUpdate = {
    ...data,
    updated_at: new Date().toISOString(),
  }

  const { data: profile, error } = await supabase
    .from('users_profiles')
    .update(updateData)
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    return {
      profile: null,
      error: {
        code: 'PROFILE_UPDATE_FAILED',
        message: 'Failed to update profile',
        details: error,
      },
    }
  }

  return { profile, error: null }
}

/**
 * Server-side version of uploadProfilePicture for use in API routes
 */
export async function uploadProfilePictureServer(
  userId: string,
  file: File
): Promise<{ url: string | null; error: ProfileServiceError | null }> {
  const supabase = createServerClient()

  // Generate unique filename
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}-${Date.now()}.${fileExt}`
  const filePath = `avatars/${fileName}`

  // Upload file to storage
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    })

  if (uploadError) {
    return {
      url: null,
      error: {
        code: 'UPLOAD_FAILED',
        message: 'Failed to upload profile picture',
        details: uploadError,
      },
    }
  }

  // Get public URL
  const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath)

  // Update profile with new avatar URL
  const { error: updateError } = await supabase
    .from('users_profiles')
    .update({ avatar_url: urlData.publicUrl, updated_at: new Date().toISOString() })
    .eq('id', userId)

  if (updateError) {
    return {
      url: null,
      error: {
        code: 'PROFILE_UPDATE_FAILED',
        message: 'Failed to update profile with avatar URL',
        details: updateError,
      },
    }
  }

  return { url: urlData.publicUrl, error: null }
}
