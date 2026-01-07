'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { leads } from '@/lib/data';
import type { Lead, LeadSource } from '@/lib/types';
import {
  ArrowRight,
  Facebook,
  Globe,
  MessageSquare,
  User,
} from 'lucide-react';
import Link from 'next/link';

const SourceIcon = ({
  source,
  className,
}: {
  source: LeadSource;
  className?: string;
}) => {
  const iconProps = { className };
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

function NotificationCard({ lead }: { lead: Lead }) {
  return (
    <Card className="transition-all hover:bg-muted/50">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <SourceIcon source={lead.source} className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1 space-y-1">
          <CardTitle className="text-lg">New Lead: {lead.name}</CardTitle>
          <CardDescription>{lead.lastMessage}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-between p-4 pt-0">
        <div className="text-sm text-muted-foreground">{lead.timestamp}</div>
        <Link
          href={`/dashboard/conversations?leadId=${lead.id}`}
          className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View details <ArrowRight className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}

export default function NotificationsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">
          You have {leads.length} new notifications.
        </p>
      </div>
      <div className="space-y-4">
        {leads.map((lead) => (
          <NotificationCard key={lead.id} lead={lead} />
        ))}
      </div>
    </div>
  );
}
