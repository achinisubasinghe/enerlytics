"use client";

import { Users, Zap, ClipboardList, Wrench, Droplets, Flame } from "lucide-react";
import { useApi } from "@/hooks/use-api";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { StatGridSkeleton } from "@/components/layout/DataTableSkeleton";

export default function AdminStaffDashboard() {
  const { data: stats, loading } = useApi("/api/admin-staff/");

  return (
    <PageShell>
      <PageHeader
        title="Admin staff dashboard"
        description="Overview of customers, meters, and field operations."
      />

      {loading ? (
        <div className="space-y-6">
          <StatGridSkeleton count={4} />
          <StatGridSkeleton count={3} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Customers"
              value={stats?.customers || 0}
              icon={<Users className="size-5" />}
            />
            <StatCard
              title="Meters"
              value={stats?.meters || 0}
              icon={<Zap className="size-5" />}
            />
            <StatCard
              title="Meter readers"
              value={stats?.meterReaders || 0}
              icon={<ClipboardList className="size-5" />}
            />
            <StatCard
              title="Fix requests"
              value="—"
              icon={<Wrench className="size-5" />}
            />
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Meters by utility
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard
                title="Electricity meters"
                value={stats?.electricityMeters || 0}
                icon={<Zap className="size-5" />}
              />
              <StatCard
                title="Water meters"
                value={stats?.waterMeters || 0}
                icon={<Droplets className="size-5" />}
              />
              <StatCard
                title="Gas meters"
                value={stats?.gasMeters || 0}
                icon={<Flame className="size-5" />}
              />
            </div>
          </div>
        </>
      )}
    </PageShell>
  );
}
