import React, { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import {
  Badge,
  Button,
  Card,
  LoadingView,
  ScreenContainer,
  SectionHeader,
  TextField,
} from '../../components';
import type { BadgeTone } from '../../components';
import { leaveService } from '../../api/services';
import { useAsync } from '../../hooks/useAsync';
import type { LeaveRequest, LeaveStatus, LeaveType } from '../../types';

const LEAVE_TYPES: LeaveType[] = ['Casual', 'Sick', 'Earned', 'Unpaid'];

const statusTone: Record<LeaveStatus, BadgeTone> = {
  Approved: 'success',
  Pending: 'warning',
  Rejected: 'danger',
};

export function LeaveRequestScreen() {
  const balances = useAsync(leaveService.getBalances);
  const requests = useAsync(leaveService.getRequests);

  const [type, setType] = useState<LeaveType>('Casual');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localRequests, setLocalRequests] = useState<LeaveRequest[]>([]);

  const onSubmit = async () => {
    if (!fromDate.trim() || !toDate.trim() || !reason.trim()) {
      Alert.alert('Incomplete', 'Please fill the dates and reason.');
      return;
    }
    setSubmitting(true);
    try {
      const created = await leaveService.submitRequest({ type, fromDate, toDate, reason });
      setLocalRequests(prev => [created, ...prev]);
      setFromDate('');
      setToDate('');
      setReason('');
      Alert.alert('Submitted', 'Your leave request has been submitted for approval.');
    } catch {
      Alert.alert('Error', 'Could not submit your request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const allRequests = [...localRequests, ...(requests.data ?? [])];

  return (
    <ScreenContainer>
      {/* Leave balances */}
      <SectionHeader title="Leave Balance" />
      {balances.loading ? (
        <LoadingView />
      ) : (
        <View className="mb-6 flex-row justify-between">
          {(balances.data ?? []).map((b, i, arr) => (
            <Card
              key={b.type}
              className={`flex-1 ${i < arr.length - 1 ? 'mr-3' : ''}`}>
              <Text className="text-xs text-ink-muted">{b.type}</Text>
              <Text className="mt-1 text-2xl font-extrabold text-ink">
                {b.total - b.used}
              </Text>
              <Text className="text-xs text-ink-faint">of {b.total} left</Text>
            </Card>
          ))}
        </View>
      )}

      {/* New request form */}
      <SectionHeader title="Apply for Leave" />
      <Card className="mb-6">
        <Text className="mb-2 text-sm font-semibold text-ink">Leave Type</Text>
        <View className="mb-4 flex-row flex-wrap">
          {LEAVE_TYPES.map(t => {
            const selected = t === type;
            return (
              <Pressable
                key={t}
                onPress={() => setType(t)}
                className={`mb-2 mr-2 rounded-full border px-4 py-2 ${
                  selected
                    ? 'border-brand-600 bg-brand-50'
                    : 'border-surface-border bg-white'
                }`}>
                <Text
                  className={`text-sm font-medium ${
                    selected ? 'text-brand-600' : 'text-ink-muted'
                  }`}>
                  {t}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View className="flex-row">
          <TextField
            label="From"
            containerClassName="mr-3 flex-1"
            placeholder="18 Jun 2026"
            value={fromDate}
            onChangeText={setFromDate}
          />
          <TextField
            label="To"
            containerClassName="flex-1"
            placeholder="20 Jun 2026"
            value={toDate}
            onChangeText={setToDate}
          />
        </View>

        <TextField
          label="Reason"
          containerClassName="mt-4"
          placeholder="Briefly describe your reason"
          value={reason}
          onChangeText={setReason}
          multiline
        />

        <Button
          label="Submit Request"
          className="mt-5"
          loading={submitting}
          onPress={onSubmit}
        />
      </Card>

      {/* Request history */}
      <SectionHeader title="My Requests" />
      {requests.loading ? (
        <LoadingView />
      ) : (
        <View className="gap-3">
          {allRequests.map(req => (
            <Card key={req.id}>
              <View className="flex-row items-start justify-between">
                <View className="flex-1">
                  <Text className="text-base font-semibold text-ink">
                    {req.type} Leave · {req.days} {req.days > 1 ? 'days' : 'day'}
                  </Text>
                  <Text className="mt-0.5 text-sm text-ink-muted">
                    {req.fromDate} → {req.toDate}
                  </Text>
                  <Text className="mt-1 text-sm text-ink-faint">{req.reason}</Text>
                </View>
                <Badge label={req.status} tone={statusTone[req.status]} />
              </View>
            </Card>
          ))}
        </View>
      )}
    </ScreenContainer>
  );
}
