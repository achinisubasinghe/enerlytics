"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus, Receipt } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/layout/EmptyState";
import { DataTableSkeleton } from "@/components/layout/DataTableSkeleton";

export default function TariffListPage() {
  const [tariffs, setTariffs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTariffs() {
      try {
        const res = await fetch("/api/admin-staff/tariffs", {
          cache: "no-store",
        });
        const data = await res.json();
        setTariffs(Array.isArray(data) ? data : []);
      } catch (err: unknown) {
        console.error("Failed to load tariffs", err);
      } finally {
        setLoading(false);
      }
    }

    loadTariffs();
  }, []);

  async function toggleStatus(id: string | number, currentStatus: string) {
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    await fetch(`/api/admin-staff/tariffs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    setTariffs((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
  }

  return (
    <PageShell>
      <PageHeader
        title="Tariff plans"
        description="Manage utility pricing plans and slab rates."
        actions={
          <Button asChild>
            <Link href="/dashboard/admin-staff/tariffs/add">
              <Plus className="size-4" />
              Add tariff
            </Link>
          </Button>
        }
      />

      <Card className="py-0">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6">
              <DataTableSkeleton rows={5} cols={5} />
            </div>
          ) : tariffs.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="No tariffs yet"
                description="Create a tariff plan to define utility rates."
                icon={<Receipt className="size-5" />}
                action={
                  <Button asChild size="sm">
                    <Link href="/dashboard/admin-staff/tariffs/add">
                      <Plus className="size-4" />
                      Add tariff
                    </Link>
                  </Button>
                }
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tariff name</TableHead>
                  <TableHead>Utility</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tariffs.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.name}</TableCell>
                    <TableCell>{t.utility_type}</TableCell>
                    <TableCell>
                      <Badge
                        variant={t.status === "ACTIVE" ? "success" : "secondary"}
                      >
                        {t.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {new Date(t.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/dashboard/admin-staff/tariffs/${t.id}/edit`}>
                            Edit
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant={t.status === "ACTIVE" ? "destructive" : "default"}
                          onClick={() => toggleStatus(t.id, t.status)}
                        >
                          {t.status === "ACTIVE" ? "Disable" : "Enable"}
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
