import { AppointmentCalendar } from "@/components/calendar/appointment-calendar";
import { appointments, agents } from "@/lib/data";

export default function CalendarPage() {
  return (
    <div className="space-y-4 h-full">
       <div className="hidden md:block">
        <h1 className="text-2xl font-bold tracking-tight">Calendar & Appointments</h1>
        <p className="text-muted-foreground">
          Manage your schedule and client appointments.
        </p>
      </div>
      <div className="h-[calc(100vh-12rem)]">
        <AppointmentCalendar initialAppointments={appointments} agents={agents} />
      </div>
    </div>
  );
}
