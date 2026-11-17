"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
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

export default function AssignMeterPage() {
  const [meters, setMeters] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedMeter, setSelectedMeter] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadData() {
      const metersRes = await fetch("/api/admin-staff/meters/assign/unassigned");
      const customersRes = await fetch("/api/admin-staff/customers");

      const metersData = await metersRes.json();
      const customersData = await customersRes.json();

      setMeters(Array.isArray(metersData) ? metersData : []);
      setCustomers(Array.isArray(customersData) ? customersData : []);
    }

    loadData();
  }, []);

  async function handleAssign() {
    setError("");
    setSuccess("");

    if (!selectedMeter || !selectedCustomer) {
      setError("Please select meter and customer");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/admin-staff/meters/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        meterId: selectedMeter,
        customerId: selectedCustomer,
      }),
    });

    if (!res.ok) {
      setError("Assignment failed");
      setLoading(false);
      return;
    }

    setSuccess("Meter assigned successfully");
    setSelectedMeter("");
    setSelectedCustomer("");
    setMeters((prev) => prev.filter((m) => String(m.id) !== selectedMeter));
    setLoading(false);
  }

  return (
    <PageShell>
      <PageHeader
        title="Assign meter"
        description="Link an unassigned meter to a customer account."
      />

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Assignment</CardTitle>
          <CardDescription>Only unassigned meters are listed.</CardDescription>
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
            <Label>Meter</Label>
            <Select value={selectedMeter} onValueChange={setSelectedMeter}>
              <SelectTrigger>
                <SelectValue placeholder="Select meter" />
              </SelectTrigger>
              <SelectContent>
                {meters.map((m) => (
                  <SelectItem key={m.id} value={String(m.id)}>
                    {m.meter_number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Customer</Label>
            <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
              <SelectTrigger>
                <SelectValue placeholder="Select customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
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
