"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/layout/EmptyState";
import { DataTableSkeleton } from "@/components/layout/DataTableSkeleton";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { History } from "lucide-react";

export default function ReadingHistoryPage() {
  const { meterId } = useParams();
  const [history, setHistory] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/meter-reader/readings/history/${meterId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setHistory(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load history");
        setLoading(false);
      });
  }, [meterId]);

  return (
    <PageShell>
      <PageHeader
        title="Reading history"
        description="Past readings recorded for this meter"
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link href="/dashboard/meter-reader">Back</Link>
            </Button>
            <Button asChild>
              <Link href={`/dashboard/meter-reader/readings/${meterId}`}>
                Add reading
              </Link>
            </Button>
          </div>
        }
      />

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Readings</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <DataTableSkeleton rows={5} cols={4} />
          ) : !error && history.length === 0 ? (
            <EmptyState
              title="No readings yet"
              description="No historical readings found for this meter."
              icon={<History className="size-5" />}
              action={
                <Button asChild>
                  <Link href={`/dashboard/meter-reader/readings/${meterId}`}>
                    Add reading
                  </Link>
                </Button>
              }
            />
          ) : !error ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Previous</TableHead>
                  <TableHead>Current</TableHead>
                  <TableHead>Units used</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell className="tabular-nums">
                      {r.reading_date}
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {r.previous_reading}
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {r.current_reading}
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {r.units_used}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : null}
        </CardContent>
      </Card>
    </PageShell>
  );
}
