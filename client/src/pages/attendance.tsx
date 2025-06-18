import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Clock, Calendar, CheckCircle, XCircle, MapPin, Clock3, Clock9, TrendingUp } from "lucide-react";
import { MobileHeader } from "@/components/mobile-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingOverlay } from "@/components/loading-overlay";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Lottie from "lottie-react";

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

const checkInAnimation = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 60,
  w: 100,
  h: 100,
  nm: "Check In",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Check",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [50, 50] },
        a: { a: 0, k: [0, 0] },
        s: { 
          a: 1,
          k: [
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 0, s: [0, 0] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 20, s: [120, 120] },
            { t: 59, s: [100, 100] }
          ]
        }
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
              c: { a: 0, k: [0.2, 0.8, 0.4, 1] },
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
      op: 60,
      st: 0,
      bm: 0
    }
  ]
};

export function AttendancePage({ onBack }: AttendancePageProps) {
  const [activeTab, setActiveTab] = useState("today");
  const { toast } = useToast();

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
        return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Present</Badge>;
      case 'absent':
        return <Badge variant="destructive">Absent</Badge>;
      case 'late':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Late</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
    <div className="min-h-screen bg-background">
      <MobileHeader 
        title="Attendance" 
        onBack={onBack}
        showNotifications={true}
      />

      <div className="px-3 pb-20 space-y-4">
        {/* Today's Status Card */}
        <Card className="catalyst-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Today's Attendance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString([], { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              {getStatusBadge(todayAttendance?.status || 'Not Checked In')}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Check In */}
              <div className="glass-card p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <Clock9 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Check In</p>
                    <p className="text-sm font-medium">
                      {formatTime(todayAttendance?.checkInTime)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Check Out */}
              <div className="glass-card p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <Clock3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Check Out</p>
                    <p className="text-sm font-medium">
                      {formatTime(todayAttendance?.checkOutTime)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {!todayAttendance?.hasCheckedIn ? (
                <Button
                  onClick={() => checkInMutation.mutate()}
                  disabled={checkInMutation.isPending}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  {checkInMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Checking In...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Check In
                    </div>
                  )}
                </Button>
              ) : !todayAttendance?.hasCheckedOut ? (
                <Button
                  onClick={() => checkOutMutation.mutate()}
                  disabled={checkOutMutation.isPending}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {checkOutMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Checking Out...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4" />
                      Check Out
                    </div>
                  )}
                </Button>
              ) : (
                <div className="flex-1 glass-card p-3 rounded-lg text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-6 h-6">
                      <Lottie
                        animationData={checkInAnimation}
                        loop={false}
                        autoplay={true}
                        style={{ width: "100%", height: "100%" }}
                      />
                    </div>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      All done for today!
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Attendance Records */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 glass-nav">
            <TabsTrigger value="today" className="text-xs">Today</TabsTrigger>
            <TabsTrigger value="history" className="text-xs">History</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-3 mt-4">
            {todayAttendance ? (
              <Card className="catalyst-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Today</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(new Date().toISOString())}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(todayAttendance.status)}
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-muted-foreground">In: </span>
                      <span className="font-medium">{formatTime(todayAttendance.checkInTime)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Out: </span>
                      <span className="font-medium">{formatTime(todayAttendance.checkOutTime)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="catalyst-card">
                <CardContent className="p-6 text-center">
                  <p className="text-sm text-muted-foreground">No attendance record for today</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-3 mt-4">
            {recordsLoading ? (
              <LoadingOverlay isVisible={true} variant="pulse" message="Loading records..." />
            ) : attendanceRecords && attendanceRecords.length > 0 ? (
              <div className="space-y-3">
                {attendanceRecords.slice(0, 10).map((record) => (
                  <Card key={record.id} className="catalyst-card">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{formatDate(record.date)}</p>
                            <p className="text-xs text-muted-foreground">
                              {record.hoursWorked ? `${record.hoursWorked}h worked` : 'Hours not calculated'}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(record.status)}
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-muted-foreground">In: </span>
                          <span className="font-medium">{formatTime(record.checkIn)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Out: </span>
                          <span className="font-medium">{formatTime(record.checkOut)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="catalyst-card">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No attendance records found</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}