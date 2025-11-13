import { cn } from "@/lib/utils";

interface ContentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function ContentCard({ title, children, className }: ContentCardProps) {
  return (
    <div className={cn("p-6 rounded-8 bg-brand-surface text-brand-white", className)}>
      <h3 className="text-heading-3 font-bold mb-4">{title}</h3>
      <div className="text-body-2 text-gray-light">{children}</div>
    </div>
  );
}
