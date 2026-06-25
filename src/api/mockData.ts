/**
 * Centralized mock data. In a real app this lives behind the backend; keeping it
 * in one file makes it obvious what to delete once services hit real endpoints.
 */
import type {
  Appraisal,
  EmployeeProfile,
  LeaveBalance,
  LeaveRequest,
  Payslip,
  PersonalDetails,
  SmartObjective,
  User,
} from '../types';

export const mockUser: User = {
  id: 'EMP-1024',
  userId: 'admin',
  name: 'Aarav Mehta',
  email: 'aarav.mehta@technova.com',
  designation: 'Senior Software Engineer',
  department: 'Product Engineering',
};

export const mockPersonalDetails: PersonalDetails = {
  fullName: 'Aarav Mehta',
  employeeId: 'EMP-1024',
  dateOfBirth: '12 Aug 1993',
  gender: 'Male',
  bloodGroup: 'O+',
  maritalStatus: 'Married',
  phone: '+91 98765 43210',
  personalEmail: 'aarav.m@gmail.com',
  address: '42, Lake View Residency, Bengaluru, KA 560037',
  emergencyContactName: 'Priya Mehta',
  emergencyContactPhone: '+91 98765 11122',
};

/**
 * Employee profile — transcribed from the web "My Profile" panel so the mobile
 * Organization/Overview tabs show the same data. Replace with a real endpoint.
 */
export const mockEmployeeProfile: EmployeeProfile = {
  header: {
    fullName: 'Baljinder Singh Dhanoa',
    designation: 'Senior IT Manager',
    phone: '9988776655',
    email: 'Jane.Smith@Company.Com',
    location: 'Sultanate of Oman',
  },
  organization: {
    division: 'Overheads',
    branch: 'OIT00000',
    department: 'OIT00000',
    section: 'Not Applicable',
    jobType: 'NA',
    designation: 'Senior IT Manager',
    grade: 'H04',
    location: 'Sultanate of Oman',
    joinedDate: '17/05/2006',
    servicePeriod: '20 Years, 1 Months & 6 Days',
    expatriate: true,
    reportsTo: 'Moh Rizwan Ali Ansari',
    role: 'Staff',
  },
  overview: {
    references: [
      {
        id: 'REF-1',
        name: 'Test',
        designation: '-',
        phoneNo: '12121212',
        email: 'Pna@gmail.com',
        organisation: '-',
        address: 'Blr',
      },
      {
        id: 'REF-2',
        name: 'As Applicable',
        designation: 'N/A',
        phoneNo: '123456789',
        email: 'test@mail.com',
        organisation: 'Finance',
        address: 'Wadi Kabir',
      },
      {
        id: 'REF-3',
        name: 'Test',
        designation: '-',
        phoneNo: '12121212',
        email: 'Pna@gmail.com',
        organisation: '-',
        address: 'Blr',
      },
    ],
    addresses: [
      {
        kind: 'Permanent',
        contactName: 'Robert Smith',
        city: 'Muttrah',
        country: '-',
        address: '456 Park Avenue',
        region: 'Muscat',
        addressType: 'Permanent',
        addressNature: '-',
      },
      {
        kind: 'Local',
        contactName: '-',
        city: '-',
        country: '-',
        address: 'Flat No 74, Air Borne Bldg, Ghala',
        region: '-',
        addressType: 'Local',
        addressNature: 'GEN',
      },
      {
        kind: 'Temporary',
        contactName: '-',
        city: '-',
        country: '-',
        address: 'Flat No 76 Temp, Air Borne Bldg, Ghala2',
        region: '-',
        addressType: 'Temporary',
        addressNature: 'ICE',
      },
      {
        kind: 'Emergency 1',
        contactName: 'Robert Smith',
        city: '-',
        country: '-',
        address: 'Flat No 84 Temp, ICE, Ghala2',
        region: '-',
        addressType: 'Emergency',
        addressNature: 'ICE',
      },
      {
        kind: 'Emergency 2',
        contactName: '-',
        city: '-',
        country: '-',
        address: 'Flat No 85, ICE, Ghala2',
        region: '-',
        addressType: 'Emergency',
        addressNature: 'ICE',
      },
    ],
  },
  generalInfo: {
    workExperience: [
      {
        id: 'WX-1',
        fromDate: '21/04/2020',
        toDate: '21/04/2025',
        designation: 'Manager',
        company: 'ABC Pvt Ltd, Mumbai',
        experience: '5 Years 1 Days',
        hasAttachment: true,
      },
    ],
    qualifications: [
      {
        id: 'QL-1',
        year: '2018',
        degree: 'Bachelor of Engg',
        specialization: 'Mechanical',
        university: 'Reva University',
        location: 'Bangalore',
        highestDegree: false,
        hasAttachment: true,
      },
      {
        id: 'QL-2',
        year: '2006',
        degree: 'Bachelor of Engg',
        specialization: 'Chemical',
        university: 'Mumbai University',
        location: 'Mumbai',
        highestDegree: false,
        hasAttachment: true,
      },
      {
        id: 'QL-3',
        year: '2006',
        degree: 'Bachelor of Engg',
        specialization: 'Chemical',
        university: 'Mumbai University',
        location: 'Mumbai',
        highestDegree: false,
        hasAttachment: true,
      },
    ],
  },
};

