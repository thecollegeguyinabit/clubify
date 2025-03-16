
import React from "react";
import { cn } from "@/lib/utils";

type AvatarProps = {
  src?: string;
  alt?: string;
  initials?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  status?: "online" | "offline" | "away" | "busy";
};

const Avatar = ({ 
  src, 
  alt = "Avatar", 
  initials, 
  size = "md", 
  className,
  status 
}: AvatarProps) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
  };

  // Generate initials from name if not provided
  const renderInitials = () => {
    if (initials) return initials;
    if (alt && alt !== "Avatar") {
      return alt
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
    }
    return "U";
  };

  const statusColors = {
    online: "bg-green-500",
    offline: "bg-gray-400",
    away: "bg-yellow-500",
    busy: "bg-red-500"
  };

  return (
    <div className="relative">
      <div
        className={cn(
          "relative rounded-full flex items-center justify-center bg-primary text-primary-foreground font-medium overflow-hidden",
          sizeClasses[size],
          className
        )}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <span className="select-none">{renderInitials()}</span>
        )}
      </div>
      
      {status && (
        <span 
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-2 border-background",
            statusColors[status],
            size === "sm" ? "w-2.5 h-2.5" : 
            size === "md" ? "w-3 h-3" : 
            size === "lg" ? "w-3.5 h-3.5" : "w-4 h-4"
          )}
        />
      )}
    </div>
  );
};

export default Avatar;
