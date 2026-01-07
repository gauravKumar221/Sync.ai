'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';

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
import { Clock } from 'lucide-react';
import { DayContentProps } from 'react-day-picker';

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
    .slice(0, 5);

  const CustomDayContent = (dayProps: DayContentProps) => {
    const { date } = dayProps;
    const dateAppointments = appointments.filter(a => format(a.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));

    return (
      <div className="flex flex-col h-full w-full p-2">
        <div className="self-start">{date.getDate()}</div>
        {dateAppointments.length > 0 && (
          <div className="mt-auto flex-grow flex flex-col justify-end">
            {dateAppointments.slice(0, 2).map((appt, index) => (
              <div key={index} className="flex items-center gap-1 text-xs">
                <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>
                <span className="truncate">{appt.purpose}</span>
              </div>
            ))}
            {dateAppointments.length > 2 && (
              <div className="text-xs text-muted-foreground mt-1">
                + {dateAppointments.length - 2} more
              </div>
            )}
          </div>
        )}
      </div>
    );
  };


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-2">
        <Card className="p-0">
          <CardContent className="p-2 md:p-4">
            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="w-full"
                components={{
                  DayContent: CustomDayContent
                }}
            />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="clientName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name</FormLabel>
                    <FormControl><Input placeholder="Name" {...field} /></FormControl>
                  </FormItem>
                )} />
                 <FormField control={form.control} name="dateTime" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date & Time</FormLabel>
                    <FormControl><Input type="datetime-local" {...field} /></FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="duration" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                     <FormControl><Input type="number" placeholder="30" {...field} /></FormControl>
                  </FormItem>
                )} />
                <Button type="submit" className="w-full">Schedule</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map(appt => (
                    <div key={appt.id} className="flex gap-4">
                        <div className="flex-shrink-0 text-center">
                            <p className="text-lg font-bold">{format(appt.date, "dd")}</p>
                            <p className="text-xs text-muted-foreground">{format(appt.date, "MMM")}</p>
                        </div>
                        <div className="border-l-2 border-primary pl-4">
                            <p className="font-semibold">{appt.purpose}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                {format(appt.date, "p")}
                            </p>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No upcoming appointments.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
