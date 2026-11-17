"use client";

import { Users, CreditCard, Clock, UserCog, UserPlus } from "lucide-react";
import { useApi } from "@/hooks/use-api";
import Link from "next/link";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { EmptyState } from "@/components/layout/EmptyState";
import {
  DataTableSkeleton,
  StatGridSkeleton,
} from "@/components/layout/DataTableSkeleton";
import {
  CHART_COLORS,
  CHART_PRIMARY,
  CHART_GRID,
  CHART_AXIS,
} from "@/lib/chart-colors";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {
  const { data: users, loading } = useApi("/api/admin/users");
  const { data: meterReaderData } = useApi("/api/admin/meter-readers");

  const userList = users || [];

  const stats = {
    totalUsers: userList.length,
    totalPayments: 842000,
    pendingPayments: 47,
    meterReaders: meterReaderData?.count || 0,
  };

  const paymentsTrend = [
    { month: "Aug", amount: 120000 },
    { month: "Sep", amount: 155000 },
    { month: "Oct", amount: 138000 },
    { month: "Nov", amount: 190000 },
    { month: "Dec", amount: 239000 },
  ];

  const roleDistribution = [
    {
      name: "Customers",
      value:
        userList.filter((u: any) => u.role === "CUSTOMER").length || 45,
    },
    {
      name: "Meter Readers",
      value:
        userList.filter((u: any) => u.role === "METER_READER").length || 12,
    },
    {
      name: "Cashiers",
      value: userList.filter((u: any) => u.role === "CASHIER").length || 6,
    },
    {
      name: "Admins",
      value: userList.filter((u: any) => u.role === "ADMIN").length || 3,
    },
  ];

  return (
    <PageShell>
      <PageHeader
        title="Admin dashboard"
        description="Overview of users, payments, and system activity."
        actions={
          <Button asChild>
            <Link href="/dashboard/admin/users/add">
              <UserPlus className="size-4" />
              Add new user
            </Link>
          </Button>
        }
      />

      {loading ? (
        <StatGridSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Users className="size-5" />}
            title="Total users"
            value={stats.totalUsers}
          />
          <StatCard
            icon={<CreditCard className="size-5" />}
            title="Total payments"
            value={`LKR ${stats.totalPayments.toLocaleString()}`}
          />
          <StatCard
            icon={<Clock className="size-5" />}
            title="Pending payments"
            value={stats.pendingPayments}
          />
          <StatCard
            icon={<UserCog className="size-5" />}
            title="Meter readers"
            value={stats.meterReaders}
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Payments overview (last 5 months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={paymentsTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
                <XAxis dataKey="month" stroke={CHART_AXIS} />
                <YAxis stroke={CHART_AXIS} className="tabular-nums" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke={CHART_PRIMARY}
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Users by role</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={roleDistribution}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {roleDistribution.map((_, index) => (
                    <Cell
                      key={index}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent users</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/admin/users">View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <DataTableSkeleton rows={5} cols={4} />
          ) : userList.length === 0 ? (
            <EmptyState
              icon={<Users className="size-5" />}
              title="No users found"
              description="Add users to start managing the system."
              action={
                <Button asChild>
                  <Link href="/dashboard/admin/users/add">
                    <UserPlus className="size-4" />
                    Add new user
                  </Link>
                </Button>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Phone</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userList.slice(0, 5).map((user: any) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{user.role}</Badge>
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {user.phone || "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </PageShell>
  );
}
