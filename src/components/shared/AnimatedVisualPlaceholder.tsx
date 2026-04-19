"use client";

import { cn } from "@/lib/utils";

export function AnimatedVisualPlaceholder({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      data-visual={id}
      className={cn(
        "pointer-events-none absolute rounded-full blur-3xl opacity-70",
        className
      )}
    />
  );
}
