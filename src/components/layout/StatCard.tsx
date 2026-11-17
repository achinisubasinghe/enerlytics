import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  title,
  value,
  icon,
  hint,
  className,
  valueClassName,
}: {
  title: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  hint?: string;
  className?: string;
  valueClassName?: string;
}) {
  return (
    <Card className={cn("py-0", className)}>
      <CardContent className="flex items-center gap-4 p-5">
        {icon ? (
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        ) : null}
        <div className="min-w-0 space-y-0.5">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p
            className={cn(
              "truncate text-2xl font-semibold tabular-nums tracking-tight text-foreground",
              valueClassName
            )}
          >
            {value}
          </p>
          {hint ? (
            <p className="text-xs text-muted-foreground">{hint}</p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
