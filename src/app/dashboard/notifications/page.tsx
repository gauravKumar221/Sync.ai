
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";

export default function NotificationsPage() {
  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">
          View all your recent notifications here.
        </p>
      </div>
      <Card className="flex flex-col items-center justify-center p-12 text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Bell className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>No New Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="max-w-md text-muted-foreground">
            You're all caught up! When you have new notifications, they will appear here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
