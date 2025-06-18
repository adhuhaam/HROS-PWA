import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { LoadingOverlay } from "@/components/loading-overlay";

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (credentials: { employeeId: string; password: string }) => {
      return await apiRequest("POST", "/api/auth/login", credentials);
    },
    onSuccess: () => {
      toast({
        title: "Welcome back!",
        description: "Login successful",
      });
      onLoginSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate({ employeeId, password });
  };

  return (
    <div className="h-screen flex flex-col justify-center px-6 py-safe fade-in">
      <LoadingOverlay isVisible={loginMutation.isPending} message="Logging in..." />
      
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-hros-blue rounded-2xl mb-6">
          <Users className="text-white text-2xl w-8 h-8" />
        </div>
        <h1 className="text-2xl font-medium text-gray-900 mb-2">Welcome to HRoS</h1>
        <p className="text-gray-600">Employee Self Service Portal</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-2">
            Employee No
          </Label>
          <Input
            id="employeeId"
            type="text"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-hros-blue focus:border-transparent transition-all"
            placeholder="Enter your employee number"
          />
        </div>
        
        <div>
          <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-hros-blue focus:border-transparent transition-all"
            placeholder="Enter your password"
          />
        </div>
        
        <Button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full bg-hros-blue text-white py-3 rounded-xl font-medium text-lg hover:bg-blue-700 transition-colors"
        >
          {loginMutation.isPending ? "Logging in..." : "Login"}
        </Button>
        
        <div className="text-center">
          <a href="#" className="text-hros-blue text-sm hover:underline">
            Forgot Password?
          </a>
        </div>
      </form>
    </div>
  );
}
