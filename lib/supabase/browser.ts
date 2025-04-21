import { createBrowserClient } from "@supabase/ssr";

// Create a singleton instance to prevent multiple initializations
let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null;

export const supabaseBrowser = () => {
  try {
    // Return existing instance if available
    if (supabaseInstance) {
      return supabaseInstance;
    }
    
    // Check if environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error("Supabase environment variables are not properly configured");
      return null;
    }
    
    // Create new instance
    supabaseInstance = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    return supabaseInstance;
  } catch (error) {
    console.error("Error initializing Supabase client:", error);
    return null;
  }
}