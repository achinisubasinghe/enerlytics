"use client";

import Link from "next/link";
import { useApi } from "@/hooks/use-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { EmptyState } from "@/components/layout/EmptyState";
import { StatGridSkeleton } from "@/components/layout/DataTableSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { Receipt, Gauge, MessageSquareWarning } from "lucide-react";

export default function CustomerDashboard() {
  const { data: bills, loading: billsLoading } = useApi("/api/customer/bills");
  const { data: meters, loading: metersLoading } = useApi(
    "/api/customer/meters"
  );
  const { data: complaints, loading: complaintsLoading } = useApi(
    "/api/customer/complaints"
  );

  const billsList = bills || [];
  const metersList = meters || [];
  const complaintsList = complaints || [];

  const unpaidBills = billsList.filter((bill: any) => bill.status === "UNPAID");
  const totalOutstanding = unpaidBills.reduce(
    (sum: any, bill: any) => sum + parseFloat(bill.amount || 0),
    0
  );

  const statsLoading = billsLoading || metersLoading || complaintsLoading;

  return (
    <PageShell>
      <PageHeader
        title="Customer dashboard"
        description="Overview of your bills, meters, and complaints"
      />

      {statsLoading ? (
        <StatGridSkeleton count={3} />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard
            title="Outstanding bills"
            value={`Rs. ${totalOutstanding.toFixed(2)}`}
            hint={`${unpaidBills.length} unpaid bills`}
            icon={<Receipt className="size-5" />}
            valueClassName="text-destructive"
          />
          <StatCard
            title="Active meters"
            value={metersList.length}
            hint="Registered meters"
            icon={<Gauge className="size-5" />}
          />
          <StatCard
            title="Complaints"
            value={complaintsList.length}
            hint="Total complaints"
            icon={<MessageSquareWarning className="size-5" />}
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" asChild>
          <Link href="/dashboard/customer/bills">View bills</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard/customer/meters">View meters</Link>
        </Button>
        <Button asChild>
          <Link href="/dashboard/customer/complaints">View complaints</Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle>Recent bills</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/customer/bills">View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {billsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          ) : billsList.length === 0 ? (
            <EmptyState
              title="No bills found"
              description="You have no bills yet."
              icon={<Receipt className="size-5" />}
            />
          ) : (
            <div className="space-y-3">
              {billsList.slice(0, 5).map((bill: any) => (
                <div
                  key={bill.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div>
                    <p className="font-semibold tabular-nums">
                      Bill #{bill.id}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {bill.billing_date
                        ? new Date(bill.billing_date).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold tabular-nums">
                      Rs. {parseFloat(bill.amount || 0).toFixed(2)}
                    </p>
                    <Badge
                      variant={
                        bill.status === "PAID" ? "success" : "destructive"
                      }
                      className="mt-1"
                    >
                      {bill.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle>My meters</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/customer/meters">View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {metersLoading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-lg" />
              ))}
            </div>
          ) : metersList.length === 0 ? (
            <EmptyState
              title="No meters found"
              description="No meters are registered to your account."
              icon={<Gauge className="size-5" />}
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {metersList.map((meter: any) => (
                <div
                  key={meter.id}
                  className="rounded-lg border border-border p-4"
                >
                  <p className="font-semibold tabular-nums">
                    Meter #{meter.meter_number}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {meter.utility_type}
                  </p>
                  <Badge
                    variant={
                      meter.status === "ACTIVE" ? "success" : "secondary"
                    }
                    className="mt-2"
                  >
                    {meter.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </PageShell>
  );
}
