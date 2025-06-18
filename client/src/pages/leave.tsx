import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Calendar, Plus, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { MobileHeader } from "@/components/mobile-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingOverlay } from "@/components/loading-overlay";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface LeavePageProps {
  onBack: () => void;
}

interface LeaveRequest {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  appliedDate: string;
}

interface LeaveBalance {
  type: string;
  total: number;
  used: number;
  remaining: number;
}

export function LeavePage({ onBack }: LeavePageProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    startDate: "",
    endDate: "",
    reason: ""
  });
  const { toast } = useToast();

  const { data: leaveRequests, isLoading: requestsLoading } = useQuery<LeaveRequest[]>({
    queryKey: ["/api/leave/requests"],
  });

  const { data: leaveBalances, isLoading: balancesLoading } = useQuery<LeaveBalance[]>({
    queryKey: ["/api/leave/balances"],
  });

  const submitMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return await apiRequest("POST", "/api/leave/apply", data);
    },
    onSuccess: () => {
      toast({
        title: "Leave request submitted!",
        description: "Your leave application has been submitted for approval.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/leave/requests"] });
      setShowForm(false);
      setFormData({ type: "", startDate: "", endDate: "", reason: "" });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to submit leave request",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <span className="ios-badge ios-badge-green">Approved</span>;
      case 'rejected':
        return <span className="ios-badge ios-badge-red">Rejected</span>;
      case 'pending':
        return <span className="ios-badge ios-badge-yellow">Pending</span>;
      default:
        return <span className="ios-badge" style={{ background: 'rgba(142, 142, 147, 0.15)', color: 'rgba(142, 142, 147, 1)' }}>{status}</span>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (requestsLoading || balancesLoading) {
    return <LoadingOverlay isVisible={true} message="Loading leave information..." />;
  }

  return (
    <div className="min-h-screen" style={{ background: '#f2f2f7' }}>
      <MobileHeader 
        title="Leave Management" 
        onBack={onBack}
        showNotifications={true}
      />

      <div className="px-4 pb-28 space-y-4 pt-4">
        {/* Apply Leave Button */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full ios-button py-4 px-6 text-lg font-semibold flex items-center justify-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Apply for Leave
        </button>

        {/* Leave Application Form */}
        {showForm && (
          <div className="ios-card">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6" style={{ fontWeight: 600, letterSpacing: '-0.022em' }}>
                New Leave Application
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Leave Type
                  </label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger className="ios-button-secondary border-0 text-left">
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="annual">Annual Leave</SelectItem>
                      <SelectItem value="sick">Sick Leave</SelectItem>
                      <SelectItem value="personal">Personal Leave</SelectItem>
                      <SelectItem value="emergency">Emergency Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Date
                    </label>
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="ios-button-secondary border-0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      End Date
                    </label>
                    <Input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="ios-button-secondary border-0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Reason
                  </label>
                  <Textarea
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    placeholder="Please provide reason for leave..."
                    className="ios-button-secondary border-0 min-h-[100px]"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowForm(false)}
                    className="flex-1 ios-button-secondary py-3 px-4 text-base font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => submitMutation.mutate(formData)}
                    disabled={submitMutation.isPending || !formData.type || !formData.startDate || !formData.endDate}
                    className="flex-1 ios-button py-3 px-4 text-base font-medium disabled:opacity-50"
                  >
                    {submitMutation.isPending ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Submitting...
                      </div>
                    ) : (
                      "Submit Application"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Leave Balances */}
        <div className="ios-card">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4" style={{ fontWeight: 600, letterSpacing: '-0.022em' }}>
              Leave Balance
            </h3>
            
            {leaveBalances && leaveBalances.length > 0 ? (
              <div className="space-y-3">
                {leaveBalances.map((balance, index) => (
                  <div key={index} className="ios-list-item p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white" style={{ fontWeight: 600, letterSpacing: '-0.022em' }}>
                          {balance.type}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {balance.used} used of {balance.total} days
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400" style={{ fontWeight: 700, letterSpacing: '-0.022em' }}>
                          {balance.remaining}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">days left</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="ios-list-item p-6 text-center">
                <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400">No leave balance information available</p>
              </div>
            )}
          </div>
        </div>

        {/* Leave Requests */}
        <div className="ios-card">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4" style={{ fontWeight: 600, letterSpacing: '-0.022em' }}>
              Recent Applications
            </h3>
            
            {leaveRequests && leaveRequests.length > 0 ? (
              <div className="space-y-3">
                {leaveRequests.slice(0, 5).map((request) => (
                  <div key={request.id} className="ios-list-item p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                          {getStatusIcon(request.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-lg font-semibold text-gray-900 dark:text-white truncate" style={{ fontWeight: 600, letterSpacing: '-0.022em' }}>
                              {request.type}
                            </p>
                            {getStatusBadge(request.status)}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                            {formatDate(request.startDate)} - {formatDate(request.endDate)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                            {request.reason}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="ios-list-item p-6 text-center">
                <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400">No leave applications found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}