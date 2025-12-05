/**
 * Safety Service
 * Handles safety information, emergency contacts, and safety reports
 */

import { createClient } from '@/lib/supabase/client'
import { createServerClient } from '@/lib/supabase/server'
import type { Database } from '@/types/supabase'

type SafetyInformation = Database['public']['Tables']['safety_information']['Row']
type SafetyInformationInsert = Database['public']['Tables']['safety_information']['Insert']
type SafetyInformationUpdate = Database['public']['Tables']['safety_information']['Update']
type SafetyReport = Database['public']['Tables']['safety_reports']['Row']
type SafetyReportInsert = Database['public']['Tables']['safety_reports']['Insert']
type UserProfile = Database['public']['Tables']['users_profiles']['Row']

export interface SafetyServiceError {
  code: string
  message: string
  details?: any
}

export interface EmergencyContact {
  name: string
  phone: string
  relationship?: string
}

export interface SafetyInfoFilters {
  country?: string
  city?: string
  category?: string
  safetyLevel?: 'low' | 'moderate' | 'high' | 'critical'
}

export interface CreateSafetyReportData {
  location: string
  latitude?: number
  longitude?: number
  category: string
  description: string
  severity: 'low' | 'moderate' | 'high' | 'critical'
}

/**
 * Get safety information for a specific location
 */
export async function getSafetyInformation(
  filters: SafetyInfoFilters
): Promise<{ data: SafetyInformation[] | null; error: SafetyServiceError | null }> {
  const supabase = createClient()

  let query = supabase
    .from('safety_information')
    .select('*')
    .order('last_updated', { ascending: false })

  if (filters.country) {
    query = query.eq('country', filters.country)
  }

  if (filters.city) {
    query = query.eq('city', filters.city)
  }

  if (filters.category) {
    query = query.eq('category', filters.category)
  }

  if (filters.safetyLevel) {
    query = query.eq('safety_level', filters.safetyLevel)
  }

  const { data, error } = await query

  if (error) {
    return {
      data: null,
      error: {
        code: 'SAFETY_INFO_FETCH_FAILED',
        message: 'Failed to fetch safety information',
        details: error,
      },
    }
  }

  return { data, error: null }
}

/**
 * Get safety information by ID
 */
export async function getSafetyInformationById(
  id: string
): Promise<{ data: SafetyInformation | null; error: SafetyServiceError | null }> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('safety_information')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return {
      data: null,
      error: {
        code: 'SAFETY_INFO_NOT_FOUND',
        message: 'Safety information not found',
        details: error,
      },
    }
  }

  return { data, error: null }
}

/**
 * Save emergency contacts to user profile
 * Emergency contacts are stored in the preferences JSONB field
 */
export async function saveEmergencyContacts(
  userId: string,
  contacts: EmergencyContact[]
): Promise<{ success: boolean; error: SafetyServiceError | null }> {
  const supabase = createClient()

  // Get current preferences
  const { data: profile, error: fetchError } = await supabase
    .from('users_profiles')
    .select('preferences')
    .eq('id', userId)
    .single() as { data: { preferences: any } | null; error: any }

  if (fetchError || !profile) {
    return {
      success: false,
      error: {
        code: 'PROFILE_FETCH_FAILED',
        message: 'Failed to fetch user profile',
        details: fetchError,
      },
    }
  }

  // Update preferences with emergency contacts
  const updatedPreferences = {
    ...(profile.preferences || {}),
    emergency_contacts: contacts,
  }

  const emergencyUpdateData: Database['public']['Tables']['users_profiles']['Update'] = {
    preferences: updatedPreferences,
    updated_at: new Date().toISOString(),
  }

  const emergencyUpdateQuery: any = supabase.from('users_profiles')
  const { error: updateError } = await emergencyUpdateQuery
    .update(emergencyUpdateData)
    .eq('id', userId)

  if (updateError) {
    return {
      success: false,
      error: {
        code: 'EMERGENCY_CONTACTS_SAVE_FAILED',
        message: 'Failed to save emergency contacts',
        details: updateError,
      },
    }
  }

  return { success: true, error: null }
}

/**
 * Get emergency contacts from user profile
 */
export async function getEmergencyContacts(
  userId: string
): Promise<{ contacts: EmergencyContact[] | null; error: SafetyServiceError | null }> {
  const supabase = createClient()

  const { data: profile, error } = await supabase
    .from('users_profiles')
    .select('preferences')
    .eq('id', userId)
    .single() as { data: { preferences: any } | null; error: any }

  if (error || !profile) {
    return {
      contacts: null,
      error: {
        code: 'PROFILE_FETCH_FAILED',
        message: 'Failed to fetch user profile',
        details: error,
      },
    }
  }

  const contacts = (profile.preferences as any)?.emergency_contacts || []

  return { contacts, error: null }
}

