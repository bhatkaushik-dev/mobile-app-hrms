/**
 * Central route param lists. Importing these gives every screen typed
 * navigation/route props via the helpers in `useAppNavigation`.
 */

export type AuthStackParamList = {
  SignIn: undefined;
};

export type AppStackParamList = {
  Dashboard: undefined;
  PersonalDetails: undefined;
  Payslip: undefined;
  LeaveRequest: undefined;
  LeaveApply: { leaveTitle?: string } | undefined;
  SmartObjectives: undefined;
  MyAppraisals: undefined;
};
