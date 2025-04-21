"use client";

import { supabaseBrowser } from "@/lib/supabase/browser";
import { useQuery } from "@tanstack/react-query";
import React from "react";

// Define a type for the user profile for better type safety
// You might need to adjust this based on your actual 'profiles' table structure
interface UserProfile {
  created_at: string;
  display_name: string;
  email: string;
  id: string;
  role: string;
  username: string;
  image_url: string;
}

export default function useUser() {
    
    // Specify the return type for useQuery
    return useQuery<UserProfile | null>({ // Return UserProfile or null
        queryKey: ["user"],
        queryFn: async () => {
            console.log("useUser: Fetching session...");
            const supabase = supabaseBrowser()
            if (!supabase) {
              console.error("useUser: Supabase client not available.");
              return null; // Return null if client fails
            }

            const { data: { session }, error: sessionError } = await supabase.auth.getSession();

            if (sessionError) {
              console.error("useUser: Error fetching session:", sessionError);
              return null; // Return null on session error
            }
            
            console.log("useUser: Session user ID:", session?.user?.id);

            if (session?.user) {
                console.log("useUser: Session found, fetching profile for ID:", session.user.id);
                const { data: userProfile, error: profileError } = await supabase
                    .from("profiles")
                    .select("*") // Consider selecting only necessary fields
                    .eq("id", session.user.id)
                    .single();

                if (profileError) {
                  console.error("useUser: Error fetching profile:", profileError);
                  // Return null on profile error
                  return null; 
                }

                console.log("useUser: Fetched profile data:", userProfile);
                // Ensure the fetched data matches the UserProfile type if necessary
                return userProfile as UserProfile; // Cast might be needed depending on Supabase types
            }
            
            console.log("useUser: No session found, returning null.");
            return null; // Return null if no session
        }
    });
}