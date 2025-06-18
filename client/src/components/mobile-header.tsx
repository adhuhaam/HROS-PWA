import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { ArrowLeftIcon, BellIcon, UserIcon } from "@heroicons/react/24/outline";

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
    <header 
      className="sticky top-0 z-50 px-4 py-2 border-b border-gray-200/10 dark:border-gray-700/10 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between h-11">
        {onBack ? (
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200 text-gray-900 dark:text-gray-100"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h1>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-xs font-bold text-white">HRoS</span>
            </div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h1>
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          <div className="bg-gray-100/30 dark:bg-gray-800/30 rounded-xl p-1">
            <ThemeToggle />
          </div>
          
          {showNotifications && (
            <Button
              variant="ghost"
              size="icon"
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200 text-gray-900 dark:text-gray-100 relative"
            >
              <BellIcon className="h-5 w-5" />
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
