"use client";

import { useParams } from "next/navigation";
import { History } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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

export default function PaymentHistory() {
  const params = useParams();
  const { data: payments = [], loading } = useApi(
    `/api/billing/payments?customerId=${params.customerId}`
  );

  return (
    <PageShell>
      <PageHeader
        title="Payment history"
        description="All payments recorded for this customer."
      />

      {loading ? (
        <DataTableSkeleton rows={6} cols={7} />
      ) : payments.length === 0 ? (
        <EmptyState
          title="No payment history"
          description="Payments for this customer will show up here."
          icon={<History className="size-5" />}
        />
      ) : (
        <Card className="py-0">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Bill ID</TableHead>
                    <TableHead>Meter</TableHead>
                    <TableHead>Utility</TableHead>
                    <TableHead>Amount paid</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Reference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="tabular-nums">
                        {p.payment_date
                          ? new Date(p.payment_date).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell className="tabular-nums">#{p.bill_id}</TableCell>
                      <TableCell className="tabular-nums">
                        {p.meter_number || "N/A"}
                      </TableCell>
                      <TableCell>{p.utility_type || "N/A"}</TableCell>
                      <TableCell className="font-semibold tabular-nums text-success">
                        Rs. {parseFloat(p.amount).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{p.payment_method}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {p.reference_number || "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </PageShell>
  );
}
