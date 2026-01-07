
'use client';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import {
  
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Bell, CreditCard, LogOut, Settings, User, MessageSquare, Globe, Facebook } from 'lucide-react';
import { leads } from '@/lib/data';
import { LeadSource } from '@/lib/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const userProfileImage = PlaceHolderImages.find(p => p.id === 'user-profile');

const SourceIcon = ({ source, className }: { source: LeadSource, className?: string }) => {
  const iconProps = { className: cn("h-4 w-4", className) };
  switch (source) {
    case 'WhatsApp':
      return <MessageSquare {...iconProps} />;
    case 'Website':
      return <Globe {...iconProps} />;
    case 'Facebook':
      return <Facebook {...iconProps} />;
    case 'Manual':
      return <User {...iconProps} />;
    default:
      return null;
  }
};


export function UserNav() {
  const recentLeads = leads.slice(0, 4);
  const router = useRouter();

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-red-600"></span>
            </span>
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80" align="end">
          <DropdownMenuLabel>
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium leading-none">Notifications</p>
                <p className="text-xs leading-none text-muted-foreground">4 new</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
           <DropdownMenuGroup>
            {recentLeads.map(lead => (
              <DropdownMenuItem key={lead.id} className="items-start gap-3">
                <SourceIcon source={lead.source} className="text-muted-foreground mt-1" />
                <div className="flex flex-col">
                  <p className="text-sm font-medium">New lead from {lead.source}</p>
                  <p className="text-xs text-muted-foreground">
                    {lead.name} - {lead.timestamp}
                  </p>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="justify-center">
                <Link href="/dashboard/notifications" className='cursor-pointer text-primary hover:underline'>
                    View All Notifications
                </Link>
            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userProfileImage?.imageUrl} alt="@shadcn" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">User</p>
              <p className="text-xs leading-none text-muted-foreground">
                user@example.com
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
