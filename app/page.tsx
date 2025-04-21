import { Button } from "@/components/ui/button" 
import React from "react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to Seamless</h1>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/signin">Sign In with Google</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/auth">Register</Link>
        </Button>
      </div>
    </div>
  )
}