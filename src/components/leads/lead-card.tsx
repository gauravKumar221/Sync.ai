'use client';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import type { Lead, LeadStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { GripVertical } from 'lucide-react';
import Link from 'next/link';

const getStatusBadgeVariant = (status: LeadStatus) => {
  switch (status) {
    case 'New':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'In Progress':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'Converted':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'Lost':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    default:
      return 'default';
  }
};

const getStatusInitial = (status: LeadStatus) => {
  switch (status) {
    case 'New':
      return 'N';
    case 'In Progress':
      return 'P';
    case 'Converted':
      return 'C';
    case 'Lost':
      return 'L';
  }
};

export function LeadCard({ lead }: { lead: Lead }) {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="group flex cursor-pointer items-center gap-4 border-b p-3 pr-8 transition-colors last:border-b-0 hover:bg-muted/50">
            <div className="flex items-center gap-3">
              <GripVertical className="h-4 w-4 text-muted-foreground/50 transition-opacity group-hover:opacity-100 md:opacity-0" />
              <Checkbox />
            </div>

            <div className="flex w-full items-center gap-4">
              <Badge
                variant="outline"
                className={cn(
                  'w-6 justify-center text-xs font-bold',
                  getStatusBadgeVariant(lead.status)
                )}
              >
                {getStatusInitial(lead.status)}
              </Badge>
              <div className="w-20 truncate font-medium">{lead.name}</div>
              <div className="flex-1 truncate text-muted-foreground">
                {lead.lastMessage}
              </div>
              <div className="w-24 text-right text-xs text-muted-foreground">
                {lead.timestamp}
              </div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          align="start"
          className="w-96 rounded-xl border-2 p-4 shadow-2xl"
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={lead.avatarUrl} alt={lead.name} />
                  <AvatarFallback>{lead.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{lead.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {lead.phone}
                  </p>
                </div>
              </div>
              <Badge
                className={cn('capitalize', getStatusBadgeVariant(lead.status))}
              >
                {lead.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium">Last Message:</p>
              <p className="text-sm text-muted-foreground">
                {lead.lastMessage}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                Assigned to: {lead.assignedAgent.name}
              </div>
              <Button size="sm" asChild>
                <Link href={`/dashboard/conversations?leadId=${lead.id}`}>View Conversation</Link>
              </Button>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
