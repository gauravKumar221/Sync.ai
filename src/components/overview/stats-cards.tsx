import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, DollarSign, Target } from 'lucide-react';

const kpiData = [
  { title: 'Total Leads', value: '1,254', change: '+12.5%', icon: Users, color: 'text-primary' },
  { title: 'Revenue', value: '$45,231.89', change: '+20.1%', icon: DollarSign, color: 'text-green-500' },
  { title: 'Conversion Rate', value: '25.4%', change: '+5.2%', icon: Target, color: 'text-accent' },
  { title: 'In Progress', value: '89', change: '-2.1%', icon: TrendingUp, color: 'text-yellow-500' },
];

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpiData.map((kpi) => (
        <Card key={kpi.title} className="hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
            <kpi.icon className={`h-4 w-4 text-muted-foreground ${kpi.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.value}</div>
            <p className={`text-xs ${kpi.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
              {kpi.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
