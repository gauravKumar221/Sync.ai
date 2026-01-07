'use client'
import { ChatLayout } from "@/components/conversations/chat-layout";
import { conversations, leads } from "@/lib/data";
import { useSearchParams } from "next/navigation";

export default function ConversationsPage() {
  const searchParams = useSearchParams();
  const leadId = searchParams.get('leadId');

  const defaultLayout = [265, 440, 655];
  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-2xl font-bold tracking-tight">Conversations</h1>
        <p className="text-muted-foreground">
          Engage with your leads and customers.
        </p>
      </div>
      <div className="hidden flex-col md:flex">
        <ChatLayout
          defaultLayout={defaultLayout}
          leads={leads}
          conversations={conversations}
          navCollapsedSize={4}
          defaultSelectedLeadId={leadId}
        />
      </div>
       <div className="md:hidden text-center text-muted-foreground">
        Conversation view is available on larger screens.
      </div>
    </div>
  );
}
