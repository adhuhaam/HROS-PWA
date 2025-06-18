import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, Download, Eye, Calendar, TrendingUp, FileText } from "lucide-react";
import { MobileHeader } from "@/components/mobile-header";
import { LoadingOverlay } from "@/components/loading-overlay";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PayrollPageProps {
  onBack: () => void;
}

interface PayrollRecord {
  id: string;
  month: string;
  year: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  payDate: string;
  status: string;
}

interface PayrollSummary {
  currentMonth: {
    basicSalary: number;
    allowances: number;
    deductions: number;
    netSalary: number;
    status: string;
  };
  ytdEarnings: number;
  ytdDeductions: number;
  ytdNet: number;
}

export function PayrollPage({ onBack }: PayrollPageProps) {
  const [activeTab, setActiveTab] = useState("current");

  const { data: payrollRecords, isLoading: recordsLoading } = useQuery<PayrollRecord[]>({
    queryKey: ["/api/payroll"],
  });

  const { data: currentPayroll, isLoading: currentLoading } = useQuery({
    queryKey: ["/api/payroll/current"],
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return <span className="ios-badge ios-badge-green">Paid</span>;
      case 'pending':
        return <span className="ios-badge ios-badge-yellow">Pending</span>;
      case 'processing':
        return <span className="ios-badge" style={{ background: 'rgba(0, 122, 255, 0.15)', color: 'rgba(0, 122, 255, 1)' }}>Processing</span>;
      default:
        return <span className="ios-badge" style={{ background: 'rgba(142, 142, 147, 0.15)', color: 'rgba(142, 142, 147, 1)' }}>{status}</span>;
    }
  };

  if (recordsLoading || currentLoading) {
    return <LoadingOverlay isVisible={true} message="Loading payroll information..." />;
  }

  const summary: PayrollSummary = {
    currentMonth: currentPayroll || {
      basicSalary: 0,
      allowances: 0,
      deductions: 0,
      netSalary: 0,
      status: 'Not Available'
    },
    ytdEarnings: payrollRecords?.reduce((sum, record) => sum + record.basicSalary + record.allowances, 0) || 0,
    ytdDeductions: payrollRecords?.reduce((sum, record) => sum + record.deductions, 0) || 0,
    ytdNet: payrollRecords?.reduce((sum, record) => sum + record.netSalary, 0) || 0,
  };

  return (
    <div className="min-h-screen" style={{ background: '#f2f2f7' }}>
      <MobileHeader 
        title="Payroll" 
        onBack={onBack}
        showNotifications={true}
      />

      <div className="px-4 pb-28 space-y-4 pt-4">
        {/* Current Month Summary */}
        <div className="ios-card">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white" style={{ fontWeight: 600, letterSpacing: '-0.022em' }}>
                  {new Date().toLocaleDateString([], { month: 'long', year: 'numeric' })}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Current Month</p>
              </div>
              {getStatusBadge(summary.currentMonth.status)}
            </div>

            <div className="space-y-4">
              {/* Net Salary Highlight */}
              <div className="ios-list-item p-6 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Net Salary</p>
                <p className="text-4xl font-bold text-green-600 dark:text-green-400" style={{ fontWeight: 700, letterSpacing: '-0.022em' }}>
                  {formatCurrency(summary.currentMonth.netSalary)}
                </p>
              </div>

              {/* Breakdown */}
              <div className="grid grid-cols-1 gap-3">
                <div className="ios-list-item p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-base font-medium text-gray-900 dark:text-white">Basic Salary</span>
                    </div>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white" style={{ fontWeight: 600, letterSpacing: '-0.022em' }}>
                      {formatCurrency(summary.currentMonth.basicSalary)}
                    </span>
                  </div>
                </div>

                <div className="ios-list-item p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-base font-medium text-gray-900 dark:text-white">Allowances</span>
                    </div>
                    <span className="text-lg font-semibold text-green-600 dark:text-green-400" style={{ fontWeight: 600, letterSpacing: '-0.022em' }}>
                      +{formatCurrency(summary.currentMonth.allowances)}
                    </span>
                  </div>
                </div>

                <div className="ios-list-item p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-red-600 dark:text-red-400 rotate-180" />
                      </div>
                      <span className="text-base font-medium text-gray-900 dark:text-white">Deductions</span>
                    </div>
                    <span className="text-lg font-semibold text-red-600 dark:text-red-400" style={{ fontWeight: 600, letterSpacing: '-0.022em' }}>
                      -{formatCurrency(summary.currentMonth.deductions)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payroll History */}
        <div className="ios-card">
          <div className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="ios-nav grid w-full grid-cols-2 p-1 mb-6">
                <TabsTrigger value="current" className="text-sm font-medium py-2 px-4 rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">
                  YTD Summary
                </TabsTrigger>
                <TabsTrigger value="history" className="text-sm font-medium py-2 px-4 rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">
                  History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="current" className="space-y-4 mt-0">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4" style={{ fontWeight: 600, letterSpacing: '-0.022em' }}>
                  Year to Date Summary
                </h3>
                
                <div className="space-y-3">
                  <div className="ios-list-item p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-medium text-gray-900 dark:text-white">Total Earnings</span>
                      <span className="text-lg font-semibold text-green-600 dark:text-green-400" style={{ fontWeight: 600, letterSpacing: '-0.022em' }}>
                        {formatCurrency(summary.ytdEarnings)}
                      </span>
                    </div>
                  </div>

                  <div className="ios-list-item p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-medium text-gray-900 dark:text-white">Total Deductions</span>
                      <span className="text-lg font-semibold text-red-600 dark:text-red-400" style={{ fontWeight: 600, letterSpacing: '-0.022em' }}>
                        {formatCurrency(summary.ytdDeductions)}
                      </span>
                    </div>
                  </div>

                  <div className="ios-list-item p-4 border-2 border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-gray-900 dark:text-white" style={{ fontWeight: 600, letterSpacing: '-0.022em' }}>
                        Net YTD
                      </span>
                      <span className="text-xl font-bold text-blue-600 dark:text-blue-400" style={{ fontWeight: 700, letterSpacing: '-0.022em' }}>
                        {formatCurrency(summary.ytdNet)}
                      </span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="history" className="space-y-3 mt-0">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4" style={{ fontWeight: 600, letterSpacing: '-0.022em' }}>
                  Payroll History
                </h3>
                
                {payrollRecords && payrollRecords.length > 0 ? (
                  <div className="space-y-3">
                    {payrollRecords.slice(0, 12).map((record) => (
                      <div key={record.id} className="ios-list-item p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <p className="text-lg font-semibold text-gray-900 dark:text-white" style={{ fontWeight: 600, letterSpacing: '-0.022em' }}>
                                {record.month} {record.year}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Paid on {formatDate(record.payDate)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(record.status)}
                            <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1" style={{ fontWeight: 600, letterSpacing: '-0.022em' }}>
                              {formatCurrency(record.netSalary)}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="text-center">
                            <p className="text-gray-500 dark:text-gray-400">Basic</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(record.basicSalary)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-500 dark:text-gray-400">Allowances</p>
                            <p className="font-semibold text-green-600 dark:text-green-400">+{formatCurrency(record.allowances)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-500 dark:text-gray-400">Deductions</p>
                            <p className="font-semibold text-red-600 dark:text-red-400">-{formatCurrency(record.deductions)}</p>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <button className="flex-1 ios-button-secondary py-2 px-3 text-sm font-medium flex items-center justify-center gap-2">
                            <Eye className="h-4 w-4" />
                            View
                          </button>
                          <button className="flex-1 ios-button-secondary py-2 px-3 text-sm font-medium flex items-center justify-center gap-2">
                            <Download className="h-4 w-4" />
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="ios-list-item p-6 text-center">
                    <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">No payroll records found</p>
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