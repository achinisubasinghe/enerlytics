"use client";

import Link from "next/link";
import { useApi } from "@/hooks/use-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/layout/EmptyState";
import { DataTableSkeleton } from "@/components/layout/DataTableSkeleton";
import { useRouter } from "next/navigation";
import { MessageSquareWarning } from "lucide-react";

function complaintStatusVariant(status: string) {
  switch (status) {
    case "PENDING":
      return "warning" as const;
    case "IN_PROGRESS":
      return "default" as const;
    case "RESOLVED":
      return "success" as const;
    case "CLOSED":
      return "secondary" as const;
    default:
      return "secondary" as const;
  }
}

export default function CustomerComplaintsPage() {
  const router = useRouter();
  const { data: complaints, loading } = useApi("/api/customer/complaints");

  const complaintsList = complaints || [];

  return (
    <PageShell>
      <PageHeader
        title="My complaints"
        description="Track issues you have submitted"
        actions={
          <Button asChild>
            <Link href="/dashboard/customer/complaints/new">New complaint</Link>
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Complaint history</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <DataTableSkeleton rows={4} cols={2} />
          ) : complaintsList.length === 0 ? (
            <EmptyState
              title="No complaints found"
              description="You have not submitted any complaints yet."
              icon={<MessageSquareWarning className="size-5" />}
              action={
                <Button asChild>
                  <Link href="/dashboard/customer/complaints/new">
                    New complaint
                  </Link>
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              {complaintsList.map((complaint: any) => (
                <button
                  key={complaint.id}
                  type="button"
                  className="flex w-full items-start justify-between rounded-lg border border-border p-4 text-left transition-colors hover:bg-muted/40"
                  onClick={() =>
                    router.push(
                      `/dashboard/customer/complaints/${complaint.id}`
                    )
                  }
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{complaint.subject}</h3>
                      <Badge
                        variant={complaintStatusVariant(complaint.status)}
                      >
                        {complaint.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {complaint.complaint_text}
                    </p>
                    <p className="text-xs text-muted-foreground tabular-nums">
                      Submitted:{" "}
                      {new Date(complaint.created_at).toLocaleString()}
                    </p>
                    {complaint.response ? (
                      <p className="text-xs font-medium text-success">
                        Response received
                      </p>
                    ) : null}
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </PageShell>
  );
}
