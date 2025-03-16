
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import Header from "@/components/Header";

const ForgotPassword = () => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <ForgotPasswordForm />
    </div>
  );
};

export default ForgotPassword;
