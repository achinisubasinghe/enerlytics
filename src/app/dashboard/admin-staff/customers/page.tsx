"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useMemo, useState } from "react";
import { Search, UserPlus, Users } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/layout/EmptyState";
import { DataTableSkeleton } from "@/components/layout/DataTableSkeleton";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  async function deleteCustomer(id: string | number) {
    if (!confirm("Delete customer?")) return;

    setError("");
    const res = await fetch(`/api/admin-staff/customers/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      setError("Delete failed");
      return;
    }

    setCustomers((prev) => prev.filter((c: any) => c.id !== id));
  }

  useEffect(() => {
    async function loadCustomers() {
      try {
        const res = await fetch("/api/admin-staff/customers", {
          cache: "no-store",
        });

        const data = await res.json();
        setCustomers(Array.isArray(data) ? data : []);
      } catch (err: unknown) {
        console.error("Fetch failed:", err);
        setError("Failed to load customers");
      } finally {
        setLoading(false);
      }
    }

    loadCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    return customers.filter(
      (c: any) =>
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase()) ||
        c.nic?.toLowerCase().includes(search.toLowerCase())
    );
  }, [customers, search]);

  return (
    <PageShell>
      <PageHeader
        title="Customers"
        description={`Total customers: ${customers.length}`}
        actions={
          <Button asChild>
            <Link href="/dashboard/admin-staff/customers/add">
              <UserPlus className="size-4" />
              Add customer
            </Link>
          </Button>
        }
      />

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by name, email or NIC…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card className="py-0">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6">
              <DataTableSkeleton rows={6} cols={5} />
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="No customers found"
                description={
                  search
                    ? "Try a different search term."
                    : "Add your first customer to get started."
                }
                icon={<Users className="size-5" />}
                action={
                  !search ? (
                    <Button asChild size="sm">
                      <Link href="/dashboard/admin-staff/customers/add">
                        <UserPlus className="size-4" />
                        Add customer
                      </Link>
                    </Button>
                  ) : null
                }
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>NIC</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((c: any) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>{c.email}</TableCell>
                    <TableCell className="tabular-nums">{c.phone || "—"}</TableCell>
                    <TableCell className="tabular-nums">{c.nic || "—"}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/dashboard/admin-staff/customers/${c.id}/edit`}>
                            Edit
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteCustomer(c.id)}
                        >
                          Delete
                        </Button>
                      </div>
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
