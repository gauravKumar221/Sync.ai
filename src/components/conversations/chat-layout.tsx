'use client';

import * as React from 'react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { CornerDownLeft, Mic, Paperclip, Send } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import type { Lead, Conversation } from '@/lib/types';
import { cn } from '@/lib/utils';
import { summarizeLeadConversation } from '@/ai/flows/summarize-lead-conversation';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ChatLayoutProps {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
  leads: Lead[];
  conversations: Conversation[];
  defaultSelectedLeadId?: string | null;
}

export function ChatLayout({
  defaultLayout = [320, 1115],
  defaultCollapsed = false,
  navCollapsedSize,
  leads,
  conversations,
  defaultSelectedLeadId,
}: ChatLayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [selectedLeadId, setSelectedLeadId] = React.useState<string>(defaultSelectedLeadId ?? leads[0].id);
  const { toast } = useToast();

  const selectedConversation = conversations.find(c => c.lead.id === selectedLeadId);

  const handleSummarize = async () => {
    if (!selectedConversation) return;

    toast({
        title: 'Generating Summary...',
        description: 'The AI is summarizing the conversation. Please wait.',
    });
    
    const conversationText = selectedConversation.messages
      .map(m => `${m.sender}: ${m.content}`)
      .join('\n');
    
    try {
      const { summary } = await summarizeLeadConversation({ conversation: conversationText });
      toast({
        title: 'Conversation Summary',
        description: (
            <div className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                <p className="text-sm text-white">
                    {summary}
                </p>
            </div>
        )
      });
    } catch (error) {
      console.error('Error summarizing conversation:', error);
      toast({
        title: 'Error',
        description: 'Could not generate summary.',
        variant: 'destructive'
      });
    }
  };

  return (
    <ResizablePanelGroup
      direction="horizontal"
      onLayout={(sizes: number[]) => {
        document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`;
      }}
      className="h-full max-h-[calc(100vh-10rem)] items-stretch rounded-lg border"
    >
      <ResizablePanel
        defaultSize={defaultLayout[0]}
        collapsedSize={navCollapsedSize}
        collapsible={true}
        minSize={20}
        maxSize={30}
        onCollapse={() => {
          setIsCollapsed(true);
          document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(true)}`;
        }}
        onExpand={() => {
          setIsCollapsed(false);
          document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(false)}`;
        }}
        className={cn(isCollapsed && 'min-w-[50px] transition-all duration-300 ease-in-out')}
      >
        <div className={cn('flex h-[56px] items-center justify-center', isCollapsed ? 'h-[56px]' : 'px-2')}>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <Separator />
        <div className="p-2 space-y-1">
          {leads.map(lead => (
            <button
              key={lead.id}
              onClick={() => setSelectedLeadId(lead.id)}
              className={cn(
                'flex w-full flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent',
                selectedLeadId === lead.id && 'bg-muted'
              )}
            >
              <div className="flex w-full items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={lead.avatarUrl} />
                  <AvatarFallback>{lead.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-semibold">{lead.name}</div>
                  <div className="text-xs text-muted-foreground">{lead.phone}</div>
                </div>
                <div className="text-xs text-muted-foreground">{lead.timestamp}</div>
              </div>
              <div className="line-clamp-2 text-xs text-muted-foreground">
                {lead.lastMessage.substring(0, 300)}
              </div>
            </button>
          ))}
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
        <div className="flex h-full flex-col">
          <div className="flex items-center p-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={selectedConversation?.lead.avatarUrl} />
                <AvatarFallback>{selectedConversation?.lead.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h1 className="text-xl font-bold">{selectedConversation?.lead.name}</h1>
            </div>
            <div className="ml-auto">
              <Button variant="outline" size="sm" onClick={handleSummarize}>
                Summarize with AI
              </Button>
            </div>
          </div>
          <Separator />
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {selectedConversation?.messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-end gap-2',
                    message.sender === 'agent' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.sender !== 'agent' && message.sender !== 'system' && (
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={selectedConversation.lead.avatarUrl} />
                        <AvatarFallback>{selectedConversation.lead.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                   {message.sender === 'system' && (
                    <div className="w-full text-center text-xs text-muted-foreground py-2">{message.content}</div>
                  )}

                  {message.sender !== 'system' && (
                     <div
                        className={cn(
                        'max-w-xs rounded-lg p-3 text-sm md:max-w-md',
                        message.sender === 'agent'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        )}
                    >
                        {message.content}
                    </div>
                  )}
                  {message.sender === 'agent' && message.agent && (
                     <Avatar className="h-8 w-8">
                        <AvatarImage src={message.agent.avatarUrl} />
                        <AvatarFallback>{message.agent.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          </div>
          <Separator />
          <div className="p-4">
            <form>
              <div className="relative">
                <Textarea
                  placeholder="Reply..."
                  className="resize-none pr-16"
                />
                <Button type="submit" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
