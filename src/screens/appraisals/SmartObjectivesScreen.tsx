import React from 'react';
import { Text, View } from 'react-native';
import {
  Badge,
  Card,
  LoadingView,
  ProgressBar,
  ScreenContainer,
  SectionHeader,
} from '../../components';
import type { BadgeTone } from '../../components';
import { appraisalService } from '../../api/services';
import { useAsync } from '../../hooks/useAsync';
import type { ObjectiveStatus } from '../../types';

const statusTone: Record<ObjectiveStatus, BadgeTone> = {
  Completed: 'success',
  'In Progress': 'info',
  'Not Started': 'neutral',
};

export function SmartObjectivesScreen() {
  const { data, loading } = useAsync(appraisalService.getObjectives);

  if (loading || !data) {
    return (
      <ScreenContainer scroll={false}>
        <LoadingView />
      </ScreenContainer>
    );
  }

  const overall = Math.round(
    data.reduce((sum, o) => sum + (o.progress * o.weightage) / 100, 0),
  );

  return (
    <ScreenContainer>
      <Card className="mb-5 bg-brand-600">
        <Text className="text-sm text-white/80">Overall Goal Progress</Text>
        <Text className="mt-1 text-3xl font-extrabold text-white">{overall}%</Text>
        <View className="mt-3">
          <ProgressBar value={overall} tone="success" />
        </View>
        <Text className="mt-2 text-xs text-white/70">
          {data.length} objectives · weighted by importance
        </Text>
      </Card>

      <SectionHeader title="My Objectives" />
      <View className="gap-3">
        {data.map(obj => (
          <Card key={obj.id}>
            <View className="flex-row items-start justify-between">
              <Text className="mr-3 flex-1 text-base font-semibold text-ink">
                {obj.title}
              </Text>
              <Badge label={obj.status} tone={statusTone[obj.status]} />
            </View>
            <Text className="mt-1 text-sm text-ink-muted">{obj.description}</Text>

            <View className="mt-3 flex-row items-center justify-between">
              <Text className="text-xs text-ink-faint">Weightage {obj.weightage}%</Text>
              <Text className="text-xs text-ink-faint">Due {obj.dueDate}</Text>
            </View>
            <View className="mt-2 flex-row items-center">
              <View className="flex-1">
                <ProgressBar value={obj.progress} />
              </View>
              <Text className="ml-3 text-sm font-semibold text-ink">
                {obj.progress}%
              </Text>
            </View>
          </Card>
        ))}
      </View>
    </ScreenContainer>
  );
}
