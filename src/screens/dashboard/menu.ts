import type { AppStackParamList } from '../../navigation/types';

/**
 * Dashboard menu definition — data-driven so adding a workflow is a one-line
 * change here, not a UI rewrite. `route` must be a real screen in AppStack;
 * `soon: true` marks portal modules that exist on web but aren't built yet.
 */

/** Named pastel tints for the home-grid tiles. `bg` is the tile square color. */
export type TileTint =
  | 'amber'
  | 'sky'
  | 'emerald'
  | 'violet'
  | 'rose'
  | 'cyan'
  | 'indigo'
  | 'orange'
  | 'teal'
  | 'fuchsia';

/**
 * Full, literal class strings per tint so NativeWind's compiler can see them.
 * Never build these by interpolation — the classes must appear verbatim.
 */
export const TILE_TINT_BG: Record<TileTint, string> = {
  amber: 'bg-amber-100',
  sky: 'bg-sky-100',
  emerald: 'bg-emerald-100',
  violet: 'bg-violet-100',
  rose: 'bg-rose-100',
  cyan: 'bg-cyan-100',
  indigo: 'bg-indigo-100',
  orange: 'bg-orange-100',
  teal: 'bg-teal-100',
  fuchsia: 'bg-fuchsia-100',
};

export interface MenuItem {
  key: string;
  label: string;
  description: string;
  icon: string;
  tint: TileTint;
  route?: keyof AppStackParamList;
  soon?: boolean;
}

/**
 * Every workflow shown on the home grid, in display order. Flattened into a
 * single grid (the visual approach) while keeping the data driving it here.
 */
export const dashboardTiles: MenuItem[] = [
  {
    key: 'personal-details',
    label: 'Personal Details',
    description: 'Your profile, contact & emergency info',
    icon: '👤',
    tint: 'sky',
    route: 'PersonalDetails',
  },
  {
    key: 'payslip',
    label: 'Payslip',
    description: 'View and download monthly payslips',
    icon: '💰',
    tint: 'amber',
    route: 'Payslip',
  },
  {
    key: 'leave-request',
    label: 'Leave Request',
    description: 'Apply for leave & track approvals',
    icon: '🗓️',
    tint: 'emerald',
    route: 'LeaveRequest',
  },
  {
    key: 'smart-objectives',
    label: 'Smart Objectives',
    description: 'Track your SMART goals & progress',
    icon: '🎯',
    tint: 'violet',
    route: 'SmartObjectives',
  },
  {
    key: 'my-appraisals',
    label: 'My Appraisals',
    description: 'Performance reviews & ratings',
    icon: '⭐',
    tint: 'rose',
    route: 'MyAppraisals',
  },
  {
    key: 'approvals',
    label: 'Approvals',
    description: 'Review & action pending requests',
    icon: '✅',
    tint: 'cyan',
    route: 'Approvals',
  },
  {
    key: 'calendar',
    label: 'Calendar',
    description: 'Holidays & events',
    icon: '📅',
    tint: 'indigo',
    soon: true,
  },
  {
    key: 'attendance',
    label: 'Attendance',
    description: 'Punch in / out & timesheet',
    icon: '🕒',
    tint: 'orange',
    soon: true,
  },
  {
    key: 'claims',
    label: 'Claims',
    description: 'Submit expense claims',
    icon: '🧾',
    tint: 'teal',
    soon: true,
  },
  {
    key: 'loans',
    label: 'Loans & Advances',
    description: 'Loan requests & balances',
    icon: '🏦',
    tint: 'fuchsia',
    soon: true,
  },
  {
    key: 'compliance',
    label: 'Compliance',
    description: 'Policies & acknowledgements',
    icon: '📋',
    tint: 'sky',
    soon: true,
  },
];

/**
 * Rotating promo/quick-action banners shown in the top carousel. Each links to
 * a real workflow — the copy references features that already exist.
 */
export interface DashboardBanner {
  key: string;
  title: string;
  subtitle: string;
  icon: string;
  /** Two-stop gradient (start → end) drawn behind the banner. */
  gradient: readonly [string, string];
  route?: keyof AppStackParamList;
}

export const dashboardBanners: DashboardBanner[] = [
  {
    key: 'leave',
    title: 'Time off, sorted',
    subtitle: 'Apply for leave and track approvals in seconds.',
    icon: '🗓️',
    gradient: ['#1F7BA0', '#309CDC'],
    route: 'LeaveRequest',
  },
  {
    key: 'objectives',
    title: 'Stay on target',
    subtitle: 'Follow your SMART objectives and progress.',
    icon: '🎯',
    gradient: ['#7C3AED', '#A855F7'],
    route: 'SmartObjectives',
  },
  {
    key: 'payslip',
    title: 'Your payslips, anytime',
    subtitle: 'View and download monthly payslips on the go.',
    icon: '💰',
    gradient: ['#B45309', '#F59E0B'],
    route: 'Payslip',
  },
];
