'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format, getDate } from 'date-fns';

import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { Appointment, Agent } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Clock, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const quickScheduleSchema = z.object({
  clientName: z.string().min(2, 'Name is too short'),
  dateTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date and time',
  }),
  duration: z.string().min(1, 'Please select a duration'),
});

export function AppointmentCalendar({ initialAppointments, agents }: { initialAppointments: Appointment[], agents: Agent[] }) {
  const { toast } = useToast();
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [appointments, setAppointments] = React.useState(initialAppointments);

  const form = useForm<z.infer<typeof quickScheduleSchema>>({
    resolver: zodResolver(quickScheduleSchema),
    defaultValues: { clientName: '', dateTime: '', duration: '30' },
  });

  function onSubmit(values: z.infer<typeof quickScheduleSchema>) {
    const newAppointmentDate = new Date(values.dateTime);

    const newAppointment: Appointment = {
      id: `appt-${Date.now()}`,
      clientName: values.clientName,
      date: newAppointmentDate,
      purpose: `Meeting with ${values.clientName}`,
      assignedAgent: agents[0], // Defaulting to first agent for simplicity
      leadId: 'lead-new',
    };
    
    setAppointments([...appointments, newAppointment]);
    toast({ title: 'Appointment Scheduled!', description: `Appointment with ${values.clientName} has been created.` });
    form.reset();
  }
  
  const upcomingAppointments = appointments
    .filter(a => a.date >= new Date())
    .sort((a,b) => a.date.getTime() - b.date.getTime())
    .slice(0, 3);
    
  const eventsByDate = appointments.reduce((acc, appt) => {
    const dateKey = format(appt.date, 'yyyy-MM-dd');
    if(!acc[dateKey]) {
        acc[dateKey] = 0;
    }
    acc[dateKey]++;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      <Card className="lg:col-span-2 h-full flex flex-col bg-card">
        <CardContent className="p-2 md:p-4 flex-grow">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="h-full w-full"
            classNames={{
                root: "h-full flex flex-col",
                caption: "flex justify-between items-center px-2 pt-2 pb-4",
                caption_label: "text-xl font-bold",
                nav: 'flex items-center gap-1',
                nav_button: cn(
                  'h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100'
                ),
                months: "flex-grow",
                month: "h-full flex flex-col",
                table: "h-full w-full border-collapse",
                head_row: "grid grid-cols-7 mb-2",
                head_cell: "text-muted-foreground uppercase text-xs font-normal",
                body: "flex-grow grid grid-cols-7 grid-rows-5 gap-2",
                row: "contents",
                cell: cn(
                  "relative h-full text-left p-2 rounded-lg bg-muted/30 hover:bg-muted/60 transition-colors focus-within:relative focus-within:z-20"
                ),
                day: "absolute top-2 left-2 text-sm font-medium",
                day_today: "bg-primary text-primary-foreground",
                day_selected: "bg-accent text-accent-foreground border-2 border-primary",
                day_outside: "text-muted-foreground/30",
                day_disabled: "text-muted-foreground/30",
            }}
            components={{
              DayContent: ({ date }) => {
                const dateKey = format(date, 'yyyy-MM-dd');
                const eventCount = eventsByDate[dateKey];
                const day = getDate(date);
                
                return (
                  <>
                    <span className="text-foreground">{day}</span>
                    {eventCount > 0 && (
                      <div className="absolute bottom-2 left-2 flex items-center gap-1">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                         {eventCount > 1 && <span className="text-xs text-muted-foreground">{eventCount} events</span>}
                      </div>
                    )}
                  </>
                );
              },
            }}
          />
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Upcoming</CardTitle>
            <Button size="icon" variant="ghost" className="h-8 w-8 bg-gradient-to-br from-red-500 to-blue-500 text-white">
                <Plus className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
             {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map(appt => (
                    <div key={appt.id} className="flex flex-col gap-1 rounded-lg border p-3 bg-muted/30">
                        <p className="font-semibold">{appt.purpose}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {format(appt.date, "p")}
                        </p>
                        <p className="text-xs text-muted-foreground">{appt.assignedAgent.name}</p>
                    </div>
                ))
            ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No upcoming appointments.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="clientName" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Client Name</FormLabel>
                    <FormControl><Input placeholder="Name" {...field} /></FormControl>
                  </FormItem>
                )} />
                 <FormField control={form.control} name="dateTime" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Date & Time</FormLabel>
                    <FormControl><Input type="datetime-local" {...field} /></FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="duration" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Duration (min)</FormLabel>
                     <FormControl><Input type="number" placeholder="30" {...field} /></FormControl>
                  </FormItem>
                )} />
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">Schedule</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
