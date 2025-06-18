import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { ArrowLeft, Bell, User } from "lucide-react";

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
    <header className="bg-primary text-primary-foreground px-6 py-4 pt-safe sticky top-0 z-50 backdrop-blur-sm shadow-lg">
      <div className="flex items-center justify-between">
        {onBack ? (
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="p-2 -ml-2 rounded-full hover:bg-primary-foreground/10 transition-all duration-200 text-primary-foreground"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-semibold">{title}</h1>
          </div>
        ) : user ? (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">{user.name}</h1>
              <p className="text-primary-foreground/80 text-sm">{user.employeeId}</p>
            </div>
          </div>
        ) : (
          <h1 className="text-xl font-semibold">{title}</h1>
        )}
        
        <div className="flex items-center space-x-2">
          <div className="bg-primary-foreground/10 rounded-lg p-1">
            <ThemeToggle />
          </div>
          
          {showNotifications && (
            <Button
              variant="ghost"
              size="icon"
              className="p-2 rounded-full hover:bg-primary-foreground/10 transition-all duration-200 text-primary-foreground relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                3
              </span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
