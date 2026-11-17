"use client";

import { AlertTriangle, Users } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { EmptyState } from "@/components/layout/EmptyState";
import {
  DataTableSkeleton,
  StatGridSkeleton,
} from "@/components/layout/DataTableSkeleton";
import { useApi } from "@/hooks/use-api";

export default function DefaultersReport() {
  const { data, loading } = useApi("/api/manager/defaulters");

  if (loading) {
    return (
      <PageShell>
        <PageHeader title="Defaulters report" />
        <StatGridSkeleton count={2} />
        <DataTableSkeleton rows={5} cols={5} />
      </PageShell>
    );
  }

  const defaulters = data?.defaulters ?? [];

  return (
    <PageShell>
      <PageHeader
        title="Defaulters report"
        description="Customers with unpaid balances."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <StatCard
          title="Total defaulters"
          value={data?.stats?.totalDefaulters || 0}
          icon={<Users className="size-5" />}
        />
        <StatCard
          title="Total outstanding"
          value={`Rs. ${data?.stats?.totalOutstanding?.toFixed(2) || "0.00"}`}
          icon={<AlertTriangle className="size-5" />}
          valueClassName="text-destructive"
        />
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Defaulters list</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {defaulters.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="No defaulters found"
                description="Customers with unpaid bills will appear here."
                icon={<Users className="size-5" />}
                className="border-0 bg-transparent py-8"
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Unpaid bills</TableHead>
                    <TableHead>Outstanding amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {defaulters.map((d, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{d.name}</TableCell>
                      <TableCell>{d.email}</TableCell>
                      <TableCell className="tabular-nums">
                        {d.phone || "N/A"}
                      </TableCell>
                      <TableCell className="tabular-nums">
                        {d.unpaid_bills_count}
                      </TableCell>
                      <TableCell className="font-semibold tabular-nums text-destructive">
                        Rs. {parseFloat(d.total_outstanding).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </PageShell>
  );
}
