import { Button } from "@/components/ui/button";
import { ArrowLeft, Bell } from "lucide-react";

interface MobileHeaderProps {
  title: string;
  onBack?: () => void;
  showNotifications?: boolean;
  user?: {
    name: string;
    employeeId: string;
  };
}

export function MobileHeader({ title, onBack, showNotifications = false, user }: MobileHeaderProps) {
  return (
    <header className="bg-hros-blue text-white px-6 py-4 pt-safe">
      <div className="flex items-center justify-between">
        {onBack ? (
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="p-2 -ml-2 rounded-full hover:bg-blue-700 transition-colors text-white"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-medium">{title}</h1>
          </div>
        ) : user ? (
          <div>
            <h1 className="text-xl font-medium">{user.name}</h1>
            <p className="text-blue-100 text-sm">{user.employeeId}</p>
          </div>
        ) : (
          <h1 className="text-xl font-medium">{title}</h1>
        )}
        
        {showNotifications && (
          <Button
            variant="ghost"
            size="icon"
            className="p-2 rounded-full hover:bg-blue-700 transition-colors text-white"
          >
            <Bell className="h-6 w-6" />
          </Button>
        )}
      </div>
    </header>
  );
}
