'use client';

import { TrendingUp } from 'lucide-react';
import { Line, LineChart as RechartsLineChart, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartData = [
  { day: 'Monday', leads: 50 },
  { day: 'Tuesday', leads: 75 },
  { day: 'Wednesday', leads: 150 },
  { day: 'Thursday', leads: 125 },
  { day: 'Friday', leads: 175 },
  { day: 'Saturday', leads: 200 },
  { day: 'Sunday', leads: 225 },
];

const chartConfig = {
  leads: {
    label: 'New Leads',
    color: 'hsl(var(--primary))',
  },
};

export function LeadsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lead Generation</CardTitle>
        <CardDescription>New leads over the last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <RechartsLineChart
            data={chartData}
            margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
             <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="leads"
              type="monotone"
              stroke="url(#lineGradient)"
              strokeWidth={2}
              dot={true}
            />
             <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
            </defs>
          </RechartsLineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing total leads for the last 7 days
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
