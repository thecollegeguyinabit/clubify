
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Header from "@/components/Header";
import ClubCard from "@/components/clubs/ClubCard";
import { useClub } from "@/contexts/ClubContext";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const { clubs, getUserClubs } = useClub();
  
  const userClubs = getUserClubs();
  const otherClubs = clubs.filter(club => !userClubs.some(uc => uc.id === club.id));
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="container py-8 flex-1 animate-slide-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.name}</h1>
            <p className="text-muted-foreground mt-1">
              Manage your clubs and discover new communities
            </p>
          </div>
          
          <Button asChild>
            <Link to="/create-club" className="flex items-center">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Club
            </Link>
          </Button>
        </div>
        
        {userClubs.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Your Clubs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userClubs.map(club => (
                <ClubCard key={club.id} club={club} />
              ))}
            </div>
          </section>
        )}
        
        <section>
          <h2 className="text-2xl font-bold mb-6">Discover Clubs</h2>
          {otherClubs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherClubs.map(club => (
                <ClubCard key={club.id} club={club} />
              ))}
            </div>
          ) : (
            <div className="bg-card p-8 rounded-lg text-center">
              <h3 className="text-lg font-medium mb-2">No clubs to discover yet</h3>
              <p className="text-muted-foreground mb-6">
                Be the first to create a club and build your community!
              </p>
              <Button asChild>
                <Link to="/create-club">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Club
                </Link>
              </Button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
