'use client';

import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/browser'; 
import { Button } from "@/components/ui/button";
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const router = useRouter();
  const supabase = supabaseBrowser(); // Get supabase client instance

  const handleLogout = async () => {
    if (!supabase) {
        console.error("Supabase client not initialized");
        // Optionally: show an error message to the user
        return;
    }
    
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error logging out:', error.message);
      // Optionally: show an error message to the user
    } else {
      // Redirect to the root page after successful logout
      router.push('/'); // Changed from '/login' to '/'
      router.refresh(); // Refresh server components
    }
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout}>
      <LogOut className="mr-2 size-4" />
      Logout
    </Button>
  );
} 