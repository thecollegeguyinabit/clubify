import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth, User } from "./AuthContext";

export type Club = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  ownerId: string;
  members: ClubMember[];
  channels: Channel[];
  avatar?: string;
};

export type ClubMember = {
  userId: string;
  name: string;
  role: "admin" | "moderator" | "member";
  joinedAt: string;
  avatar?: string;
};

export type Channel = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  createdBy: string;
  clubId: string;
  isPrivate: boolean;
  allowedMembers?: string[];
  messages: Message[];
};

export type Message = {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  channelId: string;
  reactions?: Reaction[];
  isEdited?: boolean;
};

export type Reaction = {
  emoji: string;
  count: number;
  userIds: string[];
};

type ClubContextType = {
  clubs: Club[];
  isLoading: boolean;
  selectedClub: Club | null;
  selectedChannel: Channel | null;
  createClub: (name: string, description: string, avatar?: string) => Promise<Club>;
  joinClub: (clubId: string) => Promise<void>;
  leaveClub: (clubId: string) => Promise<void>;
  createChannel: (clubId: string, name: string, description: string, isPrivate?: boolean, allowedMembers?: string[]) => Promise<Channel>;
  selectClub: (clubId: string | null) => void;
  selectChannel: (channelId: string | null) => void;
  sendMessage: (channelId: string, content: string) => Promise<Message>;
  updateClub: (clubId: string, updates: Partial<Omit<Club, 'id' | 'members' | 'channels'>>) => Promise<Club>;
  updateChannel: (channelId: string, updates: Partial<Omit<Channel, 'id' | 'messages'>>) => Promise<Channel>;
  deleteMessage: (messageId: string) => Promise<void>;
  getUserClubs: () => Club[];
  getAllClubs: () => Club[];
};

//const ClubContext = createContext<ClubContextType | undefined>(undefined);

const ClubContext = React.createContext<ClubContextType | null>(null);

const CLUBS_STORAGE_KEY = "club-collab-clubs";