export const mockPayslips: Payslip[] = [
  { id: 'PS-2605', month: 'May 2026', grossPay: 142000, netPay: 118400, deductions: 23600, status: 'Paid' },
  { id: 'PS-2604', month: 'April 2026', grossPay: 142000, netPay: 118400, deductions: 23600, status: 'Paid' },
  { id: 'PS-2603', month: 'March 2026', grossPay: 142000, netPay: 117900, deductions: 24100, status: 'Paid' },
  { id: 'PS-2602', month: 'February 2026', grossPay: 138000, netPay: 115200, deductions: 22800, status: 'Paid' },
];

export const mockLeaveBalances: LeaveBalance[] = [
  { type: 'Casual', total: 12, used: 5 },
  { type: 'Sick', total: 10, used: 2 },
  { type: 'Earned', total: 18, used: 6 },
];

export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: 'LR-3012',
    type: 'Earned',
    fromDate: '18 Jun 2026',
    toDate: '20 Jun 2026',
    days: 3,
    reason: 'Family function out of town.',
    status: 'Approved',
    appliedOn: '02 Jun 2026',
  },
  {
    id: 'LR-3009',
    type: 'Sick',
    fromDate: '09 Jun 2026',
    toDate: '09 Jun 2026',
    days: 1,
    reason: 'Fever and rest advised.',
    status: 'Approved',
    appliedOn: '09 Jun 2026',
  },
  {
    id: 'LR-3015',
    type: 'Casual',
    fromDate: '28 Jun 2026',
    toDate: '28 Jun 2026',
    days: 1,
    reason: 'Personal errand.',
    status: 'Pending',
    appliedOn: '15 Jun 2026',
  },
];

export const mockObjectives: SmartObjective[] = [
  {
    id: 'OBJ-01',
    title: 'Ship the new billing module',
    description: 'Deliver invoicing v2 with automated tax computation by end of H1.',
    weightage: 35,
    progress: 80,
    status: 'In Progress',
    dueDate: '30 Jun 2026',
  },
  {
    id: 'OBJ-02',
    title: 'Reduce API p95 latency by 30%',
    description: 'Profile and optimize the three slowest service endpoints.',
    weightage: 25,
    progress: 55,
    status: 'In Progress',
    dueDate: '15 Jul 2026',
  },
  {
    id: 'OBJ-03',
    title: 'Mentor two junior engineers',
    description: 'Run weekly pairing sessions and track growth plans.',
    weightage: 20,
    progress: 100,
    status: 'Completed',
    dueDate: '31 May 2026',
  },
  {
    id: 'OBJ-04',
    title: 'Improve unit test coverage to 85%',
    description: 'Add tests across the payments and auth packages.',
    weightage: 20,
    progress: 0,
    status: 'Not Started',
    dueDate: '30 Aug 2026',
  },
];

export const mockAppraisals: Appraisal[] = [
  {
    id: 'APR-2025H2',
    cycle: 'H2 2025',
    reviewer: 'Neha Kapoor (Engineering Manager)',
    rating: 4.5,
    status: 'Finalized',
    submittedOn: '12 Jan 2026',
    summary: 'Exceeded expectations on delivery and ownership. Strong technical leadership.',
  },
  {
    id: 'APR-2025H1',
    cycle: 'H1 2025',
    reviewer: 'Neha Kapoor (Engineering Manager)',
    rating: 4.0,
    status: 'Finalized',
    submittedOn: '10 Jul 2025',
    summary: 'Consistent performer. Recommended to take on more cross-team initiatives.',
  },
  {
    id: 'APR-2026H1',
    cycle: 'H1 2026',
    reviewer: 'Neha Kapoor (Engineering Manager)',
    rating: 0,
    status: 'Draft',
    summary: 'Self-assessment pending. Review window opens 01 Jul 2026.',
  },
];
