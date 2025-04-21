'use client';

import { useEffect } from 'react';

// Define the CredentialResponse type
interface CredentialResponse {
  credential: string;
  select_by: string;
  g_csrf_token: string;
}

// Define the props for the component
interface GoogleSignInProps {
  clientId: string;
  onSignIn: (response: CredentialResponse) => void;
}

export function GoogleSignIn({ clientId, onSignIn }: GoogleSignInProps) {
  // Define the callback function that will be called when sign-in completes
  const handleSignInWithGoogle = (response: CredentialResponse) => {
    console.log('Google Sign-In successful', response);
    onSignIn(response);
  };

  // Add the callback function to the window object so it can be called by the Google Sign-In script
  useEffect(() => {
    // @ts-ignore - Adding the callback function to the window object
    window.handleSignInWithGoogle = handleSignInWithGoogle;
    
    // Clean up the callback function when the component unmounts
    return () => {
      // @ts-ignore
      delete window.handleSignInWithGoogle;
    };
  }, [onSignIn]);

  return (
    <>
      <div
        id="g_id_onload"
        data-client_id={clientId}
        data-context="signin"
        data-ux_mode="popup"
        data-callback="handleSignInWithGoogle"
        data-nonce=""
        data-auto_select="true"
        data-itp_support="true"
        data-use_fedcm_for_prompt="true"
      ></div>
      <div
        className="g_id_signin"
        data-type="standard"
        data-shape="pill"
        data-theme="outline"
        data-text="signin_with"
        data-size="large"
        data-logo_alignment="left"
      ></div>
    </>
  );
} 