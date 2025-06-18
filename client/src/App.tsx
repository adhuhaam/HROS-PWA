import { useState, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { LoadingOverlay } from "@/components/loading-overlay";
import { BottomNavigation } from "@/components/bottom-navigation";

// Pages
import { LoginPage } from "@/pages/login";
import { DashboardPage } from "@/pages/dashboard";
import { AttendancePage } from "@/pages/attendance";
import { LeavePage } from "@/pages/leave";
import { PayrollPage } from "@/pages/payroll";
import { DocumentsPage } from "@/pages/documents";
import { ProfilePage } from "@/pages/profile";

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setIsLoggedIn(true);
    }
  }, [isAuthenticated]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentPage("dashboard");
    // Invalidate and refetch user data
    queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage("dashboard");
    queryClient.clear();
  };

  const handleNavigation = (page: string) => {
    setCurrentPage(page);
  };

  const handleBack = () => {
    setCurrentPage("dashboard");
  };

  // Show loading while checking authentication
  if (isLoading) {
    return <LoadingOverlay isVisible={true} message="Loading..." />;
  }

  // Show login if not authenticated
  if (!isAuthenticated && !isLoggedIn) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Main app content
  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative">
      {currentPage === "dashboard" && (
        <DashboardPage onNavigate={handleNavigation} />
      )}
      {currentPage === "attendance" && (
        <AttendancePage onBack={handleBack} />
      )}
      {currentPage === "leave" && (
        <LeavePage onBack={handleBack} />
      )}
      {currentPage === "payroll" && (
        <PayrollPage onBack={handleBack} />
      )}
      {currentPage === "documents" && (
        <DocumentsPage onBack={handleBack} />
      )}
      {currentPage === "profile" && (
        <ProfilePage onBack={handleBack} onLogout={handleLogout} />
      )}
      
      {/* Bottom Navigation */}
      <BottomNavigation 
        activeTab={currentPage} 
        onTabChange={setCurrentPage} 
      />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
