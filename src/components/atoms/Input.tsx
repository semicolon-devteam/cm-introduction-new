import * as React from "react";

import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            // Figma Design: Medium size input (padding: 12px 14px, border-radius: 10px)
            "w-full px-[14px] py-3 rounded-[10px]",
            "bg-brand-white text-brand-black text-body-2",
            "border border-[#E0E0E1]",
            "placeholder:text-[#AEAFB1] placeholder:font-normal",
            "focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent",
            "transition-colors",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus:ring-red-500",
            className,
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-caption text-red-500">{error}</p>}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
