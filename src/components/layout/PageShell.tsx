import { cn } from "@/lib/utils";

export function PageShell({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1440px] space-y-6 px-4 pb-10 pt-6 sm:px-6 lg:px-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
