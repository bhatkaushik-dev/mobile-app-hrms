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

/* ── Employee profile (mirrors the web "My Profile" panel) ───────────────── */

/** Left-panel summary card shown above the profile tabs. */
export interface ProfileHeader {
  fullName: string;
  designation: string;
  phone: string;
  email: string;
  location: string;
}

/** "Organization" tab — structure + employee details. */
export interface OrganizationInfo {
  // Organization structure
  division: string;
  branch: string;
  department: string;
  section: string;
  // Employee details
  jobType: string;
  designation: string;
  grade: string;
  location: string;
  joinedDate: string;
  servicePeriod: string;
  expatriate: boolean;
  reportsTo: string;
  role: string;
}

/** A single reference contact (the web shows up to three). */
export interface Reference {
  id: string;
  name: string;
  designation: string;
  phoneNo: string;
  email: string;
  organisation: string;
  address: string;
}

export type AddressKind =
  | 'Permanent'
  | 'Local'
  | 'Temporary'
  | 'Emergency 1'
  | 'Emergency 2';

/** One address block. `kind` drives the card's badge label. */
export interface AddressInfo {
  kind: AddressKind;
  contactName: string;
  city: string;
  country: string;
  address: string;
  region: string;
  addressType: string;
  addressNature: string;
}

/** "Overview" tab — references + address blocks. */
export interface ProfileOverview {
  references: Reference[];
  addresses: AddressInfo[];
}

/** One row of the work-experience timeline. */
export interface WorkExperience {
  id: string;
  fromDate: string;
  toDate: string;
  designation: string;
  company: string; // company with location, e.g. "ABC Pvt Ltd, Mumbai"
  experience: string; // e.g. "5 Years 1 Days"
  hasAttachment: boolean;
}

/** One row of the qualification timeline. */
export interface Qualification {
  id: string;
  year: string;
  degree: string;
  specialization: string;
  university: string;
  location: string;
  highestDegree: boolean;
  hasAttachment: boolean;
}

/**
 * "General Info" tab. Reference/address sub-tabs reuse the `overview` data;
 * this only carries the two timelines unique to General Info.
 */
export interface GeneralInfo {
  workExperience: WorkExperience[];
  qualifications: Qualification[];
}

/** Full profile bundle loaded by the Personal Details screen. */
export interface EmployeeProfile {
  header: ProfileHeader;
  organization: OrganizationInfo;
  overview: ProfileOverview;
  generalInfo: GeneralInfo;
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
