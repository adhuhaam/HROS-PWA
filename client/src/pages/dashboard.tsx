import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { MobileHeader } from "@/components/mobile-header";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  Clock, 
  Calendar, 
  DollarSign,
  Users,
  FileText,
  MessageCircle,
  Clock as UserClock,
  Cake,
  Book,
  Images,
  Building2
} from "lucide-react";

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
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFlipped, setIsFlipped] = useState(false);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    retry: false,
  });

  const { data: employee } = useQuery({
    queryKey: ["/api/employee/details"],
    retry: false,
  });

  // Get actual notices and holidays from API
  const { data: notices = [] } = useQuery({
    queryKey: ["/api/notices"],
    retry: false,
  });

  const { data: holidays = [] } = useQuery({
    queryKey: ["/api/holidays"],
    retry: false,
  });

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const dashboardStats: DashboardStats = stats || {
    todayStatus: "Not Checked In",
    leaveBalance: "0 Days",
    monthlyAttendance: "0/22 Days",
    isCheckedIn: false
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MobileHeader 
        title="Dashboard" 
        showNotifications={true}
        user={user ? {
          name: user.name || user.staff_name || "Employee",
          employeeId: user.employeeId || user.emp_no || ""
        } : undefined}
      />
      
      <div className="px-5 pb-20 pt-4 space-y-6">
        {/* Animated Employee ID Card */}
        <div className="flex items-center justify-center min-h-[280px] w-full overflow-visible">
          <div 
            className="w-full max-w-[450px] h-[250px] relative cursor-pointer"
            onClick={flipCard}
            style={{ perspective: '2000px' }}
          >
            {/* Front Side */}
            <div 
              className={`absolute w-full h-full backface-hidden rounded-[15px] transition-transform duration-600 ease-in-out shadow-2xl ${
                isFlipped ? 'rotate-y-180' : 'rotate-y-0'
              }`}
              style={{
                background: 'linear-gradient(135deg, #006bad 0%, #050027 25%, #004069 50%, #006bad 75%, #050027 100%)',
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Background overlay */}
              <div className="absolute inset-0 rounded-[15px] overflow-hidden">
                <div 
                  className="absolute inset-0 opacity-70 bg-cover bg-center rounded-[15px]"
                  style={{
                    backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDQwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiBmaWxsPSJ1cmwoI2dyYWRpZW50KSIvPgo8ZGVmcz4KPGZ1Y2lhbEdyYWRpZW50IGlkPSJncmFkaWVudCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMwMDZiYWQiIHN0b3Atb3BhY2l0eT0iMC4zIi8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzA1MDAyNyIgc3RvcC1vcGFjaXR5PSIwLjMiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K)',
                    mixBlendMode: 'multiply'
                  }}
                />
                <div 
                  className="absolute inset-0 rounded-[15px]"
                  style={{
                    background: 'rgba(1, 40, 88, 0.31)',
                    borderTop: '0.9px solid rgba(13, 122, 223, 0.1)'
                  }}
                />
              </div>

              {/* Top Row with photo + logo */}
              <div className="flex justify-between items-start px-3 pt-3">
                <div className="flex items-start justify-start">
                  {employee?.photo_file_name ? (
                    <img
                      src={`https://hros.rccmaldives.com/assets/document/${employee.photo_file_name}`}
                      className="w-[100px] h-[120px] object-contain opacity-80 mt-1 ml-1 rounded-[10px] mix-blend-luminosity"
                      alt="Employee"
                    />
                  ) : (
                    <Users className="w-15 h-15 text-white opacity-80" />
                  )}
                </div>
                <div className="flex items-start justify-end">
                  <Building2 className="w-12 h-12 text-white opacity-90" />
                </div>
              </div>

              {/* Bottom Info */}
              <div className="absolute bottom-4 left-0 right-0 px-5 flex justify-between items-end">
                <div className="flex-1 flex flex-col justify-end items-start">
                  <h3 className="text-white text-base font-normal uppercase">
                    {employee?.name || user?.staff_name || user?.name || "Employee"}
                  </h3>
                  <p className="text-gray-300 text-[10px] font-normal uppercase">
                    {employee?.designation || 'Employee'} -- {employee?.department || 'Department'}
                  </p>
                  <div className="h-px w-3/4 bg-white/30 my-1" />
                  <p className="text-gray-300 text-[10px] font-normal uppercase">
                    M- {employee?.contact_number || 'N/A'} ---- E- {employee?.emp_email || 'N/A'}
                  </p>
                </div>
                <div className="flex flex-col justify-end items-end">
                  <p className="text-white text-[11px] font-light text-right mb-2">
                    Emp No
                  </p>
                  <p className="text-white text-xl font-semibold uppercase text-right">
                    {employee?.emp_no || user?.emp_no || user?.employeeId || "0000"}
                  </p>
                </div>
              </div>
            </div>

            {/* Back Side */}
            <div 
              className={`absolute w-full h-full backface-hidden rounded-[15px] transition-transform duration-600 ease-in-out shadow-2xl ${
                isFlipped ? 'rotate-y-0' : 'rotate-y-180'
              }`}
              style={{
                background: 'linear-gradient(225deg, #006bad 0%, #000024 25%, #006bad 50%, #000028 75%, #006bad 100%)',
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Background overlay */}
              <div className="absolute inset-0 rounded-[15px] overflow-hidden">
                <div 
                  className="absolute inset-0 opacity-70 bg-cover bg-center rounded-[15px]"
                  style={{
                    backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDQwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiBmaWxsPSJ1cmwoI2dyYWRpZW50KSIvPgo8ZGVmcz4KPGZ1Y2lhbEdyYWRpZW50IGlkPSJncmFkaWVudCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMwMDZiYWQiIHN0b3Atb3BhY2l0eT0iMC4zIi8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzA1MDAyNyIgc3RvcC1vcGFjaXR5PSIwLjMiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K)',
                    mixBlendMode: 'multiply'
                  }}
                />
                <Building2 className="absolute right-24 top-14 w-[150px] h-8 text-white opacity-20 mix-blend-difference" />
                <div 
                  className="absolute inset-0 rounded-[15px]"
                  style={{
                    background: 'rgba(1, 40, 88, 0.31)',
                    borderTop: '0.9px solid rgba(13, 122, 223, 0.1)'
                  }}
                />
              </div>
              
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-white">
                  <Building2 className="w-16 h-16 mx-auto mb-4 opacity-60" />
                  <p className="text-sm font-light">RCC Maldives</p>
                  <p className="text-xs opacity-75">Employee Self Service</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access Grid */}
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => onNavigate("attendance")}
            className="aspect-square bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col items-center justify-center space-y-2 hover:shadow-xl transition-shadow"
          >
            <Clock className="w-9 h-9 text-[#006bad]" />
            <span className="text-xs font-semibold text-gray-900 dark:text-white text-center">Attendance</span>
          </button>
          
          <button
            onClick={() => onNavigate("leave")}
            className="aspect-square bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col items-center justify-center space-y-2 hover:shadow-xl transition-shadow"
          >
            <Calendar className="w-9 h-9 text-[#006bad]" />
            <span className="text-xs font-semibold text-gray-900 dark:text-white text-center">Leave</span>
          </button>
          
          <button
            onClick={() => onNavigate("profile")}
            className="aspect-square bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col items-center justify-center space-y-2 hover:shadow-xl transition-shadow"
          >
            <Users className="w-9 h-9 text-[#006bad]" />
            <span className="text-xs font-semibold text-gray-900 dark:text-white text-center">Profile</span>
          </button>
          
          <button
            onClick={() => onNavigate("payroll")}
            className="aspect-square bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col items-center justify-center space-y-2 hover:shadow-xl transition-shadow"
          >
            <DollarSign className="w-9 h-9 text-[#006bad]" />
            <span className="text-xs font-semibold text-gray-900 dark:text-white text-center">Payroll</span>
          </button>
          
          <button
            onClick={() => window.open('https://chat.rccmaldives.com', '_blank')}
            className="aspect-square bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col items-center justify-center space-y-2 hover:shadow-xl transition-shadow"
          >
            <MessageCircle className="w-9 h-9 text-[#006bad]" />
            <span className="text-xs font-semibold text-gray-900 dark:text-white text-center">Chat</span>
          </button>
          
          <button
            onClick={() => window.open('https://ot.rccmaldives.com', '_blank')}
            className="aspect-square bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col items-center justify-center space-y-2 hover:shadow-xl transition-shadow"
          >
            <UserClock className="w-9 h-9 text-[#006bad]" />
            <span className="text-xs font-semibold text-gray-900 dark:text-white text-center">OT</span>
          </button>
          
          <button
            onClick={() => window.open('https://birthday.rccmaldives.com', '_blank')}
            className="aspect-square bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col items-center justify-center space-y-2 hover:shadow-xl transition-shadow"
          >
            <Cake className="w-9 h-9 text-[#006bad]" />
            <span className="text-xs font-semibold text-gray-900 dark:text-white text-center">Birthday</span>
          </button>
          
          <button
            onClick={() => window.open('https://handbook.rccmaldives.com', '_blank')}
            className="aspect-square bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col items-center justify-center space-y-2 hover:shadow-xl transition-shadow"
          >
            <Book className="w-9 h-9 text-[#006bad]" />
            <span className="text-xs font-semibold text-gray-900 dark:text-white text-center">Handbook</span>
          </button>
          
          <button
            onClick={() => onNavigate("documents")}
            className="aspect-square bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col items-center justify-center space-y-2 hover:shadow-xl transition-shadow"
          >
            <Images className="w-9 h-9 text-[#006bad]" />
            <span className="text-xs font-semibold text-gray-900 dark:text-white text-center">Documents</span>
          </button>
        </div>

        {/* Announcements */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            📣 Announcements
          </h2>
          {notices.length === 0 ? (
            <p className="text-sm text-gray-500">No announcements</p>
          ) : (
            <div className="space-y-2">
              {notices.map((notice: any) => (
                <div 
                  key={notice.id} 
                  className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg border-l-6 border-l-[#006bad]"
                >
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-0">
                    {notice.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {notice.content}
                  </p>
                  <p className="text-xs text-gray-400 mt-0">
                    {notice.created_at}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Holidays */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            🎉 Holidays
          </h2>
          {holidays.length === 0 ? (
            <p className="text-sm text-gray-500">No holidays</p>
          ) : (
            <div className="space-y-2">
              {holidays
                .sort((a: any, b: any) => new Date(a.holiday_date).getTime() - new Date(b.holiday_date).getTime())
                .map((holiday: any) => {
                  const isPast = new Date(holiday.holiday_date) < new Date();
                  return (
                    <div 
                      key={holiday.id} 
                      className={`p-2 rounded-lg shadow-lg border-l-6 ${
                        isPast 
                          ? 'bg-red-50 border-l-red-300' 
                          : 'bg-white dark:bg-gray-800 border-l-[#006bad]'
                      }`}
                    >
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                        {holiday.holiday_name}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {holiday.holiday_date}
                      </p>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}