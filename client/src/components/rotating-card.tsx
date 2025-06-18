import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { User, Building2 } from "lucide-react";

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
        className="relative w-full h-40 perspective-1000 cursor-pointer mb-6"
        onClick={handleClick}
      >
        <div
          className={`relative w-full h-full transition-transform duration-700 preserve-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Front Face - Welcome Message */}
          <div className="absolute inset-0 w-full h-full backface-hidden rounded-xl ios-card">
            <CardContent className="p-6 h-full flex items-center space-x-4">
              {icon}
              <div className="flex-1">
                <h2 className="text-xl font-normal text-foreground mb-1">{title}</h2>
                <p className="text-muted-foreground font-normal">{value}</p>
              </div>
            </CardContent>
          </div>

          {/* Back Face - Employee Details */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-xl ios-card">
            <CardContent className="p-6 h-full flex items-center space-x-4">
              <div className="flex-shrink-0">
                {employeeData.photoUrl ? (
                  <img
                    src={employeeData.photoUrl}
                    alt={employeeData.name}
                    className="w-16 h-16 rounded-full border-2 border-primary/20 object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-normal text-foreground truncate">{employeeData.name}</h3>
                <p className="text-sm text-muted-foreground mb-1 font-normal">ID: {employeeData.employeeId}</p>
                {employeeData.designation && (
                  <div className="flex items-center text-xs text-muted-foreground mb-1">
                    <Building2 className="w-3 h-3 mr-1" />
                    <span className="truncate font-normal">{employeeData.designation}</span>
                  </div>
                )}
                {employeeData.department && (
                  <p className="text-xs text-muted-foreground truncate font-normal">{employeeData.department}</p>
                )}
              </div>
              <div className="flex-shrink-0">
                {/* Company Logo */}
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">HRoS</span>
                </div>
              </div>
            </CardContent>
          </div>
        </div>
      </div>
    );
  }

  // Regular dashboard card
  return (
    <Card 
      className="shadow-sm border touch-active cursor-pointer hover:scale-105 transition-transform"
      onClick={handleClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-normal">{title}</p>
            <p className="text-2xl font-normal text-gray-900">{value}</p>
          </div>
          <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
