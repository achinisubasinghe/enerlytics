"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, UserPlus, Users } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/layout/EmptyState";
import { DataTableSkeleton } from "@/components/layout/DataTableSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function roleBadgeVariant(
  role: string
): "default" | "secondary" | "outline" | "success" | "warning" {
  switch (role) {
    case "ADMIN":
      return "default";
    case "ADMIN_STAFF":
      return "secondary";
    case "METER_READER":
      return "outline";
    case "CASHIER":
      return "success";
    case "CUSTOMER":
      return "warning";
    default:
      return "secondary";
  }
}

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await fetch("/api/admin/users", { cache: "no-store" });
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch {
        setUsers([]);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  async function deleteUser(id: string | number) {
    if (!confirm("Delete user?")) return;

    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });

    if (!res.ok) {
      setError("Delete failed");
      return;
    }

    setError(null);
    setUsers((prev) => prev.filter((u: any) => u.id !== id));
  }

  const filteredUsers = useMemo(() => {
    return users.filter((u: any) => {
      const matchesSearch =
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase());

      const matchesRole = roleFilter === "ALL" || u.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  return (
    <PageShell>
      <PageHeader
        title="User management"
        description={`Total users: ${users.length}`}
        actions={
          <Button asChild>
            <Link href="/dashboard/admin/users/add">
              <UserPlus className="size-4" />
              Add new user
            </Link>
          </Button>
        }
      />

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative w-full md:w-1/3">
              <Search
                className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All roles</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="ADMIN_STAFF">Admin staff</SelectItem>
                <SelectItem value="METER_READER">Meter reader</SelectItem>
                <SelectItem value="CASHIER">Cashier</SelectItem>
                <SelectItem value="CUSTOMER">Customer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <DataTableSkeleton rows={6} cols={6} />
          ) : filteredUsers.length === 0 ? (
            <EmptyState
              icon={<Users className="size-5" />}
              title="No users found"
              description={
                search || roleFilter !== "ALL"
                  ? "Try adjusting your search or role filter."
                  : "Add a user to get started."
              }
              action={
                !search && roleFilter === "ALL" ? (
                  <Button asChild>
                    <Link href="/dashboard/admin/users/add">
                      <UserPlus className="size-4" />
                      Add new user
                    </Link>
                  </Button>
                ) : null
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>NIC</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="tabular-nums">
                        {user.phone || "—"}
                      </TableCell>
                      <TableCell className="tabular-nums">
                        {user.nic || "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={roleBadgeVariant(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link
                              href={`/dashboard/admin/users/${user.id}/edit`}
                            >
                              Edit
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteUser(user.id)}
                          >
                            Delete
                          </Button>
                        </div>
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
