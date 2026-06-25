import React, { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Badge,
  Card,
  DateField,
  EmployeeSummaryCard,
  LoadingView,
  RadioGroup,
  SectionHeader,
  SelectField,
  TextField,
  formatDMY,
} from '../../components';
import type { SelectOption } from '../../components';
import { leaveService } from '../../api/services';
import { useAsync } from '../../hooks/useAsync';
import { useAppNavigation } from '../../navigation/hooks';
import type { AppStackParamList } from '../../navigation/types';
import type { LeaveMode } from '../../types';

const MODE_OPTIONS = [
  { label: 'Full Day', value: 'Full Day' },
  { label: 'Half Day', value: 'Half Day' },
];

/** Read-only display field for the Transaction Details strip. */
function ReadOnlyField({
  label,
  value,
  containerClassName = '',
}: {
  label: string;
  value: React.ReactNode;
  containerClassName?: string;
}) {
  return (
    <View className={containerClassName}>
      <Text className="mb-2 text-sm font-semibold text-ink">{label}</Text>
      <View className="h-13 min-h-[52px] justify-center rounded-xl bg-surface-muted px-4">
        {typeof value === 'string' ? (
          <Text className="text-base text-ink-muted">{value}</Text>
        ) : (
          value
        )}
      </View>
    </View>
  );
}

