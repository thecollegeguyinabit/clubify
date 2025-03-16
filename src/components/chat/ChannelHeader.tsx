
import React from "react";
import { Channel, Club } from "@/contexts/ClubContext";
import { Hash, Lock } from "lucide-react";

type ChannelHeaderProps = {
  channel: Channel;
  club: Club;
};

const ChannelHeader = ({ channel, club }: ChannelHeaderProps) => {
  const memberCount = club.members.length;
  
  return (
    <div className="h-14 px-6 flex items-center border-b bg-card/50">
      <div className="flex items-center gap-2">
        {channel.isPrivate ? (
          <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
        ) : (
          <Hash className="h-4 w-4 text-muted-foreground shrink-0" />
        )}
        <h3 className="font-medium ">{channel.name}</h3>
      </div>
      
      <div className="h-5 w-px bg-border mx-3"></div>
      
      <div className="text-sm text-muted-foreground truncate">
        {channel.description || `Welcome to the ${channel.name} channel`}
      </div>
      
      <div className="ml-auto text-xs text-muted-foreground hidden sm:block">
        {memberCount} {memberCount === 1 ? "member" : "members"}
      </div>
    </div>
  );
};

export default ChannelHeader;