/**
 * Create a safety report
 */
export async function createSafetyReport(
  userId: string,
  reportData: CreateSafetyReportData
): Promise<{ report: SafetyReport | null; error: SafetyServiceError | null }> {
  const supabase = createClient()

  const insertData: SafetyReportInsert = {
    user_id: userId,
    location: reportData.location,
    latitude: reportData.latitude || null,
    longitude: reportData.longitude || null,
    category: reportData.category,
    description: reportData.description,
    severity: reportData.severity,
    status: 'pending',
  }

  const safetyReportInsertQuery: any = supabase.from('safety_reports')
  const { data: report, error } = await safetyReportInsertQuery
    .insert(insertData)
    .select()
    .single()

  if (error) {
    return {
      report: null,
      error: {
        code: 'SAFETY_REPORT_CREATE_FAILED',
        message: 'Failed to create safety report',
        details: error,
      },
    }
  }

  return { report, error: null }
}

/**
 * Get user's safety reports
 */
export async function getUserSafetyReports(
  userId: string
): Promise<{ reports: SafetyReport[] | null; error: SafetyServiceError | null }> {
  const supabase = createClient()

  const { data: reports, error } = await supabase
    .from('safety_reports')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    return {
      reports: null,
      error: {
        code: 'SAFETY_REPORTS_FETCH_FAILED',
        message: 'Failed to fetch safety reports',
        details: error,
      },
    }
  }

  return { reports, error: null }
}

// ============================================================================
// Server-side functions for API routes
// ============================================================================

/**
 * Server-side: Get safety information
 */
export async function getSafetyInformationServer(
  filters: SafetyInfoFilters
): Promise<{ data: SafetyInformation[] | null; error: SafetyServiceError | null }> {
  const supabase = createServerClient()

  let query = supabase
    .from('safety_information')
    .select('*')
    .order('last_updated', { ascending: false })

  if (filters.country) {
    query = query.eq('country', filters.country)
  }

  if (filters.city) {
    query = query.eq('city', filters.city)
  }

  if (filters.category) {
    query = query.eq('category', filters.category)
  }

  if (filters.safetyLevel) {
    query = query.eq('safety_level', filters.safetyLevel)
  }

  const { data, error } = await query

  if (error) {
    return {
      data: null,
      error: {
        code: 'SAFETY_INFO_FETCH_FAILED',
        message: 'Failed to fetch safety information',
        details: error,
      },
    }
  }

  return { data, error: null }
}

/**
 * Server-side: Save emergency contacts
 */
export async function saveEmergencyContactsServer(
  userId: string,
  contacts: EmergencyContact[]
): Promise<{ success: boolean; error: SafetyServiceError | null }> {
  const supabase = createServerClient()

  // Get current preferences
  const { data: profile, error: fetchError } = await supabase
    .from('users_profiles')
    .select('preferences')
    .eq('id', userId)
    .single() as { data: { preferences: any } | null; error: any }

  if (fetchError || !profile) {
    return {
      success: false,
      error: {
        code: 'PROFILE_FETCH_FAILED',
        message: 'Failed to fetch user profile',
        details: fetchError,
      },
    }
  }

  // Update preferences with emergency contacts
  const updatedPreferences = {
    ...(profile.preferences || {}),
    emergency_contacts: contacts,
  }

  const emergencyUpdateServerData: Database['public']['Tables']['users_profiles']['Update'] = {
    preferences: updatedPreferences,
    updated_at: new Date().toISOString(),
  }

  const emergencyUpdateServerQuery: any = supabase.from('users_profiles')
  const { error: updateError } = await emergencyUpdateServerQuery
    .update(emergencyUpdateServerData)
    .eq('id', userId)

  if (updateError) {
    return {
      success: false,
      error: {
        code: 'EMERGENCY_CONTACTS_SAVE_FAILED',
        message: 'Failed to save emergency contacts',
        details: updateError,
      },
    }
  }

  return { success: true, error: null }
}

/**
 * Server-side: Create safety report
 */
