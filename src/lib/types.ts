
export type NavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
};

export type LeadStatus = 'New' | 'In Progress' | 'Converted' | 'Lost';
export type LeadSource = 'WhatsApp' | 'Website' | 'Facebook' | 'Manual' | 'All';
export type LeadPriority = 'Low' | 'Medium' | 'High';

export type Agent = {
  id: string;
  name: string;
  avatarUrl: string;
};

export type Lead = {
  id: string;
  name: string;
  phone: string;
  source: LeadSource;
  status: LeadStatus;
  priority: LeadPriority;
  assignedAgent: Agent;
  lastMessage: string;
  timestamp: string;
  avatarUrl: string;
  createdAt: Date;
};

export type Message = {
  id: string;
  sender: 'lead' | 'agent' | 'system';
  content: string;
  timestamp: string;
  agent?: Agent;
};

export type Conversation = {
  lead: Lead;
  messages: Message[];
};

export type Transaction = {
  id: string;
  date: string;
  type: 'Income' | 'Expense';
  amount: number;
  description: string;
};

export type Appointment = {
  id: string;
  clientName: string;
  date: Date;
  purpose: string;
  assignedAgent: Agent;
  leadId: string;
};
