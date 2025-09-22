import { supabase } from './supabase'
import type { Session } from '@supabase/supabase-js'

export interface AuthUser {
  id: string
  email?: string
  created_at: string
}

export async function signUpWithEmail(email: string, password: string): Promise<AuthUser> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`
    }
  })
  
  if (error) {
    throw new Error(`Failed to sign up: ${error.message}`)
  }
  
  if (!data.user) {
    throw new Error('No user returned from sign up')
  }
  
  return {
    id: data.user.id,
    email: data.user.email || undefined,
    created_at: data.user.created_at,
  }
}

export async function signInWithEmail(email: string, password: string): Promise<AuthUser> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) {
    throw new Error(`Failed to sign in: ${error.message}`)
  }
  
  if (!data.user) {
    throw new Error('No user returned from sign in')
  }
  
  return {
    id: data.user.id,
    email: data.user.email || undefined,
    created_at: data.user.created_at,
  }
}

export async function signInAnonymously(): Promise<AuthUser> {
  // Keep for demo purposes, but discourage use
  const { data, error } = await supabase.auth.signInAnonymously()
  
  if (error) {
    throw new Error(`Failed to sign in: ${error.message}`)
  }
  
  if (!data.user) {
    throw new Error('No user returned from sign in')
  }
  
  return {
    id: data.user.id,
    email: data.user.email || undefined,
    created_at: data.user.created_at,
  }
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    throw new Error(`Failed to sign out: ${error.message}`)
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }
  
  return {
    id: user.id,
    email: user.email || undefined,
    created_at: user.created_at,
  }
}

export async function getSession(): Promise<Session | null> {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

// Auth state change listener
export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  return supabase.auth.onAuthStateChange(async (_event, session) => {
    if (session?.user) {
      callback({
        id: session.user.id,
        email: session.user.email || undefined,
        created_at: session.user.created_at,
      })
    } else {
      callback(null)
    }
  })
}