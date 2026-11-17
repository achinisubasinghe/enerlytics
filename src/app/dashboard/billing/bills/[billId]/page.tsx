"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FileText, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/layout/EmptyState";
import { DataTableSkeleton } from "@/components/layout/DataTableSkeleton";
import { useApi } from "@/hooks/use-api";

export default function BillDetails() {
  const params = useParams();
  const { data: bill, loading } = useApi(`/api/billing/bills/${params.billId}`);

  if (loading) {
    return (
      <PageShell>
        <PageHeader title="Bill details" />
        <DataTableSkeleton rows={4} cols={2} />
      </PageShell>
    );
  }

  if (!bill) {
    return (
      <PageShell>
        <PageHeader title="Bill details" />
        <EmptyState
          title="Bill not found"
          description="This bill may have been removed or the link is invalid."
          icon={<FileText className="size-5" />}
        />
      </PageShell>
    );
  }

  const outstanding = parseFloat(bill.outstanding || 0);
  const billAmount = parseFloat(bill.bill_amount || 0);
  const totalPaid = billAmount - outstanding;

  return (
    <PageShell className="max-w-3xl">
      <PageHeader
        title={`Bill #${bill.id}`}
        description="Customer, usage, and payment details for this bill."
        actions={
          <Badge
            variant={
              bill.status === "PAID"
                ? "success"
                : bill.status === "PARTIALLY PAID"
                  ? "warning"
                  : "destructive"
            }
          >
            {bill.status}
          </Badge>
        }
      />

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Customer information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            <div>
              <p className="text-muted-foreground">Name</p>
              <p className="font-medium">{bill.customer_name || "N/A"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium">{bill.customer_email || "N/A"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Address</p>
              <p className="font-medium">{bill.customer_address || "N/A"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Phone</p>
              <p className="font-medium tabular-nums">
                {bill.customer_phone || "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Meter and usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            <div>
              <p className="text-muted-foreground">Meter number</p>
              <p className="font-medium tabular-nums">
                {bill.meter_number || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Utility type</p>
              <p className="font-medium">{bill.utility_type || "N/A"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Previous reading</p>
              <p className="font-medium tabular-nums">{bill.previous_reading}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Current reading</p>
              <p className="font-medium tabular-nums">{bill.current_reading}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Units consumed</p>
              <p className="font-medium tabular-nums">{bill.units_used}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Billing date</p>
              <p className="font-medium tabular-nums">
                {bill.billing_date
                  ? new Date(bill.billing_date).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Billing summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bill amount</span>
              <span className="font-semibold tabular-nums">
                Rs. {billAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-success">
              <span>Total paid</span>
              <span className="font-semibold tabular-nums">
                Rs. {totalPaid.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-base font-semibold text-destructive">
              <span>Outstanding</span>
              <span className="tabular-nums">
                Rs. {outstanding.toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {bill.payments && bill.payments.length > 0 && (
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Payment history</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {bill.payments.map((payment, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3"
                >
                  <div>
                    <p className="font-medium tabular-nums">
                      Rs. {parseFloat(payment.amount).toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(payment.payment_date).toLocaleDateString()} —{" "}
                      {payment.payment_method}
                    </p>
                    {payment.reference_number && (
                      <p className="text-xs text-muted-foreground">
                        Ref: {payment.reference_number}
                      </p>
                    )}
                  </div>
                  <Receipt className="size-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {outstanding > 0 && (
        <Link href={`/dashboard/billing/payments/add/${bill.id}`}>
          <Button className="w-full">Record payment</Button>
        </Link>
      )}
    </PageShell>
  );
}
