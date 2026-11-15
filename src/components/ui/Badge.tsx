import React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "approved"
  | "submitted"
  | "rejected"
  | "pending"
  | "calibrated"
  | "overdue"
  | "expiring"
  | "neutral";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

export function Badge({ className, variant = "neutral", children, ...props }: BadgeProps) {
  // Rectangular technical stamp geometry (border-radius: 3px)
  const baseStyles =
    "inline-flex items-center px-2 py-0.5 text-xs font-mono font-medium rounded-[3px] border tracking-wider uppercase tabular-nums";

  const variantStyles: Record<BadgeVariant, string> = {
    approved: "bg-emerald-50 text-emerald-700 border-emerald-300",
    calibrated: "bg-emerald-50 text-emerald-700 border-emerald-300",
    submitted: "bg-sky-50 text-sky-700 border-sky-300",
    pending: "bg-amber-50 text-amber-700 border-amber-300",
    expiring: "bg-orange-50 text-orange-700 border-orange-300",
    rejected: "bg-red-50 text-red-700 border-red-300",
    overdue: "bg-red-50 text-red-700 border-red-300",
    neutral: "bg-slate-100 text-slate-700 border-slate-300",
  };

  return (
    <span className={cn(baseStyles, variantStyles[variant], className)} {...props}>
      {children}
    </span>
  );
}

