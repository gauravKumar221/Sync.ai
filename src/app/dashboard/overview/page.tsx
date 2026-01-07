import { StatsCards } from '@/components/overview/stats-cards';
import { LeadsChart } from '@/components/overview/leads-chart';
import { RecentLeads } from '@/components/overview/recent-leads';

export default function OverviewPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">Here's a summary of your sales activity.</p>
      </div>
      
      <StatsCards />

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <LeadsChart />
        </div>
        <div className="lg:col-span-2">
          <RecentLeads />
        </div>
      </div>
    </div>
  );
}
