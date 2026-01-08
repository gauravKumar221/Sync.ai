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
import { Calendar as CalendarIcon, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

type Event = {
  id: string;
  title: string;
  client: string;
  time: string;
  date: Date;
};

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [clientName, setClientName] = useState('');
  const [duration, setDuration] = useState('30');
  const { toast } = useToast();

  const mockEvents: Event[] = [
    {
      id: 'evt1',
      title: 'Follow-up with Mike',
      client: 'Mike Johnson',
      time: '11:00 AM',
      date: new Date(),
    },
  ];

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !clientName) {
      toast({
        title: 'Missing Information',
        description: 'Please select a client and a date.',
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: 'Appointment Scheduled!',
      description: `Meeting with ${clientName} on ${format(
        date,
        'PPP'
      )} for ${duration} minutes.`,
    });
    // Reset form
    setClientName('');
    setDuration('30');
  };

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
          <InteractiveCalendar />
        </div>
        <div className="space-y-6">
          <Card className="glass-card">
            <div className="p-6">
              <h3 className="mb-4 text-lg font-semibold">
                Follow-up with Mike
              </h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>11:00 AM</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Mike Johnson</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="glass-card">
            <div className="p-6">
              <h3 className="mb-4 text-lg font-semibold">Quick Schedule</h3>
              <form onSubmit={handleSchedule} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="client-name">Client Name</Label>
                  <Input
                    id="client-name"
                    placeholder="Name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="bg-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date-time">Date & Time</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full justify-start text-left font-normal bg-transparent hover:bg-white/5',
                          !date && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? (
                          format(date, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 glass-card border-none">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        className="bg-transparent"
                      />
                    </PopoverContent>
                  </Popover>
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
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
