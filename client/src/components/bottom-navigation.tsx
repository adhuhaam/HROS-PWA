import { 
  HomeIcon, 
  UserIcon, 
  CalendarDaysIcon, 
  CurrencyDollarIcon, 
  UserCircleIcon 
} from "@heroicons/react/24/outline";
import { useLanguage } from "@/contexts/LanguageContext";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const { t } = useLanguage();
  
  const tabs = [
    { id: "dashboard", label: t('nav.home'), icon: HomeIcon },
    { id: "attendance", label: t('nav.attendance'), icon: UserIcon },
    { id: "leave", label: t('nav.leave'), icon: CalendarDaysIcon },
    { id: "payroll", label: t('nav.payroll'), icon: CurrencyDollarIcon },
    { id: "profile", label: t('nav.profile'), icon: UserCircleIcon },
  ];

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-sm">
      <div className="flex items-center justify-around py-3 px-4 rounded-2xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-gray-200/20 dark:border-gray-700/20">
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
                  : "text-gray-600 dark:text-gray-300 hover:text-blue-600"
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
