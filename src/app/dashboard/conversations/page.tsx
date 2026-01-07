'use client'
import { Suspense } from 'react';
import { ChatLayout } from "@/components/conversations/chat-layout";
import { conversations, leads } from "@/lib/data";
import { useSearchParams } from "next/navigation";
import { Skeleton } from '@/components/ui/skeleton';

function ConversationsClientPage() {
  const searchParams = useSearchParams();
  const leadId = searchParams.get('leadId');

  const defaultLayout = [265, 440, 655];

  return (
    <ChatLayout
      defaultLayout={defaultLayout}
      leads={leads}
      conversations={conversations}
      navCollapsedSize={4}
      defaultSelectedLeadId={leadId}
    />
  );
}

function LoadingSkeleton() {
    return (
        <div className="flex h-[calc(100vh-10rem)] rounded-lg border">
            <Skeleton className="h-full w-[265px]" />
            <div className="flex-1 p-4 space-y-4">
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-full w-full" />
            </div>
        </div>
    )
}

export default function ConversationsPage() {
  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-2xl font-bold tracking-tight">Conversations</h1>
        <p className="text-muted-foreground">
          Engage with your leads and customers.
        </p>
      </div>
      <div className="hidden flex-col md:flex">
        <Suspense fallback={<LoadingSkeleton />}>
            <ConversationsClientPage />
        </Suspense>
      </div>
       <div className="md:hidden text-center text-muted-foreground">
        Conversation view is available on larger screens.
      </div>
    </div>
  );
}
