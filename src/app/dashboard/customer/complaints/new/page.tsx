"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/layout/PageHeader";

export default function NewComplaintPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    subject: "",
    complaint_text: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/customer/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit complaint");
      }

      router.push("/dashboard/customer/complaints");
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell className="max-w-3xl">
      <PageHeader
        title="Submit new complaint"
        description="Describe the issue so our team can follow up"
        actions={
          <Button variant="outline" asChild>
            <Link href="/dashboard/customer/complaints">Back</Link>
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Complaint details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                placeholder="Brief description of the issue"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="complaint_text">Complaint details</Label>
              <textarea
                id="complaint_text"
                value={formData.complaint_text}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    complaint_text: e.target.value,
                  })
                }
                placeholder="Please provide detailed information about your complaint..."
                className="border-input bg-transparent placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full min-h-[150px] rounded-md border px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                required
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit complaint"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/customer/complaints">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </PageShell>
  );
}
