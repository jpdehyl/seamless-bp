import React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc";

export default function page() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <div className="w-96 rounded-md border border-border p-5 space-y-5 relative bg-black">
        <div className="glowBox absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        <div className="flex items-center justify-between gap-2">    
          <h1 className="text-2xl font-bold">Sign in to Seamless</h1>
        </div>
        <div className="flex flex-col gap-4 mt-4">
          <Input type="email" placeholder="Email" />
          <Input type="password" placeholder="Password" />
        </div>

        <p className="text-sm text-muted-foreground mt-6 mb-4">Register or sign in to your account</p>
        <div className="flex flex-col gap-2">
          <Button className="block w-full" variant="outline">Sign in</Button>
          <Button className="block w-full" variant="outline">Register</Button>
          <Button className="flex items-center justify-center gap-2 w-full" variant="outline">
            <FcGoogle className="h-4 w-4" />
            Sign in with Google
          </Button>
        </div>
      </div>
    </div>
  )
}