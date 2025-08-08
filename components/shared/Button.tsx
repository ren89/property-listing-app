import React from "react";
import { Button as BaseButton } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { VariantProps } from "class-variance-authority";
import type { buttonVariants } from "@/components/ui/button";

interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export default function Button({
  loading = false,
  loadingText = "Loading...",
  children,
  disabled,
  variant,
  size,
  ...props
}: ButtonProps) {
  return (
    <BaseButton
      variant={variant}
      size={size}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />}
      {loading ? loadingText : children}
    </BaseButton>
  );
}
