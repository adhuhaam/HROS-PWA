import { useQuery } from "@tanstack/react-query";
import { 
  CalendarDaysIcon, 
  ClockIcon, 
  DocumentTextIcon, 
  ArrowTrendingUpIcon, 
  UserIcon, 
  UsersIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationTriangleIcon,
  GiftIcon,
  BriefcaseIcon,
  BellIcon
} from "@heroicons/react/24/outline";
import { MobileHeader } from "@/components/mobile-header";
import { RotatingCard } from "@/components/rotating-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { LoadingOverlay } from "@/components/loading-overlay";
import Lottie from "lottie-react";

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

interface DashboardStats {
  todayStatus: string;
  leaveBalance: string;
  monthlyAttendance: string;
  isCheckedIn: boolean;
}

interface User {
  id: number;
  name: string;
  employeeId: string;
  email: string;
  department?: string;
  position?: string;
}

interface EmployeeDetails {
  emp_no: string;
  name: string;
  designation?: string;
  department?: string;
  contact_number?: string;
  emp_email?: string;
  photo_file_name?: string;
}

interface Notice {
  id: string;
  title: string;
  content: string;
  created_at?: string;
}

interface Holiday {
  id: string;
  holiday_name: string;
  date: string;
  type?: string;
}

const welcomeAnimation = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 90,
  w: 100,
  h: 100,
  nm: "Wave",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Wave Hand",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { 
          a: 1, 
          k: [
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 0, s: [0] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 15, s: [15] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 30, s: [-15] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 45, s: [15] },
            { t: 89, s: [0] }
          ]
        },
        p: { a: 0, k: [50, 50] },
        a: { a: 0, k: [0, 0] },
        s: { a: 0, k: [100, 100] }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "el",
              d: 1,
              s: { a: 0, k: [40, 40] },
              p: { a: 0, k: [0, 0] }
            },
            {
              ty: "fl",
              c: { a: 0, k: [1, 0.8, 0.4, 1] },
              o: { a: 0, k: 100 }
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 }
            }
          ]
        }
      ],
      ip: 0,
      op: 90,
      st: 0,
      bm: 0
    }
  ]
};

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ["/api/auth/user"],
  });

  const { data: employeeDetails, isLoading: detailsLoading } = useQuery<EmployeeDetails>({
    queryKey: ["/api/employee/details"],
    enabled: !!user,
  });

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
    enabled: !!user,
  });

  const { data: notices, isLoading: noticesLoading } = useQuery<Notice[]>({
    queryKey: ["/api/notices"],
    enabled: !!user,
  });

  const { data: holidays, isLoading: holidaysLoading } = useQuery<Holiday[]>({
    queryKey: ["/api/holidays"],
    enabled: !!user,
  });

  if (userLoading) {
    return <LoadingOverlay isVisible={true} message="Loading dashboard..." />;
  }

  const dashboardStats: DashboardStats = stats || {
    todayStatus: "Not Available",
    leaveBalance: "0",
    monthlyAttendance: "0%",
    isCheckedIn: false,
  };

  const userName = employeeDetails?.name || user?.name || "Employee";
  const employeeId = employeeDetails?.emp_no || user?.employeeId || "";

  const getStatusIcon = (status: string) => {
    if (status.includes("Checked In") || status.includes("Present")) {
      return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
    } else if (status.includes("Absent")) {
      return <XCircleIcon className="h-6 w-6 text-red-500" />;
    } else {
      return <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />;
    }
  };

  const getAttendanceColor = (attendance: string) => {
    const value = parseInt(attendance);
    if (value >= 90) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    if (value >= 75) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <MobileHeader
        title=""
        showNotifications={true}
      />

      <div className="px-4 pb-28 pt-4">
        {/* Employee ID Card */}
        <div className="mb-6">
          <RotatingCard
            icon={<UserIcon className="h-8 w-8 text-primary" />}
            title={`Good ${new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}!`}
            value="Employee ID Card"
            bgColor="bg-white/70 dark:bg-black/70 backdrop-blur-xl border border-white/30 dark:border-gray-700/30"
            onClick={() => {}}
            employeeData={employeeDetails ? {
              name: employeeDetails.name,
              employeeId: employeeDetails.emp_no,
              designation: employeeDetails.designation,
              department: employeeDetails.department,
              photoUrl: employeeDetails.photo_file_name
            } : {
              name: userName,
              employeeId: employeeId,
              designation: user?.position || "Employee",
              department: user?.department || "Department"
            }}
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <RotatingCard
            icon={getStatusIcon(dashboardStats.todayStatus)}
            title="Today's Status"
            value={dashboardStats.todayStatus}
            bgColor="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900"
            onClick={() => onNavigate("attendance")}
          />
          
          <RotatingCard
            icon={<CalendarDaysIcon className="h-6 w-6 text-primary" />}
            title="Leave Balance"
            value={`${dashboardStats.leaveBalance} days`}
            bgColor="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900"
            onClick={() => onNavigate("leave")}
          />
          
          <RotatingCard
            icon={<ArrowTrendingUpIcon className="h-6 w-6 text-primary" />}
            title="Attendance"
            value={dashboardStats.monthlyAttendance}
            bgColor="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900"
            onClick={() => onNavigate("attendance")}
          />
          
          <RotatingCard
            icon={<BriefcaseIcon className="h-6 w-6 text-primary" />}
            title="Payroll"
            value="View Details"
            bgColor="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900"
            onClick={() => onNavigate("payroll")}
          />
        </div>

        {/* Quick Actions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => onNavigate("attendance")}
              >
                <ClockIcon className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium">Check In/Out</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => onNavigate("leave")}
              >
                <CalendarDaysIcon className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium">Apply Leave</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => onNavigate("documents")}
              >
                <DocumentTextIcon className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium">Documents</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => onNavigate("profile")}
              >
                <UserIcon className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium">Profile</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notices */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BellIcon className="h-5 w-5" />
              Latest Notices
            </CardTitle>
          </CardHeader>
          <CardContent>
            {noticesLoading ? (
              <div className="flex justify-center py-4">
                <LoadingOverlay isVisible={true} variant="pulse" message="Loading notices..." />
              </div>
            ) : notices && notices.length > 0 ? (
              <ScrollArea className="h-32">
                <div className="space-y-3">
                  {notices.slice(0, 3).map((notice) => (
                    <div
                      key={notice.id}
                      className="p-3 bg-muted/50 rounded-lg border border-border/50"
                    >
                      <h4 className="font-medium text-sm text-foreground">{notice.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {notice.content}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <p className="text-center text-muted-foreground py-4">No notices available</p>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Holidays */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GiftIcon className="h-5 w-5" />
              Upcoming Holidays
            </CardTitle>
          </CardHeader>
          <CardContent>
            {holidaysLoading ? (
              <div className="flex justify-center py-4">
                <LoadingOverlay isVisible={true} variant="pulse" message="Loading holidays..." />
              </div>
            ) : holidays && holidays.length > 0 ? (
              <ScrollArea className="h-32">
                <div className="space-y-3">
                  {holidays.slice(0, 3).map((holiday) => (
                    <div
                      key={holiday.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border/50"
                    >
                      <div>
                        <h4 className="font-medium text-sm text-foreground">{holiday.holiday_name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {new Date(holiday.date).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {holiday.type || "Holiday"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <p className="text-center text-muted-foreground py-4">No upcoming holidays</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}