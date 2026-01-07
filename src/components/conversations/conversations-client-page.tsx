
'use client'

import { useSearchParams } from "next/navigation";
import { ChatLayout } from "@/components/conversations/chat-layout";
import { conversations, leads } from "@/lib/data";

export function ConversationsClientPage() {
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
