"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useLeads } from "@/app/context/LeadContext";
import { Skeleton } from "../ui/skeleton";

export function RecentLeads() {
  const { leads, loading } = useLeads();

  // 🛡 Hard safety: always array
  const recentLeads = Array.isArray(leads) ? leads.slice(0, 5) : [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Leads</CardTitle>
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/leads">
            View All
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {loading ? (
          <>
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
          </>
        ) : recentLeads.length === 0 ? (
          <p className="text-sm text-muted-foreground">No leads found.</p>
        ) : (
          recentLeads.map((lead) => (
            <div key={lead.id} className="flex items-center gap-4">
              <Avatar className="h-9 w-9">
                <AvatarFallback>
                  {lead.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <p className="text-sm font-medium leading-none">{lead.name}</p>
                <p className="text-sm text-muted-foreground">{lead.phone}</p>
              </div>

              <div className="text-sm text-muted-foreground">
                {new Date(lead.created_at).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
