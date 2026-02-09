import { AnalyticsCharts } from "@/components/analytics/analytics-charts";

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Visualize your lead generation and conversion performance..
        </p>
      </div>
      <AnalyticsCharts />
    </div>
  );
}
