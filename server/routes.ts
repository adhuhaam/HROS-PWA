import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, leaveRequestSchema, attendanceSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Simple session middleware for demo
  let currentUser: any = null;

  // Middleware to check authentication
  const isAuthenticated = (req: any, res: any, next: any) => {
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
      
      const user = await storage.getUserByEmployeeId(employeeId);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Set current user (in real app, use proper session management)
      currentUser = user;
      
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    currentUser = null;
    res.json({ message: "Logged out successfully" });
  });

  app.get("/api/auth/user", isAuthenticated, async (req, res) => {
    const { password: _, ...userWithoutPassword } = currentUser;
    res.json(userWithoutPassword);
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
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
  app.get("/api/attendance", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const attendance = await storage.getAttendanceByUserId(userId);
      res.json(attendance);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch attendance" });
    }
  });

  app.get("/api/attendance/today", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const today = new Date();
      const todayAttendance = await storage.getAttendanceByUserId(userId, today);
      res.json(todayAttendance[0] || null);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch today's attendance" });
    }
  });

  app.post("/api/attendance/checkin", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
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

  app.post("/api/attendance/checkout", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
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
  app.get("/api/leave/requests", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const requests = await storage.getLeaveRequestsByUserId(userId);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch leave requests" });
    }
  });

  app.get("/api/leave/balances", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const currentYear = new Date().getFullYear();
      const balances = await storage.getLeaveBalancesByUserId(userId, currentYear);
      res.json(balances);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch leave balances" });
    }
  });

  app.post("/api/leave/request", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
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
  app.get("/api/payroll", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const payroll = await storage.getPayrollByUserId(userId);
      res.json(payroll);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch payroll" });
    }
  });

  app.get("/api/payroll/current", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
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
  app.get("/api/documents", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const documents = await storage.getDocumentsByUserId(userId);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
