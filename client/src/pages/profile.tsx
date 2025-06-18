import { useQuery } from "@tanstack/react-query";
import { User, Mail, Phone, MapPin, Building, Calendar, Settings, LogOut, Edit, Camera, Globe } from "lucide-react";
import { MobileHeader } from "@/components/mobile-header";
import { ThemeToggle } from "@/components/theme-toggle";
import { LoadingOverlay } from "@/components/loading-overlay";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage, Language } from "@/contexts/LanguageContext";

interface ProfilePageProps {
  onBack: () => void;
  onLogout: () => void;
}

interface UserProfile {
  id: number;
  name: string;
  employeeId: string;
  email: string;
  phone?: string;
  department?: string;
  position?: string;
  joinDate?: string;
  location?: string;
  manager?: string;
  photoUrl?: string;
}

export function ProfilePage({ onBack, onLogout }: ProfilePageProps) {
  const { language, setLanguage, t } = useLanguage();

  const { data: user, isLoading } = useQuery<UserProfile>({
    queryKey: ["/api/auth/user"],
  });

  const { data: employeeDetails } = useQuery({
    queryKey: ["/api/employee/details"],
  });

  const languages = [
    { value: "english" as Language, label: "English", flag: "🇺🇸" },
    { value: "sinhala" as Language, label: "සිංහල (Sinhala)", flag: "🇱🇰" },
    { value: "tamil" as Language, label: "தமிழ் (Tamil)", flag: "🇮🇳" },
    { value: "hindi" as Language, label: "हिंदी (Hindi)", flag: "🇮🇳" },
    { value: "malayalam" as Language, label: "മലയാളം (Malayalam)", flag: "🇮🇳" },
    { value: "bangla" as Language, label: "বাংলা (Bangla)", flag: "🇧🇩" },
  ];

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString([], { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return <LoadingOverlay isVisible={true} message="Loading profile..." />;
  }

  if (!user) {
    return (
      <div className="min-h-screen" style={{ background: '#f2f2f7' }}>
        <MobileHeader title="Profile" onBack={onBack} />
        <div className="px-4 pt-4">
          <div className="ios-card">
            <div className="p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400">Unable to load profile information</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const profile: UserProfile = {
    ...user,
    phone: employeeDetails?.contact_number || user.phone,
    department: employeeDetails?.department || user.department,
    position: employeeDetails?.designation || user.position,
    photoUrl: employeeDetails?.photo_file_name
  };

  return (
    <div className="min-h-screen" style={{ background: '#f2f2f7' }}>
      <MobileHeader 
        title="Profile" 
        onBack={onBack}
        showNotifications={true}
      />

      <div className="px-4 pb-28 space-y-4 pt-4">
        {/* Profile Header */}
        <div className="ios-card">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                {profile.photoUrl ? (
                  <img
                    src={profile.photoUrl}
                    alt={profile.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-sm"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900 border-4 border-white dark:border-gray-800 shadow-sm flex items-center justify-center">
                    <User className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                  </div>
                )}
                <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1" style={{ fontWeight: 700, letterSpacing: '-0.022em' }}>
                  {profile.name}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-1" style={{ fontWeight: 500 }}>
                  {profile.position || 'Employee'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ID: {profile.employeeId}
                </p>
              </div>
              
              <button className="ios-button-secondary p-3 rounded-full">
                <Edit className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="ios-list-item p-4 text-center">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1" style={{ fontWeight: 700, letterSpacing: '-0.022em' }}>
                  2.5
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Years</p>
              </div>
              
              <div className="ios-list-item p-4 text-center">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1" style={{ fontWeight: 700, letterSpacing: '-0.022em' }}>
                  95%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Attendance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="ios-card">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4" style={{ fontWeight: 600, letterSpacing: '-0.022em' }}>
              Contact Information
            </h3>
            
            <div className="space-y-3">
              <div className="ios-list-item p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white" style={{ fontWeight: 500, letterSpacing: '-0.011em' }}>
                      {profile.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="ios-list-item p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white" style={{ fontWeight: 500, letterSpacing: '-0.011em' }}>
                      {profile.phone || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="ios-list-item p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <Building className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Department</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white" style={{ fontWeight: 500, letterSpacing: '-0.011em' }}>
                      {profile.department || 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="ios-list-item p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Join Date</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white" style={{ fontWeight: 500, letterSpacing: '-0.011em' }}>
                      {formatDate(profile.joinDate)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="ios-card">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4" style={{ fontWeight: 600, letterSpacing: '-0.022em' }}>
              Settings
            </h3>
            
            <div className="space-y-3">
              <div className="ios-list-item p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                      <Settings className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <span className="text-lg font-medium text-gray-900 dark:text-white" style={{ fontWeight: 500, letterSpacing: '-0.011em' }}>
                      Dark Mode
                    </span>
                  </div>
                  <ThemeToggle />
                </div>
              </div>

              <button className="w-full ios-list-item p-4 text-left hover:scale-[0.98] transition-transform">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <Settings className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-lg font-medium text-gray-900 dark:text-white" style={{ fontWeight: 500, letterSpacing: '-0.011em' }}>
                    Notification Settings
                  </span>
                </div>
              </button>

              <button className="w-full ios-list-item p-4 text-left hover:scale-[0.98] transition-transform">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <Settings className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-lg font-medium text-gray-900 dark:text-white" style={{ fontWeight: 500, letterSpacing: '-0.011em' }}>
                    Privacy Settings
                  </span>
                </div>
              </button>

              <div className="ios-list-item p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                      <Globe className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-lg font-medium text-gray-900 dark:text-white" style={{ fontWeight: 500, letterSpacing: '-0.011em' }}>
                      Language
                    </span>
                  </div>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="w-40 h-9 bg-white/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-600/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          <div className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            <span>{lang.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full ios-list-item p-4 hover:scale-[0.98] transition-transform"
          style={{ background: 'rgba(255, 59, 48, 0.1)' }}
        >
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              <LogOut className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
            <span className="text-lg font-semibold text-red-600 dark:text-red-400" style={{ fontWeight: 600, letterSpacing: '-0.011em' }}>
              Sign Out
            </span>
          </div>
        </button>

        {/* App Info */}
        <div className="ios-card">
          <div className="p-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">HRoS Employee Portal</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Version 2.1.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}