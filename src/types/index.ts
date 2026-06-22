/**
 * Shared domain types for the Employee Portal.
 * Keep API response shapes here so screens and services agree on one contract.
 */

export interface User {
  id: string;
  userId: string;
  name: string;
  email: string;
  designation: string;
  department: string;
  avatarUrl?: string;
}

export interface AuthSession {
  token: string;
  user: User;
}

export interface PersonalDetails {
  fullName: string;
  employeeId: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  maritalStatus: string;
  phone: string;
  personalEmail: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

export interface Payslip {
  id: string;
  month: string; // e.g. "May 2026"
  grossPay: number;
  netPay: number;
  deductions: number;
  status: 'Paid' | 'Processing';
}

export type LeaveType = 'Casual' | 'Sick' | 'Earned' | 'Unpaid';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveBalance {
  type: LeaveType;
  total: number;
  used: number;
}

export interface LeaveRequest {
  id: string;
  type: LeaveType;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;
}

export interface NewLeaveRequest {
  type: LeaveType;
  fromDate: string;
  toDate: string;
  reason: string;
}

export type ObjectiveStatus = 'Not Started' | 'In Progress' | 'Completed';

export interface SmartObjective {
  id: string;
  title: string;
  description: string;
  weightage: number; // percentage
  progress: number; // 0-100
  status: ObjectiveStatus;
  dueDate: string;
}

export interface Appraisal {
  id: string;
  cycle: string; // e.g. "H1 2026"
  reviewer: string;
  rating: number; // 1-5
  status: 'Draft' | 'Submitted' | 'Finalized';
  submittedOn?: string;
  summary: string;
}