export async function createSafetyReportServer(
  userId: string,
  reportData: CreateSafetyReportData
): Promise<{ report: SafetyReport | null; error: SafetyServiceError | null }> {
  const supabase = createServerClient()

  const insertData: SafetyReportInsert = {
    user_id: userId,
    location: reportData.location,
    latitude: reportData.latitude || null,
    longitude: reportData.longitude || null,
    category: reportData.category,
    description: reportData.description,
    severity: reportData.severity,
    status: 'pending',
  }

  const safetyReportInsertServerQuery: any = supabase.from('safety_reports')
  const { data: report, error } = await safetyReportInsertServerQuery
    .insert(insertData)
    .select()
    .single()

  if (error) {
    return {
      report: null,
      error: {
        code: 'SAFETY_REPORT_CREATE_FAILED',
        message: 'Failed to create safety report',
        details: error,
      },
    }
  }

  return { report, error: null }
}

/**
 * Server-side: Create or update safety information (Admin only)
 */
export async function createSafetyInformationServer(
  adminUserId: string,
  data: Omit<SafetyInformationInsert, 'created_by'>
): Promise<{ data: SafetyInformation | null; error: SafetyServiceError | null }> {
  const supabase = createServerClient()

  const insertData: SafetyInformationInsert = {
    ...data,
    created_by: adminUserId,
  }

  const safetyInfoInsertQuery: any = supabase.from('safety_information')
  const { data: safetyInfo, error } = await safetyInfoInsertQuery
    .insert(insertData)
    .select()
    .single()

  if (error) {
    return {
      data: null,
      error: {
        code: 'SAFETY_INFO_CREATE_FAILED',
        message: 'Failed to create safety information',
        details: error,
      },
    }
  }

  return { data: safetyInfo, error: null }
}

/**
 * Server-side: Update safety information (Admin only)
 */
export async function updateSafetyInformationServer(
  id: string,
  data: SafetyInformationUpdate
): Promise<{ data: SafetyInformation | null; error: SafetyServiceError | null }> {
  const supabase = createServerClient()

  const updateData: SafetyInformationUpdate = {
    ...data,
    updated_at: new Date().toISOString(),
    last_updated: new Date().toISOString(),
  }

  const safetyInfoUpdateQuery: any = supabase.from('safety_information')
  const { data: safetyInfo, error } = await safetyInfoUpdateQuery
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return {
      data: null,
      error: {
        code: 'SAFETY_INFO_UPDATE_FAILED',
        message: 'Failed to update safety information',
        details: error,
      },
    }
  }

  return { data: safetyInfo, error: null }
}

/**
 * Server-side: Delete safety information (Admin only)
 */
export async function deleteSafetyInformationServer(
  id: string
): Promise<{ success: boolean; error: SafetyServiceError | null }> {
  const supabase = createServerClient()

  const { error } = await supabase
    .from('safety_information')
    .delete()
    .eq('id', id)

  if (error) {
    return {
      success: false,
      error: {
        code: 'SAFETY_INFO_DELETE_FAILED',
        message: 'Failed to delete safety information',
        details: error,
      },
    }
  }

  return { success: true, error: null }
}

/**
 * Server-side: Get all safety reports (Admin only)
 */
export async function getAllSafetyReportsServer(
  filters?: {
    status?: 'pending' | 'reviewing' | 'resolved' | 'dismissed'
    severity?: 'low' | 'moderate' | 'high' | 'critical'
  }
): Promise<{ reports: SafetyReport[] | null; error: SafetyServiceError | null }> {
  const supabase = createServerClient()

  let query = supabase
    .from('safety_reports')
    .select('*')
    .order('created_at', { ascending: false })

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  if (filters?.severity) {
    query = query.eq('severity', filters.severity)
  }

  const { data: reports, error } = await query

  if (error) {
    return {
      reports: null,
      error: {
        code: 'SAFETY_REPORTS_FETCH_FAILED',
        message: 'Failed to fetch safety reports',
        details: error,
      },
    }
  }

  return { reports, error: null }
}

/**
 * Server-side: Update safety report status (Admin only)
 */
export async function updateSafetyReportStatusServer(
  id: string,
  status: 'pending' | 'reviewing' | 'resolved' | 'dismissed'
): Promise<{ report: SafetyReport | null; error: SafetyServiceError | null }> {
  const supabase = createServerClient()

  const updateData: Partial<SafetyReport> = {
    status,
    ...(status === 'resolved' ? { resolved_at: new Date().toISOString() } : {}),
  }

  const safetyReportUpdateQuery: any = supabase.from('safety_reports')
  const { data: report, error } = await safetyReportUpdateQuery
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return {
      report: null,
      error: {
        code: 'SAFETY_REPORT_UPDATE_FAILED',
        message: 'Failed to update safety report',
        details: error,
      },
    }
  }

  return { report, error: null }
}
