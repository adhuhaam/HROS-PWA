import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { loginSchema } from "@shared/schema";
import { z } from "zod";

interface AuthenticatedRequest extends Request {
  user?: any;
  authToken?: string;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Simple session middleware for demo
  let currentUser: any = null;
  let authToken: string | null = null;

  // Middleware to check authentication
  const isAuthenticated = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    if (!currentUser || !authToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = currentUser;
    req.authToken = authToken;
    next();
  };

  // Helper function to make API requests
  const makeApiRequest = async (
    endpoint: string,
    method: string = "GET",
    data?: any,
    token?: string,
  ) => {
    const url = `https://api.rccmaldives.com/ess/${endpoint}`;
    const headers: any = {};

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const options: any = {
      method,
      headers,
    };

    if (data && (method === "POST" || method === "PUT" || method === "PATCH")) {
      if (endpoint === 'auth/index.php') {
        // Send as form data for PHP $_POST
        const formData = new URLSearchParams();
        Object.keys(data).forEach(key => {
          formData.append(key, data[key]);
        });
        options.body = formData;
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
      } else {
        // Send as JSON for other endpoints
        options.body = JSON.stringify(data);
        headers['Content-Type'] = 'application/json';
      }
    }

    const response = await fetch(url, options);
    const result = await response.json();

    return { response, result };
  };

  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { employeeId, password } = loginSchema.parse(req.body);

      const { response, result } = await makeApiRequest(
        "auth/index.php",
        "POST",
        {
          username: employeeId,
          password: password,
        },
      );

      if (result.status !== "success") {
        return res
          .status(401)
          .json({ message: result.message || "Invalid credentials" });
      }

      // Store user data and create a session token
      currentUser = {
        id: result.data.emp_no,
        employeeId: result.data.username,
        name: result.data.staff_name,
        email: "",
        phone: "",
        position: "",
        department: ""
      };
      authToken = `session_${Date.now()}_${result.data.emp_no}`;

