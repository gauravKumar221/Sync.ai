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
  useSidebar,
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
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo className="h-7 w-7" />
          <span
            className={cn(
              'text-lg font-semibold transition-opacity duration-200',
              isCollapsed ? 'opacity-0' : 'opacity-100'
            )}
          >
            LeadFlowAI
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <Link href={item.href}>
                <SidebarMenuButton as="a" isActive={isActive(item.href)} size="lg" tooltip={item.title}>
                  <item.icon className="h-5 w-5" />
                  {!isCollapsed && <span>{item.title}</span>}
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href={settingsNav.href}>
              <SidebarMenuButton as="a" isActive={isActive(settingsNav.href)} size="lg" tooltip={settingsNav.title}>
                <settingsNav.icon className="h-5 w-5" />
                {!isCollapsed && <span>{settingsNav.title}</span>}
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userProfileImage?.imageUrl} alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className={cn("flex flex-col text-sm transition-opacity duration-200", isCollapsed ? 'opacity-0' : 'opacity-100' )}>
              <span className="font-medium">User</span>
              <span className="text-xs text-muted-foreground">user@email.com</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className={cn("h-7 w-7", isCollapsed ? 'opacity-0 pointer-events-none' : '')}>
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
