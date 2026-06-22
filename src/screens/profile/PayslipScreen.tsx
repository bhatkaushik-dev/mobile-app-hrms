import React from 'react';
import { Pressable, Text, View } from 'react-native';
import {
  Badge,
  Card,
  EmptyView,
  LoadingView,
  ScreenContainer,
  SectionHeader,
} from '../../components';
import { profileService } from '../../api/services';
import { useAsync } from '../../hooks/useAsync';
import { formatINR } from '../../utils/format';

export function PayslipScreen() {
  const { data, loading } = useAsync(profileService.getPayslips);

  if (loading) {
    return (
      <ScreenContainer scroll={false}>
        <LoadingView />
      </ScreenContainer>
    );
  }

  if (!data || data.length === 0) {
    return (
      <ScreenContainer scroll={false}>
        <EmptyView title="No payslips yet" subtitle="Your payslips will appear here." />
      </ScreenContainer>
    );
  }

  const latest = data[0];

  return (
    <ScreenContainer>
      {/* Latest payslip highlight */}
      <Card className="mb-5 bg-brand-600">
        <Text className="text-sm text-white/80">Latest Net Pay · {latest.month}</Text>
        <Text className="mt-1 text-3xl font-extrabold text-white">
          {formatINR(latest.netPay)}
        </Text>
        <View className="mt-4 flex-row justify-between">
          <View>
            <Text className="text-xs text-white/70">Gross</Text>
            <Text className="text-base font-semibold text-white">
              {formatINR(latest.grossPay)}
            </Text>
          </View>
          <View>
            <Text className="text-xs text-white/70">Deductions</Text>
            <Text className="text-base font-semibold text-white">
              {formatINR(latest.deductions)}
            </Text>
          </View>
          <View>
            <Text className="text-xs text-white/70">Status</Text>
            <Text className="text-base font-semibold text-white">{latest.status}</Text>
          </View>
        </View>
      </Card>

      <SectionHeader title="Payslip History" />
      <View className="gap-3">
        {data.map(slip => (
          <Card key={slip.id}>
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-base font-semibold text-ink">{slip.month}</Text>
                <Text className="text-sm text-ink-muted">Net {formatINR(slip.netPay)}</Text>
              </View>
              <View className="items-end">
                <Badge
                  label={slip.status}
                  tone={slip.status === 'Paid' ? 'success' : 'warning'}
                />
                <Pressable hitSlop={6} className="mt-2">
                  <Text className="text-sm font-semibold text-brand-600">Download</Text>
                </Pressable>
              </View>
            </View>
          </Card>
        ))}
      </View>
    </ScreenContainer>
  );
}
