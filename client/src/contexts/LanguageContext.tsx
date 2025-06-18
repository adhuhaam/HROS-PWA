import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'english' | 'sinhala' | 'tamil' | 'hindi' | 'malayalam' | 'bangla';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>('english');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('app-language') as Language;
    if (savedLanguage) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('app-language', newLanguage);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.english[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Translation data
const translations: Record<Language, Record<string, string>> = {
  english: {
    // Common
    'welcome': 'Welcome',
    'loading': 'Loading',
    'error': 'Error',
    'success': 'Success',
    'cancel': 'Cancel',
    'save': 'Save',
    'edit': 'Edit',
    'delete': 'Delete',
    'back': 'Back',
    'home': 'Home',
    'profile': 'Profile',
    'settings': 'Settings',
    
    // Login
    'login.title': 'Welcome Back',
    'login.subtitle': 'Employee Portal',
    'login.signin': 'Sign In',
    'login.employeeId': 'Employee ID',
    'login.password': 'Password',
    'login.signingIn': 'Signing in...',
    'login.help': 'Need help? Contact HR department',
    
    // Dashboard
    'dashboard.goodMorning': 'Good Morning',
    'dashboard.goodAfternoon': 'Good Afternoon',
    'dashboard.goodEvening': 'Good Evening',
    'dashboard.employeeIdCard': 'Employee ID Card',
    'dashboard.todaysStatus': "Today's Status",
    'dashboard.leaveBalance': 'Leave Balance',
    'dashboard.attendance': 'Attendance',
    'dashboard.payroll': 'Payroll',
    'dashboard.quickActions': 'Quick Actions',
    'dashboard.checkInOut': 'Check In/Out',
    'dashboard.applyLeave': 'Apply Leave',
    'dashboard.documents': 'Documents',
    'dashboard.latestNotices': 'Latest Notices',
    'dashboard.upcomingHolidays': 'Upcoming Holidays',
    'dashboard.viewDetails': 'View Details',
    'dashboard.days': 'days',
    
    // Navigation
    'nav.home': 'Home',
    'nav.attendance': 'Attendance',
    'nav.leave': 'Leave',
    'nav.payroll': 'Payroll',
    'nav.profile': 'Profile',
    
    // Profile
    'profile.contactInformation': 'Contact Information',
    'profile.email': 'Email',
    'profile.phone': 'Phone',
    'profile.department': 'Department',
    'profile.joinDate': 'Join Date',
    'profile.darkMode': 'Dark Mode',
    'profile.notificationSettings': 'Notification Settings',
    'profile.privacySettings': 'Privacy Settings',
    'profile.language': 'Language',
    'profile.signOut': 'Sign Out',
    'profile.years': 'Years',
    'profile.attendance': 'Attendance',
    'profile.notProvided': 'Not provided',
    'profile.notSpecified': 'Not specified',
    
    // Attendance
    'attendance.title': 'Attendance',
    'attendance.checkIn': 'Check In',
    'attendance.checkOut': 'Check Out',
    'attendance.todaysAttendance': "Today's Attendance",
    'attendance.attendanceHistory': 'Attendance History',
    'attendance.status': 'Status',
    'attendance.checkInTime': 'Check In Time',
    'attendance.checkOutTime': 'Check Out Time',
    'attendance.hoursWorked': 'Hours Worked',
    'attendance.present': 'Present',
    'attendance.absent': 'Absent',
    'attendance.late': 'Late',
    
    // Leave
    'leave.title': 'Leave Management',
    'leave.applyLeave': 'Apply Leave',
    'leave.leaveBalance': 'Leave Balance',
    'leave.leaveHistory': 'Leave History',
    'leave.leaveType': 'Leave Type',
    'leave.startDate': 'Start Date',
    'leave.endDate': 'End Date',
    'leave.reason': 'Reason',
    'leave.status': 'Status',
    'leave.approved': 'Approved',
    'leave.pending': 'Pending',
    'leave.rejected': 'Rejected',
    'leave.annual': 'Annual',
    'leave.sick': 'Sick',
    'leave.casual': 'Casual',
    'leave.total': 'Total',
    'leave.used': 'Used',
    'leave.remaining': 'Remaining',
    
    // Payroll
    'payroll.title': 'Payroll',
    'payroll.currentMonth': 'Current Month',
    'payroll.payrollHistory': 'Payroll History',
    'payroll.basicSalary': 'Basic Salary',
    'payroll.allowances': 'Allowances',
    'payroll.deductions': 'Deductions',
    'payroll.netSalary': 'Net Salary',
    'payroll.payDate': 'Pay Date',
    'payroll.status': 'Status',
    'payroll.paid': 'Paid',
    'payroll.pending': 'Pending',
    'payroll.ytdEarnings': 'YTD Earnings',
    'payroll.ytdDeductions': 'YTD Deductions',
    'payroll.ytdNet': 'YTD Net',
    
    // Documents
    'documents.title': 'Documents',
    'documents.uploadDocument': 'Upload Document',
    'documents.documentHistory': 'Document History',
    'documents.fileName': 'File Name',
    'documents.fileType': 'File Type',
    'documents.uploadDate': 'Upload Date',
    'documents.category': 'Category',
    'documents.size': 'Size',
    
    // Company
    'company.hros': 'HRoS',
    'company.humanResource': 'Human Resource',
    'company.operatingSystem': 'Operating System',
    'company.employeePortal': 'Employee Portal',
  },
  
  sinhala: {
    // Common
    'welcome': 'ආයුබෝවන්',
    'loading': 'පූරණය වෙමින්',
    'error': 'දෝෂය',
    'success': 'සාර්ථකයි',
    'cancel': 'අවලංගු කරන්න',
    'save': 'සුරකින්න',
    'edit': 'සංස්කරණය',
    'delete': 'මකන්න',
    'back': 'ආපසු',
    'home': 'මුල් පිටුව',
    'profile': 'පැතිකඩ',
    'settings': 'සැකසුම්',
    
    // Login
    'login.title': 'නැවතත් ආයුබෝවන්',
    'login.subtitle': 'සේවක ද්වාරය',
    'login.signin': 'පිවිසෙන්න',
    'login.employeeId': 'සේවක අංකය',
    'login.password': 'මුරපදය',
    'login.signingIn': 'පිවිසෙමින්...',
    'login.help': 'උදව් අවශ්‍යද? HR අංශය සම්බන්ධ කරගන්න',
    
    // Dashboard
    'dashboard.goodMorning': 'සුභ උදෑසනක්',
    'dashboard.goodAfternoon': 'සුභ දහවල්',
    'dashboard.goodEvening': 'සුභ සන්ධ්‍යාවක්',
    'dashboard.employeeIdCard': 'සේවක හැඳුනුම්පත',
    'dashboard.todaysStatus': 'අද දිනයේ තත්ත්වය',
    'dashboard.leaveBalance': 'නිවාඩු ශේෂය',
    'dashboard.attendance': 'පැමිණීම',
    'dashboard.payroll': 'වැතන ගණනය',
    'dashboard.quickActions': 'ඉක්මන් ක්‍රියා',
    'dashboard.checkInOut': 'පැමිණීම/නික්මීම',
    'dashboard.applyLeave': 'නිවාඩු ඉල්ලීම',
    'dashboard.documents': 'ලේඛන',
    'dashboard.latestNotices': 'නවතම දැනුම්දීම්',
    'dashboard.upcomingHolidays': 'ඉදිරි නිවාඩු',
    'dashboard.viewDetails': 'විස්තර බලන්න',
    'dashboard.days': 'දින',
    
    // Navigation
    'nav.home': 'මුල් පිටුව',
    'nav.attendance': 'පැමිණීම',
    'nav.leave': 'නිවාඩු',
    'nav.payroll': 'වැතන',
    'nav.profile': 'පැතිකඩ',
    
    // Profile
    'profile.contactInformation': 'සම්බන්ධතා තොරතුරු',
    'profile.email': 'ඊමේල්',
    'profile.phone': 'දුරකථන',
    'profile.department': 'අංශය',
    'profile.joinDate': 'සම්බන්ධ වූ දිනය',
    'profile.darkMode': 'අඳුරු ප්‍රකාරය',
    'profile.notificationSettings': 'දැනුම්දීම් සැකසුම්',
    'profile.privacySettings': 'පෞද්ගලිකත්ව සැකසුම්',
    'profile.language': 'භාෂාව',
    'profile.signOut': 'ඉවත් වෙන්න',
    'profile.years': 'අවුරුදු',
    'profile.attendance': 'පැමිණීම',
    'profile.notProvided': 'සපයා නැත',
    'profile.notSpecified': 'නිශ්චිත නොකර',
    
    // Attendance
    'attendance.title': 'පැමිණීම',
    'attendance.checkIn': 'පැමිණීම',
    'attendance.checkOut': 'නික්මීම',
    'attendance.todaysAttendance': 'අදට පැමිණීම',
    'attendance.attendanceHistory': 'පැමිණීම් ඉතිහාසය',
    'attendance.status': 'තත්ත්වය',
    'attendance.checkInTime': 'පැමිණීමේ වේලාව',
    'attendance.checkOutTime': 'නික්මීමේ වේලාව',
    'attendance.hoursWorked': 'වැඩ කළ පැය',
    'attendance.present': 'පැමිණි',
    'attendance.absent': 'නැති',
    'attendance.late': 'ප්‍රමාද',
    
    // Leave
    'leave.title': 'නිවාඩු කළමනාකරණය',
    'leave.applyLeave': 'නිවාඩු ඉල්ලීම',
    'leave.leaveBalance': 'නිවාඩු ශේෂය',
    'leave.leaveHistory': 'නිවාඩු ඉතිහාසය',
    'leave.leaveType': 'නිවාඩු වර්ගය',
    'leave.startDate': 'ආරම්භක දිනය',
    'leave.endDate': 'අවසාන දිනය',
    'leave.reason': 'හේතුව',
    'leave.status': 'තත්ත්වය',
    'leave.approved': 'අනුමත',
    'leave.pending': 'අපේක්ෂාවේ',
    'leave.rejected': 'ප්‍රතික්ෂේප',
    'leave.annual': 'වාර්ෂික',
    'leave.sick': 'අසනීප',
    'leave.casual': 'අනිත්‍ය',
    'leave.total': 'සම්පූර්ණ',
    'leave.used': 'භාවිතා කළ',
    'leave.remaining': 'ඉතිරි',
    
    // Payroll
    'payroll.title': 'වැතන ගණනය',
    'payroll.currentMonth': 'වර්තමාන මාසය',
    'payroll.payrollHistory': 'වැතන ඉතිහාසය',
    'payroll.basicSalary': 'මූලික වැතන',
    'payroll.allowances': 'දීමනා',
    'payroll.deductions': 'අඩුකිරීම්',
    'payroll.netSalary': 'ශුද්ධ වැතන',
    'payroll.payDate': 'ගෙවන දිනය',
    'payroll.status': 'තත්ත්වය',
    'payroll.paid': 'ගෙවා ඇත',
    'payroll.pending': 'අපේක්ෂාවේ',
    'payroll.ytdEarnings': 'වර්ෂයේ ආදායම',
    'payroll.ytdDeductions': 'වර්ෂයේ අඩුකිරීම්',
    'payroll.ytdNet': 'වර්ෂයේ ශුද්ධ',
    
    // Documents
    'documents.title': 'ලේඛන',
    'documents.uploadDocument': 'ලේඛනයක් උඩුගත කරන්න',
    'documents.documentHistory': 'ලේඛන ඉතිහාසය',
    'documents.fileName': 'ගොනු නම',
    'documents.fileType': 'ගොනු වර්ගය',
    'documents.uploadDate': 'උඩුගත කළ දිනය',
    'documents.category': 'වර්ගය',
    'documents.size': 'ප්‍රමාණය',
    
    // Company
    'company.hros': 'HRoS',
    'company.humanResource': 'මානව සම්පත්',
    'company.operatingSystem': 'මෙහෙයුම් ක්‍රමය',
    'company.employeePortal': 'සේවක ද්වාරය',
  },
  
  tamil: {
    // Common
    'welcome': 'வரவேற்கிறோம்',
    'loading': 'ஏற்றுகிறது',
    'error': 'பிழை',
    'success': 'வெற்றி',
    'cancel': 'ரத்து செய்',
    'save': 'சேமி',
    'edit': 'திருத்து',
    'delete': 'நீக்கு',
    'back': 'பின்',
    'home': 'முகப்பு',
    'profile': 'சுயவிவரம்',
    'settings': 'அமைப்புகள்',
    
    // Login
    'login.title': 'மீண்டும் வரவேற்கிறோம்',
    'login.subtitle': 'பணியாளர் போர்ட்டல்',
    'login.signin': 'உள்நுழைக',
    'login.employeeId': 'பணியாளர் எண்',
    'login.password': 'கடவுச்சொல்',
    'login.signingIn': 'உள்நுழைகிறது...',
    'login.help': 'உதவி தேவையா? HR துறையை தொடர்பு கொள்ளுங்கள்',
    
    // Dashboard
    'dashboard.goodMorning': 'காலை வணக்கம்',
    'dashboard.goodAfternoon': 'மதிய வணக்கம்',
    'dashboard.goodEvening': 'மாலை வணக்கம்',
    'dashboard.employeeIdCard': 'பணியாளர் அடையாள அட்டை',
    'dashboard.todaysStatus': 'இன்றைய நிலை',
    'dashboard.leaveBalance': 'விடுப்பு மீதம்',
    'dashboard.attendance': 'வருகை',
    'dashboard.payroll': 'ஊதியம்',
    'dashboard.quickActions': 'விரைவு செயல்கள்',
    'dashboard.checkInOut': 'உள்/வெளியே',
    'dashboard.applyLeave': 'விடுப்பு விண்ணப்பம்',
    'dashboard.documents': 'ஆவணங்கள்',
    'dashboard.latestNotices': 'சமீபத்திய அறிவிப்புகள்',
    'dashboard.upcomingHolidays': 'வரும் விடுமுறைகள்',
    'dashboard.viewDetails': 'விவரங்களைப் பார்க்க',
    'dashboard.days': 'நாட்கள்',
    
    // Navigation
    'nav.home': 'முகப்பு',
    'nav.attendance': 'வருகை',
    'nav.leave': 'விடுப்பு',
    'nav.payroll': 'ஊதியம்',
    'nav.profile': 'சுயவிவரம்',
    
    // Profile
    'profile.contactInformation': 'தொடர்பு தகவல்',
    'profile.email': 'மின்னஞ்சல்',
    'profile.phone': 'தொலைபேசி',
    'profile.department': 'துறை',
    'profile.joinDate': 'சேர்ந்த தேதி',
    'profile.darkMode': 'இருண்ட பயன்முறை',
    'profile.notificationSettings': 'அறிவிப்பு அமைப்புகள்',
    'profile.privacySettings': 'தனியுரிமை அமைப்புகள்',
    'profile.language': 'மொழி',
    'profile.signOut': 'வெளியேறு',
    'profile.years': 'ஆண்டுகள்',
    'profile.attendance': 'வருகை',
    'profile.notProvided': 'வழங்கப்படவில்லை',
    'profile.notSpecified': 'குறிப்பிடப்படவில்லை',
    
    // Attendance
    'attendance.title': 'வருகை',
    'attendance.checkIn': 'உள்நுழைவு',
    'attendance.checkOut': 'வெளியேறு',
    'attendance.todaysAttendance': 'இன்றைய வருகை',
    'attendance.attendanceHistory': 'வருகை வரலாறு',
    'attendance.status': 'நிலை',
    'attendance.checkInTime': 'உள்நுழைவு நேரம்',
    'attendance.checkOutTime': 'வெளியேறும் நேரம்',
    'attendance.hoursWorked': 'வேலை செய்த மணிநேரங்கள்',
    'attendance.present': 'வந்துள்ளார்',
    'attendance.absent': 'இல்லை',
    'attendance.late': 'தாமதம்',
    
    // Leave
    'leave.title': 'விடுப்பு மேலாண்மை',
    'leave.applyLeave': 'விடுப்பு விண்ணப்பம்',
    'leave.leaveBalance': 'விடுப்பு மீதம்',
    'leave.leaveHistory': 'விடுப்பு வரலாறு',
    'leave.leaveType': 'விடுப்பு வகை',
    'leave.startDate': 'தொடக்க தேதி',
    'leave.endDate': 'முடிவு தேதி',
    'leave.reason': 'காரணம்',
    'leave.status': 'நிலை',
    'leave.approved': 'அனுமதிக்கப்பட்டது',
    'leave.pending': 'நிலுவையில்',
    'leave.rejected': 'நிராகரிக்கப்பட்டது',
    'leave.annual': 'வருடாந்திர',
    'leave.sick': 'நோய்',
    'leave.casual': 'சாதாரண',
    'leave.total': 'மொத்தம்',
    'leave.used': 'பயன்படுத்தப்பட்டது',
    'leave.remaining': 'மீதம்',
    
    // Payroll
    'payroll.title': 'ஊதியம்',
    'payroll.currentMonth': 'தற்போதைய மாதம்',
    'payroll.payrollHistory': 'ஊதிய வரலாறு',
    'payroll.basicSalary': 'அடிப்படை சம்பளம்',
    'payroll.allowances': 'கொடுப்பனவுகள்',
    'payroll.deductions': 'கழிவுகள்',
    'payroll.netSalary': 'நிகர சம்பளம்',
    'payroll.payDate': 'சம்பளம் கொடுக்கும் தேதி',
    'payroll.status': 'நிலை',
    'payroll.paid': 'கொடுக்கப்பட்டது',
    'payroll.pending': 'நிலுவையில்',
    'payroll.ytdEarnings': 'YTD வருமானம்',
    'payroll.ytdDeductions': 'YTD கழிவுகள்',
    'payroll.ytdNet': 'YTD நிகர',
    
    // Documents
    'documents.title': 'ஆவணங்கள்',
    'documents.uploadDocument': 'ஆவணத்தை பதிவேற்று',
    'documents.documentHistory': 'ஆவண வரலாறு',
    'documents.fileName': 'கோப்பு பெயர்',
    'documents.fileType': 'கோப்பு வகை',
    'documents.uploadDate': 'பதிவேற்ற தேதி',
    'documents.category': 'வகை',
    'documents.size': 'அளவு',
    
    // Company
    'company.hros': 'HRoS',
    'company.humanResource': 'மனித வளம்',
    'company.operatingSystem': 'இயக்க முறைமை',
    'company.employeePortal': 'பணியாளர் போர்ட்டல்',
  },
  
  hindi: {
    // Common
    'welcome': 'स्वागत है',
    'loading': 'लोड हो रहा है',
    'error': 'त्रुटि',
    'success': 'सफलता',
    'cancel': 'रद्द करें',
    'save': 'सेव करें',
    'edit': 'संपादित करें',
    'delete': 'हटाएं',
    'back': 'वापस',
    'home': 'होम',
    'profile': 'प्रोफाइल',
    'settings': 'सेटिंग्स',
    
    // Login
    'login.title': 'वापस स्वागत है',
    'login.subtitle': 'कर्मचारी पोर्टल',
    'login.signin': 'साइन इन',
    'login.employeeId': 'कर्मचारी आईडी',
    'login.password': 'पासवर्ड',
    'login.signingIn': 'साइन इन हो रहा है...',
    'login.help': 'मदद चाहिए? HR विभाग से संपर्क करें',
    
    // Dashboard
    'dashboard.goodMorning': 'सुप्रभात',
    'dashboard.goodAfternoon': 'शुभ दोपहर',
    'dashboard.goodEvening': 'शुभ संध्या',
    'dashboard.employeeIdCard': 'कर्मचारी पहचान पत्र',
    'dashboard.todaysStatus': 'आज की स्थिति',
    'dashboard.leaveBalance': 'छुट्टी शेष',
    'dashboard.attendance': 'उपस्थिति',
    'dashboard.payroll': 'वेतन',
    'dashboard.quickActions': 'त्वरित कार्य',
    'dashboard.checkInOut': 'चेक इन/आउट',
    'dashboard.applyLeave': 'छुट्टी आवेदन',
    'dashboard.documents': 'दस्तावेज',
    'dashboard.latestNotices': 'नवीनतम सूचनाएं',
    'dashboard.upcomingHolidays': 'आगामी छुट्टियां',
    'dashboard.viewDetails': 'विवरण देखें',
    'dashboard.days': 'दिन',
    
    // Navigation
    'nav.home': 'होम',
    'nav.attendance': 'उपस्थिति',
    'nav.leave': 'छुट्टी',
    'nav.payroll': 'वेतन',
    'nav.profile': 'प्रोफाइल',
    
    // Profile
    'profile.contactInformation': 'संपर्क जानकारी',
    'profile.email': 'ईमेल',
    'profile.phone': 'फोन',
    'profile.department': 'विभाग',
    'profile.joinDate': 'ज्वाइन की तारीख',
    'profile.darkMode': 'डार्क मोड',
    'profile.notificationSettings': 'नोटिफिकेशन सेटिंग्स',
    'profile.privacySettings': 'प्राइवेसी सेटिंग्स',
    'profile.language': 'भाषा',
    'profile.signOut': 'साइन आउट',
    'profile.years': 'साल',
    'profile.attendance': 'उपस्थिति',
    'profile.notProvided': 'प्रदान नहीं किया गया',
    'profile.notSpecified': 'निर्दिष्ट नहीं',
    
    // Attendance
    'attendance.title': 'उपस्थिति',
    'attendance.checkIn': 'चेक इन',
    'attendance.checkOut': 'चेक आउट',
    'attendance.todaysAttendance': 'आज की उपस्थिति',
    'attendance.attendanceHistory': 'उपस्थिति का इतिहास',
    'attendance.status': 'स्थिति',
    'attendance.checkInTime': 'चेक इन समय',
    'attendance.checkOutTime': 'चेक आउट समय',
    'attendance.hoursWorked': 'काम के घंटे',
    'attendance.present': 'उपस्थित',
    'attendance.absent': 'अनुपस्थित',
    'attendance.late': 'देर से',
    
    // Leave
    'leave.title': 'छुट्टी प्रबंधन',
    'leave.applyLeave': 'छुट्टी आवेदन',
    'leave.leaveBalance': 'छुट्टी शेष',
    'leave.leaveHistory': 'छुट्टी का इतिहास',
    'leave.leaveType': 'छुट्टी का प्रकार',
    'leave.startDate': 'शुरुआती तारीख',
    'leave.endDate': 'अंतिम तारीख',
    'leave.reason': 'कारण',
    'leave.status': 'स्थिति',
    'leave.approved': 'अनुमोदित',
    'leave.pending': 'लंबित',
    'leave.rejected': 'अस्वीकृत',
    'leave.annual': 'वार्षिक',
    'leave.sick': 'बीमारी',
    'leave.casual': 'आकस्मिक',
    'leave.total': 'कुल',
    'leave.used': 'उपयोग किया गया',
    'leave.remaining': 'बची हुई',
    
    // Payroll
    'payroll.title': 'वेतन',
    'payroll.currentMonth': 'वर्तमान महीना',
    'payroll.payrollHistory': 'वेतन का इतिहास',
    'payroll.basicSalary': 'मूल वेतन',
    'payroll.allowances': 'भत्ते',
    'payroll.deductions': 'कटौती',
    'payroll.netSalary': 'शुद्ध वेतन',
    'payroll.payDate': 'वेतन की तारीख',
    'payroll.status': 'स्थिति',
    'payroll.paid': 'भुगतान किया गया',
    'payroll.pending': 'लंबित',
    'payroll.ytdEarnings': 'YTD कमाई',
    'payroll.ytdDeductions': 'YTD कटौती',
    'payroll.ytdNet': 'YTD शुद्ध',
    
    // Documents
    'documents.title': 'दस्तावेज',
    'documents.uploadDocument': 'दस्तावेज अपलोड करें',
    'documents.documentHistory': 'दस्तावेज का इतिहास',
    'documents.fileName': 'फाइल नाम',
    'documents.fileType': 'फाइल प्रकार',
    'documents.uploadDate': 'अपलोड की तारीख',
    'documents.category': 'श्रेणी',
    'documents.size': 'आकार',
    
    // Company
    'company.hros': 'HRoS',
    'company.humanResource': 'मानव संसाधन',
    'company.operatingSystem': 'ऑपरेटिंग सिस्टम',
    'company.employeePortal': 'कर्मचारी पोर्टल',
  },
  
  malayalam: {
    // Common
    'welcome': 'സ്വാഗതം',
    'loading': 'ലോഡിംഗ്',
    'error': 'പിശക്',
    'success': 'വിജയം',
    'cancel': 'റദ്ദാക്കുക',
    'save': 'സേവ് ചെയ്യുക',
    'edit': 'എഡിറ്റ് ചെയ്യുക',
    'delete': 'ഇല്ലാതാക്കുക',
    'back': 'പിന്നോട്ട്',
    'home': 'ഹോം',
    'profile': 'പ്രൊഫൈൽ',
    'settings': 'സെറ്റിംഗ്സ്',
    
    // Login
    'login.title': 'തിരികെ സ്വാഗതം',
    'login.subtitle': 'ജീവനക്കാരുടെ പോർട്ടൽ',
    'login.signin': 'സൈൻ ഇൻ',
    'login.employeeId': 'ജീവനക്കാരൻ ഐഡി',
    'login.password': 'പാസ്‌വേഡ്',
    'login.signingIn': 'സൈൻ ഇൻ ചെയ്യുന്നു...',
    'login.help': 'സഹായം വേണോ? HR വിഭാഗത്തെ ബന്ധപ്പെടുക',
    
    // Dashboard
    'dashboard.goodMorning': 'സുപ്രഭാതം',
    'dashboard.goodAfternoon': 'ഉച്ചയ്ക്ക് നമസ്കാരം',
    'dashboard.goodEvening': 'സന്ധ്യയ്ക്ക് നമസ്കാരം',
    'dashboard.employeeIdCard': 'ജീവനക്കാരൻ ഐഡി കാർഡ്',
    'dashboard.todaysStatus': 'ഇന്നത്തെ സ്ഥിതി',
    'dashboard.leaveBalance': 'അവധി ബാക്കി',
    'dashboard.attendance': 'ഹാജർ',
    'dashboard.payroll': 'ശമ്പളം',
    'dashboard.quickActions': 'വേഗത്തിലുള്ള പ്രവർത്തനങ്ങൾ',
    'dashboard.checkInOut': 'ചെക്ക് ഇൻ/ഔട്ട്',
    'dashboard.applyLeave': 'അവധി അപേക്ഷ',
    'dashboard.documents': 'രേഖകൾ',
    'dashboard.latestNotices': 'ഏറ്റവും പുതിയ അറിയിപ്പുകൾ',
    'dashboard.upcomingHolidays': 'വരാനിരിക്കുന്ന അവധിദിനങ്ങൾ',
    'dashboard.viewDetails': 'വിശദാംശങ്ങൾ കാണുക',
    'dashboard.days': 'ദിവസങ്ങൾ',
    
    // Navigation
    'nav.home': 'ഹോം',
    'nav.attendance': 'ഹാജർ',
    'nav.leave': 'അവധി',
    'nav.payroll': 'ശമ്പളം',
    'nav.profile': 'പ്രൊഫൈൽ',
    
    // Profile
    'profile.contactInformation': 'ബന്ധപ്പെടാനുള്ള വിവരങ്ങൾ',
    'profile.email': 'ഇമെയിൽ',
    'profile.phone': 'ഫോൺ',
    'profile.department': 'വിഭാഗം',
    'profile.joinDate': 'ചേർന്ന തീയതി',
    'profile.darkMode': 'ഇരുണ്ട മോഡ്',
    'profile.notificationSettings': 'അറിയിപ്പ് സെറ്റിംഗ്സ്',
    'profile.privacySettings': 'സ്വകാര്യത സെറ്റിംഗ്സ്',
    'profile.language': 'ഭാഷ',
    'profile.signOut': 'സൈൻ ഔട്ട്',
    'profile.years': 'വർഷങ്ങൾ',
    'profile.attendance': 'ഹാജർ',
    'profile.notProvided': 'നൽകിയിട്ടില്ല',
    'profile.notSpecified': 'വ്യക്തമാക്കിയിട്ടില്ല',
    
    // Attendance
    'attendance.title': 'ഹാജർ',
    'attendance.checkIn': 'ചെക്ക് ഇൻ',
    'attendance.checkOut': 'ചെക്ക് ഔട്ട്',
    'attendance.todaysAttendance': 'ഇന്നത്തെ ഹാജർ',
    'attendance.attendanceHistory': 'ഹാജർ ചരിത്രം',
    'attendance.status': 'സ്ഥിതി',
    'attendance.checkInTime': 'ചെക്ക് ഇൻ സമയം',
    'attendance.checkOutTime': 'ചെക്ക് ഔട്ട് സമയം',
    'attendance.hoursWorked': 'ജോലി ചെയ്ത മണിക്കൂറുകൾ',
    'attendance.present': 'ഹാജർ',
    'attendance.absent': 'അഹാജർ',
    'attendance.late': 'വൈകി',
    
    // Leave
    'leave.title': 'അവധി മാനേജ്മെന്റ്',
    'leave.applyLeave': 'അവധി അപേക്ഷ',
    'leave.leaveBalance': 'അവധി ബാക്കി',
    'leave.leaveHistory': 'അവധി ചരിത്രം',
    'leave.leaveType': 'അവധി തരം',
    'leave.startDate': 'ആരംഭ തീയതി',
    'leave.endDate': 'അവസാന തീയതി',
    'leave.reason': 'കാരണം',
    'leave.status': 'സ്ഥിതി',
    'leave.approved': 'അംഗീകരിച്ചു',
    'leave.pending': 'തീർപ്പുകലാത്ത',
    'leave.rejected': 'നിരസിച്ചു',
    'leave.annual': 'വാർഷിക',
    'leave.sick': 'അസുഖം',
    'leave.casual': 'കാഷ്വൽ',
    'leave.total': 'മൊത്തം',
    'leave.used': 'ഉപയോഗിച്ചത്',
    'leave.remaining': 'ബാക്കി',
    
    // Payroll
    'payroll.title': 'ശമ്പളം',
    'payroll.currentMonth': 'ഈ മാസം',
    'payroll.payrollHistory': 'ശമ്പള ചരിത്രം',
    'payroll.basicSalary': 'അടിസ്ഥാന ശമ്പളം',
    'payroll.allowances': 'അലവൻസുകൾ',
    'payroll.deductions': 'കിഴിവുകൾ',
    'payroll.netSalary': 'ആകെ ശമ്പളം',
    'payroll.payDate': 'ശമ്പള തീയതി',
    'payroll.status': 'സ്ഥിതി',
    'payroll.paid': 'നൽകിയത്',
    'payroll.pending': 'തീർപ്പുകലാത്ത',
    'payroll.ytdEarnings': 'YTD വരുമാനം',
    'payroll.ytdDeductions': 'YTD കിഴിവുകൾ',
    'payroll.ytdNet': 'YTD ആകെ',
    
    // Documents
    'documents.title': 'രേഖകൾ',
    'documents.uploadDocument': 'രേഖ അപ്‌ലോഡ് ചെയ്യുക',
    'documents.documentHistory': 'രേഖാ ചരിത്രം',
    'documents.fileName': 'ഫയൽ പേര്',
    'documents.fileType': 'ഫയൽ തരം',
    'documents.uploadDate': 'അപ്‌ലോഡ് തീയതി',
    'documents.category': 'വിഭാഗം',
    'documents.size': 'വലുപ്പം',
    
    // Company
    'company.hros': 'HRoS',
    'company.humanResource': 'മാനവ വിഭവശേഷി',
    'company.operatingSystem': 'ഓപ്പറേറ്റിംഗ് സിസ്റ്റം',
    'company.employeePortal': 'ജീവനക്കാരുടെ പോർട്ടൽ',
  },
  
  bangla: {
    // Common
    'welcome': 'স্বাগতম',
    'loading': 'লোড হচ্ছে',
    'error': 'ত্রুটি',
    'success': 'সফল',
    'cancel': 'বাতিল',
    'save': 'সংরক্ষণ',
    'edit': 'সম্পাদনা',
    'delete': 'মুছুন',
    'back': 'পিছনে',
    'home': 'হোম',
    'profile': 'প্রোফাইল',
    'settings': 'সেটিংস',
    
    // Login
    'login.title': 'আবার স্বাগতম',
    'login.subtitle': 'কর্মচারী পোর্টাল',
    'login.signin': 'সাইন ইন',
    'login.employeeId': 'কর্মচারী আইডি',
    'login.password': 'পাসওয়ার্ড',
    'login.signingIn': 'সাইন ইন হচ্ছে...',
    'login.help': 'সাহায্য প্রয়োজন? HR বিভাগের সাথে যোগাযোগ করুন',
    
    // Dashboard
    'dashboard.goodMorning': 'সুপ্রভাত',
    'dashboard.goodAfternoon': 'শুভ দুপুর',
    'dashboard.goodEvening': 'শুভ সন্ধ্যা',
    'dashboard.employeeIdCard': 'কর্মচারী পরিচয়পত্র',
    'dashboard.todaysStatus': 'আজকের অবস্থা',
    'dashboard.leaveBalance': 'ছুটির ব্যালেন্স',
    'dashboard.attendance': 'উপস্থিতি',
    'dashboard.payroll': 'বেতন',
    'dashboard.quickActions': 'দ্রুত কাজ',
    'dashboard.checkInOut': 'চেক ইন/আউট',
    'dashboard.applyLeave': 'ছুটির আবেদন',
    'dashboard.documents': 'নথি',
    'dashboard.latestNotices': 'সর্বশেষ নোটিশ',
    'dashboard.upcomingHolidays': 'আসন্ন ছুটির দিন',
    'dashboard.viewDetails': 'বিস্তারিত দেখুন',
    'dashboard.days': 'দিন',
    
    // Navigation
    'nav.home': 'হোম',
    'nav.attendance': 'উপস্থিতি',
    'nav.leave': 'ছুটি',
    'nav.payroll': 'বেতন',
    'nav.profile': 'প্রোফাইল',
    
    // Profile
    'profile.contactInformation': 'যোগাযোগের তথ্য',
    'profile.email': 'ইমেইল',
    'profile.phone': 'ফোন',
    'profile.department': 'বিভাগ',
    'profile.joinDate': 'যোগদানের তারিখ',
    'profile.darkMode': 'ডার্ক মোড',
    'profile.notificationSettings': 'বিজ্ঞপ্তি সেটিংস',
    'profile.privacySettings': 'গোপনীয়তা সেটিংস',
    'profile.language': 'ভাষা',
    'profile.signOut': 'সাইন আউট',
    'profile.years': 'বছর',
    'profile.attendance': 'উপস্থিতি',
    'profile.notProvided': 'প্রদান করা হয়নি',
    'profile.notSpecified': 'নির্দিষ্ট করা হয়নি',
    
    // Attendance
    'attendance.title': 'উপস্থিতি',
    'attendance.checkIn': 'চেক ইন',
    'attendance.checkOut': 'চেক আউট',
    'attendance.todaysAttendance': 'আজকের উপস্থিতি',
    'attendance.attendanceHistory': 'উপস্থিতির ইতিহাস',
    'attendance.status': 'অবস্থা',
    'attendance.checkInTime': 'চেক ইন সময়',
    'attendance.checkOutTime': 'চেক আউট সময়',
    'attendance.hoursWorked': 'কাজের ঘন্টা',
    'attendance.present': 'উপস্থিত',
    'attendance.absent': 'অনুপস্থিত',
    'attendance.late': 'দেরি',
    
    // Leave
    'leave.title': 'ছুটি ব্যবস্থাপনা',
    'leave.applyLeave': 'ছুটির আবেদন',
    'leave.leaveBalance': 'ছুটির ব্যালেন্স',
    'leave.leaveHistory': 'ছুটির ইতিহাস',
    'leave.leaveType': 'ছুটির ধরন',
    'leave.startDate': 'শুরুর তারিখ',
    'leave.endDate': 'শেষের তারিখ',
    'leave.reason': 'কারণ',
    'leave.status': 'অবস্থা',
    'leave.approved': 'অনুমোদিত',
    'leave.pending': 'মুলতুবি',
    'leave.rejected': 'প্রত্যাখ্যাত',
    'leave.annual': 'বার্ষিক',
    'leave.sick': 'অসুস্থতা',
    'leave.casual': 'নৈমিত্তিক',
    'leave.total': 'মোট',
    'leave.used': 'ব্যবহৃত',
    'leave.remaining': 'অবশিষ্ট',
    
    // Payroll
    'payroll.title': 'বেতন',
    'payroll.currentMonth': 'বর্তমান মাস',
    'payroll.payrollHistory': 'বেতনের ইতিহাস',
    'payroll.basicSalary': 'মূল বেতন',
    'payroll.allowances': 'ভাতা',
    'payroll.deductions': 'কর্তন',
    'payroll.netSalary': 'নিট বেতন',
    'payroll.payDate': 'বেতনের তারিখ',
    'payroll.status': 'অবস্থা',
    'payroll.paid': 'প্রদান করা হয়েছে',
    'payroll.pending': 'মুলতুবি',
    'payroll.ytdEarnings': 'YTD আয়',
    'payroll.ytdDeductions': 'YTD কর্তন',
    'payroll.ytdNet': 'YTD নিট',
    
    // Documents
    'documents.title': 'নথি',
    'documents.uploadDocument': 'নথি আপলোড',
    'documents.documentHistory': 'নথির ইতিহাস',
    'documents.fileName': 'ফাইলের নাম',
    'documents.fileType': 'ফাইলের ধরন',
    'documents.uploadDate': 'আপলোডের তারিখ',
    'documents.category': 'বিভাগ',
    'documents.size': 'আকার',
    
    // Company
    'company.hros': 'HRoS',
    'company.humanResource': 'মানব সম্পদ',
    'company.operatingSystem': 'অপারেটিং সিস্টেম',
    'company.employeePortal': 'কর্মচারী পোর্টাল',
  },
};