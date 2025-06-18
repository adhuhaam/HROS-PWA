import { useQuery } from "@tanstack/react-query";
import { MobileHeader } from "@/components/mobile-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { Payroll } from "@shared/schema";

interface PayrollPageProps {
  onBack: () => void;
}

export function PayrollPage({ onBack }: PayrollPageProps) {
  const { data: currentPayroll } = useQuery<Payroll>({
    queryKey: ["/api/payroll/current"],
  });

  const { data: payrollHistory } = useQuery<Payroll[]>({
    queryKey: ["/api/payroll"],
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="min-h-screen pb-20">
      <MobileHeader title="Payroll" onBack={onBack} />
      
      {/* Current Month Summary */}
      <div className="px-6 py-6">
        {currentPayroll && (
          <div className="bg-gradient-to-r from-hros-blue to-blue-500 rounded-2xl p-6 text-white mb-6">
            <h2 className="text-lg font-medium mb-2">
              {currentPayroll.month} {currentPayroll.year}
            </h2>
            <p className="text-3xl font-bold">{formatCurrency(currentPayroll.netSalary)}</p>
            <p className="text-blue-100 text-sm">Net Salary</p>
          </div>
        )}
        
        {/* Payroll Breakdown */}
        {currentPayroll && (
          <Card className="shadow-sm border">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Basic Salary</span>
                  <span className="font-medium">{formatCurrency(currentPayroll.basicSalary)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Allowances</span>
                  <span className="font-medium text-green-600">+{formatCurrency(currentPayroll.allowances)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Deductions</span>
                  <span className="font-medium text-red-600">-{formatCurrency(currentPayroll.deductions)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-medium text-gray-900">Net Amount</span>
                  <span className="font-bold text-gray-900">{formatCurrency(currentPayroll.netSalary)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Payslip History */}
      <div className="px-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payslip History</h3>
        <div className="space-y-3 hide-scrollbar">
          {payrollHistory?.map((payroll) => (
            <Card key={payroll.id} className="shadow-sm border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {payroll.month} {payroll.year}
                    </p>
                    <p className="text-sm text-gray-500">{formatCurrency(payroll.netSalary)}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-hros-blue hover:text-blue-700"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
