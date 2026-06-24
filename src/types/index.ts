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

/** A single label/value line on a leave info card (e.g. "Entitlement" → "30 days"). */
export interface LeaveCardInfo {
  label: string;
  value: string;
}

/** Data-driven leave type card shown on the Leave Request screen. */
export interface LeaveCard {
  id: string;
  title: string;
  icon: string;
  iconColor: string;
  iconBgColor: string;
  info: LeaveCardInfo[];
}

/** Employee profile shown in the header of the Leave Apply/Edit screen. */
export interface LeaveEmployee {
  employeeCode: string;
  employeeName: string;
  designation: string;
  grade: string;
  dateOfBirth: string;
  age: number;
  joinDate: string;
  officeEmail: string;
  personalEmail: string;
  mobileNo: string;
  reportsTo: string;
  division: string;
  branch: string;
  department: string;
  section: string;
  serviceYears: number;
  nationality: string;
}

export type LeaveMode = 'Full Day' | 'Half Day';

/** Payload submitted from the Leave Apply/Edit form. */
export interface LeaveApplication {
  leaveType: string;
  fromDate: string;
  toDate: string;
  days: number;
  mode: LeaveMode;
  personResponsible: string;
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
