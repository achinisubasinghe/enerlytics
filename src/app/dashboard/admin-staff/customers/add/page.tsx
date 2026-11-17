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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/layout/PageHeader";

export default function AddCustomerPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    nic: "",
    address: "",
    customerType: "HOUSEHOLD",
  });
  const [createLogin, setCreateLogin] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/admin-staff/customers/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, createLogin }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(text);
      setError("Failed to add customer");
      setLoading(false);
      return;
    }

    const data = await res.json();

    if (data.password) {
      setGeneratedPassword(data.password);
      setLoading(false);
    } else {
      router.push("/dashboard/admin-staff/customers");
    }
  }

  return (
    <PageShell>
      <PageHeader
        title="Add customer"
        description="Create a customer record and optionally issue a login."
      />

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Customer details</CardTitle>
          <CardDescription>All fields marked as required must be completed.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            {generatedPassword ? (
              <Alert variant="success">
                <AlertTitle>Customer account created</AlertTitle>
                <AlertDescription>
                  <p className="mb-2">Customer and login account created successfully.</p>
                  <div className="rounded-md border border-border bg-card p-3">
                    <p className="text-xs font-medium text-muted-foreground">
                      Temporary password (save this now)
                    </p>
                    <p className="mt-1 select-all font-mono text-lg font-semibold tabular-nums text-foreground">
                      {generatedPassword}
                    </p>
                  </div>
                  <p className="mt-2 text-sm font-medium text-warning-foreground">
                    This password will only be shown once. Save it and share with the customer.
                  </p>
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
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
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone number</Label>
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

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={form.customerType}
                    onValueChange={(value) => setForm({ ...form, customerType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HOUSEHOLD">Household</SelectItem>
                      <SelectItem value="BUSINESS">Business</SelectItem>
                      <SelectItem value="GOVERNMENT">Government</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="createLogin"
                    checked={createLogin}
                    onChange={(e) => setCreateLogin(e.target.checked)}
                    className="size-4 rounded border-border accent-primary"
                  />
                  <Label htmlFor="createLogin" className="cursor-pointer font-normal">
                    Create login account (generates temporary password)
                  </Label>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex gap-2">
            {generatedPassword ? (
              <Button
                type="button"
                className="w-full"
                onClick={() => router.push("/dashboard/admin-staff/customers")}
              >
                Go to customers list
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? "Saving…" : "Save customer"}
                </Button>
              </>
            )}
          </CardFooter>
        </form>
      </Card>
    </PageShell>
  );
}
