'use client';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import type { Lead, LeadPriority, LeadStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { GripVertical, Trash2, MoreVertical, Octagon, AlertTriangle, Circle } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

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

const getPriorityCardVariant = (priority: LeadPriority) => {
  switch (priority) {
    case 'High':
      return 'bg-blue-700/10 border-blue-700/20 hover:bg-blue-700/20';
    case 'Medium':
      return 'bg-yellow-500/10 border-yellow-500/20 hover:bg-yellow-500/20';
    case 'Low':
      return 'bg-orange-500/10 border-orange-500/20 hover:bg-orange-500/20';
    default:
      return 'hover:bg-muted/50';
  }
};

const getPriorityBadgeVariant = (priority: LeadPriority) => {
    switch (priority) {
        case 'High':
            return 'bg-blue-700/20 text-blue-300 border-blue-700/30';
        case 'Medium':
            return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        case 'Low':
            return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
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

const PriorityIcon = ({ priority }: { priority: LeadPriority }) => {
  switch (priority) {
    case 'Low':
      return <Circle className="h-3 w-3 text-orange-500" />;
    case 'Medium':
      return <AlertTriangle className="h-3 w-3 text-yellow-500" />;
    case 'High':
      return <Octagon className="h-3 w-3 text-blue-700" fill="currentColor" />;
  }
};

export function LeadCard({ lead, onDelete, onUpdate }: { lead: Lead, onDelete: () => void, onUpdate: (lead: Lead) => void }) {

  const handlePriorityChange = (priority: LeadPriority) => {
    onUpdate({ ...lead, priority });
  };
  
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("group flex cursor-pointer items-center gap-4 border-b p-3 pr-4 transition-colors last:border-b-0", getPriorityCardVariant(lead.priority))}>
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
              <div className="w-20 truncate font-medium flex items-center gap-2">
                <PriorityIcon priority={lead.priority} />
                {lead.name}
              </div>
              <div className="flex-1 truncate text-muted-foreground">
                {lead.lastMessage}
              </div>
              <div className="w-24 text-right text-xs text-muted-foreground">
                {lead.timestamp}
              </div>
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                   <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                   <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Set Priority</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                         <DropdownMenuRadioGroup value={lead.priority} onValueChange={(value) => handlePriorityChange(value as LeadPriority)}>
                          <DropdownMenuRadioItem value="High">High</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="Medium">Medium</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="Low">Low</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete(); }}>
                    <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                    <span className="text-red-500">Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          align="start"
          className="w-96 rounded-xl border-2 p-4 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between">
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
              <div className='flex gap-2'>
                 <Badge
                    className={cn('capitalize', getPriorityBadgeVariant(lead.priority))}
                    >
                    {lead.priority} Priority
                </Badge>
                <Badge
                    className={cn('capitalize', getStatusBadgeVariant(lead.status))}
                >
                    {lead.status}
                </Badge>
              </div>
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
