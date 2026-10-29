import { createClient } from '@supabase/supabase-js';

// Read Vite environment variables
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || '';
const supabasePublishableKey = import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY || '';

// Fail-safe check to ensure missing or template credentials never crash the app
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabasePublishableKey &&
  supabaseUrl !== 'YOUR_SUPABASE_URL' &&
  supabasePublishableKey !== 'your_supabase_publishable_anon_key_here'
);

// Clear any obsolete localStorage tokens to enforce tab-scoped non-persistent session policy
if (typeof window !== 'undefined' && window.localStorage) {
  try {
    Object.keys(window.localStorage).forEach((key) => {
      if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
        window.localStorage.removeItem(key);
      }
    });
  } catch {
    // Ignore storage errors in restricted contexts
  }
}

// Use sessionStorage in browser so credentials/sessions are never permanently saved across fresh visits
const customAuthStorage = typeof window !== 'undefined' && window.sessionStorage ? window.sessionStorage : undefined;

// Provide fallback WebSocket transport for environments without native WebSocket (e.g. Node test runners)
const realtimeConfig = typeof WebSocket !== 'undefined' ? {} : { transport: class WebSocket {} };

// Initialize Supabase client safely
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        storage: customAuthStorage,
        persistSession: true, // persists within active browser tab session only (sessionStorage)
        autoRefreshToken: true,
      },
      realtime: realtimeConfig,
    })
  : null;


/**
 * Safe connection test
 * Checks client configuration and makes an actual lightweight request
 * to verify reachability of the Supabase project without requiring database tables.
 *
 * @returns {Promise<{ success: boolean, message: string, details?: any }>}
 */
export async function testSupabaseConnection() {
  if (!supabaseUrl) {
    return {
      success: false,
      message: 'VITE_SUPABASE_URL is missing in .env.local',
    };
  }

  if (!supabasePublishableKey) {
    return {
      success: false,
      message: 'VITE_SUPABASE_PUBLISHABLE_KEY is not set in .env.local',
    };
  }

  if (!supabase) {
    return {
      success: false,
      message: 'Supabase client failed to initialize.',
    };
  }

  try {
    // Calling getSession() verifies network reachability and key validity against Supabase Auth
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      return {
        success: false,
        message: `Supabase returned an error: ${error.message}`,
        details: error,
      };
    }

    return {
      success: true,
      message: 'Supabase client connected and verified successfully!',
      hasSession: Boolean(data?.session),
    };
  } catch (err) {
    return {
      success: false,
      message: `Network request to Supabase failed: ${err.message}`,
      details: err,
    };
  }
}
