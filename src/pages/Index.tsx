
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col">
        <section className="relative flex flex-col items-center justify-center min-h-[80vh] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 pointer-events-none" />
          
          <div className="container max-w-5xl relative z-10 px-4 py-32 md:py-40 flex flex-col items-center text-center animate-fade-in">
            <div className="space-y-4 mb-10">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
                The ultimate platform for <span className="text-primary">college club</span> management
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Streamline communication, organize events, and build thriving communities with an elegant, purpose-built platform for student organizations.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto">
              <Button asChild size="lg" className="gap-2 w-full">
                <Link to={isAuthenticated ? "/dashboard" : "/register"}>
                  {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              
              {!isAuthenticated && (
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link to="/login">Log in</Link>
                </Button>
              )}
            </div>
          </div>
        </section>
        
        <section className="py-24 bg-muted/30">
          <div className="container px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4">Why choose Clubify?</h2>
              <p className="text-muted-foreground text-lg">
                Built specifically for the unique needs of college clubs and student organizations
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                title="Organized Communication"
                description="Channel-based discussions keep conversations organized and accessible."
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path></svg>
                }
              />
              
              <FeatureCard
                title="Role-Based Management"
                description="Clearly defined roles for admins, officers and members to manage permissions."
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                }
              />
              
              <FeatureCard
                title="Simplified Decisions"
                description="Easy polling system for club decisions and collecting feedback."
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>
                }
              />
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t py-8">
        <div className="container px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Clubify Club Management. All rights reserved.
          </div>
          <div className="mt-4 md:mt-0">
            <Button variant="link" asChild>
              <Link to={isAuthenticated ? "/dashboard" : "/register"}>
                {isAuthenticated ? "Dashboard" : "Get Started"}
              </Link>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

type FeatureCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

const FeatureCard = ({ title, description, icon }: FeatureCardProps) => {
  return (
    <div className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default Index;
