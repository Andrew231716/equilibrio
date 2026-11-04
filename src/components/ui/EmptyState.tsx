import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("card p-6 text-center", className)}>
      <h3 className="font-display text-lg text-[var(--forest)]">{title}</h3>
      <p className="mt-2 text-sm text-[var(--muted)]">{description}</p>
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}
