import { Loader2, LucideIcon } from "lucide-react";
import { ButtonHTMLAttributes, forwardRef } from "react";

import { Button } from "@atoms/Button";
import { cn } from "@lib/utils";

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  fullWidth?: boolean;
}

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  (
    {
      children,
      loading = false,
      loadingText = "Loading...",
      icon: Icon,
      iconPosition = "left",
      variant = "default",
      size = "default",
      fullWidth = false,
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        disabled={isDisabled}
        className={cn(fullWidth && "w-full", className)}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {loadingText}
          </>
        ) : (
          <>
            {Icon && iconPosition === "left" && <Icon className="mr-2 h-4 w-4" />}
            {children}
            {Icon && iconPosition === "right" && <Icon className="ml-2 h-4 w-4" />}
          </>
        )}
      </Button>
    );
  },
);

ActionButton.displayName = "ActionButton";
