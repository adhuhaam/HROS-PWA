import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Clock, Calendar, CheckCircle, XCircle, Clock3, Clock9, TrendingUp } from "lucide-react";
import { MobileHeader } from "@/components/mobile-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingOverlay } from "@/components/loading-overlay";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLanguage } from "@/contexts/LanguageContext";

interface AttendancePageProps {
  onBack: () => void;
}

interface AttendanceRecord {
  id: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: string;
  hoursWorked?: number;
}

interface TodayAttendance {
  hasCheckedIn: boolean;
  checkInTime?: string;
  hasCheckedOut: boolean;
  checkOutTime?: string;
  status: string;
}

export function AttendancePage({ onBack }: AttendancePageProps) {
  const [activeTab, setActiveTab] = useState("today");
  const { toast } = useToast();
  const { t } = useLanguage();

  const { data: todayAttendance, isLoading: todayLoading } = useQuery<TodayAttendance>({
    queryKey: ["/api/attendance/today"],
  });

  const { data: attendanceRecords, isLoading: recordsLoading } = useQuery<AttendanceRecord[]>({
    queryKey: ["/api/attendance/records"],
  });

  const checkInMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/attendance/checkin", {});
    },
    onSuccess: () => {
      toast({
        title: "Check-in successful!",
        description: "Your attendance has been recorded.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/attendance/today"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Check-in failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const checkOutMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/attendance/checkout", {});
    },
    onSuccess: () => {
      toast({
        title: "Check-out successful!",
        description: "Have a great day!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/attendance/today"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Check-out failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'present':
        return <span className="ios-badge ios-badge-green">Present</span>;
      case 'absent':
        return <span className="ios-badge ios-badge-red">Absent</span>;
      case 'late':
        return <span className="ios-badge ios-badge-yellow">Late</span>;
      default:
        return <span className="ios-badge" style={{ background: 'rgba(142, 142, 147, 0.15)', color: 'rgba(142, 142, 147, 1)' }}>{status}</span>;
    }
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return "--:--";
    return new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (todayLoading) {
    return <LoadingOverlay isVisible={true} message="Loading attendance..." />;
  }

  return (
    <div className="min-h-screen" style={{ background: '#f2f2f7' }}>
      <MobileHeader 
        title="Attendance" 
        onBack={onBack}
        showNotifications={true}
      />

      <div className="px-4 pb-28 space-y-4 pt-4">
        {/* Today's Status Card */}
        <div className="ios-card">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white" style={{ fontWeight: 600, letterSpacing: '-0.022em' }}>
                  Today's Attendance
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {new Date().toLocaleDateString([], { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              {getStatusBadge(todayAttendance?.status || 'Not Checked In')}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {/* Check In */}
              <div className="ios-list-item p-4">
                <div className="text-center">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Clock9 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Check In</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white" style={{ fontWeight: 600, letterSpacing: '-0.022em' }}>
                    {formatTime(todayAttendance?.checkInTime)}
                  </p>
                </div>
              </div>

              {/* Check Out */}
              <div className="ios-list-item p-4">
                <div className="text-center">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Clock3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Check Out</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white" style={{ fontWeight: 600, letterSpacing: '-0.022em' }}>
                    {formatTime(todayAttendance?.checkOutTime)}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {!todayAttendance?.hasCheckedIn ? (
                <button
                  onClick={() => checkInMutation.mutate()}
                  disabled={checkInMutation.isPending}
                  className="w-full ios-button py-4 px-6 text-lg font-semibold"
                  style={{ background: 'rgba(52, 199, 89, 1)' }}
                >
                  {checkInMutation.isPending ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Checking In...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Check In
                    </div>
                  )}
                </button>
              ) : !todayAttendance?.hasCheckedOut ? (
                <button
                  onClick={() => checkOutMutation.mutate()}
                  disabled={checkOutMutation.isPending}
                  className="w-full ios-button py-4 px-6 text-lg font-semibold"
                  style={{ background: 'rgba(0, 122, 255, 1)' }}
                >
                  {checkOutMutation.isPending ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Checking Out...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <XCircle className="h-5 w-5" />
                      Check Out
                    </div>
                  )}
                </button>
              ) : (
                <div className="ios-list-item p-4 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-lg font-semibold text-green-600 dark:text-green-400" style={{ fontWeight: 600, letterSpacing: '-0.022em' }}>
                      All done for today!
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Attendance Records */}
        <div className="ios-card">
          <div className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="ios-nav grid w-full grid-cols-2 p-1 mb-6">
                <TabsTrigger value="today" className="text-sm font-medium py-2 px-4 rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">
                  Today
                </TabsTrigger>
                <TabsTrigger value="history" className="text-sm font-medium py-2 px-4 rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">
                  History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="today" className="space-y-3 mt-0">
                {todayAttendance ? (
                  <div className="ios-list-item p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white" style={{ fontWeight: 600, letterSpacing: '-0.022em' }}>
                            Today
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(new Date().toISOString())}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(todayAttendance.status)}
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">In: </span>
                        <span className="font-semibold text-gray-900 dark:text-white">{formatTime(todayAttendance.checkInTime)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Out: </span>
                        <span className="font-semibold text-gray-900 dark:text-white">{formatTime(todayAttendance.checkOutTime)}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="ios-list-item p-6 text-center">
                    <p className="text-gray-500 dark:text-gray-400">No attendance record for today</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="history" className="space-y-3 mt-0">
                {recordsLoading ? (
                  <div className="ios-list-item p-6 text-center">
                    <div className="w-6 h-6 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-gray-500 dark:text-gray-400">Loading records...</p>
                  </div>
                ) : attendanceRecords && attendanceRecords.length > 0 ? (
                  <div className="space-y-3">
                    {attendanceRecords.slice(0, 10).map((record) => (
                      <div key={record.id} className="ios-list-item p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                              <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            </div>
                            <div>
                              <p className="text-lg font-semibold text-gray-900 dark:text-white" style={{ fontWeight: 600, letterSpacing: '-0.022em' }}>
                                {formatDate(record.date)}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {record.hoursWorked ? `${record.hoursWorked}h worked` : 'Hours not calculated'}
                              </p>
                            </div>
                          </div>
                          {getStatusBadge(record.status)}
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">In: </span>
                            <span className="font-semibold text-gray-900 dark:text-white">{formatTime(record.checkIn)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Out: </span>
                            <span className="font-semibold text-gray-900 dark:text-white">{formatTime(record.checkOut)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="ios-list-item p-6 text-center">
                    <TrendingUp className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">No attendance records found</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}