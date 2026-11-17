"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { apiCall } from "@/hooks/use-api";
import { useRouter } from "next/navigation";

const ROLE_ROUTES = {
  ADMIN: "/dashboard/admin",
  MANAGER: "/dashboard/manager",
  ADMIN_STAFF: "/dashboard/admin-staff",
  CASHIER: "/dashboard/billing",
  METER_READER: "/dashboard/meter-reader",
  CUSTOMER: "/dashboard/customer",
};

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await apiCall<{ token: string; role: string }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });

      document.cookie = `token=${data.token}; path=/`;

      const route = ROLE_ROUTES[data.role as keyof typeof ROLE_ROUTES];
      if (route) {
        router.push(route);
      } else {
        setError("Unknown role. Contact an administrator.");
      }
    } catch (err: unknown) {
      setError((err as Error).message || "Login failed. Check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden p-4">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,oklch(0.72_0.06_200_/_0.25),transparent_50%),radial-gradient(ellipse_at_bottom_right,oklch(0.55_0.05_220_/_0.15),transparent_45%)]"
        aria-hidden="true"
      />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <p className="text-2xl font-semibold tracking-tight text-primary">Enerlytics</p>
          <p className="mt-1 text-sm text-muted-foreground">Utility operations console</p>
        </div>
        <Card className="rounded-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-xl font-semibold">Sign in</CardTitle>
            <CardDescription>Enter your work credentials to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error ? (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@utility.lk"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in…" : "Sign in"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Need an account?{" "}
              <Link href="/register" className="font-medium text-primary hover:underline">
                Register
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
