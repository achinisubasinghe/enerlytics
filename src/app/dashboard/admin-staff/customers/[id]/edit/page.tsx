"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useState, useEffect, use } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/layout/PageHeader";

export default function EditCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id: customerId } = use(params);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    nic: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadCustomer() {
      const res = await fetch(`/api/admin-staff/customers/${customerId}`);
      if (!res.ok) {
        setError("Customer not found");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setForm(data);
      setLoading(false);
    }

    loadCustomer();
  }, [customerId]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    const res = await fetch(`/api/admin-staff/customers/${customerId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      setError("Update failed");
      setSaving(false);
      return;
    }

    setSuccess("Customer updated successfully");
    setTimeout(() => {
      router.push("/dashboard/admin-staff/customers");
    }, 800);
  }

  return (
    <PageShell>
      <PageHeader
        title="Edit customer"
        description="Update customer contact and identity details."
      />

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Customer details</CardTitle>
          <CardDescription>Changes apply immediately after saving.</CardDescription>
        </CardHeader>
        {loading ? (
          <CardContent className="space-y-4">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </CardContent>
        ) : error === "Customer not found" ? (
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Go back
            </Button>
          </CardContent>
        ) : (
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
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="tabular-nums"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nic">NIC</Label>
                <Input
                  id="nic"
                  name="nic"
                  value={form.nic}
                  onChange={handleChange}
                  className="tabular-nums"
                />
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={saving}>
                {saving ? "Updating…" : "Update customer"}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </PageShell>
  );
}
