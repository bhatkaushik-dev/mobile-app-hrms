import type { AppStackParamList } from '../../navigation/types';

/**
 * Dashboard menu definition — data-driven so adding a workflow is a one-line
 * change here, not a UI rewrite. `route` must be a real screen in AppStack;
 * `soon: true` marks portal modules that exist on web but aren't built yet.
 */
export interface MenuItem {
  key: string;
  label: string;
  description: string;
  icon: string;
  route?: keyof AppStackParamList;
  soon?: boolean;
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

export const menuSections: MenuSection[] = [
  {
    title: 'My Profile',
    items: [
      {
        key: 'personal-details',
        label: 'Personal Details',
        description: 'Your profile, contact & emergency info',
        icon: '👤',
        route: 'PersonalDetails',
      },
      {
        key: 'payslip',
        label: 'Payslip',
        description: 'View and download monthly payslips',
        icon: '💰',
        route: 'Payslip',
      },
    ],
  },
  {
    title: 'Leave',
    items: [
      {
        key: 'leave-request',
        label: 'Leave Request',
        description: 'Apply for leave & track approvals',
        icon: '🗓️',
        route: 'LeaveRequest',
      },
    ],
  },
  {
    title: 'Appraisals',
    items: [
      {
        key: 'smart-objectives',
        label: 'Smart Objectives',
        description: 'Track your SMART goals & progress',
        icon: '🎯',
        route: 'SmartObjectives',
      },
      {
        key: 'my-appraisals',
        label: 'My Appraisals',
        description: 'Performance reviews & ratings',
        icon: '⭐',
        route: 'MyAppraisals',
      },
    ],
  },
];

/** Other portal modules (mirrors the web sidebar). Built incrementally. */
export const upcomingModules: MenuItem[] = [
  { key: 'calendar', label: 'Calendar', description: '', icon: '📅', soon: true },
  { key: 'approvals', label: 'Approvals', description: '', icon: '✅', route: 'Approvals' },
  { key: 'attendance', label: 'Attendance', description: '', icon: '🕒', soon: true },
  { key: 'claims', label: 'Claims', description: '', icon: '🧾', soon: true },
  { key: 'loans', label: 'Loans & Advances', description: '', icon: '🏦', soon: true },
  { key: 'compliance', label: 'Compliance', description: '', icon: '📋', soon: true },
];
