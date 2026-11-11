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
    approved: "bg-[#052e16] text-[#4ade80] border-[#166534]",
    calibrated: "bg-[#052e16] text-[#4ade80] border-[#166534]",
    submitted: "bg-[#082f49] text-[#38bdf8] border-[#075985]",
    pending: "bg-[#422006] text-[#facc15] border-[#854d0e]",
    expiring: "bg-[#451a03] text-[#fb923c] border-[#9a3412]",
    rejected: "bg-[#450a0a] text-[#f87171] border-[#991b1b]",
    overdue: "bg-[#450a0a] text-[#f87171] border-[#991b1b]",
    neutral: "bg-[#1e293b] text-[#94a3b8] border-[#334155]",
  };

  return (
    <span className={cn(baseStyles, variantStyles[variant], className)} {...props}>
      {children}
    </span>
  );
}

