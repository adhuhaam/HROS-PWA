import { Home, UserCheck, Calendar, FileText, User } from "lucide-react";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: "dashboard", label: "Home", icon: Home },
    { id: "attendance", label: "Attendance", icon: UserCheck },
    { id: "leave", label: "Leave", icon: Calendar },
    { id: "payroll", label: "Payroll", icon: FileText },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-4 left-4 right-4 ios-nav pb-safe z-40 mx-auto max-w-sm">
      <div className="flex items-center justify-around py-2 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-0 flex-1 ${
                isActive 
                  ? "text-blue-500 transform scale-105" 
                  : "text-gray-500 dark:text-gray-400 hover:text-blue-500"
              }`}
            >
              <Icon className={`w-6 h-6 transition-transform ${isActive ? 'scale-110' : ''}`} />
              <span className="text-xs font-medium truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
