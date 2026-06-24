import React from 'react';
import { Text, View } from 'react-native';
import { Card } from './Card';
import { Button } from './Button';
import type { LeaveCardInfo } from '../types';

interface LeaveInfoCardProps {
  /** Emoji glyph shown in the colored tile. */
  icon: string;
  /** Text color of the icon (hex). */
  iconColor: string;
  /** Background color of the icon tile (hex). */
  iconBgColor: string;  
  title: string;
  /** Label/value lines, e.g. { label: 'Entitlement', value: '30 days' }. */
  
  info: LeaveCardInfo[];
  applyLabel?: string;
  onApply?: () => void;
  className?: string;
}

/**
 * Reusable leave summary card: icon tile + title, a list of label/value rows,
 * a divider, and an "Apply Now" action at the bottom. Data-driven vixa `info`.
 */
export function LeaveInfoCard({
  icon,
  iconColor,
  iconBgColor,
  title,
  info,
  applyLabel = 'Apply Now',
  onApply,
  className = '',
}: LeaveInfoCardProps) {
  return (
    <Card className={className}>
      <View className="flex-row items-center">
        <View
          className="h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: iconBgColor }}>
          <Text className="text-lg" style={{ color: iconColor }}>
            {icon}
          </Text> 
        </View>
        <Text className="ml-3 flex-1 text-base font-bold uppercase text-ink">
          {title}
        </Text>
      </View>

      {/* Info rows */}
      <View className="mt-4">
        {info.map(row => (
          <View
            key={row.label}
            className="flex-row items-center justify-between py-1.5">
            <Text className="text-sm text-ink-muted">{row.label}</Text>
            <Text className="text-sm font-semibold text-ink">{row.value}</Text>
          </View>
        ))}
      </View>

      {/* Divider */}
      <View className="my-4 h-px bg-surface-border" />

      {/* Action */}
      <Button label={applyLabel} className='mt-4 self-start' variant="secondary" onPress={onApply} />
    </Card>
  );
}
