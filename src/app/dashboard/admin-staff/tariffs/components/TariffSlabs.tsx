"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

export default function TariffSlabs({
  slabs,
  setSlabs,
}: {
  slabs: any[];
  setSlabs: (s: any[]) => void;
}) {
  function addSlab() {
    setSlabs([...slabs, { min: "", max: "", rate: "", fixed: "" }]);
  }

  function removeSlab(index: number) {
    setSlabs(slabs.filter((_, i) => i !== index));
  }

  function updateSlab(index: number, field: string, value: string) {
    const updated = [...slabs];
    updated[index][field] = value;
    setSlabs(updated);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Tariff slabs</h3>
        <Button type="button" variant="outline" size="sm" onClick={addSlab}>
          <Plus className="size-4" />
          Add slab
        </Button>
      </div>

      {slabs.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-6 text-center text-sm text-muted-foreground">
          No slabs yet. Add a slab to define unit ranges and rates.
        </p>
      ) : (
        <div className="space-y-3">
          {slabs.map((slab: any, i: number) => (
            <div
              key={i}
              className="grid grid-cols-1 gap-3 rounded-lg border border-border bg-muted/20 p-3 sm:grid-cols-5 sm:items-end"
            >
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Min units</Label>
                <Input
                  placeholder="Min units"
                  value={slab.min_units ?? slab.min ?? ""}
                  onChange={(e) => updateSlab(i, "min_units", e.target.value)}
                  className="tabular-nums"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Max units</Label>
                <Input
                  placeholder="Max units"
                  value={slab.max_units ?? slab.max ?? ""}
                  onChange={(e) => updateSlab(i, "max_units", e.target.value)}
                  className="tabular-nums"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Rate / unit</Label>
                <Input
                  placeholder="Rate / unit"
                  value={slab.rate_per_unit ?? slab.rate ?? ""}
                  onChange={(e) => updateSlab(i, "rate_per_unit", e.target.value)}
                  className="tabular-nums"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Fixed charge</Label>
                <Input
                  placeholder="Fixed charge"
                  value={slab.fixed_charge ?? slab.fixed ?? ""}
                  onChange={(e) => updateSlab(i, "fixed_charged", e.target.value)}
                  className="tabular-nums"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeSlab(i)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
