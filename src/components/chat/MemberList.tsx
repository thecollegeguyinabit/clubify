
import React from "react";
import { Crown, Shield, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Avatar from "../Avatar";
import { ClubMember } from "@/contexts/ClubContext";

type MemberListProps = {
  members: ClubMember[];
};

const MemberList = ({ members }: MemberListProps) => {
  // Group members by role
  const adminMembers = members.filter(member => member.role === "admin");
  const moderatorMembers = members.filter(member => member.role === "moderator");
  const regularMembers = members.filter(member => member.role === "member");
  
  return (
    <div className="w-60 hidden md:block border-l h-screen">
      <h3 className="px-3 h-14 flex items-center font-semibold border-b">
        Members - {members.length}
      </h3>
      
      <ScrollArea className="h-[calc(100vh-3.5rem)]">
        <div className="px-3 py-2">
          {adminMembers.length > 0 && (
            <MemberGroup 
              title="Admins" 
              members={adminMembers} 
              icon={<Crown className="h-3 w-3 text-amber-500" />} 
            />
          )}
          
          {moderatorMembers.length > 0 && (
            <>
              <Separator className="my-2" />
              <MemberGroup 
                title="Moderators" 
                members={moderatorMembers} 
                icon={<Shield className="h-3 w-3 text-indigo-500" />} 
              />
            </>
          )}
          
          {regularMembers.length > 0 && (
            <>
              <Separator className="my-2" />
              <MemberGroup 
                title="Members" 
                members={regularMembers} 
                icon={<User className="h-3 w-3 text-muted-foreground" />} 
              />
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

type MemberGroupProps = {
  title: string;
  members: ClubMember[];
  icon: React.ReactNode;
};

const MemberGroup = ({ title, members, icon }: MemberGroupProps) => {
  return (
    <div>
      <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
        {icon}
        <span>{title}</span>
      </h4>
      
      <div className="space-y-1">
        {members.map(member => (
          <div key={member.userId} className="flex items-center gap-2 py-1 px-1.5 rounded-md hover:bg-muted/50">
            <Avatar
              src={member.avatar}
              alt={member.name}
              size="sm"
            />
            <span className="text-sm truncate">{member.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberList;
