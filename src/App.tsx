
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings"; "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import CreateClub from "./pages/CreateClub";
import Club from "./pages/Club";
import { AuthProvider } from "./contexts/AuthContext";
import { ClubProvider } from "./contexts/ClubContext";
import AuthProtected from "./components/layout/AuthProtected";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ClubProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route 
                path="/dashboard" 
                element={
                  <AuthProtected>
                    <Dashboard />
                  </AuthProtected>
                } 
              />
              <Route 
                path="/create-club" 
                element={
                  <AuthProtected>
                    <CreateClub />
                  </AuthProtected>
                } 
              />
              <Route 
                path="/clubs/:clubId/*" 
                element={
                  <AuthProtected>
                    <Club />
                  </AuthProtected>
                } 
              />
              {/* Catch-all route for 404 */}
              <Route path="*" element={<NotFound />} />
              <Route path="/settings" element={<Settings />} />
</Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ClubProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
