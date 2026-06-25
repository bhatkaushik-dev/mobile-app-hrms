import React from 'react';
import { View } from 'react-native';
import {
  EmptyView,
  LeaveInfoCard,
  LoadingView,
  ScreenContainer,
  SectionHeader,
} from '../../components';
import { leaveService } from '../../api/services';
import { useAsync } from '../../hooks/useAsync';
import { useAppNavigation } from '../../navigation/hooks';

export function LeaveRequestScreen() {
  const cards = useAsync(leaveService.getLeaveCards);
  const navigation = useAppNavigation();

  const onApply = (title: string) => {
    navigation.navigate('LeaveApply', { leaveTitle: title });
  };

  return (
    <ScreenContainer>
      <SectionHeader title="Leave Request" />

      {cards.loading ? (
        <LoadingView />
      ) : (cards.data ?? []).length === 0 ? (
        <EmptyView title="No leave types" subtitle="Nothing to show right now." />
      ) : (
        <View className="gap-12">
          {(cards.data ?? []).map(card => (
            <LeaveInfoCard
              key={card.id}
              icon={card.icon}
              iconColor={card.iconColor}
              iconBgColor={card.iconBgColor}
              title={card.title}
              info={card.info}
              onApply={() => onApply(card.title)}
            />
          ))}
        </View>
      )}
    </ScreenContainer>
  );
}
