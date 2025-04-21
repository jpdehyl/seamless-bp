'use client';

import { useState } from 'react';
import { GoogleSignIn } from '@/components/GoogleSignIn';

export default function SignInPage() {
  const [signInResponse, setSignInResponse] = useState<string | null>(null);
  
  // Replace with your actual Google Client ID
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
  
  const handleSignIn = (response: any) => {
    // Store the credential in state
    setSignInResponse(response.credential);
    
    // Here you would typically:
    // 1. Send the credential to your backend
    // 2. Verify the token
    // 3. Create a session for the user
    console.log('Sign-in successful with credential:', response.credential);
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-8">Sign In with Google</h1>
      
      <div className="mb-8">
        <GoogleSignIn clientId={clientId} onSignIn={handleSignIn} />
      </div>
      
      {signInResponse && (
        <div className="mt-8 p-4 border rounded-lg max-w-md overflow-auto">
          <h2 className="text-lg font-semibold mb-2">Sign-In Successful!</h2>
          <p className="text-sm text-gray-500 mb-2">Credential (first 20 chars):</p>
          <code className="text-xs bg-gray-100 p-2 rounded block">
            {signInResponse.substring(0, 20)}...
          </code>
        </div>
      )}
    </div>
  );
} 