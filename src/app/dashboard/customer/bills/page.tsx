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
import { Receipt } from "lucide-react";

function billStatusVariant(status: string) {
  switch (status) {
    case "NOT PAID":
      return "destructive" as const;
    case "PARTIALLY PAID":
      return "warning" as const;
    case "PAID":
      return "success" as const;
    default:
      return "secondary" as const;
  }
}

export default function CustomerBillsPage() {
  const { data: bills, loading } = useApi("/api/customer/bills");

  const billsList = bills || [];

  const totalOutstanding = billsList
    .filter((bill: any) => bill.status !== "PAID")
    .reduce(
      (sum: any, bill: any) => sum + parseFloat(bill.bill_amount || 0),
      0
    );

  const paidBills = billsList.filter((bill: any) => bill.status === "PAID");
  const unpaidBills = billsList.filter((bill: any) => bill.status !== "PAID");

  return (
    <PageShell>
      <PageHeader
        title="My bills"
        description="Billing history and outstanding amounts"
      />

      {loading ? (
        <StatGridSkeleton count={3} />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard
            title="Total outstanding"
            value={`Rs. ${totalOutstanding.toFixed(2)}`}
            hint={`${unpaidBills.length} unpaid bills`}
            icon={<Receipt className="size-5" />}
            valueClassName="text-destructive"
          />
          <StatCard
            title="Total bills"
            value={billsList.length}
            hint="All time"
            icon={<Receipt className="size-5" />}
          />
          <StatCard
            title="Paid bills"
            value={paidBills.length}
            hint="Settled bills"
            icon={<Receipt className="size-5" />}
            valueClassName="text-success"
          />
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Bill history</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <DataTableSkeleton rows={4} cols={3} />
          ) : billsList.length === 0 ? (
            <EmptyState
              title="No bills found"
              description="You have no bills yet."
              icon={<Receipt className="size-5" />}
            />
          ) : (
            <div className="space-y-3">
              {billsList.map((bill: any) => (
                <div
                  key={bill.id}
                  className="flex flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold tabular-nums">
                        Bill #{bill.id}
                      </h3>
                      <Badge variant={billStatusVariant(bill.status)}>
                        {bill.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                      <div>
                        <p className="text-muted-foreground">Billing date</p>
                        <p className="font-medium tabular-nums">
                          {new Date(bill.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">
                          Previous reading
                        </p>
                        <p className="font-medium tabular-nums">
                          {parseFloat(bill.previous_reading).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Current reading</p>
                        <p className="font-medium tabular-nums">
                          {parseFloat(bill.current_reading).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Units used</p>
                        <p className="font-medium tabular-nums">
                          {parseFloat(bill.units_used).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-left sm:ml-4 sm:text-right">
                    <p className="text-2xl font-semibold tabular-nums">
                      Rs. {parseFloat(bill.bill_amount).toFixed(2)}
                    </p>
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
