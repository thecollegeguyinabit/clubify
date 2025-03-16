
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useClub, Club } from "@/contexts/ClubContext";
import { useAuth } from "@/contexts/AuthContext";
import Avatar from "../Avatar";

type ClubCardProps = {
  club: Club;
};

const ClubCard = ({ club }: ClubCardProps) => {
  const { joinClub } = useClub();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const isUserMember = club.members.some(member => member.userId === user?.id);
  const memberCount = club.members.length;
  const channelCount = club.channels.length;

  const handleJoinClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isUserMember) {
      try {
        await joinClub(club.id);
        navigate(`/clubs/${club.id}`);
      } catch (error) {
        // Error is handled by the context toast
      }
    } else {
      navigate(`/clubs/${club.id}`);
    }
  };

  const handleCardClick = () => {
    if (isUserMember) {
      navigate(`/clubs/${club.id}`);
    }
  };

  return (
    <Card 
      className={`overflow-hidden transition-all duration-300 hover:shadow-md ${isUserMember ? "cursor-pointer" : ""}`}
      onClick={isUserMember ? handleCardClick : undefined}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-4">
          <Avatar 
            src={club.avatar} 
            alt={club.name} 
            size="lg" 
            className="border-2 border-border"
          />
          <div>
            <CardTitle className="text-xl tracking-tight">{club.name}</CardTitle>
            <CardDescription className="text-sm flex items-center gap-2">
              <span>{memberCount} {memberCount === 1 ? "member" : "members"}</span>
              <span className="text-xs">•</span>
              <span>{channelCount} {channelCount === 1 ? "channel" : "channels"}</span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="text-sm">
        <p className="line-clamp-2">{club.description}</p>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleJoinClick} 
          variant={isUserMember ? "secondary" : "default"}
          className="w-full mt-2"
        >
          {isUserMember ? "Open" : "Join Club"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ClubCard;
