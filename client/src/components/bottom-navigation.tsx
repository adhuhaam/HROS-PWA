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
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-xs backdrop-blur-xl border-t pb-safe z-40" style={{
      background: 'rgba(255, 255, 255, 0.1)',
      borderColor: 'rgba(255, 255, 255, 0.1)'
    }}>
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center space-y-0.5 px-2 py-1.5 rounded-lg transition-all duration-200 ${
                isActive 
                  ? "text-primary scale-105" 
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Icon className={`w-4 h-4 transition-transform ${isActive ? 'scale-110' : ''}`} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