export function LeaveApplyScreen() {
  const route = useRoute<RouteProp<AppStackParamList, 'LeaveApply'>>();
  const navigation = useAppNavigation();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  const employee = useAsync(leaveService.getEmployee);
  const colleagues = useAsync(leaveService.getColleagues);
  const cards = useAsync(leaveService.getLeaveCards);

  const [leaveType, setLeaveType] = useState(route.params?.leaveTitle ?? '');
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [mode, setMode] = useState<LeaveMode>('Full Day');
  const [person, setPerson] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    leaveType?: string;
    dates?: string;
    reason?: string;
  }>({});

  const leaveTypeOptions: SelectOption[] = useMemo(
    () => (cards.data ?? []).map(c => ({ label: c.title, value: c.title })),
    [cards.data],
  );
  const personOptions: SelectOption[] = useMemo(
    () => (colleagues.data ?? []).map(c => ({ label: c, value: c })),
    [colleagues.data],
  );

  const leaveDays = useMemo(() => {
    if (!fromDate || !toDate) return 0;
    const ms = toDate.getTime() - fromDate.getTime();
    const inclusive = Math.round(ms / 86_400_000) + 1;
    if (mode === 'Half Day') return 0.5;
    return inclusive;
  }, [fromDate, toDate, mode]);

  const validate = () => {
    const next: typeof errors = {};
    if (!leaveType) next.leaveType = 'Please select a leave type.';
    if (!fromDate || !toDate) next.dates = 'Please choose your leave dates.';
    if (!reason.trim()) next.reason = 'Please enter a reason for leave.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onReset = () => {
    setLeaveType(route.params?.leaveTitle ?? '');
    setFromDate(null);
    setToDate(null);
    setMode('Full Day');
    setPerson('');
    setReason('');
    setErrors({});
  };

  const onSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await leaveService.submitApplication({
        leaveType,
        fromDate: formatDMY(fromDate as Date),
        toDate: formatDMY(toDate as Date),
        days: leaveDays,
        mode,
        personResponsible: person,
        reason: reason.trim(),
      });
      Alert.alert('Submitted', 'Your leave request has been submitted for approval.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert('Error', 'Could not submit your request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (employee.loading || !employee.data) {
    return (
      <View className="flex-1 bg-surface-muted">
        <LoadingView />
      </View>
    );
  }

  const today = new Date();

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-surface-muted"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={headerHeight}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-4">
          {/* Employee header */}
          <EmployeeSummaryCard employee={employee.data} className="mb-5" />

          {/* Transaction details */}
          <SectionHeader title="Transaction Details" />
          <Card className="mb-5">
            <View className="flex-row">
              <ReadOnlyField
                label="Transaction No."
                value="-"
                containerClassName="mr-3 flex-1"
              />
              <ReadOnlyField
                label="Transaction Date"
                value={formatDMY(today)}
                containerClassName="flex-1"
              />
            </View>
            <View className="mt-4 flex-row items-end">
              <ReadOnlyField
                label="Transaction Type"
                value="Leave Request"
                containerClassName="mr-3 flex-1"
              />
              <View className="flex-1">
                <Text className="mb-2 text-sm font-semibold text-ink">Status</Text>
                <View className="h-13 min-h-[52px] justify-center rounded-xl bg-surface-muted px-4">
                  <Badge label="New" tone="info" />
                </View>
              </View>
            </View>
          </Card>

          {/* Leave request form */}
          <SectionHeader title="Leave Request" />
          <Card className="mb-5">
            <SelectField
              label="Leave Type"
              required
              placeholder="Select leave type"
              value={leaveType}
              options={leaveTypeOptions}
              onSelect={v => {
                setLeaveType(v);
                setErrors(e => ({ ...e, leaveType: undefined }));
              }}
              error={errors.leaveType}
            />

            <View className="mt-4 flex-row">
              <DateField
                label="From Date"
                required
                containerClassName="mr-3 flex-1"
                value={fromDate}
                onChange={d => {
                  setFromDate(d);
                  // Keep the range valid: drop an end date that now precedes the start.
                  if (toDate && toDate < d) setToDate(null);
                  setErrors(e => ({ ...e, dates: undefined }));
                }}
                error={errors.dates}
              />
              <DateField
                label="To Date"
                required
                containerClassName="flex-1"
                value={toDate}
                minDate={fromDate}
                onChange={d => {
                  setToDate(d);
                  setErrors(e => ({ ...e, dates: undefined }));
                }}
                error={errors.dates ? ' ' : undefined}
              />
            </View>

            {/* Leave days summary */}
            <View className="mt-4 flex-row items-center justify-between rounded-xl bg-amber-100 px-4 py-3.5">
              <Text className="text-base font-bold text-ink">Leave Days</Text>
              <Text className="text-base font-bold text-ink">
                {leaveDays} {leaveDays === 1 ? 'Day' : 'Days'}
              </Text>
            </View>

            <RadioGroup
              label="Leave Mode"
              className="mt-4"
              options={MODE_OPTIONS}
              value={mode}
              onChange={v => setMode(v as LeaveMode)}
            />

            <SelectField
              label="Person Responsible in Absence"
              containerClassName="mt-4"
              placeholder="Select Person Responsible in Absense"
              value={person}
              options={personOptions}
              onSelect={setPerson}
            />

            <TextField
              label="Reason For Leave / Remarks"
              containerClassName="mt-4"
              placeholder="Leave a message to the approver."
              value={reason}
              onChangeText={t => {
                setReason(t);
                setErrors(e => ({ ...e, reason: undefined }));
              }}
              error={errors.reason}
              multiline
              numberOfLines={4}
              style={{ minHeight: 96, textAlignVertical: 'top' }}
            />
          </Card>
        </View>
      </ScrollView>

      {/* Sticky action bar */}
      <View
        className="flex-row border-t border-surface-border bg-white px-4 pt-3"
        style={{ paddingBottom: insets.bottom + 12 }}>
        <Pressable
          accessibilityRole="button"
          onPress={onReset}
          className="mr-3 h-13 min-h-[52px] flex-1 flex-row items-center justify-center rounded-xl border border-surface-border active:bg-surface-muted">
          <Text className="text-base font-semibold text-ink-muted">↺ Reset</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          disabled={submitting}
          onPress={onSubmit}
          className={`h-13 min-h-[52px] flex-[1.4] flex-row items-center justify-center rounded-xl bg-brand-600 active:bg-brand-700 ${
            submitting ? 'opacity-60' : ''
          }`}>
          <Text className="text-base font-semibold text-white">
            {submitting ? 'Submitting…' : '✓ Submit'}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
