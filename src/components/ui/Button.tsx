import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "danger" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading = false, icon, children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-[#163d78] disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-[6px] tracking-wide text-sm";

    const variantStyles = {
      primary: "bg-[#163d78] text-white hover:bg-[#113162] border border-[#163d78] shadow-none",
      danger: "bg-[#ed2e35] text-white hover:bg-[#cf2228] border border-[#ed2e35] shadow-none",
      secondary: "bg-[#1e293b] text-slate-200 hover:bg-[#28384f] border border-[#334155]",
      outline: "bg-transparent text-slate-200 hover:bg-[#1e293b] border border-[#475569]",
      ghost: "bg-transparent text-slate-300 hover:bg-[#1e293b] hover:text-white border border-transparent",
    };

    const sizeStyles = {
      sm: "h-8 px-2.5 text-xs gap-1.5",
      md: "h-9 px-3.5 text-sm gap-2",
      lg: "h-11 px-5 text-sm gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? (
          <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        ) : (
          icon && <span className="inline-flex shrink-0 items-center justify-center">{icon}</span>
        )}
        <span>{children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";