export const ClubProvider = ({ children }: { children: ReactNode }) => {
// export const ClubProvider: React.FC = ({ children }) =>{
  const [clubs, setClubs] = useState<Club[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  

  useEffect(() => {
    const storedClubs = localStorage.getItem(CLUBS_STORAGE_KEY);
    if (storedClubs) {
      setClubs(JSON.parse(storedClubs));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (clubs.length > 0) {
      localStorage.setItem(CLUBS_STORAGE_KEY, JSON.stringify(clubs));
    }
  }, [clubs]);

  useEffect(() => {
    if (selectedClub) {
      const updatedClub = clubs.find(club => club.id === selectedClub.id) || null;
      setSelectedClub(updatedClub);
      
      if (selectedChannel && updatedClub) {
        const updatedChannel = updatedClub.channels.find(channel => channel.id === selectedChannel.id) || null;
        setSelectedChannel(updatedChannel);
      }
    }
  }, [clubs, selectedClub?.id, selectedChannel?.id]);

  const createClub = async (name: string, description: string, avatar?: string): Promise<Club> => {
    if (!user) throw new Error("You must be logged in to create a club");
    
    try {
      const newClub: Club = {
        id: crypto.randomUUID(),
        name,
        description,
        createdAt: new Date().toISOString(),
        ownerId: user.id,
        avatar,
        members: [{
          userId: user.id,
          name: user.name,
          role: "admin",
          joinedAt: new Date().toISOString(),
          avatar: user.avatar
        }],
        channels: [{
          id: crypto.randomUUID(),
          name: "general",
          description: "General discussion channel",
          createdAt: new Date().toISOString(),
          createdBy: user.id,
          clubId: "",
          isPrivate: false,
          messages: []
        }]
      };
      
      newClub.channels[0].clubId = newClub.id;
      
      setClubs(prev => [...prev, newClub]);
      
      toast({
        title: "Club created!",
        description: `${name} has been successfully created.`,
      });
      
      return newClub;
    } catch (error: any) {
      toast({
        title: "Failed to create club",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const joinClub = async (clubId: string): Promise<void> => {
    if (!user) throw new Error("You must be logged in to join a club");
    
    try {
      setClubs(prev => {
        const clubIndex = prev.findIndex(c => c.id === clubId);
        if (clubIndex === -1) throw new Error("Club not found");
        
        if (prev[clubIndex].members.some(m => m.userId === user.id)) {
          throw new Error("You're already a member of this club");
        }
        
        const updatedClub = {
          ...prev[clubIndex],
          members: [
            ...prev[clubIndex].members,
            {
              userId: user.id,
              name: user.name,
              role: "member" as "admin" | "moderator" | "member",
              joinedAt: new Date().toISOString(),
              avatar: user.avatar
            }
          ]
        };
        
        const updatedClubs = [...prev];
        updatedClubs[clubIndex] = updatedClub;
        
        toast({
          title: "Joined club!",
          description: `You've successfully joined ${updatedClub.name}.`,
        });
        
        return updatedClubs;
      });
    } catch (error: any) {
      toast({
        title: "Failed to join club",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const leaveClub = async (clubId: string): Promise<void> => {
    if (!user) throw new Error("You must be logged in to leave a club");
    
    try {
      setClubs(prev => {
        const clubIndex = prev.findIndex(c => c.id === clubId);
        if (clubIndex === -1) throw new Error("Club not found");
        
        const club = prev[clubIndex];
        
        if (!club.members.some(m => m.userId === user.id)) {
          throw new Error("You're not a member of this club");
        }
        
        if (club.ownerId === user.id) {
          throw new Error("Club owners cannot leave their club. Transfer ownership first or delete the club.");
        }
        
        const updatedClub = {
          ...club,
          members: club.members.filter(m => m.userId !== user.id)
        };
        
        const updatedClubs = [...prev];
        updatedClubs[clubIndex] = updatedClub;
        
        toast({
          title: "Left club",
          description: `You've left ${club.name}.`,
        });
        
        if (selectedClub?.id === clubId) {
          setSelectedClub(null);
          setSelectedChannel(null);
        }
        
        return updatedClubs;
      });
    } catch (error: any) {
      toast({
        title: "Failed to leave club",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const createChannel = async (
    clubId: string,
    name: string,
    description: string,
    isPrivate = false,
    allowedMembers: string[] = []
  ): Promise<Channel> => {
    if (!user) throw new Error("You must be logged in to create a channel");
    
    try {
      let newChannel: Channel | null = null;
      
      setClubs(prev => {
        const clubIndex = prev.findIndex(c => c.id === clubId);
        if (clubIndex === -1) throw new Error("Club not found");
        
        const userMember = prev[clubIndex].members.find(m => m.userId === user.id);
        if (!userMember || (userMember.role !== "admin" && userMember.role !== "moderator")) {
          throw new Error("You don't have permission to create channels");
        }
        
        if (prev[clubIndex].channels.some(c => c.name === name)) {
          throw new Error(`Channel '${name}' already exists`);
        }
        
        newChannel = {
          id: crypto.randomUUID(),
          name,
          description,
          createdAt: new Date().toISOString(),
          createdBy: user.id,
          clubId,
          isPrivate,
          allowedMembers: isPrivate ? allowedMembers : undefined,
          messages: []
        };
        
        const updatedClub = {
          ...prev[clubIndex],
          channels: [...prev[clubIndex].channels, newChannel!]
        };
        
        const updatedClubs = [...prev];
        updatedClubs[clubIndex] = updatedClub;
        
        toast({
          title: "Channel created!",
          description: `Channel '${name}' has been created.`,
        });
        
        return updatedClubs;
      });
      
      if (!newChannel) throw new Error("Failed to create channel");
      return newChannel;
    } catch (error: any) {
      toast({
        title: "Failed to create channel",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const selectClub = (clubId: string | null) => {
    if (!clubId) {
      setSelectedClub(null);
      setSelectedChannel(null);
      return;
    }
    
    const club = clubs.find(c => c.id === clubId) || null;
    setSelectedClub(club);
    
    if (club && club.channels.length > 0) {
      setSelectedChannel(club.channels[0]);
    } else {
      setSelectedChannel(null);
    }
  };

  const selectChannel = (channelId: string | null) => {
    if (!channelId || !selectedClub) {
      setSelectedChannel(null);
      return;
    }
    
    const channel = selectedClub.channels.find(c => c.id === channelId) || null;
    setSelectedChannel(channel);
  };

  const sendMessage = async (channelId: string, content: string): Promise<Message> => {
    if (!user) throw new Error("You must be logged in to send messages");
    if (!content.trim()) throw new Error("Message cannot be empty");
    
    try {
      let newMessage: Message | null = null;
      
      setClubs(prev => {
        let targetClubIndex = -1;
        let targetChannelIndex = -1;
        
        for (let i = 0; i < prev.length; i++) {
          const channelIndex = prev[i].channels.findIndex(c => c.id === channelId);
          if (channelIndex !== -1) {
            targetClubIndex = i;
            targetChannelIndex = channelIndex;
            break;
          }
        }
        
        if (targetClubIndex === -1 || targetChannelIndex === -1) {
          throw new Error("Channel not found");
        }
        
        const club = prev[targetClubIndex];
        
        if (!club.members.some(m => m.userId === user.id)) {
          throw new Error("You're not a member of this club");
        }
        
        const channel = club.channels[targetChannelIndex];
        if (channel.isPrivate && channel.allowedMembers && !channel.allowedMembers.includes(user.id)) {
          throw new Error("You don't have access to this channel");
        }
        
        newMessage = {
          id: crypto.randomUUID(),
          content,
          createdAt: new Date().toISOString(),
          userId: user.id,
          userName: user.name,
          userAvatar: user.avatar,
          channelId
        };
        
        const updatedChannel = {
          ...channel,
          messages: [...channel.messages, newMessage!]
        };
        
        const updatedChannels = [...club.channels];
        updatedChannels[targetChannelIndex] = updatedChannel;
        
        const updatedClub = {
          ...club,
          channels: updatedChannels
        };
        
        const updatedClubs = [...prev];
        updatedClubs[targetClubIndex] = updatedClub;
        
        return updatedClubs;
      });
      
      if (!newMessage) throw new Error("Failed to send message");
      return newMessage;
    } catch (error: any) {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateClub = async (clubId: string, updates: Partial<Omit<Club, 'id' | 'members' | 'channels'>>): Promise<Club> => {
    if (!user) throw new Error("You must be logged in to update a club");
    
    try {
      let updatedClub: Club | null = null;
      
      setClubs(prev => {
        const clubIndex = prev.findIndex(c => c.id === clubId);
        if (clubIndex === -1) throw new Error("Club not found");
        
        const club = prev[clubIndex];
        
        const userMember = club.members.find(m => m.userId === user.id);
        if (!userMember || userMember.role !== "admin") {
          throw new Error("You don't have permission to update this club");
        }
        
        updatedClub = {
          ...club,
          ...updates
        };
        
        const updatedClubs = [...prev];
        updatedClubs[clubIndex] = updatedClub;
        
        toast({
          title: "Club updated",
          description: `${club.name} has been updated.`,
        });
        
        return updatedClubs;
      });
      
      if (!updatedClub) throw new Error("Failed to update club");
      return updatedClub;
    } catch (error: any) {
      toast({
        title: "Failed to update club",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // const deleteChannel = (channelId: string) =>{
  //   setClubs((prevClub) =>({
  //     ...prevClub,
  //     channels: prevClub.channels.filter((channel) => channel.id !== channelId),
  //   }));
  // };

  const updateChannel = async (channelId: string, updates: Partial<Omit<Channel, 'id' | 'messages'>>): Promise<Channel> => {
    if (!user) throw new Error("You must be logged in to update a channel");
    
    try {
      let updatedChannel: Channel | null = null;
      
      setClubs(prev => {
        let targetClubIndex = -1;
        let targetChannelIndex = -1;
        
        for (let i = 0; i < prev.length; i++) {
          const channelIndex = prev[i].channels.findIndex(c => c.id === channelId);
          if (channelIndex !== -1) {
            targetClubIndex = i;
            targetChannelIndex = channelIndex;
            break;
          }
        }
        
        if (targetClubIndex === -1 || targetChannelIndex === -1) {
          throw new Error("Channel not found");
        }
        
        const club = prev[targetClubIndex];
        
        const userMember = club.members.find(m => m.userId === user.id);
        if (!userMember || (userMember.role !== "admin" && userMember.role !== "moderator")) {
          throw new Error("You don't have permission to update channels");
        }
        
        const channel = club.channels[targetChannelIndex];
        updatedChannel = {
          ...channel,
          ...updates
        };
        
        const updatedChannels = [...club.channels];
        updatedChannels[targetChannelIndex] = updatedChannel;
        
        const updatedClub = {
          ...club,
          channels: updatedChannels
        };
        
        const updatedClubs = [...prev];
        updatedClubs[targetClubIndex] = updatedClub;
        
        toast({
          title: "Channel updated",
          description: `Channel ${channel.name} has been updated.`,
        });
        
        return updatedClubs;
      });
      
      if (!updatedChannel) throw new Error("Failed to update channel");
      return updatedChannel;
    } catch (error: any) {
      toast({
        title: "Failed to update channel",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteMessage = async (messageId: string): Promise<void> => {
    if (!user) throw new Error("You must be logged in to delete messages");
    
    try {
      setClubs(prev => {
        for (let clubIndex = 0; clubIndex < prev.length; clubIndex++) {
          const club = prev[clubIndex];
          
          for (let channelIndex = 0; channelIndex < club.channels.length; channelIndex++) {
            const channel = club.channels[channelIndex];
            const messageIndex = channel.messages.findIndex(m => m.id === messageId);
            
            if (messageIndex !== -1) {
              const message = channel.messages[messageIndex];
              
              const userMember = club.members.find(m => m.userId === user.id);
              const isAdmin = userMember?.role === "admin";
              const isModerator = userMember?.role === "moderator";
              const isMessageAuthor = message.userId === user.id;
              
              if (!isAdmin && !isModerator && !isMessageAuthor) {
                throw new Error("You don't have permission to delete this message");
              }
              
              const updatedMessages = [...channel.messages];
              updatedMessages.splice(messageIndex, 1);
              
              const updatedChannel = {
                ...channel,
                messages: updatedMessages
              };
              
              const updatedChannels = [...club.channels];
              updatedChannels[channelIndex] = updatedChannel;
              
              const updatedClub = {
                ...club,
                channels: updatedChannels
              };
              
              const updatedClubs = [...prev];
              updatedClubs[clubIndex] = updatedClub;
              
              toast({
                title: "Message deleted",
                description: "The message has been deleted.",
              });
              
              return updatedClubs;
            }
          }
        }
        
        throw new Error("Message not found");
      });
    } catch (error: any) {
      toast({
        title: "Failed to delete message",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const getUserClubs = (): Club[] => {
    if (!user) return [];
    return clubs.filter(club => club.members.some(member => member.userId === user.id));
  };

  const getAllClubs = (): Club[] => {
    return clubs;
  };
  const value={
    clubs,
    isLoading,
    selectedClub,
    selectedChannel,
    createClub,
    joinClub,
    leaveClub,
    createChannel,
    selectClub,
    selectChannel,
    sendMessage,
    updateClub,
    updateChannel,
    deleteMessage,
    getUserClubs,
    getAllClubs,
  };

  return (
    <ClubContext.Provider
      // value={{
      //   clubs,
      //   isLoading,
      //   selectedClub,
      //   selectedChannel,
      //   createClub,
      //   joinClub,
      //   leaveClub,
      //   createChannel,
      //   selectClub,
      //   selectChannel,
      //   sendMessage,
      //   updateClub,
      //   updateChannel,
      //   deleteMessage,
      //   getUserClubs,
      //   getAllClubs,
      // }}
      value={value}
    >
      {children}
    </ClubContext.Provider>
  );
};

export const useClub = () => {
  const context = useContext(ClubContext);
  if (context === undefined) {
    throw new Error("useClub must be used within a ClubProvider");
  }
  return context;
};
