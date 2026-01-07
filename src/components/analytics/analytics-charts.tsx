"use client"

import { Bar, BarChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { leads } from "@/lib/data"

export function AnalyticsCharts() {
  const leadsBySource = leads.reduce((acc, lead) => {
    acc[lead.source] = (acc[lead.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const leadsBySourceData = Object.keys(leadsBySource).map(source => ({
    name: source,
    total: leadsBySource[source]
  }));

  const leadsByStatus = leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const leadsByStatusData = Object.keys(leadsByStatus).map((status, index) => ({
    status,
    leads: leadsByStatus[status],
    fill: `hsl(var(--chart-${index + 1}))`
  }));
  
  const chartConfig = {
    leads: {
      label: "Leads",
    },
    New: {
      label: "New",
      color: "hsl(var(--chart-1))",
    },
    "In Progress": {
      label: "In Progress",
      color: "hsl(var(--chart-2))",
    },
    Converted: {
      label: "Converted",
      color: "hsl(var(--chart-3))",
    },
    Lost: {
      label: "Lost",
      color: "hsl(var(--chart-4))",
    },
  };


  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Leads by Source</CardTitle>
          <CardDescription>Distribution of leads from different sources</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadsBySourceData}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                 <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lead Status Distribution</CardTitle>
           <CardDescription>Current status of all leads</CardDescription>
        </CardHeader>
        <CardContent>
           <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square h-[300px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={leadsByStatusData}
                dataKey="leads"
                nameKey="status"
                innerRadius={60}
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
