
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import AuthFormContainer from "./AuthFormContainer";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real application, this would send a reset link
      // For this mock version, we'll simulate a successful request
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSent(true);
      toast({
        title: "Check your email",
        description: "We've sent you instructions to reset your password.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reset instructions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthFormContainer
      title="Reset your password"
      description="Enter your email address and we'll send you a link to reset your password"
      footer={
        <p>
          Remember your password?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Back to login
          </Link>
        </p>
      }
    >
      {isSent ? (
        <div className="space-y-4">
          <div className="bg-primary/10 text-primary text-sm p-4 rounded-md">
            <p>Password reset email sent!</p>
            <p className="mt-2">
              Please check your email for instructions to reset your password.
            </p>
          </div>
          <Button onClick={() => setIsSent(false)} variant="outline" className="w-full">
            Try again
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              autoComplete="email"
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send reset instructions"}
          </Button>
        </form>
      )}
    </AuthFormContainer>
  );
};

export default ForgotPasswordForm;
