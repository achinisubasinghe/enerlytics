"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    address: "",
    contact: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("Registration is submitted for review. An admin will activate your account.");
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden p-4">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.72_0.06_200_/_0.25),transparent_50%),radial-gradient(ellipse_at_bottom_left,oklch(0.55_0.05_220_/_0.15),transparent_45%)]"
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
          <p className="mt-1 text-sm text-muted-foreground">Create a customer account</p>
        </div>
        <Card className="rounded-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-xl font-semibold">Register</CardTitle>
            <CardDescription>Provide your details to request access</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {message ? (
                <Alert variant="success">
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="Nimal Perera"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Street, city"
                  value={form.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Contact number</Label>
                <Input
                  id="contact"
                  name="contact"
                  placeholder="+94 77 123 4567"
                  value={form.contact}
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
                  placeholder="you@email.com"
                  value={form.email}
                  onChange={handleChange}
                  required
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
                />
              </div>

              <Button type="submit" className="w-full">
                Create account
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already registered?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
