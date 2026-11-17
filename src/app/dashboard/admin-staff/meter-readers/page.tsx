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
import { Search, UserCheck, ClipboardList } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/layout/EmptyState";
import { DataTableSkeleton } from "@/components/layout/DataTableSkeleton";

export default function MeterReadersPage() {
  const [readers, setReaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadReaders() {
      const res = await fetch("/api/admin-staff/meter-readers/with-meters", {
        cache: "no-store",
      });
      const data = await res.json();
      setReaders(Array.isArray(data) ? data : []);
      setLoading(false);
    }

    loadReaders();
  }, []);

  const assignedCount = readers.filter((r: any) => r.meter_number).length;
  const unassignedCount = readers.length - assignedCount;

  const filteredReaders = useMemo(() => {
    return readers.filter(
      (r: any) =>
        r.name?.toLowerCase().includes(search.toLowerCase()) ||
        r.email?.toLowerCase().includes(search.toLowerCase()) ||
        r.meter_number?.toLowerCase().includes(search.toLowerCase())
    );
  }, [readers, search]);

  return (
    <PageShell>
      <PageHeader
        title="Meter readers"
        description={`Total: ${readers.length} · Assigned: ${assignedCount} · Unassigned: ${unassignedCount}`}
        actions={
          <Button asChild>
            <Link href="/dashboard/admin-staff/meter-readers/assign">
              <UserCheck className="size-4" />
              Assign reader
            </Link>
          </Button>
        }
      />

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by name, email or meter…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card className="py-0">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6">
              <DataTableSkeleton rows={6} cols={4} />
            </div>
          ) : filteredReaders.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="No meter readers found"
                description={
                  search
                    ? "Try a different search term."
                    : "Meter readers will appear here once accounts exist."
                }
                icon={<ClipboardList className="size-5" />}
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Assigned meter</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReaders.map((r: any) => (
                  <TableRow key={r.reader_id}>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell>{r.email}</TableCell>
                    <TableCell className="tabular-nums">
                      {r.meter_number || "—"}
                    </TableCell>
                    <TableCell>
                      {r.meter_number ? (
                        <Badge variant="success">Assigned</Badge>
                      ) : (
                        <Badge variant="warning">Not assigned</Badge>
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
