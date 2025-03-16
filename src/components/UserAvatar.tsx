
import React from "react";
import Avatar from "@/components/Avatar";
import { User } from "@/contexts/AuthContext";

interface UserAvatarProps {
  user: User | null;
  size?: "sm" | "md" | "lg" | "xl";
  showStatus?: boolean;
  className?: string;
}

const UserAvatar = ({ 
  user, 
  size = "md", 
  showStatus = false,
  className 
}: UserAvatarProps) => {
  if (!user) {
    return (
      <Avatar
        size={size}
        initials="?"
        className={className}
      />
    );
  }

  return (
    <Avatar
      src={user.avatar}
      alt={user.name}
      size={size}
      status={showStatus ? "online" : undefined}
      className={className}
    />
  );
};

export default UserAvatar;
