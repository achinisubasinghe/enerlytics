"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/layout/EmptyState";
import { DataTableSkeleton } from "@/components/layout/DataTableSkeleton";
import { useApi } from "@/hooks/use-api";

export default function RecordPayment() {
  const params = useParams();
  const router = useRouter();
  const { data: bill, loading } = useApi(`/api/billing/bills/${params.billId}`);

  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (bill && parseFloat(bill.outstanding) > 0) {
      setAmount(bill.outstanding.toString());
    }
  }, [bill]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid payment amount.");
      return;
    }

    if (bill && parseFloat(amount) > parseFloat(bill.outstanding)) {
      setError(
        `Payment exceeds outstanding amount of Rs. ${parseFloat(bill.outstanding).toFixed(2)}.`
      );
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/billing/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          billId: params.billId,
          amount: parseFloat(amount),
          paymentMethod,
          referenceNumber: referenceNumber || null,
          notes: notes || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to record payment.");
        setSubmitting(false);
        return;
      }

      setSuccess(`Payment recorded successfully. Bill status: ${data.billStatus}.`);
      setTimeout(() => {
        router.push(`/dashboard/billing/bills/${params.billId}`);
      }, 2000);
    } catch {
      setError("An error occurred while recording payment.");
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <PageShell className="max-w-lg">
        <PageHeader title="Record payment" />
        <DataTableSkeleton rows={4} cols={2} />
      </PageShell>
    );
  }

  if (!bill) {
    return (
      <PageShell className="max-w-lg">
        <PageHeader title="Record payment" />
        <EmptyState
          title="Bill not found"
          description="This bill may have been removed or the link is invalid."
          icon={<FileText className="size-5" />}
        />
      </PageShell>
    );
  }

  return (
    <PageShell className="max-w-lg">
      <PageHeader
        title="Record payment"
        description="Apply a payment against this bill."
      />

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Bill summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bill ID</span>
              <span className="font-medium tabular-nums">#{bill.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Customer</span>
              <span className="font-medium">{bill.customer_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total amount</span>
              <span className="font-medium tabular-nums">
                Rs. {parseFloat(bill.bill_amount).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-base font-semibold text-destructive">
              <span>Outstanding</span>
              <span className="tabular-nums">
                Rs. {parseFloat(bill.outstanding).toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Payment amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                max={bill.outstanding}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="tabular-nums"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger id="paymentMethod" className="w-full">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASH">Cash</SelectItem>
                  <SelectItem value="CARD">Card</SelectItem>
                  <SelectItem value="ONLINE">Online transfer</SelectItem>
                  <SelectItem value="CHEQUE">Cheque</SelectItem>
                  <SelectItem value="MOBILE_PAYMENT">Mobile payment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(paymentMethod === "ONLINE" ||
              paymentMethod === "CARD" ||
              paymentMethod === "CHEQUE") && (
              <div className="space-y-2">
                <Label htmlFor="referenceNumber">
                  Reference / transaction number
                </Label>
                <Input
                  id="referenceNumber"
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  placeholder="Enter reference number"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="border-input bg-transparent placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-md border px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                rows={3}
                placeholder="Additional notes..."
              />
            </div>

            {error && <Alert variant="destructive">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
                disabled={submitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="flex-1">
                {submitting ? "Recording..." : "Record payment"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </PageShell>
  );
}
