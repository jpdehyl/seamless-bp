"use client";

import { supabaseBrowser } from "@/lib/supabase/browser";
import { useQuery } from "@tanstack/react-query";
import React from "react";


const initUser = {
    created_at: "",
    display_name: "",
    email: "",
    id: "",
    role: "",
    username: "",
    image_url: "",
    
}


export default function useUser() {
    
    return useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            console.log("useUser: Fetching session...");
            const supabase = supabaseBrowser()
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();

            if (sessionError) {
              console.error("useUser: Error fetching session:", sessionError);
              return initUser;
            }
            
            console.log("useUser: Session user ID:", session?.user?.id);

            if (session?.user) {
                console.log("useUser: Session found, fetching profile for ID:", session.user.id);
                const { data: userProfile, error: profileError } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", session.user.id)
                    .single();

                if (profileError) {
                  console.error("useUser: Error fetching profile:", profileError);
                  // Decide if returning initUser is correct here, or maybe throw?
                  return initUser; 
                }

                console.log("useUser: Fetched profile data:", userProfile);
                return userProfile;
            }
            
            console.log("useUser: No session found, returning initUser.");
            return initUser;
        }
    });
}