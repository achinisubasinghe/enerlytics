"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/layout/PageHeader";

export default function AssignMeterReaderPage() {
  const [readers, setReaders] = useState<any[]>([]);
  const [meters, setMeters] = useState<any[]>([]);
  const [selectedReader, setSelectedReader] = useState("");
  const [selectedMeter, setSelectedMeter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch("/api/admin-staff/meter-readers")
      .then((res) => res.json())
      .then(setReaders);

    fetch("/api/admin-staff/meters/unassigned")
      .then((res) => res.json())
      .then(setMeters);
  }, []);

  async function handleAssign() {
    setError("");
    setSuccess("");

    if (!selectedReader || !selectedMeter) {
      setError("Please select both meter and reader");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/admin-staff/meter-readers/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        meterId: selectedMeter,
        meterReaderId: selectedReader,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Assignment failed");
      setLoading(false);
      return;
    }

    setSuccess("Meter assigned successfully");
    setMeters((prev) => prev.filter((m: any) => String(m.id) !== selectedMeter));
    setSelectedMeter("");
    setSelectedReader("");
    setLoading(false);
  }

  return (
    <PageShell>
      <PageHeader
        title="Assign meter reader"
        description="Assign a field reader to an unassigned meter."
      />

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Assignment</CardTitle>
          <CardDescription>Select a reader and a free meter.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
            <Label>Reader</Label>
            <Select value={selectedReader} onValueChange={setSelectedReader}>
              <SelectTrigger>
                <SelectValue placeholder="Select reader" />
              </SelectTrigger>
              <SelectContent>
                {readers.map((r: any) => (
                  <SelectItem key={r.id} value={String(r.id)}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Meter</Label>
            <Select value={selectedMeter} onValueChange={setSelectedMeter}>
              <SelectTrigger>
                <SelectValue placeholder="Select meter" />
              </SelectTrigger>
              <SelectContent>
                {meters.map((m: any) => (
                  <SelectItem key={m.id} value={String(m.id)}>
                    {m.meter_number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleAssign} disabled={loading}>
            {loading ? "Assigning…" : "Assign"}
          </Button>
        </CardFooter>
      </Card>
    </PageShell>
  );
}
