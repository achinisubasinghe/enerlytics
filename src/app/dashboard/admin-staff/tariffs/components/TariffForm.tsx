"use client";

import { useRouter } from "next/navigation";
import TariffSlabs from "./TariffSlabs";
import { useEffect, useState } from "react";
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

export default function TariffForm({
  mode = "add",
  tariffId,
  initialData,
}: {
  mode?: string;
  tariffId?: string | number;
  initialData?: any;
}) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [utilityType, setUtilityType] = useState("ELECTRICITY");
  const [status, setStatus] = useState("ACTIVE");
  const [slabs, setSlabs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData && initialData.tariff) {
      setName(initialData.tariff.name);
      setUtilityType(initialData.tariff.utility_type);
      setStatus(initialData.tariff.status);
      setSlabs(initialData.slabs || []);
    }
  }, [initialData]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const url =
      mode === "add"
        ? "/api/admin-staff/tariffs"
        : `/api/admin-staff/tariffs/${tariffId}`;

    const method = mode === "add" ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          utilityType,
          status,
          slabs,
        }),
      });

      if (!res.ok) {
        setError(mode === "add" ? "Failed to add tariff" : "Failed to update tariff");
        setLoading(false);
        return;
      }

      router.push("/dashboard/admin-staff/tariffs");
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <CardTitle>{mode === "add" ? "Add new tariff" : "Edit tariff"}</CardTitle>
        <CardDescription>
          Define plan details and consumption slabs with rates.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="tariff-name">Tariff name</Label>
              <Input
                id="tariff-name"
                placeholder="Tariff name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Utility type</Label>
              <Select value={utilityType} onValueChange={setUtilityType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select utility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ELECTRICITY">Electricity</SelectItem>
                  <SelectItem value="WATER">Water</SelectItem>
                  <SelectItem value="GAS">Gas</SelectItem>
                </SelectContent>
              </Select>
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
                </SelectContent>
              </Select>
            </div>
          </div>

          <TariffSlabs slabs={slabs} setSlabs={setSlabs} />
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
          <Button type="submit" disabled={loading}>
            {loading
              ? "Saving…"
              : mode === "add"
                ? "Add tariff"
                : "Update tariff"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
