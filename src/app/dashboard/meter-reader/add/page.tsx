"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AddMeterReading() {
  const RATE_PER_UNIT = 12;

  const [prevReading, setPrevReading] = useState(0);
  const [currentReading, setCurrentReading] = useState(0);
  const [units, setUnits] = useState(0);
  const [billAmount, setBillAmount] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const usedUnits = Math.max(currentReading - prevReading, 0);
    setUnits(usedUnits);
    setBillAmount(usedUnits * RATE_PER_UNIT);
  }, [prevReading, currentReading]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      prevReading,
      currentReading,
      units,
      billAmount,
    };

    console.log("Submitting:", payload);
    setMessage("Meter reading submitted.");
  }

  return (
    <PageShell className="max-w-xl">
      <PageHeader
        title="Add meter reading"
        description="Enter previous and current readings to estimate units and bill amount"
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
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {message ? (
              <Alert variant="success">
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="prevReading">Previous reading</Label>
              <Input
                id="prevReading"
                type="number"
                value={prevReading}
                onChange={(e) => setPrevReading(Number(e.target.value))}
                className="tabular-nums"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentReading">Current reading</Label>
              <Input
                id="currentReading"
                type="number"
                value={currentReading}
                onChange={(e) => setCurrentReading(Number(e.target.value))}
                className="tabular-nums"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="units">Units used</Label>
                <Input
                  id="units"
                  type="number"
                  value={units}
                  readOnly
                  className="tabular-nums bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billAmount">Bill amount (LKR)</Label>
                <Input
                  id="billAmount"
                  type="number"
                  value={billAmount}
                  readOnly
                  className="tabular-nums bg-muted"
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Submit reading
            </Button>
          </form>
        </CardContent>
      </Card>
    </PageShell>
  );
}
