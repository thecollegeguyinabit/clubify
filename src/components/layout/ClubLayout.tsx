
import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { useClub } from "@/contexts/ClubContext";
import ChannelList from "../chat/ChannelList";
import MemberList from "../chat/MemberList";
import ChatContainer from "../chat/ChatContainer";
import { useAuth } from "@/contexts/AuthContext";

const ClubLayout = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const { clubs, selectClub, selectedClub } = useClub();
  const { user } = useAuth();
  
  // Select club on mount
  React.useEffect(() => {
    if (clubId) {
      selectClub(clubId);
    }
    
    return () => {
      // Deselect on unmount
      selectClub(null);
    };
  }, [clubId, selectClub]);
  
  // Show loading while fetching club data
  if (!clubId) {
    return <Navigate to="/dashboard" replace />;
  }
  
  const club = clubs.find(c => c.id === clubId);
  
  if (!club) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Check if user is a member
  const isMember = club.members.some(m => m.userId === user?.id);
  if (!isMember) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 border-r bg-sidebar h-screen flex flex-col">
        <div className="h-14 px-4 flex items-center border-b ">
          <h2 className="font-bold p-2 ">{club.name}</h2>
        </div>
        
        <ChannelList club={club} />
      </div>
      
      {/* Main chat area */}
      <ChatContainer />
      
      {/* Members sidebar */}
      <MemberList members={club.members} />
    </div>
  );
};

export default ClubLayout;
