/**
 * Domain services. Screens call these — never the mock data or client directly.
 * Swapping to a real backend means changing the bodies here only.
 */
import type {
  Appraisal,
  AuthSession,
  LeaveBalance,
  LeaveRequest,
  NewLeaveRequest,
  Payslip,
  PersonalDetails,
  SmartObjective,
} from '../types';
import { mockReject, mockRequest } from './client';
import {
  mockAppraisals,
  mockLeaveBalances,
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
  getPayslips(): Promise<Payslip[]> {
    return mockRequest(mockPayslips);
  },
};

export const leaveService = {
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

export const appraisalService = {
  getObjectives(): Promise<SmartObjective[]> {
    return mockRequest(mockObjectives);
  },
  getAppraisals(): Promise<Appraisal[]> {
    return mockRequest(mockAppraisals);
  },
};