      res.json({ user: currentUser });
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      if (error instanceof Error && error.message.includes("fetch")) {
        return res
          .status(503)
          .json({
            message:
              "Authentication service unavailable. Please try again later.",
          });
      }
      res.status(500).json({ message: "Login failed. Please try again." });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    try {
      if (authToken) {
        await makeApiRequest("auth/logout.php", "POST", {}, authToken);
      }
      currentUser = null;
      authToken = null;
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      currentUser = null;
      authToken = null;
      res.json({ message: "Logged out successfully" });
    }
  });

  app.get(
    "/api/auth/user",
    isAuthenticated,
    async (req: AuthenticatedRequest, res) => {
      res.json(currentUser);
    },
  );

  // Dashboard stats
  app.get(
    "/api/dashboard/stats",
    isAuthenticated,
    async (req: AuthenticatedRequest, res) => {
      try {
        const { result: dashboardData } = await makeApiRequest(
          "dashboard/stats.php",
          "GET",
          null,
          req.authToken,
        );

        if (dashboardData.status === "success") {
          res.json(dashboardData.data);
        } else {
          // Fallback stats if endpoint doesn't exist yet
          res.json({
            todayStatus: "Not Checked In",
            leaveBalance: "0 Days",
            monthlyAttendance: "0/22 Days",
            isCheckedIn: false,
          });
        }
      } catch (error) {
        console.error("Dashboard stats error:", error);
        // Fallback stats
        res.json({
          todayStatus: "Not Checked In",
          leaveBalance: "0 Days",
          monthlyAttendance: "0/22 Days",
          isCheckedIn: false,
        });
      }
    },
  );

  // Attendance routes
  app.get(
    "/api/attendance",
    isAuthenticated,
    async (req: AuthenticatedRequest, res) => {
      try {
        const { result } = await makeApiRequest(
          "attendance/list.php",
          "GET",
          null,
          req.authToken,
        );
        res.json(result.status === "success" ? result.data : []);
      } catch (error) {
        console.error("Attendance fetch error:", error);
        res.status(500).json({ message: "Failed to fetch attendance" });
      }
    },
  );

  app.get(
    "/api/attendance/today",
    isAuthenticated,
    async (req: AuthenticatedRequest, res) => {
      try {
        const { result } = await makeApiRequest(
          "attendance/today.php",
          "GET",
          null,
          req.authToken,
        );
        res.json(result.status === "success" ? result.data : null);
      } catch (error) {
        console.error("Today's attendance fetch error:", error);
        res.status(500).json({ message: "Failed to fetch today's attendance" });
      }
    },
  );

  app.post(
    "/api/attendance/checkin",
    isAuthenticated,
    async (req: AuthenticatedRequest, res) => {
      try {
        const { result } = await makeApiRequest(
          "attendance/checkin.php",
          "POST",
          {
            timestamp: new Date().toISOString(),
          },
          req.authToken,
        );

        if (result.status === "success") {
          res.json(result.data);
        } else {
          res
            .status(400)
            .json({ message: result.message || "Failed to check in" });
        }
      } catch (error) {
        console.error("Check-in error:", error);
        res.status(500).json({ message: "Failed to check in" });
      }
    },
  );

  app.post(
    "/api/attendance/checkout",
    isAuthenticated,
    async (req: AuthenticatedRequest, res) => {
      try {
        const { result } = await makeApiRequest(
          "attendance/checkout.php",
          "POST",
          {
            timestamp: new Date().toISOString(),
          },
          req.authToken,
        );

        if (result.status === "success") {
          res.json(result.data);
        } else {
          res
            .status(400)
            .json({ message: result.message || "Failed to check out" });
        }
      } catch (error) {
        console.error("Check-out error:", error);
        res.status(500).json({ message: "Failed to check out" });
      }
    },
  );

  // Leave routes
  app.get(
    "/api/leave/requests",
    isAuthenticated,
    async (req: AuthenticatedRequest, res) => {
      try {
        const { result } = await makeApiRequest(
          "leave/requests.php",
          "GET",
          null,
          req.authToken,
        );
        res.json(result.status === "success" ? result.data : []);
      } catch (error) {
        console.error("Leave requests fetch error:", error);
        res.status(500).json({ message: "Failed to fetch leave requests" });
      }
    },
  );

  app.get(
    "/api/leave/balances",
    isAuthenticated,
    async (req: AuthenticatedRequest, res) => {
      try {
        const { result } = await makeApiRequest(
          "leave/balances.php",
          "GET",
          null,
          req.authToken,
        );
        res.json(result.status === "success" ? result.data : []);
      } catch (error) {
        console.error("Leave balances fetch error:", error);
        res.status(500).json({ message: "Failed to fetch leave balances" });
      }
    },
  );

  app.post(
    "/api/leave/request",
    isAuthenticated,
    async (req: AuthenticatedRequest, res) => {
      try {
        const { result } = await makeApiRequest(
          "leave/apply.php",
          "POST",
          req.body,
          req.authToken,
        );

        if (result.status === "success") {
          res.json(result.data);
        } else {
          res
            .status(400)
            .json({
              message: result.message || "Failed to submit leave request",
            });
        }
      } catch (error) {
        console.error("Leave request error:", error);
        res.status(500).json({ message: "Failed to submit leave request" });
      }
    },
  );

  // Payroll routes
  app.get(
    "/api/payroll",
    isAuthenticated,
    async (req: AuthenticatedRequest, res) => {
      try {
        const { result } = await makeApiRequest(
          "payroll/list.php",
          "GET",
          null,
          req.authToken,
        );
        res.json(result.status === "success" ? result.data : []);
      } catch (error) {
        console.error("Payroll fetch error:", error);
        res.status(500).json({ message: "Failed to fetch payroll" });
      }
    },
  );

  app.get(
    "/api/payroll/current",
    isAuthenticated,
    async (req: AuthenticatedRequest, res) => {
      try {
        const { result } = await makeApiRequest(
          "payroll/current.php",
          "GET",
          null,
          req.authToken,
        );
        res.json(result.status === "success" ? result.data : null);
      } catch (error) {
        console.error("Current payroll fetch error:", error);
        res.status(500).json({ message: "Failed to fetch current payroll" });
      }
    },
  );

  // Documents routes
  app.get(
    "/api/documents",
    isAuthenticated,
    async (req: AuthenticatedRequest, res) => {
      try {
        const { result } = await makeApiRequest(
          "documents/list.php",
          "GET",
          null,
          req.authToken,
        );
        res.json(result.status === "success" ? result.data : []);
      } catch (error) {
        console.error("Documents fetch error:", error);
        res.status(500).json({ message: "Failed to fetch documents" });
      }
    },
  );

  // Employee details route
  app.get("/api/employee/details", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const empNo = req.user?.id;
      const { result } = await makeApiRequest(`employees/index.php?emp_no=${empNo}`, 'GET', null, req.authToken);
      res.json(result.status === 'success' ? result.data : {});
    } catch (error) {
      console.error("Employee details fetch error:", error);
      res.status(500).json({ message: "Failed to fetch employee details" });
    }
  });

  // Notices route
  app.get("/api/notices", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const { result } = await makeApiRequest('settings/index.php?type=notices', 'GET', null, req.authToken);
      res.json(result.status === 'success' ? result.data : []);
    } catch (error) {
      console.error("Notices fetch error:", error);
      res.status(500).json({ message: "Failed to fetch notices" });
    }
  });

  // Holidays route
  app.get("/api/holidays", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const { result } = await makeApiRequest('settings/index.php?type=holidays', 'GET', null, req.authToken);
      res.json(result.status === 'success' ? result.data : []);
    } catch (error) {
      console.error("Holidays fetch error:", error);
      res.status(500).json({ message: "Failed to fetch holidays" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
