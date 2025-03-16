
import React, { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useClub } from "@/contexts/ClubContext";
import MessageItem from "./MessageItem";
import ChatInput from "./ChatInput";
import ChannelHeader from "./ChannelHeader";

const ChatContainer = () => {
  const { selectedChannel, selectedClub } = useClub();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChannel?.messages]);
  
  if (!selectedChannel || !selectedClub) {
    return (
      <div className="flex-1 flex items-center justify-center bg-card/10">
        <div className="text-center">
          <h3 className="text-lg font-medium">No channel selected</h3>
          <p className="text-muted-foreground mt-1">Select a channel to start chatting</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex-1 flex flex-col h-screen">
      <ChannelHeader channel={selectedChannel} club={selectedClub} />
      
      <div className="flex-1 flex flex-col">
        {selectedChannel.messages.length > 0 ? (
          <ScrollArea className="flex-1">
            <div className="py-4">
              {selectedChannel.messages.map(message => (
                <MessageItem key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center p-4">
            <div>
              <h3 className="text-lg font-medium">Welcome to #{selectedChannel.name}</h3>
              <p className="text-muted-foreground mt-1">
                This is the start of the {selectedChannel.name} channel
              </p>
              <p className="text-muted-foreground mt-4">
                Be the first to send a message!
              </p>
            </div>
          </div>
        )}
        
        <ChatInput channelId={selectedChannel.id} />
      </div>
    </div>
  );
};

export default ChatContainer;
