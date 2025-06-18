import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface RotatingCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  bgColor?: string;
  onClick?: () => void;
}

export function RotatingCard({ icon, title, value, bgColor = "bg-green-100", onClick }: RotatingCardProps) {
  const [isRotating, setIsRotating] = useState(false);

  const handleClick = () => {
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 600);
    onClick?.();
  };

  return (
    <Card 
      className={`shadow-sm border touch-active cursor-pointer ${isRotating ? 'card-flip' : ''}`}
      onClick={handleClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
          <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
