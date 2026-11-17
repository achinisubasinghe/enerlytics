"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

const units: Record<string, string> = {
  ELECTRICITY: "kWh",
  WATER: "m³",
  GAS: "units",
};

export default function AddReadingPage() {
  const { meterId } = useParams();
  const router = useRouter();
  const [meter, setMeter] = useState<any>(null);
  const [previous, setPrevious] = useState(0);
  const [current, setCurrent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/meter-reader/meters/${meterId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setMeter(data.meter);
          setPrevious(data.previousReading);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load meter");
        setLoading(false);
      });
  }, [meterId]);

  async function submit() {
    setError("");
    setSubmitting(true);

    if (Number(current) < previous) {
      setError("Current reading cannot be less than previous");
      setSubmitting(false);
      return;
    }

    const res = await fetch("/api/meter-reader/readings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        meterId,
        currentReading: Number(current),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Submission failed");
      setSubmitting(false);
      return;
    }

    router.push("/dashboard/meter-reader");
  }

  if (loading) {
    return (
      <PageShell className="max-w-lg">
        <PageHeader title="Add meter reading" />
        <Card>
          <CardContent className="space-y-4 pt-6">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </CardContent>
        </Card>
      </PageShell>
    );
  }

  const unitLabel = meter ? units[meter.utility_type] || "units" : "units";

  return (
    <PageShell className="max-w-lg">
      <PageHeader
        title="Add meter reading"
        description={
          meter
            ? `Record the current reading for meter ${meter.meter_number}`
            : "Record the current meter reading"
        }
        actions={
          <Button variant="outline" asChild>
            <Link href="/dashboard/meter-reader">Back</Link>
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Reading details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          {meter ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="meterNumber">Meter number</Label>
                <Input
                  id="meterNumber"
                  value={meter.meter_number}
                  disabled
                  className="tabular-nums"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="utilityType">Utility type</Label>
                <Input id="utilityType" value={meter.utility_type} disabled />
              </div>

              <div className="space-y-2">
                <Label htmlFor="previousReading">
                  Previous reading ({unitLabel})
                </Label>
                <Input
                  id="previousReading"
                  value={previous}
                  disabled
                  className="tabular-nums"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentReading">
                  Current reading ({unitLabel})
                </Label>
                <Input
                  id="currentReading"
                  type="number"
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                  className="tabular-nums"
                />
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  className="flex-1"
                  onClick={submit}
                  disabled={submitting || current === ""}
                >
                  {submitting ? "Submitting..." : "Submit reading"}
                </Button>
                <Button variant="outline" asChild>
                  <Link
                    href={`/dashboard/meter-reader/readings/history/${meterId}`}
                  >
                    View history
                  </Link>
                </Button>
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>
    </PageShell>
  );
}
