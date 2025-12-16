"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import { signOut as authSignOut } from '@/lib/services/auth.service';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const isSupabaseConfigured = supabaseUrl && 
      supabaseKey && 
      !supabaseUrl.includes('placeholder') && 
      !supabaseUrl.includes('xxxxxxxxx') &&
      !supabaseKey.includes('placeholder') &&
      supabaseUrl !== 'https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.supabase.co'

    if (!isSupabaseConfigured) {
      // Mock authentication - check localStorage
      console.log('[AuthContext] Using mock authentication - Supabase not configured')
      
      const storedUser = localStorage.getItem('mock-auth-user')
      const storedSession = localStorage.getItem('mock-auth-session')
      
      if (storedUser && storedSession) {
        const mockUser = JSON.parse(storedUser)
        const mockSession = JSON.parse(storedSession)
        setUser(mockUser)
        setSession(mockSession)
      }
      
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const signOut = async () => {
    await authSignOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
