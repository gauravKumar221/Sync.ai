import { LeadTable } from '@/components/leads/lead-table';
import { leads } from '@/lib/data';

export default function LeadsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
        <p className="text-muted-foreground">
          View and manage all your leads in one place.
        </p>
      </div>
      <LeadTable leads={leads} />
    </div>
  );
}
