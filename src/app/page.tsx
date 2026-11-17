"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
  }, [router]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background p-6">
      <p className="text-lg font-semibold tracking-tight text-primary">Enerlytics</p>
      <Skeleton className="h-2 w-32 rounded-full" />
    </div>
  );
}
