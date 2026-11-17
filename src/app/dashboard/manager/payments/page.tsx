"use client";

import { CreditCard } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/layout/EmptyState";
import { DataTableSkeleton } from "@/components/layout/DataTableSkeleton";
import { useApi } from "@/hooks/use-api";
import { CHART_COLORS } from "@/lib/chart-colors";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function PaymentAnalysis() {
  const { data, loading } = useApi("/api/manager/payments");

  if (loading) {
    return (
      <PageShell>
        <PageHeader title="Payment analysis" />
        <DataTableSkeleton rows={4} cols={2} />
        <DataTableSkeleton rows={5} cols={6} />
      </PageShell>
    );
  }

  const methods = data?.paymentsByMethod ?? [];
  const recent = data?.recentPayments ?? [];

  return (
    <PageShell>
      <PageHeader
        title="Payment analysis"
        description="Payment methods and recent transactions."
      />

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Payments by method</CardTitle>
        </CardHeader>
        <CardContent>
          {methods.length === 0 ? (
            <EmptyState
              title="No payment methods"
              description="Payment method breakdown will appear when payments are recorded."
              icon={<CreditCard className="size-5" />}
              className="border-0 bg-transparent py-8"
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-3">
                {methods.map((method, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3"
                  >
                    <div>
                      <Badge variant="outline">{method.payment_method}</Badge>
                      <p className="mt-1 text-sm text-muted-foreground tabular-nums">
                        {method.count} transactions
                      </p>
                    </div>
                    <p className="text-lg font-semibold tabular-nums">
                      Rs. {parseFloat(method.total_amount).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={methods}
                    dataKey="total_amount"
                    nameKey="payment_method"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {methods.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Recent payments</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {recent.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="No payments found"
                description="Recent payments will appear here."
                icon={<CreditCard className="size-5" />}
                className="border-0 bg-transparent py-8"
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Meter</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Reference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recent.map((payment, i) => (
                    <TableRow key={i}>
                      <TableCell className="tabular-nums">
                        {payment.payment_date
                          ? new Date(payment.payment_date).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell className="font-medium">
                        {payment.customer_name}
                      </TableCell>
                      <TableCell className="tabular-nums">
                        {payment.meter_number}
                      </TableCell>
                      <TableCell className="font-semibold tabular-nums text-success">
                        Rs. {parseFloat(payment.amount).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {payment.payment_method}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {payment.reference_number || "—"}
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
