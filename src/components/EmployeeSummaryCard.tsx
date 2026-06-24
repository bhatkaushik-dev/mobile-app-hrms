import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Avatar } from './Avatar';
import { InfoRow } from './InfoRow';
import type { LeaveEmployee } from '../types';

interface EmployeeSummaryCardProps {
  employee: LeaveEmployee;
  /** Whether the detail section starts expanded. */
  defaultExpanded?: boolean;
  className?: string;
}

/**
 * Employee header used on the Leave Apply/Edit screen. Collapsed shows the key
 * identity fields; expanding reveals the full profile (mirrors the web card).
 */
export function EmployeeSummaryCard({
  employee,
  defaultExpanded = false,
  className = '',
}: EmployeeSummaryCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <View
      className={`rounded-2xl border border-surface-border bg-white p-4 ${className}`}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        onPress={() => setExpanded(e => !e)}
        className="flex-row items-center">
        <Avatar name={employee.employeeName} size={48} />
        <View className="ml-3 flex-1">
          <Text className="text-base font-bold text-ink" numberOfLines={1}>
            {employee.employeeName}
          </Text>
          <Text className="text-sm text-ink-muted" numberOfLines={1}>
            {employee.employeeCode} · {employee.designation}
          </Text>
          <Text className="text-xs text-ink-faint">Grade {employee.grade}</Text>
        </View>
        <Text className="ml-2 text-xl text-ink-muted">
          {expanded ? '⌄' : '›'}
        </Text>
      </Pressable>

      {expanded ? (
        <View className="mt-3 border-t border-surface-border pt-1">
          <InfoRow label="Date of Birth" value={employee.dateOfBirth} />
          <InfoRow label="Age" value={String(employee.age)} />
          <InfoRow label="Join Date" value={employee.joinDate} />
          <InfoRow label="Office Email" value={employee.officeEmail} />
          <InfoRow label="Personal Email" value={employee.personalEmail} />
          <InfoRow label="Mobile No" value={employee.mobileNo} />
          <InfoRow label="Reports To" value={employee.reportsTo} />
          <InfoRow label="Division" value={employee.division} />
          <InfoRow label="Branch" value={employee.branch} />
          <InfoRow label="Department" value={employee.department} />
          <InfoRow label="Section" value={employee.section} />
          <InfoRow label="Service Years" value={String(employee.serviceYears)} />
          <InfoRow label="Nationality" value={employee.nationality} last />
        </View>
      ) : null}
    </View>
  );
}
