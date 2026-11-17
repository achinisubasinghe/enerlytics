"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id: userId } = use(params);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    nic: "",
    role: "ADMIN",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      const res = await fetch(`/api/admin/users/${userId}`);
      if (!res.ok) {
        setError("User not found");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setForm(data);
      setLoading(false);
    }

    loadUser();
  }, [userId]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      setError("Update failed");
      setSaving(false);
      return;
    }

    setSuccess("User updated successfully.");
    setSaving(false);
    router.push("/dashboard/admin/users");
  }

  if (loading) {
    return (
      <PageShell>
        <PageHeader title="Edit user" description="Update account details." />
        <Card className="max-w-xl">
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

  return (
    <PageShell>
      <PageHeader
        title="Edit user"
        description="Update account details and role."
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
                value={form.email}
                onChange={handleChange}
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
              <Label>Role</Label>
              <Select
                value={form.role}
                onValueChange={(value) => setForm({ ...form, role: value })}
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
              <Button type="submit" className="flex-1" disabled={saving}>
                {saving ? "Updating..." : "Update"}
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
