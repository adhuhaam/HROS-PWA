import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MobileHeader } from "@/components/mobile-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { 
  IdCard, 
  Mail, 
  Phone, 
  Calendar, 
  Bell, 
  Shield, 
  LogOut 
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ProfilePageProps {
  onBack: () => void;
  onLogout: () => void;
}

export function ProfilePage({ onBack, onLogout }: ProfilePageProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      queryClient.clear();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
      onLogout();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (!user) return null;

  const profileInfo = [
    {
      icon: <IdCard className="text-gray-400 w-5 h-5" />,
      label: "Employee ID",
      value: user.employeeId,
    },
    {
      icon: <Mail className="text-gray-400 w-5 h-5" />,
      label: "Email",
      value: user.email,
    },
    {
      icon: <Phone className="text-gray-400 w-5 h-5" />,
      label: "Phone",
      value: user.phone || "Not provided",
    },
    {
      icon: <Calendar className="text-gray-400 w-5 h-5" />,
      label: "Join Date",
      value: user.joinDate ? new Date(user.joinDate).toLocaleDateString() : "Not available",
    },
  ];

  const settingsOptions = [
    {
      icon: <Bell className="text-gray-600 w-5 h-5" />,
      label: "Notifications",
      action: () => {},
    },
    {
      icon: <Shield className="text-gray-600 w-5 h-5" />,
      label: "Privacy & Security",
      action: () => {},
    },
  ];

  return (
    <div className="min-h-screen pb-20">
      <MobileHeader title="Profile" onBack={onBack} />
      
      {/* Profile Header */}
      <div className="px-6 py-6">
        <Card className="shadow-sm border text-center">
          <CardContent className="p-6">
            <img 
              src={user.profileImageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"}
              alt="Profile"
              className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
            />
            <h2 className="text-xl font-bold text-gray-900 mb-1">{user.name}</h2>
            <p className="text-gray-600 mb-2">{user.position || "Employee"}</p>
            <p className="text-sm text-gray-500">{user.department || "Department"}</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Profile Information */}
      <div className="px-6 space-y-4">
        {profileInfo.map((info, index) => (
          <Card key={index} className="shadow-sm border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{info.label}</p>
                  <p className="font-medium text-gray-900">{info.value}</p>
                </div>
                {info.icon}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Settings Options */}
        <div className="pt-4 space-y-2">
          {settingsOptions.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={option.action}
              className="w-full bg-white rounded-xl p-4 shadow-sm border flex items-center justify-between hover:bg-gray-50 transition-colors h-auto"
            >
              <div className="flex items-center space-x-3">
                {option.icon}
                <span className="font-medium text-gray-900">{option.label}</span>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          ))}
          
          <Button
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="w-full bg-white rounded-xl p-4 shadow-sm border flex items-center justify-between hover:bg-red-50 transition-colors text-red-600 h-auto"
            variant="outline"
          >
            <div className="flex items-center space-x-3">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">
                {logoutMutation.isPending ? "Logging out..." : "Logout"}
              </span>
            </div>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
