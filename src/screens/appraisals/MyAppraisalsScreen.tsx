import React from 'react';
import { Text, View } from 'react-native';
import {
  Badge,
  Card,
  LoadingView,
  ScreenContainer,
  SectionHeader,
} from '../../components';
import type { BadgeTone } from '../../components';
import { appraisalService } from '../../api/services';
import { useAsync } from '../../hooks/useAsync';
import type { Appraisal } from '../../types';

const statusTone: Record<Appraisal['status'], BadgeTone> = {
  Finalized: 'success',
  Submitted: 'info',
  Draft: 'neutral',
};

/** Render a 0-5 rating as filled/empty stars. */
function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  return (
    <View className="flex-row items-center">
      <Text className="text-base">
        {'★'.repeat(full)}
        <Text className="text-ink-faint">{'★'.repeat(5 - full)}</Text>
      </Text>
      <Text className="ml-2 text-sm font-semibold text-ink">
        {rating > 0 ? rating.toFixed(1) : '—'}
      </Text>
    </View>
  );
}

export function MyAppraisalsScreen() {
  const { data, loading } = useAsync(appraisalService.getAppraisals);

  if (loading || !data) {
    return (
      <ScreenContainer scroll={false}>
        <LoadingView />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <SectionHeader title="Appraisal History" />
      <View className="gap-3">
        {data.map(item => (
          <Card key={item.id}>
            <View className="flex-row items-start justify-between">
              <View>
                <Text className="text-base font-semibold text-ink">{item.cycle}</Text>
                <Text className="mt-0.5 text-sm text-ink-muted">{item.reviewer}</Text>
              </View>
              <Badge label={item.status} tone={statusTone[item.status]} />
            </View>

            <View className="mt-3 border-t border-surface-border pt-3">
              <Stars rating={item.rating} />
              <Text className="mt-2 text-sm text-ink-muted">{item.summary}</Text>
              {item.submittedOn ? (
                <Text className="mt-2 text-xs text-ink-faint">
                  Submitted {item.submittedOn}
                </Text>
              ) : null}
            </View>
          </Card>
        ))}
      </View>
    </ScreenContainer>
  );
}
