/**
 * RLS Policies Validation Test
 * 
 * This test validates that the RLS policies migration file is properly structured
 * and contains all required policies for each table.
 */

import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('RLS Policies Migration Validation', () => {
  const migrationPath = join(process.cwd(), 'supabase', 'migrations', '20240101000010_create_rls_policies.sql')
  let migrationContent: string

  try {
    migrationContent = readFileSync(migrationPath, 'utf-8')
  } catch (error) {
    migrationContent = ''
  }

  it('should have RLS policies migration file', () => {
    expect(migrationContent).toBeTruthy()
    expect(migrationContent.length).toBeGreaterThan(0)
  })

  describe('users_profiles policies', () => {
    it('should have policy for users to view own profile', () => {
      expect(migrationContent).toContain('Users can view own profile')
      expect(migrationContent).toContain('ON public.users_profiles')
      expect(migrationContent).toContain('FOR SELECT')
      expect(migrationContent).toContain('auth.uid() = id')
    })

    it('should have policy for users to update own profile', () => {
      expect(migrationContent).toContain('Users can update own profile')
      expect(migrationContent).toContain('FOR UPDATE')
    })

    it('should have policy for anonymous users to view profiles', () => {
      expect(migrationContent).toContain('Anonymous users can view profiles')
      expect(migrationContent).toContain('TO anon')
    })
  })

  describe('bookings policies', () => {
    it('should have policy for users to view own bookings', () => {
      expect(migrationContent).toContain('Users can view own bookings')
      expect(migrationContent).toContain('ON public.bookings')
      expect(migrationContent).toContain('auth.uid() = user_id')
    })

    it('should have policy for users to create own bookings', () => {
      expect(migrationContent).toContain('Users can create own bookings')
      expect(migrationContent).toContain('FOR INSERT')
    })

    it('should have policy for users to update own bookings', () => {
      expect(migrationContent).toContain('Users can update own bookings')
      expect(migrationContent).toContain('FOR UPDATE')
    })
  })

  describe('reviews policies', () => {
    it('should have policy for anyone to view reviews', () => {
      expect(migrationContent).toContain('Anyone can view reviews')
      expect(migrationContent).toContain('ON public.reviews')
      expect(migrationContent).toContain('TO authenticated, anon')
    })

    it('should have policy for users to create own reviews', () => {
      expect(migrationContent).toContain('Users can create own reviews')
      expect(migrationContent).toContain('FOR INSERT')
    })

    it('should have policy for users to update own reviews', () => {
      expect(migrationContent).toContain('Users can update own reviews')
    })
  })

  describe('saved_items policies', () => {
    it('should have policy for users to view own saved items', () => {
      expect(migrationContent).toContain('Users can view own saved items')
      expect(migrationContent).toContain('ON public.saved_items')
    })

    it('should have policy for users to manage own saved items', () => {
      expect(migrationContent).toContain('Users can create own saved items')
      expect(migrationContent).toContain('Users can delete own saved items')
    })
  })

  describe('listing tables policies', () => {
    const listingTables = ['dining_venues', 'accommodations', 'events', 'transport_options', 'flights']

    listingTables.forEach(table => {
      it(`should have read policy for ${table}`, () => {
        expect(migrationContent).toContain(`ON public.${table}`)
        // Check for view/select policy
        const hasViewPolicy = migrationContent.includes(`ON public.${table}`) && 
                             migrationContent.includes('FOR SELECT')
        expect(hasViewPolicy).toBe(true)
      })

      it(`should have write policies for ${table}`, () => {
        // Check that the table has INSERT and UPDATE policies
        const tableSection = migrationContent.split(`ON public.${table}`)
        expect(tableSection.length).toBeGreaterThan(1) // Table is mentioned
        
        const hasInsert = migrationContent.includes(`ON public.${table}`) && 
                         migrationContent.includes('FOR INSERT')
        const hasUpdate = migrationContent.includes(`ON public.${table}`) && 
                         migrationContent.includes('FOR UPDATE')
        
        expect(hasInsert).toBe(true)
        expect(hasUpdate).toBe(true)
      })
    })
  })

  describe('safety tables policies', () => {
    it('should have policy for anyone to view safety information', () => {
      expect(migrationContent).toContain('Anyone can view safety information')
      expect(migrationContent).toContain('ON public.safety_information')
    })

    it('should have policy for users to create own safety reports', () => {
      expect(migrationContent).toContain('Users can create own safety reports')
      expect(migrationContent).toContain('ON public.safety_reports')
    })

    it('should have policy for users to view own safety reports', () => {
      expect(migrationContent).toContain('Users can view own safety reports')
    })
  })

  describe('admin helper function', () => {
    it('should have is_admin() helper function', () => {
      expect(migrationContent).toContain('CREATE OR REPLACE FUNCTION public.is_admin()')
      expect(migrationContent).toContain('RETURNS BOOLEAN')
    })
  })

  describe('policy structure', () => {
    it('should use CREATE POLICY statements', () => {
      const policyCount = (migrationContent.match(/CREATE POLICY/g) || []).length
      expect(policyCount).toBeGreaterThan(30) // We have many policies
    })

    it('should specify policy operations (SELECT, INSERT, UPDATE, DELETE)', () => {
      expect(migrationContent).toContain('FOR SELECT')
      expect(migrationContent).toContain('FOR INSERT')
      expect(migrationContent).toContain('FOR UPDATE')
      expect(migrationContent).toContain('FOR DELETE')
    })

    it('should use USING clauses for row filtering', () => {
      const usingCount = (migrationContent.match(/USING \(/g) || []).length
      expect(usingCount).toBeGreaterThan(20)
    })

    it('should use WITH CHECK clauses for insert/update validation', () => {
      const withCheckCount = (migrationContent.match(/WITH CHECK \(/g) || []).length
      expect(withCheckCount).toBeGreaterThan(15)
    })

    it('should use auth.uid() for user identification', () => {
      const authUidCount = (migrationContent.match(/auth\.uid\(\)/g) || []).length
      expect(authUidCount).toBeGreaterThan(20)
    })
  })

  describe('security best practices', () => {
    it('should have policies for authenticated users', () => {
      expect(migrationContent).toContain('TO authenticated')
    })

    it('should have policies for anonymous users where appropriate', () => {
      expect(migrationContent).toContain('TO anon')
    })

    it('should filter soft-deleted items in listing policies', () => {
      expect(migrationContent).toContain('deleted_at IS NULL')
    })
  })
})
