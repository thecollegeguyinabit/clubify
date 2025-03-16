import React from "react";
import { Hash, Lock, PlusCircle, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useClub, Club, Channel } from "@/contexts/ClubContext";
import { useAuth } from "@/contexts/AuthContext";
import ChannelForm from "./ChannelForm";

type ChannelListProps = {
  club: Club;
};

const ChannelList = ({ club }: ChannelListProps) => {
  const { selectedChannel, selectChannel } = useClub();
  const { user } = useAuth();
  
  const userRole = club.members.find(m => m.userId === user?.id)?.role;
  const canCreateChannels = userRole === "admin" || userRole === "moderator";
  
  const getAccessibleChannels = () => {
    return club.channels.filter(channel => {
      // If the channel is not private, or the user is an admin or moderator, they can access it
      if (!channel.isPrivate || userRole === "admin" || userRole === "moderator") {
        return true;
      }
      
      // Otherwise, check if the user is in the allowedMembers list
      return channel.allowedMembers?.includes(user?.id || "");
    });
  };
  
  const accessibleChannels = getAccessibleChannels();
  
  return (
    <div className="py-2">
      <div className="px-3 flex items-center justify-between mb-1">
        <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Channels
        </h3>
        
        {canCreateChannels && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <PlusCircle className="h-4 w-4" />
                <span className="sr-only">Add Channel</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Channel</DialogTitle>
              </DialogHeader>
              <ChannelForm clubId={club.id} />
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <ScrollArea className="h-[calc(100vh-15rem)]">
        <div className="space-y-[2px]">
          {accessibleChannels.map((channel) => (
            <ChannelItem
              key={channel.id}
              channel={channel}
              isActive={selectedChannel?.id === channel.id}
              onClick={() => selectChannel(channel.id)}
            />
          ))}
          
          {accessibleChannels.length === 0 && (
            <div className="px-3 py-2 text-sm text-muted-foreground italic">
              No channels available
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

const deleteChannel = (channelId: String) =>{
  setClubs((prevClub) => ({
    ...prevClub,
    channels: prevClub.channels.filter((channel) => channel.id !== channelId),
  }));
};

const ChannelItem = ({ 
  channel, 
  isActive, 
  onClick 
}: { 
  channel: Channel; 
  isActive: boolean; 
  onClick: () => void;
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  return (
    <div
      onMouseEnter ={() => setIsHovered(true)}
      onMouseLeave ={() => setIsHovered(false)}
      className="relative"
    >
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
        isActive
        ? "bg-sidebar-accent text-sidebar-accent-foreground"
        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
      }`}
      >
      {channel.isPrivate ? (
        <Lock className="h-4 w-4 shrink-0" />
      ) : (
        <Hash className="h-4 w-4 shrink-0" />
      )}
      <span className="truncate">{channel.name}</span>
    </button>
    {isHovered && (
      <button
        onClick = {()=> deleteChannel(channel.id)}
        className="absolute right-0 top-0 p-1"
        >
        <Trash className='h-4 w-4' />
      </button>
    )}
      </div>
  );
};

export default ChannelList;
