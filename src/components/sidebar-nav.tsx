'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Bot,
  BarChart,
  Calendar,
  Wallet,
  Settings,
  MoreHorizontal,
} from 'lucide-react';

import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import Logo from '@/components/logo';
import type { NavItem } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

const navItems: NavItem[] = [
  { title: 'Overview', href: '/dashboard/overview', icon: LayoutDashboard },
  { title: 'Leads', href: '/dashboard/leads', icon: Users },
  { title: 'Conversations', href: '/dashboard/conversations', icon: MessageSquare },
  { title: 'Automation', href: '/dashboard/automation', icon: Bot },
  { title: 'Analytics', href: '/dashboard/analytics', icon: BarChart },
  { title: 'Calendar', href: '/dashboard/calendar', icon: Calendar },
  { title: 'Finance', href: '/dashboard/finance', icon: Wallet },
];

const settingsNav: NavItem = {
  title: 'Settings',
  href: '/dashboard/settings',
  icon: Settings,
};

const userProfileImage = PlaceHolderImages.find(p => p.id === 'user-profile');

export function SidebarNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href;
  };
  
  const activeNavItemStyle = "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 bg-gradient-to-r from-cyan-glow/20 to-cyan-glow/5 text-cyan-glow";
  const navItemStyle = "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-cyan-glow/20 hover:to-cyan-glow/5 hover:text-cyan-glow text-muted-foreground";

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo className="h-7 w-7" />
          <span className="text-lg font-semibold">LeadFlowAI</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <Link href={item.href}>
                <div className={cn(isActive(item.href) ? activeNavItemStyle : navItemStyle)}>
                  <item.icon />
                  <span>{item.title}</span>
                </div>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href={settingsNav.href}>
              <div className={cn(isActive(settingsNav.href) ? activeNavItemStyle : navItemStyle)}>
                <settingsNav.icon />
                <span>{settingsNav.title}</span>
              </div>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator />
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userProfileImage?.imageUrl} alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-sm">
              <span className="font-medium">User</span>
              <span className="text-xs text-muted-foreground">user@email.com</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>
    </>
  );
}
