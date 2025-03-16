
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Avatar from "../Avatar";
import { Message } from "@/contexts/ClubContext";
import { useAuth } from "@/contexts/AuthContext";
import { useClub } from "@/contexts/ClubContext";

type MessageItemProps = {
  message: Message;
};

const MessageItem = ({ message }: MessageItemProps) => {
  const { user } = useAuth();
  const { deleteMessage, selectedClub } = useClub();

  const isAuthor = user?.id === message.userId;
  const isAdmin = selectedClub?.members.some(
    m => m.userId === user?.id && m.role === "admin"
  );
  const isModerator = selectedClub?.members.some(
    m => m.userId === user?.id && m.role === "moderator"
  );
  
  const canDelete = isAuthor || isAdmin || isModerator;
  
  const formattedDate = formatDistanceToNow(new Date(message.createdAt), { 
    addSuffix: true 
  });

  const handleDelete = async () => {
    try {
      await deleteMessage(message.id);
    } catch (error) {
      // Error is handled in the context toast
    }
  };

  return (
    <div className="group py-2 px-4 hover:bg-muted/30 flex gap-3 transition-colors">
      <div className="shrink-0">
        <Avatar
          src={message.userAvatar}
          alt={message.userName}
          size="sm"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium">{message.userName}</span>
          <span className="text-xs text-muted-foreground">{formattedDate}</span>
          
          {canDelete && (
            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Message actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive-foreground focus:bg-destructive cursor-pointer"
                    onClick={handleDelete}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Message
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
        
        <div className="mt-1 break-words whitespace-pre-line">
          {message.content}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
