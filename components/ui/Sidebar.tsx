'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  Banknote,
  Clock,
  Settings,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isCollapsed, toggleSidebar }: SidebarProps) => {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/projects', label: 'Projects', icon: Briefcase },
    { href: '/finances', label: 'Finances', icon: Banknote },
    { href: '/timecards', label: 'Timecards', icon: Clock },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className={cn(
      "fixed left-0 top-0 z-40 h-screen border-r bg-background transition-all duration-300 ease-in-out",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex h-full flex-col overflow-y-auto px-3 py-4">
        <div className={cn(
          "mb-5 flex items-center",
          isCollapsed ? "justify-center" : "pl-2.5"
        )}>
          <span className={cn(
            "self-center whitespace-nowrap text-xl font-semibold",
            isCollapsed && "hidden"
          )}>
            Seamless
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar} 
            className={cn(
              "absolute top-2 right-2 transition-opacity",
              !isCollapsed && "hidden"
            )}
            aria-label="Expand sidebar"
          >
            <ChevronsRight className="h-5 w-5" />
          </Button>
        </div>
        
        <ul className="space-y-2 font-medium flex-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'flex items-center rounded-lg p-2 text-foreground hover:bg-accent hover:text-accent-foreground group',
                  isCollapsed ? "justify-center" : "",
                  {
                    'bg-accent text-accent-foreground': pathname === item.href,
                  }
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon className="h-5 w-5 shrink-0 text-muted-foreground transition duration-75 group-hover:text-accent-foreground" />
                <span className={cn(
                  "ms-3", 
                  isCollapsed && "hidden"
                )}>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-auto p-2 flex justify-end">
           <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className={cn(isCollapsed && "hidden")}
            aria-label="Collapse sidebar"
          >
            <ChevronsLeft className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;