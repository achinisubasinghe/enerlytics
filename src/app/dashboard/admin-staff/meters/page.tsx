"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Search, Cpu, Zap } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/layout/EmptyState";
import { DataTableSkeleton } from "@/components/layout/DataTableSkeleton";

function statusVariant(status: string) {
  const s = (status || "").toLowerCase();
  if (s === "active") return "success" as const;
  if (s === "inactive") return "secondary" as const;
  return "destructive" as const;
}

export default function MetersPage() {
  const [meters, setMeters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadMeters() {
      try {
        const res = await fetch("/api/admin-staff/meters", {
          cache: "no-store",
        });
        const data = await res.json();
        setMeters(Array.isArray(data) ? data : []);
      } catch (err: unknown) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadMeters();
  }, []);

  const assignedCount = meters.filter((m: any) => m.customer_name).length;
  const unassignedCount = meters.length - assignedCount;

  const filteredMeters = useMemo(() => {
    return meters.filter(
      (m: any) =>
        m.meter_number?.toLowerCase().includes(search.toLowerCase()) ||
        m.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
        m.utility_type?.toLowerCase().includes(search.toLowerCase())
    );
  }, [meters, search]);

  return (
    <PageShell>
      <PageHeader
        title="Meters"
        description={`Total: ${meters.length} · Assigned: ${assignedCount} · Unassigned: ${unassignedCount}`}
        actions={
          <>
            <Button asChild>
              <Link href="/dashboard/admin-staff/meters/add">
                <Cpu className="size-4" />
                Add meter
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/admin-staff/meters/assign">Assign meter</Link>
            </Button>
          </>
        }
      />

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by meter no, customer or utility…"
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
          ) : filteredMeters.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="No meters found"
                description={
                  search
                    ? "Try a different search term."
                    : "Add a meter to start assigning utilities."
                }
                icon={<Zap className="size-5" />}
                action={
                  !search ? (
                    <Button asChild size="sm">
                      <Link href="/dashboard/admin-staff/meters/add">
                        <Cpu className="size-4" />
                        Add meter
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
                  <TableHead>Meter no</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Utility</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Customer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMeters.map((m: any) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium tabular-nums">
                      {m.meter_number}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(m.status)}>{m.status}</Badge>
                    </TableCell>
                    <TableCell>{m.utility_type}</TableCell>
                    <TableCell className="tabular-nums">{m.unit}</TableCell>
                    <TableCell>
                      {m.customer_name ? (
                        <span>{m.customer_name}</span>
                      ) : (
                        <span className="font-medium text-destructive">Unassigned</span>
                      )}
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
