import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot } from "lucide-react";

export default function AutomationPage() {
  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-2xl font-bold tracking-tight">Automation</h1>
        <p className="text-muted-foreground">
          Set up rules to automate your workflow.
        </p>
      </div>
      <Card className="flex flex-col items-center justify-center p-12 text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Bot className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="max-w-md text-muted-foreground">
            Our automation engine is under construction. Soon you'll be able to create powerful workflows for auto-replies, lead assignment, and status triggers.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
