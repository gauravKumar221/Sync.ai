import { ChatLayout } from "@/components/conversations/chat-layout";
import { conversations, leads } from "@/lib/data";

export default function ConversationsPage() {
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
        />
      </div>
       <div className="md:hidden text-center text-muted-foreground">
        Conversation view is available on larger screens.
      </div>
    </div>
  );
}
