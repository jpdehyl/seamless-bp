"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Globe } from "@/components/ui/globe";
import useUser from "@/app/hook/useUser";
import { FcGoogle } from "react-icons/fc";
import { supabaseBrowser } from "@/lib/supabase/browser";

export default function HomePage() {
  const { data: user, isFetching: loading } = useUser();

  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoginWithOAuth = async () => {
    try {
      setIsGoogleSigningIn(true);
      setError(null);

      const supabase = supabaseBrowser();
      if (!supabase) {
        throw new Error("Failed to initialize Supabase client");
      }

      const { data, error: signInError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${location.origin}/auth/callback`,
        },
      });

      if (signInError) {
        setError(signInError.message);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during Google sign-in");
      console.error(err);
    } finally {
      setIsGoogleSigningIn(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-br from-background via-background to-muted/30 text-foreground relative overflow-hidden">
      <div className="mb-8 z-10 transform transition-transform duration-500 hover:scale-130">
        <Image 
          src="/logo.svg" 
          alt="Seamless Logo" 
          width={500}
          height={300}
          priority
                 />
      </div>

      <Globe className="mb-8 max-w-[600px] z-0" />

      <p className="font-logo text-lg md:text-xl text-muted-foreground bg-card mb-12 text-center max-w-2xl z-10 p-4 rounded-lg shadow-md">
        Experience our streamlined workflows. Let&apos;s get you started:
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4 z-10">
        {!loading && (
          user?.id ? (
            <Button size="lg" asChild className="transition-transform duration-300 hover:scale-105 shadow-lg">
              <Link href="/dashboard">Profile</Link>
            </Button>
          ) : (
            <>
              <Button
                size="lg"
                className="flex items-center justify-center gap-2 transition-transform duration-300 hover:scale-105 shadow-lg"
                variant="outline"
                onClick={handleLoginWithOAuth}
                disabled={isGoogleSigningIn}
              >
                <FcGoogle className="h-5 w-5" />
                {isGoogleSigningIn ? "Redirecting..." : "Sign in with Google"}
              </Button>
            </>
          )
        )}
        {loading && (
          <p className="text-muted-foreground">Loading user...</p>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500 mt-4 z-10 text-center">{error}</p>
      )}
    </div>
  );
}