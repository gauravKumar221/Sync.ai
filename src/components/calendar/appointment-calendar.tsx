'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { add, format } from 'date-fns';

import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Appointment, Agent } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Clock } from 'lucide-react';

const appointmentFormSchema = z.object({
  clientName: z.string().min(2, 'Name is too short'),
  purpose: z.string().min(5, 'Please describe the purpose'),
  assignedAgent: z.string().min(1, 'Please select an agent'),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)'),
});

export function AppointmentCalendar({ initialAppointments, agents }: { initialAppointments: Appointment[], agents: Agent[] }) {
  const { toast } = useToast();
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [appointments, setAppointments] = React.useState(initialAppointments);

  const form = useForm<z.infer<typeof appointmentFormSchema>>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: { clientName: '', purpose: '', assignedAgent: '', time: '10:00' },
  });

  function onSubmit(values: z.infer<typeof appointmentFormSchema>) {
    if (!date) {
      toast({ title: 'Error', description: 'Please select a date.', variant: 'destructive' });
      return;
    }
    const [hours, minutes] = values.time.split(':').map(Number);
    const newAppointmentDate = new Date(date);
    newAppointmentDate.setHours(hours, minutes);

    const newAppointment: Appointment = {
      id: `appt-${Date.now()}`,
      clientName: values.clientName,
      date: newAppointmentDate,
      purpose: values.purpose,
      assignedAgent: agents.find(a => a.id === values.assignedAgent)!,
      leadId: 'lead-new'
    };
    
    setAppointments([...appointments, newAppointment]);
    toast({ title: 'Appointment Scheduled!', description: `Appointment with ${values.clientName} has been created.` });
    form.reset();
  }

  const upcomingAppointments = appointments
    .filter(a => a.date >= new Date())
    .sort((a,b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-2 grid gap-8">
        <Card>
            <CardHeader>
                <CardTitle>Schedule an Appointment</CardTitle>
                <CardDescription>Select a date and fill in the details to create a new appointment.</CardDescription>
            </CardHeader>
          <CardContent className="grid gap-8 lg:grid-cols-2">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border p-4"
              disabled={(date) => date < new Date(new Date().toDateString())}
            />
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="clientName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name</FormLabel>
                    <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                 <FormField control={form.control} name="time" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl><Input type="time" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="assignedAgent" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign to Agent</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select an agent" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {agents.map(agent => <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="purpose" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purpose</FormLabel>
                    <FormControl><Textarea placeholder="Purpose of the appointment" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" disabled={!date}>Schedule Appointment</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map(appt => (
                    <div key={appt.id} className="flex gap-4 rounded-md border p-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={appt.assignedAgent.avatarUrl} />
                            <AvatarFallback>{appt.assignedAgent.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">{appt.clientName}</p>
                            <p className="text-sm text-muted-foreground">{appt.purpose}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                <Clock className="h-3 w-3" />
                                {format(appt.date, "PPP p")}
                            </p>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No upcoming appointments.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
