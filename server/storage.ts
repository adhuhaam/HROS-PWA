import {
  users,
  attendance,
  leaveRequests,
  leaveBalances,
  payroll,
  documents,
  type User,
  type InsertUser,
  type Attendance,
  type InsertAttendance,
  type LeaveRequest,
  type InsertLeaveRequest,
  type LeaveBalance,
  type Payroll,
  type Document,
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmployeeId(employeeId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Attendance operations
  getAttendanceByUserId(userId: number, date?: Date): Promise<Attendance[]>;
  createAttendance(attendance: InsertAttendance & { userId: number }): Promise<Attendance>;
  updateAttendance(id: number, updates: Partial<Attendance>): Promise<Attendance | undefined>;
  
  // Leave operations
  getLeaveRequestsByUserId(userId: number): Promise<LeaveRequest[]>;
  createLeaveRequest(request: InsertLeaveRequest & { userId: number }): Promise<LeaveRequest>;
  getLeaveBalancesByUserId(userId: number, year: number): Promise<LeaveBalance[]>;
  
  // Payroll operations
  getPayrollByUserId(userId: number): Promise<Payroll[]>;
  getPayrollByUserIdAndMonth(userId: number, month: string, year: number): Promise<Payroll | undefined>;
  
  // Document operations
  getDocumentsByUserId(userId: number): Promise<Document[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private attendance: Map<number, Attendance>;
  private leaveRequests: Map<number, LeaveRequest>;
  private leaveBalances: Map<number, LeaveBalance>;
  private payroll: Map<number, Payroll>;
  private documents: Map<number, Document>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.attendance = new Map();
    this.leaveRequests = new Map();
    this.leaveBalances = new Map();
    this.payroll = new Map();
    this.documents = new Map();
    this.currentId = 1;

    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample user
    const sampleUser: User = {
      id: 1,
      employeeId: "EMP001",
      password: "password123", // In real app, this would be hashed
      name: "John Doe",
      email: "john.doe@company.com",
      phone: "+1 (555) 123-4567",
      position: "Senior Software Engineer",
      department: "Technology Department",
      joinDate: new Date("2022-01-15"),
      profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(1, sampleUser);

    // Sample attendance for today
    const today = new Date();
    const todayAttendance: Attendance = {
      id: 1,
      userId: 1,
      checkIn: new Date(today.setHours(9, 0, 0, 0)),
      checkOut: null,
      date: new Date(),
      status: "present",
      createdAt: new Date(),
    };
    this.attendance.set(1, todayAttendance);

    // Sample leave balances
    const currentYear = new Date().getFullYear();
    const leaveTypes = ["Annual Leave", "Sick Leave", "Emergency Leave"];
    const balances = [12, 8, 3];
    
    leaveTypes.forEach((type, index) => {
      const balance: LeaveBalance = {
        id: index + 1,
        userId: 1,
        leaveType: type,
        balance: balances[index],
        year: currentYear,
      };
      this.leaveBalances.set(index + 1, balance);
    });

    // Sample payroll
    const months = ["December", "November", "October", "September"];
    const salaries = [4500, 4350, 4500, 4400];
    
    months.forEach((month, index) => {
      const payrollRecord: Payroll = {
        id: index + 1,
        userId: 1,
        month,
        year: 2024,
        basicSalary: 3500,
        allowances: 1200,
        deductions: 200,
        netSalary: salaries[index],
        createdAt: new Date(),
      };
      this.payroll.set(index + 1, payrollRecord);
    });

    // Sample documents
    const sampleDocs = [
      { title: "Employment Contract 2024", category: "Contracts", fileType: "PDF" },
      { title: "Tax Certificate 2024", category: "Certificates", fileType: "PDF" },
      { title: "Training Certificate", category: "Certificates", fileType: "PDF" },
    ];

    sampleDocs.forEach((doc, index) => {
      const document: Document = {
        id: index + 1,
        userId: 1,
        title: doc.title,
        category: doc.category,
        fileUrl: `/documents/${doc.title.toLowerCase().replace(/\s+/g, '-')}.pdf`,
        fileSize: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
        fileType: doc.fileType,
        createdAt: new Date(),
      };
      this.documents.set(index + 1, document);
    });

    this.currentId = 10; // Start IDs after sample data
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmployeeId(employeeId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.employeeId === employeeId);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = {
      ...insertUser,
      id,
      profileImageUrl: null,
      joinDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getAttendanceByUserId(userId: number, date?: Date): Promise<Attendance[]> {
    const userAttendance = Array.from(this.attendance.values()).filter(att => att.userId === userId);
    if (date) {
      const targetDate = date.toDateString();
      return userAttendance.filter(att => att.date.toDateString() === targetDate);
    }
    return userAttendance;
  }

  async createAttendance(attendanceData: InsertAttendance & { userId: number }): Promise<Attendance> {
    const id = this.currentId++;
    const attendance: Attendance = {
      ...attendanceData,
      id,
      createdAt: new Date(),
    };
    this.attendance.set(id, attendance);
    return attendance;
  }

  async updateAttendance(id: number, updates: Partial<Attendance>): Promise<Attendance | undefined> {
    const existing = this.attendance.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.attendance.set(id, updated);
    return updated;
  }

  async getLeaveRequestsByUserId(userId: number): Promise<LeaveRequest[]> {
    return Array.from(this.leaveRequests.values()).filter(req => req.userId === userId);
  }

  async createLeaveRequest(requestData: InsertLeaveRequest & { userId: number }): Promise<LeaveRequest> {
    const id = this.currentId++;
    const request: LeaveRequest = {
      ...requestData,
      id,
      status: "pending",
      createdAt: new Date(),
    };
    this.leaveRequests.set(id, request);
    return request;
  }

  async getLeaveBalancesByUserId(userId: number, year: number): Promise<LeaveBalance[]> {
    return Array.from(this.leaveBalances.values()).filter(
      balance => balance.userId === userId && balance.year === year
    );
  }

  async getPayrollByUserId(userId: number): Promise<Payroll[]> {
    return Array.from(this.payroll.values())
      .filter(pay => pay.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getPayrollByUserIdAndMonth(userId: number, month: string, year: number): Promise<Payroll | undefined> {
    return Array.from(this.payroll.values()).find(
      pay => pay.userId === userId && pay.month === month && pay.year === year
    );
  }

  async getDocumentsByUserId(userId: number): Promise<Document[]> {
    return Array.from(this.documents.values())
      .filter(doc => doc.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }
}

export const storage = new MemStorage();
