
'use client';
import { LeadCard } from '@/components/leads/lead-card';
import { leads as allLeadsData } from '@/lib/data';
import { Lead, LeadStatus } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, X } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import {
  startOfDay,
  subDays,
  subYears,
  isWithinInterval,
  format,
} from 'date-fns';

const statusOptions: (LeadStatus | 'All')[] = [
  'All',
  'New',
  'In Progress',
  'Converted',
  'Lost',
];
const statusOrder: LeadStatus[] = ['New', 'In Progress', 'Converted', 'Lost'];

type DateFilterPreset = 'all' | 'today' | 'last7days' | 'lastyear' | 'custom';

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(allLeadsData);
  const [groupBy, setGroupBy] = useState<'status' | 'assignedAgent'>('status');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'All'>('All');
  const [dateFilter, setDateFilter] =
    useState<DateFilterPreset>('all');
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>(
    undefined
  );

  const handleUpdateLead = (updatedLead: Lead) => {
    setLeads(leads.map(lead => lead.id === updatedLead.id ? updatedLead : lead));
  }

  const handleClearFilters = () => {
    setDateFilter('all');
    setCustomDateRange(undefined);
    setStatusFilter('All');
    setGroupBy('status');
  };

  const filteredLeads = leads.filter((lead) => {
    // Status filter
    if (statusFilter !== 'All' && lead.status !== statusFilter) {
      return false;
    }

    // Date filter
    const now = new Date();
    let isInDateRange = true;
    switch (dateFilter) {
      case 'today':
        isInDateRange = isWithinInterval(lead.createdAt, {
          start: startOfDay(now),
          end: now,
        });
        break;
      case 'last7days':
        isInDateRange = isWithinInterval(lead.createdAt, {
          start: subDays(now, 7),
          end: now,
        });
        break;
      case 'lastyear':
        isInDateRange = isWithinInterval(lead.createdAt, {
          start: subYears(now, 1),
          end: now,
        });
        break;
      case 'custom':
        if (customDateRange?.from && customDateRange?.to) {
          isInDateRange = isWithinInterval(lead.createdAt, {
            start: startOfDay(customDateRange.from),
            end: customDateRange.to,
          });
        }
        break;
      case 'all':
      default:
        isInDateRange = true;
        break;
    }
    
    return isInDateRange;
  });

  const groupedLeads: Record<string, Lead[]> = {};
  filteredLeads.forEach(lead => {
    const key = groupBy === 'status' ? lead.status : lead.assignedAgent.name;
    if (!groupedLeads[key]) {
      groupedLeads[key] = [];
    }
    groupedLeads[key].push(lead);
  });

  const sortedGroupKeys =
    groupBy === 'status'
      ? statusOrder.filter((status) => groupedLeads[status])
      : Object.keys(groupedLeads).sort();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground">
            View and manage all your leads in one place.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Filter by Date:</label>
            <Select
              value={dateFilter}
              onValueChange={(value: DateFilterPreset) => {
                setDateFilter(value);
                if (value !== 'custom') {
                  setCustomDateRange(undefined);
                }
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="last7days">Last 7 Days</SelectItem>
                <SelectItem value="lastyear">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className="w-[240px] justify-start text-left font-normal"
                  onClick={() => setDateFilter('custom')}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {customDateRange?.from ? (
                    customDateRange.to ? (
                      <>
                        {format(customDateRange.from, 'LLL dd, y')} -{' '}
                        {format(customDateRange.to, 'LLL dd, y')}
                      </>
                    ) : (
                      format(customDateRange.from, 'LLL dd, y')
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={customDateRange}
                  onSelect={setCustomDateRange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Filter by Status:</label>
            <Select
              value={statusFilter}
              onValueChange={(value: LeadStatus | 'All') =>
                setStatusFilter(value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Group by:</label>
            <Select
              value={groupBy}
              onValueChange={(value: 'status' | 'assignedAgent') =>
                setGroupBy(value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Group by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="assignedAgent">Assigned Agent</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <Button variant="ghost" onClick={handleClearFilters}>
            <X className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {sortedGroupKeys.length > 0 ? (
          sortedGroupKeys.map((groupName) => (
            <div key={groupName}>
              <h2 className="mb-2 text-sm font-semibold text-muted-foreground">
                {groupName} ({groupedLeads[groupName].length})
              </h2>
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="flex flex-col">
                  {groupedLeads[groupName].map((lead) => (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      onUpdate={handleUpdateLead}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            No leads found for the selected filters.
          </div>
        )}
      </div>
    </div>
  );
}
