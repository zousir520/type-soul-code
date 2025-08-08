// Supabase utility functions for null safety and error handling
import { supabase } from '$lib/supabase';
import { supabaseAdmin, typedSupabaseAdmin } from '$lib/supabase-admin';

/**
 * Ensures that the Supabase admin client is available
 * Throws an error if not configured
 */
export function ensureSupabaseAdmin() {
  if (!typedSupabaseAdmin) {
    throw new Error('Supabase admin client is not configured. Please check your environment variables.');
  }
  return typedSupabaseAdmin;
}

/**
 * Ensures that the regular Supabase client is available
 * Throws an error if not configured
 */
export function ensureSupabase() {
  if (!supabase) {
    throw new Error('Supabase client is not configured. Please check your environment variables.');
  }
  return supabase;
}

/**
 * Ensures that the untyped Supabase admin client is available
 * Throws an error if not configured
 */
export function ensureSupabaseAdminUntyped() {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client is not configured. Please check your environment variables.');
  }
  return supabaseAdmin;
}

/**
 * Safely executes a Supabase operation with proper error handling
 * @param operation - Function that performs the Supabase operation
 * @param errorMessage - Custom error message for logging
 */
export async function safeSupabaseOperation<T>(
  operation: () => Promise<T>,
  errorMessage: string
): Promise<T | null> {
  try {
    return await operation();
  } catch (error) {
    console.error(`${errorMessage}:`, error);
    return null;
  }
}

/**
 * Checks if Supabase is configured and available
 */
export function isSupabaseConfigured(): boolean {
  return !!(supabase && supabaseAdmin && typedSupabaseAdmin);
}

/**
 * Gets a safe Supabase admin client or returns null if not configured
 */
export function getSafeSupabaseAdmin() {
  return typedSupabaseAdmin;
}

/**
 * Gets a safe regular Supabase client or returns null if not configured
 */
export function getSafeSupabase() {
  return supabase;
}

/**
 * Wrapper for database operations that handles null clients gracefully
 */
export async function withSupabaseAdmin<T>(
  operation: (client: NonNullable<typeof typedSupabaseAdmin>) => Promise<T>,
  fallback?: T
): Promise<T | null> {
  if (!typedSupabaseAdmin) {
    console.warn('Supabase admin client not configured, operation skipped');
    return fallback ?? null;
  }
  
  try {
    return await operation(typedSupabaseAdmin);
  } catch (error) {
    console.error('Supabase operation failed:', error);
    return fallback ?? null;
  }
}

/**
 * Wrapper for auth operations that handles null clients gracefully
 */
export async function withSupabaseAuth<T>(
  operation: (client: NonNullable<typeof supabaseAdmin>) => Promise<T>,
  fallback?: T
): Promise<T | null> {
  if (!supabaseAdmin) {
    console.warn('Supabase auth client not configured, operation skipped');
    return fallback ?? null;
  }
  
  try {
    return await operation(supabaseAdmin);
  } catch (error) {
    console.error('Supabase auth operation failed:', error);
    return fallback ?? null;
  }
}
