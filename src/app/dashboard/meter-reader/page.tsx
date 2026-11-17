"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { DataTableSkeleton } from "@/components/layout/DataTableSkeleton";
import { useApi } from "@/hooks/use-api";
import { useRouter } from "next/navigation";
import { Gauge } from "lucide-react";

export default function MeterReaderDashboard() {
  const { data: meters = [], loading } = useApi("/api/meter-reader/meters");
  const router = useRouter();
  const metersList = meters || [];

  function handleAddReading(meter: any) {
    router.push(`/dashboard/meter-reader/readings/${meter.id}`);
  }

  return (
    <PageShell>
      <PageHeader
        title="Assigned meters"
        description="Meters assigned to you for this billing period"
      />

      <Card>
        <CardHeader>
          <CardTitle>Meter list</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <DataTableSkeleton rows={6} cols={6} />
          ) : metersList.length === 0 ? (
            <EmptyState
              title="No meters assigned"
              description="You have no meters assigned for this period."
              icon={<Gauge className="size-5" />}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Meter no</TableHead>
                  <TableHead>Utility</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reading</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metersList.map((m: any) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium tabular-nums">
                      {m.meter_number}
                    </TableCell>
                    <TableCell>{m.utility_type}</TableCell>
                    <TableCell>{m.customer}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {m.address}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          m.periodStatus === "PENDING"
                            ? "destructive"
                            : "success"
                        }
                      >
                        {m.periodStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleAddReading(m)}
                          variant={
                            m.periodStatus === "COMPLETED"
                              ? "secondary"
                              : "default"
                          }
                        >
                          Add reading
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            router.push(
                              `/dashboard/meter-reader/readings/history/${m.id}`
                            )
                          }
                        >
                          History
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </PageShell>
  );
}
