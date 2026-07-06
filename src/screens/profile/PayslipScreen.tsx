import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import {
  Card,
  EmptyView,
  InfoRow,
  LoadingView,
  ScreenContainer,
  SectionHeader,
  SelectField,
} from '../../components';
import type { SelectOption } from '../../components';
import { profileService } from '../../api/services';
import { useAsync } from '../../hooks/useAsync';
import { formatAmount, formatOMR } from '../../utils/format';
import type { PayslipLine } from '../../types';

export function PayslipScreen() {
  const { data, loading } = useAsync(profileService.getPayslips);
  // Selected payslip id; null until the user picks (falls back to the newest).
  const [selectedId, setSelectedId] = useState<string | null>(null);

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

  const selected = data.find(p => p.id === selectedId) ?? data[0];

  // Years for the dropdown (newest first), and the months within the active year.
  const years = [...new Set(data.map(p => p.year))].sort((a, b) => b - a);
  const yearOptions: SelectOption[] = years.map(y => ({
    label: String(y),
    value: String(y),
  }));
  const monthsOfYear = data.filter(p => p.year === selected.year);

  const onPickYear = (value: string) => {
    const year = Number(value);
    const first = data.find(p => p.year === year);
    if (first) setSelectedId(first.id);
  };

  return (
    <ScreenContainer>
      {/* Month / year selector */}
      <Card className="mb-5">
        <Text className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-muted">
          Select Month
        </Text>
        <SelectField
          label="Year"
          value={String(selected.year)}
          options={yearOptions}
          onSelect={onPickYear}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2 pt-3">
          {monthsOfYear.map(slip => {
            const active = slip.id === selected.id;
            return (
              <Pressable
                key={slip.id}
                onPress={() => setSelectedId(slip.id)}
                accessibilityRole="button"
                className={`rounded-full px-4 py-2 ${
                  active ? 'bg-brand-600' : 'bg-surface-muted'
                }`}>
                <Text
                  className={`text-sm font-semibold ${
                    active ? 'text-white' : 'text-ink-muted'
                  }`}>
                  {slip.month}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </Card>

      {/* Net pay highlight */}
      <View className="mb-5 rounded-2xl bg-brand-600 p-4">
        <View className="flex-row items-start justify-between">
          <View className="h-8 w-8 items-center justify-center rounded-lg bg-white/20">
            {/* "M" — Monthly pay-type marker, mirroring the web card. */}
            <Text className="text-base font-bold text-white">M</Text>
          </View>
          <View className="h-9 w-9 items-center justify-center rounded-full bg-white">
            <Text className="text-base">💵</Text>
          </View>
        </View>
        <Text className="mt-3 text-sm text-white/80">Net Pay · {selected.salaryMonth}</Text>
        <Text className="mt-1 text-3xl font-extrabold text-white">
          {formatOMR(selected.netPay)}
        </Text>
        <View className="mt-4 flex-row justify-between">
          <View>
            <Text className="text-xs text-white/70">Paid Days</Text>
            <Text className="text-base font-semibold text-white">{selected.paidDays}</Text>
          </View>
          <View>
            <Text className="text-xs text-white/70">Processed No</Text>
            <Text className="text-base font-semibold text-white">{selected.processedNo}</Text>
          </View>
          <View>
            <Text className="text-xs text-white/70">Status</Text>
            <Text className="text-base font-semibold text-white">{selected.status}</Text>
          </View>
        </View>
      </View>

      {/* Payslip header + download */}
      <SectionHeader
        title={`Payslip #${selected.id}`}
        action={
          <Pressable
            hitSlop={6}
            accessibilityRole="button"
            onPress={() =>
              Alert.alert('Download Payslip', 'Payslip download is coming soon.')
            }>
            <Text className="text-sm font-semibold text-brand-600">⬇ Download</Text>
          </Pressable>
        }
      />
      <Card className="mb-5">
        <InfoRow label="Salary Month" value={selected.salaryMonth} />
        <InfoRow label="Start Date" value={selected.startDate} />
        <InfoRow label="End Date" value={selected.endDate} />
        <InfoRow label="Processed Date" value={selected.processedDate} />
        <InfoRow label="Processed No" value={selected.processedNo} />
        <InfoRow label="Paid Days" value={String(selected.paidDays)} last />
      </Card>

      {/* Earnings */}
      <SectionHeader
        title="Earnings"
        action={<Text className="text-[11px] text-ink-faint">Amounts in OMR</Text>}
      />
      <Card className="mb-5">
        {selected.earnings.map((line, i) => (
          <PayslipLineRow
            key={`${line.description}-${i}`}
            line={line}
            last={i === selected.earnings.length - 1}
          />
        ))}
        <TotalRow label="Total Earnings" amount={selected.totalEarnings} />
      </Card>

      {/* Deductions */}
      <SectionHeader
        title="Deductions"
        action={<Text className="text-[11px] text-ink-faint">Amounts in OMR</Text>}
      />
      {selected.deductions.length === 0 ? (
        <Card className="mb-5">
          <Text className="py-4 text-center text-sm text-ink-muted">
            No deduction details available at the moment.
          </Text>
        </Card>
      ) : (
        <Card className="mb-5">
          {selected.deductions.map((line, i) => (
            <PayslipLineRow
              key={`${line.description}-${i}`}
              line={line}
              negative
              last={i === selected.deductions.length - 1}
            />
          ))}
          <TotalRow label="Total Deductions" amount={selected.totalDeductions} negative />
        </Card>
      )}

      {/* Net pay in words */}
      <Card>
        <Text className="text-xs font-bold uppercase tracking-wider text-ink-muted">
          Net Pay
        </Text>
        <Text className="mt-1 text-xl font-extrabold text-ink">
          {formatOMR(selected.netPay)}
        </Text>
        <Text className="mt-1 text-sm text-ink-muted">({selected.netPayWords})</Text>
      </Card>
    </ScreenContainer>
  );
}

/**
 * One earnings/deductions line: description on top, with the monthly rate and
 * the period amount beneath. Deduction amounts are shown in red with a "-".
 */
function PayslipLineRow({
  line,
  negative = false,
  last = false,
}: {
  line: PayslipLine;
  negative?: boolean;
  last?: boolean;
}) {
  return (
    <View className={`py-3 ${last ? '' : 'border-b border-surface-border'}`}>
      <View className="flex-row items-start justify-between">
        <Text className="mr-3 flex-1 text-sm text-ink">{line.description}</Text>
        <Text
          className={`text-sm font-semibold ${negative ? 'text-danger' : 'text-ink'}`}>
          {negative ? '- ' : ''}
          {formatAmount(line.amount)}
        </Text>
      </View>
      <Text className="mt-0.5 text-xs text-ink-faint">
        Earn Rate: {formatAmount(line.earnRate)}
      </Text>
    </View>
  );
}

/** Bold totals row with a top divider, closing an earnings/deductions card. */
function TotalRow({
  label,
  amount,
  negative = false,
}: {
  label: string;
  amount: number;
  negative?: boolean;
}) {
  return (
    <View className="mt-1 flex-row items-center justify-between border-t border-surface-border pt-3">
      <Text className="text-sm font-bold text-ink">{label}</Text>
      <Text className={`text-sm font-bold ${negative ? 'text-danger' : 'text-ink'}`}>
        {negative ? '- ' : ''}
        {formatAmount(amount)}
      </Text>
    </View>
  );
}
