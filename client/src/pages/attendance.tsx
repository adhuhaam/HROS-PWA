import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MobileHeader } from "@/components/mobile-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserCheck, Clock } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Attendance } from "@shared/schema";

interface AttendancePageProps {
  onBack: () => void;
}

export function AttendancePage({ onBack }: AttendancePageProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: todayAttendance } = useQuery<Attendance | null>({
    queryKey: ["/api/attendance/today"],
  });

  const checkOutMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/attendance/checkout");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/attendance/today"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Success",
        description: "Checked out successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const isCheckedIn = todayAttendance?.checkIn && !todayAttendance?.checkOut;
  const checkInTime = todayAttendance?.checkIn ? new Date(todayAttendance.checkIn).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }) : null;

  return (
    <div className="min-h-screen pb-20">
      <MobileHeader title="Attendance" onBack={onBack} />
      
      {/* Current Status Card */}
      <div className="px-6 py-6">
        <Card className="shadow-sm border text-center">
          <CardContent className="p-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserCheck className="text-green-600 w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {checkInTime || "Not Checked In"}
            </h2>
            <p className={`font-medium mb-4 ${isCheckedIn ? "text-green-600" : "text-gray-500"}`}>
              {isCheckedIn ? "Checked In" : "Not Checked In"}
            </p>
            
            {isCheckedIn && (
              <Button
                onClick={() => checkOutMutation.mutate()}
                disabled={checkOutMutation.isPending}
                className="w-full bg-red-500 text-white py-3 rounded-xl font-medium hover:bg-red-600 transition-colors"
              >
                {checkOutMutation.isPending ? "Checking Out..." : "Check Out"}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Today's Timeline */}
      <div className="px-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Today's Timeline</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${todayAttendance?.checkIn ? "bg-green-500" : "bg-gray-300"}`}></div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${todayAttendance?.checkIn ? "text-gray-900" : "text-gray-400"}`}>
                Check In
              </p>
              <p className={`text-xs ${todayAttendance?.checkIn ? "text-gray-500" : "text-gray-400"}`}>
                {checkInTime || "Pending"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${todayAttendance?.checkOut ? "bg-green-500" : "bg-gray-300"}`}></div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${todayAttendance?.checkOut ? "text-gray-900" : "text-gray-400"}`}>
                Check Out
              </p>
              <p className={`text-xs ${todayAttendance?.checkOut ? "text-gray-500" : "text-gray-400"}`}>
                {todayAttendance?.checkOut 
                  ? new Date(todayAttendance.checkOut).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })
                  : "Pending"
                }
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Monthly Summary */}
      <div className="px-6 py-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">This Month</h3>
        <div className="grid grid-cols-3 gap-4">
          <Card className="shadow-sm border text-center">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-gray-900">22</p>
              <p className="text-xs text-gray-600">Present</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm border text-center">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-xs text-gray-600">Absent</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm border text-center">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-gray-900">2</p>
              <p className="text-xs text-gray-600">Leave</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
