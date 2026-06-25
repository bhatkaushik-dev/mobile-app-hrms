/**
 * Domain services. Screens call these — never the mock data or client directly.
 * Swapping to a real backend means changing the bodies here only.
 */
import type {
  ApprovalTab,
  ApprovalTable,
  Appraisal,
  AuthSession,
  EmployeeProfile,
  LeaveApplication,
  LeaveBalance,
  LeaveCard,
  LeaveEmployee,
  LeaveRequest,
  NewLeaveRequest,
  Payslip,
  PersonalDetails,
  SmartObjective,
} from '../types';
import { mockReject, mockRequest } from './client';
import leaveCards from '../data/leaveCards.json';
import approvalTabs from '../data/approvalTabs.json';
import {
  mockAppraisals,
  mockApprovalTables,
  genericApprovalColumns,
  mockEmployeeProfile,
  mockColleagues,
  mockLeaveBalances,
  mockLeaveEmployee,
  mockLeaveRequests,
  mockObjectives,
  mockPayslips,
  mockPersonalDetails,
  mockUser,
} from './mockData';

export const authService = {
  /** Demo credentials: admin / password */
  async signIn(userId: string, password: string): Promise<AuthSession> {
    if (userId.trim().toLowerCase() === 'admin' && password === 'password') {
      return mockRequest({ token: 'mock-jwt-token', user: mockUser });
    }
    return mockReject<AuthSession>('Invalid User ID or password.');
  },
};

export const profileService = {
  getPersonalDetails(): Promise<PersonalDetails> {
    return mockRequest(mockPersonalDetails);
  },
  getEmployeeProfile(): Promise<EmployeeProfile> {
    return mockRequest(mockEmployeeProfile);
  },
  getPayslips(): Promise<Payslip[]> {
    return mockRequest(mockPayslips);
  },
};

export const leaveService = {
  /** Leave type cards (entitlement, balance, etc.), sourced from leaveCards.json. */
  getLeaveCards(): Promise<LeaveCard[]> {
    return mockRequest(leaveCards as LeaveCard[]);
  },
  /** Employee profile shown in the Leave Apply/Edit header. */
  getEmployee(): Promise<LeaveEmployee> {
    return mockRequest(mockLeaveEmployee);
  },
  /** People selectable as the responsible person while on leave. */
  getColleagues(): Promise<string[]> {
    return mockRequest(mockColleagues);
  },
  /** Submit a new leave application from the Apply/Edit form. */
  submitApplication(payload: LeaveApplication): Promise<{ id: string }> {
    return mockRequest({ id: `LR-${3100 + payload.days}` });
  },
  getBalances(): Promise<LeaveBalance[]> {
    return mockRequest(mockLeaveBalances);
  },
  getRequests(): Promise<LeaveRequest[]> {
    return mockRequest(mockLeaveRequests);
  },
  submitRequest(payload: NewLeaveRequest): Promise<LeaveRequest> {
    const days = 1; // a real impl computes this from the date range
    const created: LeaveRequest = {
      id: `LR-${Math.floor(3000 + days * 17)}`,
      type: payload.type,
      fromDate: payload.fromDate,
      toDate: payload.toDate,
      days,
      reason: payload.reason,
      status: 'Pending',
      appliedOn: payload.fromDate,
    };
    return mockRequest(created);
  },
};

export const approvalService = {
  /** All approval workflow tabs (with their badge counts), from approvalTabs.json. */
  getTabs(): Promise<ApprovalTab[]> {
    return mockRequest(approvalTabs as ApprovalTab[]);
  },
  /**
   * The grid (columns + rows) for a given tab. Tabs with a bespoke grid return
   * it directly; every other tab synthesizes `count` generic rows so the table
   * is populated until real endpoints exist.
   */
  getApprovals(tabKey: string): Promise<ApprovalTable> {
    const bespoke = mockApprovalTables[tabKey];
    if (bespoke) {
      return mockRequest(bespoke);
    }

    const tab = (approvalTabs as ApprovalTab[]).find(t => t.key === tabKey);
    const count = tab?.count ?? 0;
    const rows = Array.from({ length: count }, (_, i) => ({
      id: `${tabKey}-${i + 1}`,
      cells: {
        slNo: i + 1,
        transactionNo: `26/${String(1000 + i + 1).padStart(7, '0')}`,
        createdDateTime: `0${(i % 9) + 1}/03/2026 1${i % 10}:24:0${i % 9}`,
        description: `${tab?.label ?? 'Process'} request #${i + 1}`,
        createdUserName: 'Administrator',
        amount: (i % 3) * 1250.5,
      },
      additionalDetails: [],
    }));
    return mockRequest({ columns: genericApprovalColumns, rows });
  },
};

export const appraisalService = {
  getObjectives(): Promise<SmartObjective[]> {
    return mockRequest(mockObjectives);
  },
  getAppraisals(): Promise<Appraisal[]> {
    return mockRequest(mockAppraisals);
  },
};
