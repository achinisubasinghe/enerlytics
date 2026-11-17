"use client";

import { useEffect, useState } from "react";
import TariffForm from "../../components/TariffForm";
import { useParams } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";

export default function EditTariffPage() {
  const [data, setData] = useState<any>(null);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    async function loadTariff() {
      try {
        const res = await fetch(`/api/admin-staff/tariffs/${id}`);
        const result = await res.json();
        console.log("EDIT DATA:", result);
        setData(result);
      } catch (err: unknown) {
        console.error("Failed to load tariff", err);
        setError("Failed to load tariff");
      } finally {
        setLoading(false);
      }
    }

    loadTariff();
  }, [id]);

  return (
    <PageShell>
      <PageHeader
        title={
          loading
            ? "Edit tariff"
            : data?.tariff
              ? `Edit tariff – ${data.tariff.name}`
              : "Edit tariff"
        }
        description="Update tariff details and rate slabs."
      />

      {loading ? (
        <Card className="max-w-3xl">
          <CardContent className="space-y-4 pt-6">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-1/2" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      ) : error || !data || !data.tariff ? (
        <Alert variant="destructive">
          <AlertDescription>{error || "Tariff not found"}</AlertDescription>
        </Alert>
      ) : (
        <TariffForm mode="edit" tariffId={String(id)} initialData={data} />
      )}
    </PageShell>
  );
}
