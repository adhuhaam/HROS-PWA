import { useQuery } from "@tanstack/react-query";
import { MobileHeader } from "@/components/mobile-header";
import { RotatingCard } from "@/components/rotating-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Calendar, Clock, UserCheck, CalendarPlus, FileText, Folder } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

interface DashboardStats {
  todayStatus: string;
  leaveBalance: string;
  monthlyAttendance: string;
  isCheckedIn: boolean;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { user } = useAuth();
  
  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const quickActions = [
    {
      title: "Attendance",
      icon: <UserCheck className="text-green-600 w-6 h-6" />,
      bgColor: "bg-green-100",
      action: () => onNavigate("attendance")
    },
    {
      title: "Apply Leave",
      icon: <CalendarPlus className="text-hros-blue w-6 h-6" />,
      bgColor: "bg-blue-100",
      action: () => onNavigate("leave")
    },
    {
      title: "Payroll",
      icon: <FileText className="text-purple-600 w-6 h-6" />,
      bgColor: "bg-purple-100",
      action: () => onNavigate("payroll")
    },
    {
      title: "Documents",
      icon: <Folder className="text-indigo-600 w-6 h-6" />,
      bgColor: "bg-indigo-100",
      action: () => onNavigate("documents")
    }
  ];

  const recentActivities = [
    {
      icon: <Check className="text-green-600 w-4 h-4" />,
      title: "Check-in recorded",
      time: "Today at 9:00 AM",
      bgColor: "bg-green-100"
    },
    {
      icon: <Calendar className="text-hros-blue w-4 h-4" />,
      title: "Leave approved",
      time: "Yesterday",
      bgColor: "bg-blue-100"
    }
  ];

  return (
    <div className="min-h-screen pb-20">
      <MobileHeader
        title="Dashboard"
        showNotifications={true}
        user={user ? { name: user.name, employeeId: user.employeeId } : undefined}
      />
      
      {/* Quick Stats Cards */}
      <div className="px-6 py-6 space-y-4">
        <RotatingCard
          icon={<Check className="text-green-600 w-6 h-6" />}
          title="Today's Status"
          value={stats?.todayStatus || "Loading..."}
          bgColor="bg-green-100"
        />
        
        <RotatingCard
          icon={<Calendar className="text-hros-blue w-6 h-6" />}
          title="Leave Balance"
          value={stats?.leaveBalance || "Loading..."}
          bgColor="bg-blue-100"
        />
        
        <RotatingCard
          icon={<Clock className="text-orange-600 w-6 h-6" />}
          title="This Month"
          value={stats?.monthlyAttendance || "Loading..."}
          bgColor="bg-orange-100"
        />
      </div>
      
      {/* Quick Actions */}
      <div className="px-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={action.action}
              className="bg-white rounded-2xl p-6 shadow-sm border text-center hover:shadow-md transition-shadow h-auto flex-col space-y-3"
            >
              <div className={`w-12 h-12 ${action.bgColor} rounded-xl flex items-center justify-center`}>
                {action.icon}
              </div>
              <p className="font-medium text-gray-900">{action.title}</p>
            </Button>
          ))}
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="px-6 py-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {recentActivities.map((activity, index) => (
            <Card key={index} className="shadow-sm border">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 ${activity.bgColor} rounded-full flex items-center justify-center`}>
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
