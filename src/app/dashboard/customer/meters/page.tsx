"use client";

import { useApi } from "@/hooks/use-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { EmptyState } from "@/components/layout/EmptyState";
import {
  DataTableSkeleton,
  StatGridSkeleton,
} from "@/components/layout/DataTableSkeleton";
import { Gauge, Droplets, Flame, Zap } from "lucide-react";

function meterStatusVariant(status: string) {
  switch (status) {
    case "ACTIVE":
      return "success" as const;
    case "MAINTENANCE":
      return "warning" as const;
    case "INACTIVE":
    default:
      return "secondary" as const;
  }
}

function UtilityIcon({ type }: { type: string }) {
  switch (type) {
    case "ELECTRICITY":
      return <Zap className="size-5" />;
    case "WATER":
      return <Droplets className="size-5" />;
    case "GAS":
      return <Flame className="size-5" />;
    default:
      return <Gauge className="size-5" />;
  }
}

export default function CustomerMetersPage() {
  const { data: meters, loading } = useApi("/api/customer/meters");

  const metersList = meters || [];
  const activeMeters = metersList.filter(
    (meter: any) => meter.status === "ACTIVE"
  );
  const inactiveMeters = metersList.filter(
    (meter: any) => meter.status === "INACTIVE"
  );

  return (
    <PageShell>
      <PageHeader
        title="My meters"
        description="Meters registered to your account"
      />

      {loading ? (
        <StatGridSkeleton count={3} />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard
            title="Total meters"
            value={metersList.length}
            hint="Registered meters"
            icon={<Gauge className="size-5" />}
          />
          <StatCard
            title="Active meters"
            value={activeMeters.length}
            hint="Currently active"
            icon={<Zap className="size-5" />}
            valueClassName="text-success"
          />
          <StatCard
            title="Inactive meters"
            value={inactiveMeters.length}
            hint="Not in use"
            icon={<Gauge className="size-5" />}
          />
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Meter details</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <DataTableSkeleton rows={3} cols={3} />
          ) : metersList.length === 0 ? (
            <EmptyState
              title="No meters found"
              description="Contact admin staff to get meters assigned to your account."
              icon={<Gauge className="size-5" />}
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {metersList.map((meter: any) => (
                <div
                  key={meter.id}
                  className="rounded-lg border border-border p-5"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <UtilityIcon type={meter.utility_type} />
                    </div>
                    <Badge variant={meterStatusVariant(meter.status)}>
                      {meter.status}
                    </Badge>
                  </div>

                  <h3 className="mb-1 text-lg font-semibold tabular-nums">
                    {meter.meter_number}
                  </h3>

                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Utility type</p>
                      <p className="font-medium">{meter.utility_type}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Unit</p>
                      <p className="font-medium">{meter.unit}</p>
                    </div>
                    {meter.created_at ? (
                      <div>
                        <p className="text-muted-foreground">Registered</p>
                        <p className="font-medium tabular-nums">
                          {new Date(meter.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </PageShell>
  );
}
