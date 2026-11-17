"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

export default function BillingDashboard() {
  const { data: bills = [], loading } = useApi("/api/billing/bills");

  return (
    <PageShell>
      <PageHeader
        title="Bills"
        description="View and manage customer utility bills."
      />

      {loading ? (
        <DataTableSkeleton rows={6} cols={8} />
      ) : bills.length === 0 ? (
        <EmptyState
          title="No bills found"
          description="Bills will appear here once they are generated."
          icon={<FileText className="size-5" />}
        />
      ) : (
        <Card className="py-0">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bill ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Meter</TableHead>
                    <TableHead>Utility</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bills.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="tabular-nums">#{b.id}</TableCell>
                      <TableCell>{b.customer_name || "N/A"}</TableCell>
                      <TableCell className="tabular-nums">
                        {b.meter_number || "N/A"}
                      </TableCell>
                      <TableCell>{b.utility_type || "N/A"}</TableCell>
                      <TableCell className="tabular-nums">
                        {b.billing_date
                          ? new Date(b.billing_date).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell className="tabular-nums font-medium">
                        Rs. {parseFloat(b.bill_amount || 0).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            b.status === "PAID"
                              ? "success"
                              : b.status === "PARTIALLY PAID"
                                ? "warning"
                                : "destructive"
                          }
                        >
                          {b.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Link href={`/dashboard/billing/bills/${b.id}`}>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </Link>
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
