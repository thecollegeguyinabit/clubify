
import React, { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal } from "lucide-react";
import { useClub } from "@/contexts/ClubContext";

type ChatInputProps = {
  channelId: string;
};

const ChatInput = ({ channelId }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { sendMessage } = useClub();

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    setIsSending(true);
    try {
      await sendMessage(channelId, message);
      setMessage("");
    } catch (error) {
      // Error is handled in the context toast
    } finally {
      setIsSending(false);
    }
  };

  // Handle pressing Enter to send (but Shift+Enter for new line)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <form onSubmit={handleSendMessage} className="mt-auto p-4 bg-card/50 border-t">
      <div className="flex items-center gap-2 ">
        <Textarea
          placeholder="Type your message..."
          className="resize-none flex-grow min-h-[2.5rem] max-h-[10rem]"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSending}
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={!message.trim() || isSending} 
          className="h-11 w-11 shrink-0"
        >
          <SendHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default ChatInput;
