import { pgTable, text, serial, timestamp, integer, boolean, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for employee data
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  employeeId: varchar("employee_id").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone"),
  position: text("position"),
  department: text("department"),
  joinDate: timestamp("join_date"),
  profileImageUrl: text("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Attendance records
export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  checkIn: timestamp("check_in"),
  checkOut: timestamp("check_out"),
  date: timestamp("date").notNull(),
  status: varchar("status").notNull(), // present, absent, leave
  createdAt: timestamp("created_at").defaultNow(),
});

// Leave requests
export const leaveRequests = pgTable("leave_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  leaveType: varchar("leave_type").notNull(),
  fromDate: timestamp("from_date").notNull(),
  toDate: timestamp("to_date").notNull(),
  reason: text("reason"),
  status: varchar("status").notNull().default("pending"), // pending, approved, rejected
  createdAt: timestamp("created_at").defaultNow(),
});

// Leave balances
export const leaveBalances = pgTable("leave_balances", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  leaveType: varchar("leave_type").notNull(),
  balance: integer("balance").notNull().default(0),
  year: integer("year").notNull(),
});

// Payroll records
export const payroll = pgTable("payroll", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  month: varchar("month").notNull(),
  year: integer("year").notNull(),
  basicSalary: integer("basic_salary").notNull(),
  allowances: integer("allowances").default(0),
  deductions: integer("deductions").default(0),
  netSalary: integer("net_salary").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Documents
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  category: varchar("category").notNull(),
  fileUrl: text("file_url").notNull(),
  fileSize: varchar("file_size"),
  fileType: varchar("file_type"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schema validations
export const insertUserSchema = createInsertSchema(users).pick({
  employeeId: true,
  password: true,
  name: true,
  email: true,
  phone: true,
  position: true,
  department: true,
});

export const loginSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  password: z.string().min(1, "Password is required"),
});

export const leaveRequestSchema = createInsertSchema(leaveRequests).pick({
  leaveType: true,
  fromDate: true,
  toDate: true,
  reason: true,
});

export const attendanceSchema = createInsertSchema(attendance).pick({
  checkIn: true,
  checkOut: true,
  date: true,
  status: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type Attendance = typeof attendance.$inferSelect;
export type InsertAttendance = z.infer<typeof attendanceSchema>;
export type LeaveRequest = typeof leaveRequests.$inferSelect;
export type InsertLeaveRequest = z.infer<typeof leaveRequestSchema>;
export type LeaveBalance = typeof leaveBalances.$inferSelect;
export type Payroll = typeof payroll.$inferSelect;
export type Document = typeof documents.$inferSelect;
