import React from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AuthErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-background text-foreground">
      <div className="bg-card p-8 rounded-lg shadow-lg max-w-md text-center border border-destructive">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-semibold mb-2 text-destructive">Authentication Error</h1>
        <p className="text-muted-foreground mb-6">
          Sorry, we couldn't sign you in using Google at this time. This might be due to a configuration issue or a temporary problem.
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          Please try signing in again later, or contact support if the issue persists.
        </p>
        <Button asChild>
          <Link href="/">Return to Homepage</Link>
        </Button>
      </div>
    </div>
  );
} 