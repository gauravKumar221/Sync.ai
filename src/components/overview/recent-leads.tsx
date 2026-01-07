import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { leads } from '@/lib/data';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export function RecentLeads() {
  const recentLeads = leads.slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Leads</CardTitle>
         <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/leads">
                View All
                <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentLeads.map((lead) => (
          <div key={lead.id} className="flex items-center gap-4">
            <Avatar className="h-9 w-9">
              <AvatarImage src={lead.avatarUrl} alt={lead.name} />
              <AvatarFallback>{lead.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium leading-none">{lead.name}</p>
              <p className="text-sm text-muted-foreground">{lead.phone}</p>
            </div>
            <div className="text-sm text-muted-foreground">{lead.timestamp}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
