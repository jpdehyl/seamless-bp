"use client";

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc";
import { supabaseBrowser } from "@/lib/supabase/browser";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoginWithOAuth = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Safely initialize Supabase client
      const supabase = supabaseBrowser();
      if (!supabase) {
        throw new Error("Failed to initialize Supabase client");
      }
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError("An error occurred during Google sign-in");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginWithEmail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Safely initialize Supabase client
      const supabase = supabaseBrowser();
      if (!supabase) {
        throw new Error("Failed to initialize Supabase client");
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError("An error occurred during email sign-in");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen auth-background">
      <div className="relative">
        <div className="glowbox absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0"></div>
        <div className="w-96 rounded-md border border-border p-5 space-y-5 relative bg-black z-10">
          <div className="flex items-center justify-between gap-2">    
            <h1 className="text-2xl font-bold">Sign in to Seamless</h1>
          </div>
          <div className="flex flex-col gap-4 mt-4">
            <Input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 mt-2">{error}</p>
          )}

          <p className="text-sm text-muted-foreground mt-6 mb-4">Register or sign in to your account</p>
          <div className="flex flex-col gap-2">
            <Button 
              className="block w-full" 
              variant="outline"
              onClick={handleLoginWithEmail}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
            <Button 
              className="block w-full" 
              variant="outline"
              disabled={loading}
            >
              Register
            </Button>
            <Button 
              className="flex items-center justify-center gap-2 w-full" 
              variant="outline" 
              onClick={handleLoginWithOAuth}
              disabled={loading}
            >
              <FcGoogle className="h-4 w-4" />
              Sign in with Google
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}