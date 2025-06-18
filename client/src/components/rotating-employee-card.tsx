import { useState, useEffect } from "react";
import { User, Building, MapPin, Calendar } from "lucide-react";

interface Employee {
  name: string;
  employeeId: string;
  designation?: string;
  department?: string;
  photoUrl?: string;
}

interface RotatingEmployeeCardProps {
  employee?: Employee;
}

export function RotatingEmployeeCard({ employee }: RotatingEmployeeCardProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [rotateZ, setRotateZ] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotateX(prev => (prev + 2) % 360);
      setRotateY(prev => (prev + 1.5) % 360);
      setRotateZ(prev => (prev + 0.5) % 360);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning!";
    if (hour < 17) return "Good Afternoon!";
    return "Good Evening!";
  };

  if (!employee) {
    return (
      <div className="catalyst-card p-6 mb-6">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-foreground mb-1">{getGreeting()}</h2>
          <p className="text-sm text-muted-foreground">Welcome back to HRoS Employee Portal</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 flex justify-center">
      <div 
        className="relative w-72 h-48 perspective-1000"
        style={{
          perspective: '1000px',
          transformStyle: 'preserve-3d'
        }}
      >
        <div
          className="absolute inset-0 rounded-xl shadow-xl transition-transform duration-100 ease-linear"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
            background: 'linear-gradient(135deg, rgba(0, 107, 173, 0.9) 0%, rgba(0, 123, 200, 0.9) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <div className="p-6 h-full flex flex-col justify-between text-white">
            {/* Header */}
            <div className="text-center mb-4">
              <h2 className="text-lg font-bold mb-1">{getGreeting()}</h2>
              <p className="text-xs opacity-90">HRoS Employee Portal</p>
            </div>

            {/* Employee Info */}
            <div className="flex items-center space-x-4">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {employee.photoUrl ? (
                  <img
                    src={employee.photoUrl}
                    alt={employee.name}
                    className="w-16 h-16 rounded-full border-2 border-white/30 object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base truncate">{employee.name}</h3>
                <p className="text-xs opacity-90 mb-1">ID: {employee.employeeId}</p>
                
                {employee.designation && (
                  <div className="flex items-center text-xs opacity-80 mb-1">
                    <Building className="w-3 h-3 mr-1" />
                    <span className="truncate">{employee.designation}</span>
                  </div>
                )}
                
                {employee.department && (
                  <div className="flex items-center text-xs opacity-80">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span className="truncate">{employee.department}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-4">
              <div className="flex items-center justify-center text-xs opacity-80">
                <Calendar className="w-3 h-3 mr-1" />
                <span>{new Date().toLocaleDateString([], { 
                  weekday: 'long', 
                  month: 'short', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>
          </div>

          {/* Glassmorphism overlay for depth */}
          <div 
            className="absolute inset-0 rounded-xl"
            style={{
              background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
              backdropFilter: 'blur(1px)'
            }}
          />
        </div>

        {/* Shadow */}
        <div 
          className="absolute inset-0 rounded-xl opacity-30 blur-lg"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 107, 173, 0.4) 0%, rgba(0, 123, 200, 0.4) 100%)',
            transform: `rotateX(${rotateX * 0.5}deg) rotateY(${rotateY * 0.5}deg) translateZ(-20px)`,
            zIndex: -1
          }}
        />
      </div>
    </div>
  );
}