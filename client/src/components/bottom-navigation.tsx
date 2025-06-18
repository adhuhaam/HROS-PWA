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
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-card/95 backdrop-blur-sm border-t border-border/50 pb-safe z-40">
      <div className="flex items-center justify-around py-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-xl transition-all duration-200 ${
                isActive 
                  ? "text-primary bg-primary/10 scale-105 shadow-sm" 
                  : "text-muted-foreground hover:text-primary hover:bg-accent/50"
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
