"use client";

import { Banknote, AlertCircle, Percent, BarChart3 } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { EmptyState } from "@/components/layout/EmptyState";
import {
  DataTableSkeleton,
  StatGridSkeleton,
} from "@/components/layout/DataTableSkeleton";
import { useApi } from "@/hooks/use-api";
import { CHART_PRIMARY, CHART_GRID, CHART_AXIS } from "@/lib/chart-colors";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function RevenueReports() {
  const { data, loading } = useApi("/api/manager/revenue");

  if (loading) {
    return (
      <PageShell>
        <PageHeader title="Revenue reports" />
        <StatGridSkeleton count={3} />
        <DataTableSkeleton rows={4} cols={3} />
      </PageShell>
    );
  }

  const collectionRate =
    data?.totalRevenue && data?.outstandingRevenue
      ? (
          (data.totalRevenue /
            (data.totalRevenue + data.outstandingRevenue)) *
          100
        ).toFixed(1)
      : "0.0";

  const byUtility = data?.revenueByUtility ?? [];
  const monthly = data?.monthlyRevenue
    ? [...data.monthlyRevenue].reverse()
    : [];

  return (
    <PageShell>
      <PageHeader
        title="Revenue reports"
        description="Collections, outstanding balances, and trends."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          title="Total revenue"
          value={`Rs. ${data?.totalRevenue?.toFixed(2) || "0.00"}`}
          icon={<Banknote className="size-5" />}
        />
        <StatCard
          title="Outstanding revenue"
          value={`Rs. ${data?.outstandingRevenue?.toFixed(2) || "0.00"}`}
          icon={<AlertCircle className="size-5" />}
          valueClassName="text-destructive"
        />
        <StatCard
          title="Collection rate"
          value={`${collectionRate}%`}
          icon={<Percent className="size-5" />}
          valueClassName="text-success"
        />
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Revenue by utility type</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {byUtility.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="No revenue data"
                description="Utility revenue will appear once bills are generated."
                icon={<Banknote className="size-5" />}
                className="border-0 bg-transparent py-8"
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utility type</TableHead>
                    <TableHead>Total revenue</TableHead>
                    <TableHead>Bill count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {byUtility.map((r, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">
                        {r.utility_type}
                      </TableCell>
                      <TableCell className="tabular-nums">
                        Rs. {parseFloat(r.revenue).toFixed(2)}
                      </TableCell>
                      <TableCell className="tabular-nums">
                        {r.bill_count}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Monthly revenue trend</CardTitle>
        </CardHeader>
        <CardContent>
          {monthly.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthly}>
                <CartesianGrid stroke={CHART_GRID} strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke={CHART_AXIS} />
                <YAxis stroke={CHART_AXIS} />
                <Tooltip />
                <Bar dataKey="revenue" fill={CHART_PRIMARY} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState
              title="No data available"
              description="Monthly trends will appear when revenue is recorded."
              icon={<BarChart3 className="size-5" />}
              className="border-0 bg-transparent py-8"
            />
          )}
        </CardContent>
      </Card>
    </PageShell>
  );
}
