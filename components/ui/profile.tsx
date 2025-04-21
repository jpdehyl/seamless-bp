"use client"

import React from "react";
import Link from "next/link";
import useUser from "@/app/hook/useUser";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Profile() {
    const { isFetching, data: user } = useUser();
    const router = useRouter();

    const handleLogout = async () => {
        const supabase = supabaseBrowser();
        await supabase.auth.signOut();
        router.refresh();
    };

    if (isFetching) {
        return <div className="h-8 w-8 bg-muted rounded-full animate-pulse"></div>;
    }

    if (!user?.id) {
        return null;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                    <Image
                        src={user.image_url || "/default-avatar.png"}
                        alt={user.display_name || "User profile image"}
                        width={32}
                        height={32}
                        className="rounded-full"
                    />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {user.display_name || "User"}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    Log Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}