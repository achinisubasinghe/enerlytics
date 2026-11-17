"use client";

import { Banknote, CreditCard, Smartphone, Wallet } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BillingSummary() {
  return (
    <PageShell>
      <PageHeader
        title="Today's collection"
        description="Cash, card, and online totals for today."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total collected"
          value="Rs. 12,500"
          icon={<Wallet className="size-5" />}
        />
        <StatCard
          title="Cash"
          value="Rs. 6,000"
          icon={<Banknote className="size-5" />}
        />
        <StatCard
          title="Card"
          value="Rs. 4,500"
          icon={<CreditCard className="size-5" />}
        />
        <StatCard
          title="Online"
          value="Rs. 2,000"
          icon={<Smartphone className="size-5" />}
        />
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Collection breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cash</span>
              <span className="font-medium tabular-nums">Rs. 6,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Card</span>
              <span className="font-medium tabular-nums">Rs. 4,500</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Online</span>
              <span className="font-medium tabular-nums">Rs. 2,000</span>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
              <span>Total collected</span>
              <span className="tabular-nums">Rs. 12,500</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}
