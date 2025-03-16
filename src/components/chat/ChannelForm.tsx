
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useClub } from "@/contexts/ClubContext";

type ChannelFormProps = {
  clubId: string;
  onSuccess?: () => void;
};

const ChannelForm = ({ clubId, onSuccess }: ChannelFormProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const { createChannel } = useClub();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Channel name must not have spaces or special characters
    const sanitizedName = name.trim().toLowerCase().replace(/\s+/g, "-");
    
    if (!sanitizedName) {
      setError("Please enter a channel name");
      return;
    }
    
    if (!/^[a-z0-9-]+$/.test(sanitizedName)) {
      setError("Channel name can only contain lowercase letters, numbers, and hyphens");
      return;
    }
    
    setError("");
    setIsSubmitting(true);
    
    try {
      await createChannel(clubId, sanitizedName, description, isPrivate);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to create channel");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="channel-name">Channel Name</Label>
        <Input
          id="channel-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., announcements"
          required
        />
        <p className="text-xs text-muted-foreground">
          Lowercase letters, numbers, and hyphens only. No spaces.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="channel-description">Description (Optional)</Label>
        <Textarea
          id="channel-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What's this channel about?"
          rows={3}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="private-channel">Private Channel</Label>
          <p className="text-xs text-muted-foreground">
            Only selected members can access
          </p>
        </div>
        <Switch
          id="private-channel"
          checked={isPrivate}
          onCheckedChange={setIsPrivate}
        />
      </div>
      
      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onSuccess}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Channel"}
        </Button>
      </div>
    </form>
  );
};

export default ChannelForm;
