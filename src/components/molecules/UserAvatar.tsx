import { Avatar, AvatarFallback, AvatarImage } from "@atoms/Avatar";
import { Badge } from "@atoms/Badge";
import { cn } from "@lib/utils";

interface UserAvatarProps {
  src?: string;
  alt?: string;
  name: string;
  status?: "online" | "offline" | "away";
  size?: "sm" | "md" | "lg";
  showName?: boolean;
  badge?: string;
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

const statusColors = {
  online: "bg-green-500",
  offline: "bg-gray-400",
  away: "bg-yellow-500",
};

export function UserAvatar({
  src,
  alt,
  name,
  status,
  size = "md",
  showName = false,
  badge,
  className,
}: UserAvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <Avatar className={sizeClasses[size]}>
          <AvatarImage src={src} alt={alt || name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        {status && (
          <span
            className={cn(
              "absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white",
              statusColors[status],
            )}
            aria-label={`Status: ${status}`}
          />
        )}
      </div>
      {showName && (
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium">{name}</span>
          {badge && (
            <Badge variant="secondary" className="text-xs">
              {badge}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
