
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "member" | "moderator";
  avatar?: string;
  college?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data storage
const USERS_STORAGE_KEY = "club-collab-users";
const CURRENT_USER_KEY = "club-collab-current-user";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Get existing users or initialize empty array
      const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
      const users = usersJson ? JSON.parse(usersJson) : [];
      
      // Check if email is already registered
      if (users.some((u: any) => u.email === email)) {
        throw new Error("Email already registered");
      }
      
      // Create new user
      const newUser: User = {
        id: crypto.randomUUID(),
        name,
        email,
        role: "member", // Default role
        // We're storing the password in this example, but in a real app you'd hash it
        // and never store plaintext passwords
      };
      
      // Store password separately - this is just for the example
      const userWithPassword = { ...newUser, password };
      
      // Add to users array
      users.push(userWithPassword);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      
      // Log the user in
      const { password: _, ...userWithoutPassword } = userWithPassword;
      setUser(userWithoutPassword);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Account created!",
        description: "You've been successfully registered.",
      });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Get users from storage
      const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
      if (!usersJson) {
        throw new Error("Invalid credentials");
      }
      
      const users = JSON.parse(usersJson);
      const user = users.find((u: any) => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error("Invalid credentials");
      }
      
      // Remove password before storing in state
      const { password: _, ...userWithoutPassword } = user;
      
      // Update state and storage
      setUser(userWithoutPassword);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Welcome back!",
        description: `You're logged in as ${user.name}`,
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    
    try {
      // Get users from storage
      const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
      if (!usersJson) {
        // In a real app, we might not want to reveal if the email exists
        // But for demo purposes, we'll show an error
        throw new Error("Email not found");
      }
      
      const users = JSON.parse(usersJson);
      const user = users.find((u: any) => u.email === email);
      
      if (!user) {
        // Same as above - in a real app, we might want to still return success
        throw new Error("Email not found");
      }
      
      // In a real app, this would send a reset email
      // For this mock, we'll just simulate success
      
      // We could generate a reset token, store it, and use it to validate reset requests
      // But for this demo we'll skip that part
      
      return;
    } catch (error: any) {
      // In a real app, we would probably not throw an error to avoid revealing
      // if an email exists in the system
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        register,
        login,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
