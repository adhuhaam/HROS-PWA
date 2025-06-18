import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, leaveRequestSchema, attendanceSchema } from "@shared/schema";
import { z } from "zod";

interface AuthenticatedRequest extends Request {
  user?: any;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Simple session middleware for demo
  let currentUser: any = null;

  // Middleware to check authentication
  const isAuthenticated = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!currentUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = currentUser;
    next();
  };

  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { employeeId, password } = loginSchema.parse(req.body);
      
      // Call external API
      const response = await fetch("https://api.rccmaldives.com/ess/auth/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          username: employeeId, 
          password: password 
        }),
      });

      if (!response.ok) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const apiResponse = await response.json();
      
      // Check if login was successful
      if (apiResponse.status !== 'success') {
        return res.status(401).json({ message: apiResponse.message || "Invalid credentials" });
      }

      // Create or update user in local storage with API data
      const userData = apiResponse.data;
      let user = await storage.getUserByEmployeeId(employeeId);
      
      if (!user) {
        // Create new user with API data
        user = await storage.createUser({
          employeeId: userData.employee_id || userData.username || employeeId,
          password: password, // Store for session management
          name: userData.name || userData.full_name || userData.display_name || "Employee",
          email: userData.email || "",
          phone: userData.phone || userData.mobile || userData.contact || "",
          position: userData.position || userData.designation || userData.job_title || "",
          department: userData.department || userData.dept || "",
        });
      }

      // Set current user for session
      currentUser = user;
      
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      if (error instanceof Error && error.message.includes('fetch')) {
        return res.status(503).json({ message: "Authentication service unavailable. Please try again later." });
      }
      res.status(500).json({ message: "Login failed. Please try again." });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    currentUser = null;
    res.json({ message: "Logged out successfully" });
  });

  app.get("/api/auth/user", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    const { password: _, ...userWithoutPassword } = currentUser;
    res.json(userWithoutPassword);
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.id;
      const today = new Date();
      const currentYear = today.getFullYear();

      // Get today's attendance
      const todayAttendance = await storage.getAttendanceByUserId(userId, today);
      const isCheckedIn = todayAttendance.length > 0 && todayAttendance[0].checkIn && !todayAttendance[0].checkOut;

      // Get leave balances
      const leaveBalances = await storage.getLeaveBalancesByUserId(userId, currentYear);
      const totalLeaveBalance = leaveBalances.reduce((sum, balance) => sum + balance.balance, 0);

      // Get monthly attendance count
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const allAttendance = await storage.getAttendanceByUserId(userId);
      const monthlyAttendance = allAttendance.filter(att => 
        att.date >= monthStart && att.status === "present"
      ).length;

      const workingDaysInMonth = 22; // Simplified

      res.json({
        todayStatus: isCheckedIn ? "Present" : "Not Checked In",
        leaveBalance: `${totalLeaveBalance} Days`,
        monthlyAttendance: `${monthlyAttendance}/${workingDaysInMonth} Days`,
        isCheckedIn
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Attendance routes
  app.get("/api/attendance", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.id;
      const attendance = await storage.getAttendanceByUserId(userId);
      res.json(attendance);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch attendance" });
    }
  });

  app.get("/api/attendance/today", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.id;
      const today = new Date();
      const todayAttendance = await storage.getAttendanceByUserId(userId, today);
      res.json(todayAttendance[0] || null);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch today's attendance" });
    }
  });

  app.post("/api/attendance/checkin", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.id;
      const now = new Date();

      const attendance = await storage.createAttendance({
        userId,
        checkIn: now,
        checkOut: null,
        date: now,
        status: "present"
      });

      res.json(attendance);
    } catch (error) {
      res.status(500).json({ message: "Failed to check in" });
    }
  });

  app.post("/api/attendance/checkout", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.id;
      const today = new Date();
      const todayAttendance = await storage.getAttendanceByUserId(userId, today);
      
      if (todayAttendance.length === 0 || todayAttendance[0].checkOut) {
        return res.status(400).json({ message: "No active check-in found" });
      }

      const updated = await storage.updateAttendance(todayAttendance[0].id, {
        checkOut: new Date()
      });

      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to check out" });
    }
  });

  // Leave routes
  app.get("/api/leave/requests", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.id;
      const requests = await storage.getLeaveRequestsByUserId(userId);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch leave requests" });
    }
  });

  app.get("/api/leave/balances", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.id;
      const currentYear = new Date().getFullYear();
      const balances = await storage.getLeaveBalancesByUserId(userId, currentYear);
      res.json(balances);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch leave balances" });
    }
  });

  app.post("/api/leave/request", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.id;
      const requestData = leaveRequestSchema.parse(req.body);
      
      const request = await storage.createLeaveRequest({
        ...requestData,
        userId
      });

      res.json(request);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Failed to submit leave request" });
    }
  });

  // Payroll routes
  app.get("/api/payroll", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.id;
      const payroll = await storage.getPayrollByUserId(userId);
      res.json(payroll);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch payroll" });
    }
  });

  app.get("/api/payroll/current", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.id;
      const now = new Date();
      const currentMonth = now.toLocaleString('default', { month: 'long' });
      const currentYear = now.getFullYear();
      
      const currentPayroll = await storage.getPayrollByUserIdAndMonth(userId, currentMonth, currentYear);
      res.json(currentPayroll);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch current payroll" });
    }
  });

  // Documents routes
  app.get("/api/documents", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.id;
      const documents = await storage.getDocumentsByUserId(userId);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
