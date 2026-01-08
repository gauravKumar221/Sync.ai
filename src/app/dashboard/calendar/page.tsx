
'use client';
import { useState } from 'react';
import { InteractiveCalendar } from '@/components/calendar/interactive-calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar as CalendarIcon, Clock, User } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { leads as allLeads, agents } from '@/lib/data';
import type { Lead, Agent } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { add, subDays } from 'date-fns';

type Event = {
  id: string;
  title: string;
  lead: Lead;
  agent: Agent;
  time: string;
  date: Date;
  description: string;
};

const initialEvents: Event[] = [
  {
    id: 'evt1',
    title: 'Follow-up with Mike',
    lead: allLeads.find((l) => l.name === 'David Wilson')!,
    agent: agents[1],
    time: '11:30 AM',
    date: new Date(),
    description: 'Pricing and contract negotiation.',
  },
  {
    id: 'evt2',
    title: 'Demo Call with Sarah',
    lead: allLeads.find((l) => l.name === 'Sarah Miller')!,
    agent: agents[0],
    time: '2:00 PM',
    date: new Date(),
    description: 'Initial product demonstration.',
  },
  {
    id: 'evt3',
    title: 'Project Kick-off',
    lead: allLeads.find((l) => l.name === 'Peter Jones')!,
    agent: agents[2],
    time: '10:00 AM',
    date: add(new Date(), { days: 2 }),
    description: 'Kick-off meeting for Project Alpha.',
  },
    {
    id: 'evt4',
    title: 'Strategy Session',
    lead: allLeads.find((l) => l.name === 'John Doe')!,
    agent: agents[0],
    time: '3:00 PM',
    date: subDays(new Date(), { days: 1 }),
    description: 'Finalize Q3 marketing strategy.',
  },
];

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [selectedLeadId, setSelectedLeadId] = useState<string | undefined>();
  const [time, setTime] = useState('12:00');
  const [duration, setDuration] = useState('30');
  const [eventTitle, setEventTitle] = useState('');
  const [calendarKey, setCalendarKey] = useState(Date.now());
  const [formDate, setFormDate] = useState<Date>(new Date());
  const { toast } = useToast();

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setFormDate(date);
  };
  
  const handleGoToToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setFormDate(today);
    setCalendarKey(Date.now()); 
  };

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const lead = allLeads.find((l) => l.id === selectedLeadId);
    if (!formDate || !selectedLeadId || !lead || !eventTitle) {
      toast({
        title: 'Missing Information',
        description: 'Please fill out all fields to schedule an event.',
        variant: 'destructive',
      });
      return;
    }

    const newEvent: Event = {
      id: `evt-${Date.now()}`,
      title: eventTitle,
      lead,
      agent: agents[Math.floor(Math.random() * agents.length)], // Assign randomly for demo
      time: format(
        new Date(`1970-01-01T${time}`),
        'hh:mm a'
      ),
      date: formDate,
      description: `Scheduled for ${duration} minutes.`,
    };

    setEvents([...events, newEvent]);

    toast({
      title: 'Appointment Scheduled!',
      description: `Meeting with ${lead.name} on ${format(
        formDate,
        'PPP'
      )} at ${newEvent.time}.`,
    });

    // Reset form
    setSelectedLeadId(undefined);
    setEventTitle('');
    setTime('12:00');
    setDuration('30');
  };

  const eventsForSelectedDay = events.filter((event) =>
    isSameDay(event.date, selectedDate)
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">
          Schedule and manage your appointments.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <InteractiveCalendar
            key={calendarKey}
            onDateSelect={handleDateSelect}
            onGoToToday={handleGoToToday}
            events={events}
            selectedDate={selectedDate}
          />
        </div>
        <div className="space-y-6">
          <Card className="glass-card">
            <CardContent className="p-6">
              <h3 className="mb-4 text-lg font-semibold">
                Schedule for {format(selectedDate, 'MMMM do, yyyy')}
              </h3>
              {eventsForSelectedDay.length > 0 ? (
                <div className="space-y-4">
                  {eventsForSelectedDay.map((event) => (
                    <div
                      key={event.id}
                      className="glass-card -m-2 rounded-lg p-4"
                    >
                      <div className="flex items-start gap-4">
                        <Avatar className="h-10 w-10 border-2 border-white/20">
                          <AvatarImage src={event.lead.avatarUrl} />
                          <AvatarFallback>
                            {event.lead.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold">{event.lead.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>
                              {event.time} with {event.agent.name}
                            </span>
                          </div>
                          <p className="mt-1 text-sm">{event.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">
                  No appointments for this day.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <h3 className="mb-4 text-lg font-semibold">Quick Schedule</h3>
              <form onSubmit={handleSchedule} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="event-title">Event Title</Label>
                  <Input
                    id="event-title"
                    placeholder="e.g. Follow-up call"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    className="bg-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-name">Client Name</Label>
                  <Select
                    value={selectedLeadId}
                    onValueChange={setSelectedLeadId}
                  >
                    <SelectTrigger
                      id="client-name"
                      className="bg-transparent hover:bg-white/5"
                    >
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-none">
                      {allLeads.map((lead) => (
                        <SelectItem
                          key={lead.id}
                          value={lead.id}
                          className="cursor-pointer"
                        >
                          {lead.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date-time">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full justify-start text-left font-normal bg-transparent hover:bg-white/5',
                            !formDate && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formDate ? (
                            format(formDate, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 glass-card border-none">
                        <Calendar
                          mode="single"
                          selected={formDate}
                          onSelect={(day) => day && setFormDate(day)}
                          initialFocus
                          className="bg-transparent"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="bg-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (min)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="bg-transparent"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold"
                >
                  Schedule
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
