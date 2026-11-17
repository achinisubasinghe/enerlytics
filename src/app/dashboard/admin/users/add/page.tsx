"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiCall } from "@/hooks/use-api";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddUserPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "",
    phone: "",
    nic: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await apiCall("/api/admin/add-user", {
        method: "POST",
        body: JSON.stringify(form),
      });

      setSuccess("User added successfully.");
      router.push("/dashboard/admin/users");
    } catch (err: unknown) {
      setError((err as Error).message || "Error adding user");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell>
      <PageHeader
        title="Add new user"
        description="Create a staff or operational account."
        actions={
          <Button variant="outline" asChild>
            <Link href="/dashboard/admin/users">Back to users</Link>
          </Button>
        }
      />

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

      <Card className="max-w-xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullname">Full name</Label>
              <Input
                id="fullname"
                name="fullname"
                placeholder="Enter full name"
                value={form.fullname}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="Enter email"
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
                placeholder="07XXXXXXXX"
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
                placeholder="Enter NIC number"
                value={form.nic}
                onChange={handleChange}
                className="tabular-nums"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={form.role || undefined}
                onValueChange={(value) => setForm({ ...form, role: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN_STAFF">Admin staff</SelectItem>
                  <SelectItem value="MANAGER">Manager</SelectItem>
                  <SelectItem value="METER_READER">Meter reader</SelectItem>
                  <SelectItem value="CASHIER">Billing clerk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? "Adding..." : "Add user"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </PageShell>
  );
}
