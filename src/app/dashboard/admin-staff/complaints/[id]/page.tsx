"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "@/hooks/use-api";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/layout/PageHeader";

export default function ComplaintDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: complaint, loading } = useApi(
    `/api/admin-staff/complaints/${params.id}`
  );

  const [status, setStatus] = useState("");
  const [response, setResponse] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (complaint) {
      setStatus(complaint.status || "PENDING");
      setResponse(complaint.response || "");
      setNotes(complaint.notes || "");
    }
  }, [complaint]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const res = await fetch(`/api/admin-staff/complaints/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, response, notes }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to update complaint");
        setSubmitting(false);
        return;
      }

      setSuccess("Complaint updated successfully");
      setTimeout(() => {
        router.push("/dashboard/admin-staff/complaints");
      }, 1500);
    } catch {
      setError("An error occurred while updating complaint");
      setSubmitting(false);
    }
  }

  const getStatusVariant = (s: string) => {
    switch (s) {
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

  if (loading) {
    return (
      <PageShell>
        <PageHeader title="Complaint details" description="Loading…" />
        <div className="max-w-3xl space-y-4">
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </PageShell>
    );
  }

  if (!complaint) {
    return (
      <PageShell>
        <PageHeader title="Complaint details" />
        <Alert variant="destructive">
          <AlertDescription>Complaint not found</AlertDescription>
        </Alert>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeader
        title="Complaint details"
        description={`Complaint #${params.id}`}
        actions={
          <Badge variant={getStatusVariant(complaint.status || "PENDING")}>
            {(complaint.status || "PENDING").replace("_", " ")}
          </Badge>
        }
      />

      <div className="mx-auto w-full max-w-3xl space-y-6">
        <Card>
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-base">Customer information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 pt-4 text-sm sm:grid-cols-2">
            <div>
              <p className="text-muted-foreground">Name</p>
              <p className="font-medium">{complaint.customer_name || "N/A"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium">{complaint.customer_email || "N/A"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Phone</p>
              <p className="font-medium tabular-nums">
                {complaint.customer_phone || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Address</p>
              <p className="font-medium">{complaint.customer_address || "N/A"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-base">Complaint details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <div>
              <p className="text-sm text-muted-foreground">Subject</p>
              <p className="font-medium">
                {complaint.subject || "No subject provided"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="whitespace-pre-wrap text-foreground">
                {complaint.complaint_text ||
                  complaint.description ||
                  "No description provided"}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <div>
                <p className="text-muted-foreground">Created</p>
                <p className="font-medium tabular-nums">
                  {complaint.created_at
                    ? new Date(complaint.created_at).toLocaleString()
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Last updated</p>
                <p className="font-medium tabular-nums">
                  {complaint.updated_at
                    ? new Date(complaint.updated_at).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-base">Update complaint</CardTitle>
          </CardHeader>
          <form onSubmit={handleUpdate}>
            <CardContent className="space-y-4 pt-4">
              {error ? (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}
              {success ? (
                <Alert variant="success">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="IN_PROGRESS">In progress</SelectItem>
                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="response">Response to customer</Label>
                <textarea
                  id="response"
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  rows={4}
                  placeholder="Enter response to customer…"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Internal notes</Label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  rows={3}
                  placeholder="Add internal notes…"
                />
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={submitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="flex-1">
                {submitting ? "Updating…" : "Update complaint"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </PageShell>
  );
}
