import { AppointmentCalendar } from "@/components/calendar/appointment-calendar";
import { appointments, agents } from "@/lib/data";

export default function CalendarPage() {
  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-2xl font-bold tracking-tight">Calendar & Appointments</h1>
        <p className="text-muted-foreground">
          Manage your schedule and client appointments.
        </p>
      </div>
      <AppointmentCalendar initialAppointments={appointments} agents={agents} />
    </div>
  );
}
