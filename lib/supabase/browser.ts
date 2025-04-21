import { createBrowserClient } from "@supabase/ssr";
import { Database } from "../types/supabase";

// Create a singleton instance to prevent multiple initializations
let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null;

export const supabaseBrowser = () => {
  console.log("supabaseBrowser: Attempting to get/create client...");
  try {
    // Return existing instance if available
    if (supabaseInstance) {
      console.log("supabaseBrowser: Returning existing instance.");
      return supabaseInstance;
    }
    
    // Check if environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error("Supabase environment variables are not properly configured");
      return null;
    }
    
    // Create new instance
    supabaseInstance = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    return supabaseInstance;
  } catch (error) {
    console.error("Error initializing Supabase client:", error);
    return null;
  }
}