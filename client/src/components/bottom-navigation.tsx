import { 
  HomeIcon, 
  UserIcon, 
  CalendarDaysIcon, 
  CurrencyDollarIcon, 
  UserCircleIcon 
} from "@heroicons/react/24/outline";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: "dashboard", label: "Home", icon: HomeIcon },
    { id: "attendance", label: "Attendance", icon: UserIcon },
    { id: "leave", label: "Leave", icon: CalendarDaysIcon },
    { id: "payroll", label: "Payroll", icon: CurrencyDollarIcon },
    { id: "profile", label: "Profile", icon: UserCircleIcon },
  ];

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-sm">
      <div 
        className="flex items-center justify-around py-3 px-4 rounded-2xl"
        style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center space-y-1 px-2 py-2 rounded-xl transition-all duration-300 min-w-0 flex-1 ${
                isActive 
                  ? "text-blue-600 transform scale-105" 
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              <Icon className={`w-6 h-6 transition-all duration-300 ${isActive ? 'scale-110' : ''}`} />
              <span className="text-xs font-medium truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
