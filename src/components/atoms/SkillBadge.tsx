import { cn } from "@/lib/utils";

interface SkillBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function SkillBadge({ children, className }: SkillBadgeProps) {
  return (
    <div
      className={cn(
        "text-gray-light inline-flex items-center gap-1 px-3 py-1 rounded-50 bg-brand-surface ",
        className,
      )}
    >
      <span className="w-1 h-1 rounded-full bg-brand-primary" />
      {children}
    </div>
  );
}
