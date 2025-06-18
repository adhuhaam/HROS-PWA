import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UserIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline";

interface EmployeeData {
  name: string;
  employeeId: string;
  designation?: string;
  department?: string;
  photoUrl?: string;
}

interface RotatingCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  bgColor?: string;
  onClick?: () => void;
  employeeData?: EmployeeData;
}

export function RotatingCard({ icon, title, value, bgColor = "bg-green-100", onClick, employeeData }: RotatingCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    if (employeeData) {
      setIsFlipped(!isFlipped);
    }
    onClick?.();
  };

  // Welcome card with employee data
  if (employeeData) {
    return (
      <div
        className="relative w-full h-56 perspective-1000 cursor-pointer mb-6"
        onClick={handleClick}
      >
        <div
          className={`relative w-full h-full transition-transform duration-700 preserve-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Front Face - Employee Details */}
          <div className="absolute inset-0 w-full h-full backface-hidden credit-card">
            <CardContent className="p-6 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {employeeData.photoUrl ? (
                    <img
                      src={employeeData.photoUrl}
                      alt={employeeData.name}
                      className="w-16 h-16 rounded-full border-2 border-primary/20 object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
                      <UserIcon className="w-8 h-8 text-primary" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">{employeeData.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">ID: {employeeData.employeeId}</p>
                  {employeeData.designation && (
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <BuildingOfficeIcon className="w-3 h-3 mr-1" />
                      <span className="truncate">{employeeData.designation}</span>
                    </div>
                  )}
                  {employeeData.department && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{employeeData.department}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </div>

          {/* Back Face - Company Logo */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 credit-card">
            <CardContent className="p-6 h-full flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-white">HRoS</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 text-center">Human Resource</h3>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 text-center">Operating System</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">Employee Portal</p>
            </CardContent>
          </div>
        </div>
      </div>
    );
  }

  // Regular dashboard card
  return (
    <Card 
      className="credit-card touch-active cursor-pointer hover:scale-105 transition-transform border-0"
      onClick={handleClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 dark:text-gray-300 text-sm font-normal">{title}</p>
            <p className="text-2xl font-normal text-gray-900 dark:text-gray-100">{value}</p>
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
