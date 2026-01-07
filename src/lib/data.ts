import { Agent, Lead, Conversation, Appointment, Transaction, LeadStatus, LeadSource } from './types';

export const agents: Agent[] = [
  { id: 'agent-1', name: 'Alex Johnson', avatarUrl: 'https://picsum.photos/seed/1/40/40' },
  { id: 'agent-2', name: 'Maria Garcia', avatarUrl: 'https://picsum.photos/seed/2/40/40' },
  { id: 'agent-3', name: 'James Brown', avatarUrl: 'https://picsum.photos/seed/3/40/40' },
];

export const leads: Lead[] = [
  {
    id: 'lead-1',
    name: 'John Doe',
    phone: '+1-555-123-4567',
    source: 'WhatsApp',
    status: 'New',
    assignedAgent: agents[0],
    lastMessage: 'Hi, I\'m interested in your services.',
    timestamp: '10:30 AM',
    avatarUrl: 'https://picsum.photos/seed/101/40/40',
  },
  {
    id: 'lead-2',
    name: 'Jane Smith',
    phone: '+1-555-987-6543',
    source: 'Website',
    status: 'In Progress',
    assignedAgent: agents[1],
    lastMessage: 'Can you provide more details about the pricing?',
    timestamp: 'Yesterday',
    avatarUrl: 'https://picsum.photos/seed/102/40/40',
  },
  {
    id: 'lead-3',
    name: 'Peter Jones',
    phone: '+1-555-555-5555',
    source: 'Facebook',
    status: 'Converted',
    assignedAgent: agents[0],
    lastMessage: 'Great, let\'s move forward with the plan.',
    timestamp: '2 days ago',
    avatarUrl: 'https://picsum.photos/seed/103/40/40',
  },
  {
    id: 'lead-4',
    name: 'Sarah Miller',
    phone: '+1-555-111-2222',
    source: 'WhatsApp',
    status: 'Lost',
    assignedAgent: agents[2],
    lastMessage: 'Sorry, I\'m no longer interested.',
    timestamp: '3 days ago',
    avatarUrl: 'https://picsum.photos/seed/104/40/40',
  },
  {
    id: 'lead-5',
    name: 'David Wilson',
    phone: '+1-555-333-4444',
    source: 'Manual',
    status: 'In Progress',
    assignedAgent: agents[1],
    lastMessage: 'Following up on our call last week.',
    timestamp: '4 days ago',
    avatarUrl: 'https://picsum.photos/seed/105/40/40',
  },
];

export const conversations: Conversation[] = [
  {
    lead: leads[0],
    messages: [
      { id: 'msg-1', sender: 'lead', content: 'Hi, I\'m interested in your services.', timestamp: '10:30 AM' },
      { id: 'msg-2', sender: 'system', content: 'Hi John Doe, thanks for contacting us. Our team will respond shortly.', timestamp: '10:31 AM' },
      { id: 'msg-3', sender: 'agent', agent: agents[0], content: 'Hello John! Alex here. I see you\'re interested in our services. How can I help you today?', timestamp: '10:35 AM' },
    ],
  },
  {
    lead: leads[1],
    messages: [
      { id: 'msg-4', sender: 'lead', content: 'Can you provide more details about the pricing?', timestamp: 'Yesterday' },
      { id: 'msg-5', sender: 'system', content: 'Hi Jane Smith, thanks for contacting us. Our team will respond shortly.', timestamp: 'Yesterday' },
    ],
  },
];

export const appointments: Appointment[] = [
  {
    id: 'appt-1',
    clientName: 'Peter Jones',
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    purpose: 'Onboarding Call',
    assignedAgent: agents[0],
    leadId: 'lead-3',
  },
  {
    id: 'appt-2',
    clientName: 'David Wilson',
    date: new Date(new Date().setDate(new Date().getDate() + 3)),
    purpose: 'Follow-up Discussion',
    assignedAgent: agents[1],
    leadId: 'lead-5',
  },
];

export const transactions: Transaction[] = [
    { id: 'txn-1', date: '2024-07-15', type: 'Income', amount: 1500, description: 'Project Alpha - Phase 1' },
    { id: 'txn-2', date: '2024-07-14', type: 'Expense', amount: 200, description: 'Software Subscription' },
    { id: 'txn-3', date: '2024-07-12', type: 'Income', amount: 750, description: 'Consulting Services' },
    { id: 'txn-4', date: '2024-07-10', type: 'Expense', amount: 50, description: 'Office Supplies' },
];
