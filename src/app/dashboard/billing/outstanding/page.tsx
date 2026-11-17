"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";
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

export default function OutstandingBills() {
  const { data: outstanding = [], loading } = useApi("/api/billing/outstanding");

  return (
    <PageShell>
      <PageHeader
        title="Outstanding bills"
        description="Bills with remaining balances that need collection."
      />

      {loading ? (
        <DataTableSkeleton rows={6} cols={7} />
      ) : outstanding.length === 0 ? (
        <EmptyState
          title="No outstanding bills"
          description="All bills are fully paid."
          icon={<AlertCircle className="size-5" />}
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
                    <TableHead>Total amount</TableHead>
                    <TableHead>Outstanding</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {outstanding.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="tabular-nums">#{b.id}</TableCell>
                      <TableCell>{b.customer_name || "N/A"}</TableCell>
                      <TableCell className="tabular-nums">
                        {b.meter_number || "N/A"}
                      </TableCell>
                      <TableCell>{b.utility_type || "N/A"}</TableCell>
                      <TableCell className="tabular-nums">
                        Rs. {parseFloat(b.bill_amount || 0).toFixed(2)}
                      </TableCell>
                      <TableCell className="font-semibold tabular-nums text-destructive">
                        Rs. {parseFloat(b.outstanding || 0).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Link href={`/dashboard/billing/payments/add/${b.id}`}>
                          <Button size="sm">Record payment</Button>
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
