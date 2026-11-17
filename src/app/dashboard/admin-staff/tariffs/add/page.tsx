"use client";

import TariffForm from "../components/TariffForm";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/layout/PageHeader";

export default function AddTariffPage() {
  return (
    <PageShell>
      <PageHeader
        title="Add tariff"
        description="Create a new utility pricing plan with rate slabs."
      />
      <TariffForm mode="add" />
    </PageShell>
  );
}
