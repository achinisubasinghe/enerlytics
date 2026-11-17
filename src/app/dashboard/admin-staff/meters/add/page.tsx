"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiCall } from "@/hooks/use-api";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/layout/PageHeader";

const UNIT_MAP: Record<string, string> = {
  ELECTRICITY: "kWh",
  WATER: "m³",
  GAS: "m³",
};

export default function AddMeterPage() {
  const router = useRouter();
  const [meterNumber, setMeterNumber] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [utilityType, setUtilityType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await apiCall("/api/admin-staff/meters/add", {
        method: "POST",
        body: JSON.stringify({ meterNumber, status, utilityType }),
      });

      setSuccess("Meter added successfully");
      setTimeout(() => {
        router.push("/dashboard/admin-staff/meters");
      }, 800);
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to add meter");
      setLoading(false);
    }
  }

  return (
    <PageShell>
      <PageHeader
        title="Add meter"
        description="Register a new utility meter in the system."
      />

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Meter details</CardTitle>
          <CardDescription>Choose utility type to set the unit automatically.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
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
              <Label htmlFor="meterNumber">Meter number</Label>
              <Input
                id="meterNumber"
                value={meterNumber}
                onChange={(e) => setMeterNumber(e.target.value)}
                placeholder="MTR-001"
                required
                className="tabular-nums"
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="DISCONNECTED">Disconnected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Utility type</Label>
              <Select value={utilityType} onValueChange={setUtilityType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select utility type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ELECTRICITY">Electricity (kWh)</SelectItem>
                  <SelectItem value="WATER">Water (m³)</SelectItem>
                  <SelectItem value="GAS">Gas (m³)</SelectItem>
                </SelectContent>
              </Select>
              {utilityType ? (
                <p className="text-sm text-muted-foreground">
                  Unit: <span className="tabular-nums">{UNIT_MAP[utilityType]}</span>
                </p>
              ) : null}
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Saving…" : "Save meter"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </PageShell>
  );
}
