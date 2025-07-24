// components/ui/Button.tsx
import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "success"
    | "ghost"
    | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      // Base styles
      "inline-flex items-center justify-center font-medium transition-all duration-200",
      "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-800",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      "rounded-lg", // Usando il tuo stile esistente

      // Size variants
      {
        "px-3 py-1.5 text-sm gap-1.5 h-8": size === "sm",
        "px-4 py-2 text-sm gap-2 h-10": size === "md",
        "px-6 py-3 text-base gap-2 h-12": size === "lg",
      },

      // Color variants (perfettamente allineati ai tuoi colori esistenti)
      {
        // Primary - usa il tuo blu principale
        "bg-[#3B82F6] hover:bg-[#3B82F6]/80 text-white focus:ring-[#3B82F6] shadow-sm":
          variant === "primary",

        // Secondary - usa i tuoi colori neutral esistenti
        "bg-neutral-700/60 hover:bg-neutral-600 text-neutral-200 border border-neutral-600/60 focus:ring-neutral-500":
          variant === "secondary",

        // Danger
        "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-sm":
          variant === "danger",

        // Success
        "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 shadow-sm":
          variant === "success",

        // Ghost - perfetto per azioni secondarie
        "hover:bg-neutral-700/50 text-neutral-300 focus:ring-neutral-500":
          variant === "ghost",

        // Outline - alternativa elegante
        "border border-neutral-600/60 hover:bg-neutral-700/30 text-neutral-300 focus:ring-neutral-500":
          variant === "outline",
      },

      className
    );

    const LoadingSpinner = () => (
      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    return (
      <button
        ref={ref}
        className={baseStyles}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? <LoadingSpinner /> : leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
