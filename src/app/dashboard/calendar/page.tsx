'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon } from "lucide-react";

export default function CalendarPage() {
  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-2xl font-bold tracking-tight">Calendar & Appointments</h1>
        <p className="text-muted-foreground">
          Manage your schedule and client appointments.
        </p>
      </div>
      <Card className="flex flex-col items-center justify-center p-12 text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <CalendarIcon className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="max-w-md text-muted-foreground">
            Our interactive calendar is being polished. Soon you'll be able to manage your appointments, set reminders, and sync with your favorite calendar apps.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
