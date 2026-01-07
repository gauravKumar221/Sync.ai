'use client';
import { LeadCard } from '@/components/leads/lead-card';
import { leads as allLeads } from '@/lib/data';
import { Lead, LeadStatus } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

const statusOrder: LeadStatus[] = ['New', 'In Progress', 'Converted', 'Lost'];

export default function LeadsPage() {
  const [groupBy, setGroupBy] = useState<'status' | 'assignedAgent'>('status');

  const groupedLeads = allLeads.reduce(
    (acc, lead) => {
      const key = groupBy === 'status' ? lead.status : lead.assignedAgent.name;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(lead);
      return acc;
    },
    {} as Record<string, Lead[]>
  );

  const sortedGroupKeys =
    groupBy === 'status'
      ? statusOrder
      : Object.keys(groupedLeads).sort();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground">
            View and manage all your leads in one place.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Group by:</label>
          <Select value={groupBy} onValueChange={(value: 'status' | 'assignedAgent') => setGroupBy(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Group by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="assignedAgent">Assigned Agent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-6">
        {sortedGroupKeys.map((groupName) => (
          <div key={groupName}>
            <h2 className="mb-2 text-sm font-semibold text-muted-foreground">
              {groupName} ({groupedLeads[groupName].length})
            </h2>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col">
                {groupedLeads[groupName].map((lead) => (
                  <LeadCard key={lead.id} lead={lead} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
