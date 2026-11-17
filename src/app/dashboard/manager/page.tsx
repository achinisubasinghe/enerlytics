"use client";

import { Users, Gauge, Banknote, AlertCircle } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";

const stats = [
  {
    label: "Total customers",
    value: "1,240",
    icon: <Users className="size-5" />,
  },
  {
    label: "Active meters",
    value: "1,105",
    icon: <Gauge className="size-5" />,
  },
  {
    label: "Total revenue",
    value: "Rs. 12.4M",
    icon: <Banknote className="size-5" />,
  },
  {
    label: "Outstanding amount",
    value: "Rs. 1.8M",
    icon: <AlertCircle className="size-5" />,
    valueClassName: "text-destructive",
  },
];

export default function ManagerDashboard() {
  return (
    <PageShell>
      <PageHeader
        title="Manager dashboard"
        description="Overview of customers, meters, and revenue."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard
            key={s.label}
            title={s.label}
            value={s.value}
            icon={s.icon}
            valueClassName={s.valueClassName}
          />
        ))}
      </div>
    </PageShell>
  );
}
