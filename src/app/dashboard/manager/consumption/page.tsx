"use client";

import { Activity, Users } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/layout/EmptyState";
import {
  DataTableSkeleton,
  StatGridSkeleton,
} from "@/components/layout/DataTableSkeleton";
import { useApi } from "@/hooks/use-api";

export default function ConsumptionReport() {
  const { data, loading } = useApi("/api/manager/consumption");

  if (loading) {
    return (
      <PageShell>
        <PageHeader title="Consumption reports" />
        <StatGridSkeleton count={3} />
        <DataTableSkeleton rows={5} cols={4} />
      </PageShell>
    );
  }

  const utilities = data?.consumptionByUtility ?? [];
  const topConsumers = data?.topConsumers ?? [];

  return (
    <PageShell>
      <PageHeader
        title="Consumption reports"
        description="Usage totals and top consumers by utility."
      />

      {utilities.length === 0 ? (
        <EmptyState
          title="No consumption data"
          description="Readings will appear here once meters are recorded."
          icon={<Activity className="size-5" />}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {utilities.map((u, i) => (
            <Card key={i}>
              <CardHeader className="border-b">
                <CardTitle>{u.utility_type}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Total units</p>
                    <p className="text-2xl font-semibold tabular-nums tracking-tight">
                      {parseFloat(u.total_units).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Average usage</p>
                    <p className="text-lg font-semibold tabular-nums">
                      {parseFloat(u.avg_units).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total readings
                    </p>
                    <p className="text-lg tabular-nums">{u.reading_count}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Top consumers</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {topConsumers.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="No top consumers"
                description="Consumer rankings will appear when usage data is available."
                icon={<Users className="size-5" />}
                className="border-0 bg-transparent py-8"
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Utility type</TableHead>
                    <TableHead>Total consumption</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topConsumers.map((consumer, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">
                        {consumer.name}
                      </TableCell>
                      <TableCell>{consumer.email}</TableCell>
                      <TableCell>{consumer.utility_type}</TableCell>
                      <TableCell className="font-semibold tabular-nums">
                        {parseFloat(consumer.total_consumption).toFixed(2)}
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
