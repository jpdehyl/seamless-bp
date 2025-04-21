'use client';

import React, { useState } from 'react';
import Sidebar from "@/components/ui/Sidebar";
import Navbar from "@/components/ui/navbar";
import { cn } from "@/lib/utils";
import useUser from "@/app/hook/useUser";

interface LayoutClientProps {
  children: React.ReactNode;
}

export default function LayoutClient({ children }: LayoutClientProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const { data: user, isFetching } = useUser();

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const isAuthenticated = !isFetching && user?.id;

  return (
    <div className="flex h-screen overflow-hidden">
      {isAuthenticated && (
        <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
      )}
      <div className={cn(
        "relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden transition-all duration-300 ease-in-out",
        isAuthenticated ? (isSidebarCollapsed ? "sm:ml-16" : "sm:ml-64") : "sm:ml-0"
      )}>
        {isAuthenticated && <Navbar />}
        <main className="p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
} 