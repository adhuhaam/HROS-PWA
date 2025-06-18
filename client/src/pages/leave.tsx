import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MobileHeader } from "@/components/mobile-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { LeaveBalance } from "@shared/schema";

interface LeavePageProps {
  onBack: () => void;
}

export function LeavePage({ onBack }: LeavePageProps) {
  const [leaveType, setLeaveType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: leaveBalances } = useQuery<LeaveBalance[]>({
    queryKey: ["/api/leave/balances"],
  });

  const leaveRequestMutation = useMutation({
    mutationFn: async (data: { leaveType: string; fromDate: string; toDate: string; reason: string }) => {
      return await apiRequest("POST", "/api/leave/request", {
        leaveType: data.leaveType,
        fromDate: new Date(data.fromDate),
        toDate: new Date(data.toDate),
        reason: data.reason,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Leave request submitted successfully!",
      });
      // Reset form
      setLeaveType("");
      setFromDate("");
      setToDate("");
      setReason("");
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["/api/leave/requests"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveType || !fromDate || !toDate || !reason) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    leaveRequestMutation.mutate({ leaveType, fromDate, toDate, reason });
  };

  const leaveTypes = ["Annual Leave", "Sick Leave", "Emergency Leave", "Maternity Leave"];

  return (
    <div className="min-h-screen pb-20">
      <MobileHeader title="Apply Leave" onBack={onBack} />
      
      <div className="px-6 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="leaveType" className="block text-sm font-medium text-gray-700 mb-2">
              Leave Type
            </Label>
            <Select value={leaveType} onValueChange={setLeaveType}>
              <SelectTrigger className="w-full px-4 py-3 border border-gray-300 rounded-xl">
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                {leaveTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fromDate" className="block text-sm font-medium text-gray-700 mb-2">
                From Date
              </Label>
              <Input
                id="fromDate"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl"
              />
            </div>
            <div>
              <Label htmlFor="toDate" className="block text-sm font-medium text-gray-700 mb-2">
                To Date
              </Label>
              <Input
                id="toDate"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
              Reason
            </Label>
            <Textarea
              id="reason"
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl"
              placeholder="Please provide reason for leave..."
            />
          </div>
          
          <Button
            type="submit"
            disabled={leaveRequestMutation.isPending}
            className="w-full bg-hros-blue text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            {leaveRequestMutation.isPending ? "Submitting..." : "Submit Request"}
          </Button>
        </form>
        
        {/* Leave Balance Card */}
        <Card className="mt-8 shadow-sm border">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Leave Balance</h3>
            <div className="space-y-3">
              {leaveBalances?.map((balance) => (
                <div key={balance.id} className="flex justify-between">
                  <span className="text-gray-600">{balance.leaveType}</span>
                  <span className="font-medium">{balance.balance} days</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
