import * as React from "react";

import { cn } from "@/lib/utils";

interface TextareaProps extends React.ComponentProps<"textarea"> {
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          className={cn(
            // Figma Design: Large textarea (padding: 12px 14px, border-radius: 10px, height: 340px)
            "w-full px-[14px] py-3 rounded-[10px]",
            "bg-brand-white text-brand-black text-body-2",
            "border border-[#E0E0E1]",
            "placeholder:text-[#AEAFB1] placeholder:font-normal",
            "focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent",
            "transition-colors resize-none",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "min-h-[340px]",
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
Textarea.displayName = "Textarea";

export { Textarea };
