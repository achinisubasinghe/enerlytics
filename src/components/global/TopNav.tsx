"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";

export default function TopNav({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-20 flex w-full items-center justify-between border-b border-border/80 bg-card/90 px-4 py-3 backdrop-blur-md sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <SidebarTrigger className="shrink-0" />
        <h2 className="truncate text-base font-semibold tracking-tight text-foreground sm:text-lg">
          {title}
        </h2>
      </div>
      <div
        className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-primary/10 text-sm font-semibold text-primary"
        aria-label="User"
      >
        U
      </div>
    </header>
  );
}
