"use client";

import { useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useApi } from "@/hooks/use-api";
import { useRouter } from "next/navigation";
import { MessageSquareWarning } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/layout/EmptyState";
import { DataTableSkeleton } from "@/components/layout/DataTableSkeleton";

export default function ComplaintsPage() {
  const { data: complaints = [], loading } = useApi("/api/admin-staff/complaints");
  const router = useRouter();
  const [filter, setFilter] = useState("ALL");

  const filteredComplaints = (complaints || []).filter(
    (c: any) => filter === "ALL" || c.status === filter
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "RESOLVED":
      case "CLOSED":
        return "success" as const;
      case "IN_PROGRESS":
        return "warning" as const;
      case "PENDING":
      default:
        return "destructive" as const;
    }
  };

  return (
    <PageShell>
      <PageHeader
        title="Complaints"
        description="Review and update customer service requests."
      />

      <div className="flex flex-wrap gap-2">
        {["ALL", "PENDING", "IN_PROGRESS", "RESOLVED", "CLOSED"].map((status) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(status)}
          >
            {status === "ALL" ? "All" : status.replace("_", " ").toLowerCase()}
          </Button>
        ))}
      </div>

      <Card className="py-0">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6">
              <DataTableSkeleton rows={6} cols={6} />
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="No complaints found"
                description={
                  filter === "ALL"
                    ? "Customer complaints will appear here."
                    : `No complaints with status “${filter.replace("_", " ").toLowerCase()}”.`
                }
                icon={<MessageSquareWarning className="size-5" />}
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComplaints.map((complaint: any) => (
                  <TableRow key={complaint.id}>
                    <TableCell className="tabular-nums">#{complaint.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {complaint.customer_name || "N/A"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {complaint.customer_email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="max-w-xs truncate">
                        {complaint.subject ||
                          complaint.complaint_text ||
                          "No subject"}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusVariant(complaint.status || "PENDING")}
                      >
                        {(complaint.status || "PENDING").replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {complaint.created_at
                        ? new Date(complaint.created_at).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          router.push(
                            `/dashboard/admin-staff/complaints/${complaint.id}`
                          )
                        }
                      >
                        View
                      </Button>
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
