import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center gap-6 overflow-hidden p-6 text-center">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.72_0.06_200_/_0.2),transparent_55%)]"
        aria-hidden="true"
      />
      <div className="relative z-10 space-y-3">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">404</p>
        <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          This route does not exist or may have moved. Head back to the console.
        </p>
      </div>
      <div className="relative z-10 flex gap-3">
        <Button asChild>
          <Link href="/login">Go to sign in</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Home</Link>
        </Button>
      </div>
    </div>
  );
}
