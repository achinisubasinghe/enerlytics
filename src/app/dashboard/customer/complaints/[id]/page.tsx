"use client";

import { use } from "react";
import Link from "next/link";
import { useApi } from "@/hooks/use-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";

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

export default function ComplaintDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params) as { id: string };
  const { data: complaint, loading } = useApi(
    `/api/customer/complaints/${resolvedParams.id}`
  );

  if (loading) {
    return (
      <PageShell className="max-w-4xl">
        <PageHeader title="Complaint details" />
        <Card>
          <CardContent className="space-y-4 pt-6">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </PageShell>
    );
  }

  if (!complaint) {
    return (
      <PageShell className="max-w-4xl">
        <PageHeader
          title="Complaint details"
          actions={
            <Button variant="outline" asChild>
              <Link href="/dashboard/customer/complaints">Back to list</Link>
            </Button>
          }
        />
        <Alert variant="destructive">
          <AlertDescription>Complaint not found.</AlertDescription>
        </Alert>
      </PageShell>
    );
  }

  return (
    <PageShell className="max-w-4xl">
      <PageHeader
        title="Complaint details"
        description={`Complaint #${complaint.id}`}
        actions={
          <Button variant="outline" asChild>
            <Link href="/dashboard/customer/complaints">Back to list</Link>
          </Button>
        }
      />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle>Complaint #{complaint.id}</CardTitle>
              <Badge variant={complaintStatusVariant(complaint.status)}>
                {complaint.status.replace("_", " ")}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="mb-2 text-lg font-semibold">{complaint.subject}</h3>
              <p className="text-sm text-muted-foreground tabular-nums">
                Submitted on:{" "}
                {new Date(complaint.created_at).toLocaleString()}
              </p>
              {complaint.updated_at &&
              complaint.updated_at !== complaint.created_at ? (
                <p className="text-sm text-muted-foreground tabular-nums">
                  Last updated:{" "}
                  {new Date(complaint.updated_at).toLocaleString()}
                </p>
              ) : null}
            </div>

            <div>
              <h4 className="mb-2 font-semibold">Complaint description</h4>
              <p className="whitespace-pre-wrap text-foreground">
                {complaint.complaint_text}
              </p>
            </div>
          </CardContent>
        </Card>

        {complaint.response ? (
          <Card className="border-success/30 bg-success/5">
            <CardHeader>
              <CardTitle className="text-success">Official response</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-foreground">
                {complaint.response}
              </p>
            </CardContent>
          </Card>
        ) : null}

        {complaint.notes ? (
          <Card>
            <CardHeader>
              <CardTitle>Internal notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-foreground">
                {complaint.notes}
              </p>
            </CardContent>
          </Card>
        ) : null}

        {!complaint.response && complaint.status === "PENDING" ? (
          <Alert>
            <AlertDescription>
              Your complaint has been received and is pending review. Our team
              will respond to you shortly.
            </AlertDescription>
          </Alert>
        ) : null}

        {complaint.status === "IN_PROGRESS" ? (
          <Alert>
            <AlertDescription>
              Your complaint is currently being processed by our team.
            </AlertDescription>
          </Alert>
        ) : null}

        {complaint.status === "RESOLVED" ? (
          <Alert variant="success">
            <AlertDescription>
              This complaint has been resolved. If you need further assistance,
              please submit a new complaint.
            </AlertDescription>
          </Alert>
        ) : null}
      </div>
    </PageShell>
  );
}
