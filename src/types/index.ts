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

/** "Contract" tab — employment terms plus probation & benefits. */
export interface ContractInfo {
  // Employment details
  category: string;
  lastPaidDate: string;
  workingPattern: string;
  otEligible: boolean;
  currency: string;
  salary: string;
  contractType: string;
  contractPeriod: string;
  contractExpiryDate: string;
  noticePeriodDays: string;
  // Probation & benefits
  probationApplicable: boolean;
  probationPeriod: string;
  probationEndDate: string;
  leaveEligible: boolean;
  passageApplicable: boolean;
  passageFrequency: string;
  sectorPassage: string;
  ssnNo: string;
  ssnDeduction: string;
  gratuity: string;
}

/** One bank account block on the Payment tab. */
export interface BankAccount {
  payeeName: string;
  bankName: string;
  branchName: string;
  accountNumber: string;
}

/** "Payment" tab — payment method plus primary/secondary accounts. */
export interface PaymentInfo {
  paymentMethod: string;
  paymentType: string;
  primaryAccount: BankAccount;
  secondaryAccount?: BankAccount;
}

/** One dependant card on the Dependants tab. */
export interface Dependant {
  id: string;
  name: string;
  relation: string; // Wife, Son, Daughter, ...
  dateOfBirth: string;
  age: string;
  gender: string;
  bloodGroup: string;
  visa: boolean;
  tickets: boolean;
  passage: string;
  passageFrequency: string;
  nationality: string;
  occupation: string;
}

/** One document row (employee's own or a dependant's). */
export interface EmployeeDocument {
  id: string;
  type: string; // PASSPORT, RESIDENT CARD, VISA, ...
  holderName: string;
  relation?: string; // present only for dependent documents
  issuePlace: string;
  issueDate: string;
  expiryDate: string;
}

/** "Documents" tab — split into the employee's own docs and dependants'. */
export interface DocumentsInfo {
  myDocuments: EmployeeDocument[];
  dependentDocuments: EmployeeDocument[];
}

/** One earnings/deductions line on the Salary Details tab. */
export interface SalaryLine {
  id: string;
  name: string;
  basis: string;
  percentage: string;
  effStartDate: string;
  effEndDate: string;
  earnings: number;
  deductions: number;
}

/** "Salary Details" tab — Summary + Details share the same line shape. */
export interface SalaryDetails {
  summary: SalaryLine[];
  details: SalaryLine[];
  netPay: number;
}

/** A single old→new earning change inside a promotion/increment record. */
export interface EarningChange {
  description: string;
  oldAmount: number;
  newAmount: number;
  increment: number;
}

/** One transfer record on the Performance → Transfers timeline. */
export interface TransferRecord {
  id: string;
  date: string;
  changes: { attribute: string; oldValue: string; newValue: string }[];
  txnNo: string;
  txnDate: string;
  notes: string;
}

/** One promotion record on the Performance → Promotions timeline. */
export interface PromotionRecord {
  id: string;
  date: string;
  fromRole: string;
  fromGrade: string;
  toRole: string;
  toGrade: string;
  lines: EarningChange[];
  totalIncrease: number;
  txnNo: string;
  txnDate: string;
  notes: string;
}

/** One increment record on the Performance → Increments timeline. */
export interface IncrementRecord {
  id: string;
  date: string;
  lines: EarningChange[];
  totalIncrease: number;
  txnNo: string;
  txnDate: string;
  notes: string;
}

/** One disciplinary action on the Performance → Disciplinary Actions timeline. */
export interface DisciplinaryAction {
  id: string;
  date: string;
  type: string;
  description: string;
  txnNo: string;
}

/** "Performance" tab — four independent timelines. */
export interface PerformanceInfo {
  transfers: TransferRecord[];
  promotions: PromotionRecord[];
  increments: IncrementRecord[];
  disciplinaryActions: DisciplinaryAction[];
}

export type LeaveBarTone = 'normal' | 'high' | 'low';

/** One year's bar on the Leaves Taken chart. */
export interface LeaveTakenYear {
  year: string;
  days: number;
  tone: LeaveBarTone;
}

/** One active loan row. */
export interface ActiveLoan {
  id: string;
  type: string;
  amount: number;
  outstanding: number;
  emi: number;
  startDate: string;
}

/** One stage on the Career Plan progression. */
export interface CareerStage {
  id: string;
  title: string;
  description: string;
  nextLevelIn: string;
  responsibilities: string[];
  current: boolean;
}

/** "Career Plan" tab — current role plus the full progression path. */
export interface CareerPlan {
  currentRole: string;
  stages: CareerStage[];
}

/** Full profile bundle loaded by the Personal Details screen. */
export interface EmployeeProfile {
  header: ProfileHeader;
  organization: OrganizationInfo;
  overview: ProfileOverview;
  generalInfo: GeneralInfo;
  contract: ContractInfo;
  payment: PaymentInfo;
  dependants: Dependant[];
  documents: DocumentsInfo;
  salary: SalaryDetails;
  performance: PerformanceInfo;
  leavesTaken: LeaveTakenYear[];
  activeLoans: ActiveLoan[];
  careerPlan: CareerPlan;
}

/**
 * One row of a payslip's Earnings or Deductions table.
 * `earnRate` is the full monthly rate; `amount` is what was actually
 * earned/deducted for the period (they differ on pro-rated lines).
 */
export interface PayslipLine {
  description: string; // e.g. "Basic (Annual Leave: 09/06/2024-30/06/2024)"
  earnRate: number;
  amount: number;
}

/** A processed monthly payslip, mirroring the web "Pay slip" panel. */
export interface Payslip {
  id: string; // payslip number, e.g. "8459"
  month: string; // "June"
  year: number; // 2024
  salaryMonth: string; // "June, 2024"
  startDate: string; // "01-Jun-2024"
  endDate: string; // "30-Jun-2024"
  processedDate: string; // "27-Jun-2024"
  processedNo: string; // "8459"
  paidDays: number; // 30
  earnings: PayslipLine[];
  deductions: PayslipLine[];
  totalEarnings: number;
  totalDeductions: number;
  netPay: number;
  netPayWords: string; // "Rial Omani Two Thousand One Hundred Fifty Only"
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

/* ── Approvals (mirrors the web Approvals workspace) ─────────────────────── */

/**
 * One approval workflow tab. `count` mirrors the badge the web shows next to
 * each tab name. The full tab list is data-driven from `approvalTabs.json`.
 */
export interface ApprovalTab {
  key: string;
  label: string;
  count: number;
}

/** A single label/value detail line shown when an approval row is expanded. */
export interface ApprovalDetail {
  label: string;
  value: string;
}

/**
 * One column in an approvals grid. Columns are defined per tab (the web shows a
 * different column set for each workflow), so the table renders generically.
 */
export interface ApprovalColumn {
  key: string;
  label: string;
  /** Fixed cell width in px (the grid scrolls horizontally). */
  width: number;
  /** `amount` right-aligns + formats; `avatar` shows initials + name. */
  type?: 'text' | 'amount' | 'avatar';
}

/** One row in an approvals grid. `cells` is keyed by the column `key`. */
export interface ApprovalRecord {
  id: string;
  cells: Record<string, string | number>;
  /** Extra detail lines revealed when the row is expanded. */
  additionalDetails: ApprovalDetail[];
}

/** A tab's full grid: its column definitions plus the rows to show. */
export interface ApprovalTable {
  columns: ApprovalColumn[];
  rows: ApprovalRecord[];
}
