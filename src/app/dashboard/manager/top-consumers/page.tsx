"use client";

import { Users } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/layout/EmptyState";

const consumers = [
  { customer: "ABC Industries", utility: "Electricity", usage: "12,000 kWh" },
  { customer: "XYZ Hotel", utility: "Water", usage: "800 m³" },
];

export default function TopConsumers() {
  return (
    <PageShell>
      <PageHeader
        title="Top consumers"
        description="Highest usage customers across utilities."
      />

      {consumers.length === 0 ? (
        <EmptyState
          title="No consumers"
          description="Top consumers will appear when usage data is available."
          icon={<Users className="size-5" />}
        />
      ) : (
        <Card className="py-0">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Utility</TableHead>
                    <TableHead>Usage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {consumers.map((c, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{c.customer}</TableCell>
                      <TableCell>{c.utility}</TableCell>
                      <TableCell className="tabular-nums">{c.usage}</TableCell>
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
