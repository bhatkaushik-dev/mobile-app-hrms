import React, { useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppIcon, Avatar, GradientFill } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { useAppNavigation } from '../../navigation/hooks';
import {
  dashboardBanners,
  dashboardTiles,
  TILE_TINT_BG,
  type DashboardBanner,
  type MenuItem,
} from './menu';

const SCREEN_WIDTH = Dimensions.get('window').width;
const H_PADDING = 16;
const BANNER_WIDTH = SCREEN_WIDTH - H_PADDING * 2;

// function greeting(): string {
//   // Static bucket keeps it deterministic; swap for real time-of-day if desired.
//   return 'Welcome back';
// }

export function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useAppNavigation();
  const { user, signOut } = useAuth();
  const [bannerIndex, setBannerIndex] = useState(0);
  const bannerRef = useRef<ScrollView>(null);

  const onItemPress = (item: MenuItem) => {
    if (item.soon || !item.route) {
      Alert.alert(item.label, 'This module is coming soon.');
      return;
    }
    navigation.navigate(item.route);
  };

  const onBannerPress = (banner: DashboardBanner) => {
    if (banner.route) navigation.navigate(banner.route);
  };

  const onBannerScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / (BANNER_WIDTH + 12));
    if (idx !== bannerIndex) setBannerIndex(idx);
  };

  const openAccountMenu = () => {
    Alert.alert(user?.name ?? 'Account', user?.email ?? '', [
      {
        text: 'Personal Details',
        onPress: () => navigation.navigate('PersonalDetails'),
      },
      { text: 'Sign out', style: 'destructive', onPress: () => signOut() },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <View className="flex-1 bg-surface-muted">
      {/* Airy brand header — light gradient with logo centered. */}
      <View className="overflow-hidden rounded-b-3xl" style={{ paddingTop: insets.top + 12 }}>
        <GradientFill id="dash-header" colors={['#E6F8FB', '#F5FBFE', '#FFFFFF']} />
        <View className="flex-row items-center justify-between px-5 pb-4">
          <Pressable
            onPress={openAccountMenu}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Open account menu"
            className="h-11 w-11 items-center justify-center rounded-full bg-white active:opacity-80"
            style={cardShadow}>
            <View className="gap-1">
              <View className="h-0.5 w-5 rounded-full bg-brand-700" />
              <View className="h-0.5 w-5 rounded-full bg-brand-700" />
              <View className="h-0.5 w-3.5 rounded-full bg-brand-700" />
            </View>
          </Pressable>

          <AppIcon width={96} height={46} />

          <Pressable
            onPress={() => Alert.alert('Support', 'Help & support is coming soon.')}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Support"
            className="h-11 w-11 items-center justify-center rounded-full bg-white active:opacity-80"
            style={cardShadow}>
            <Text className="text-lg">🎧</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        {/* Greeting */}
        {/* <View className="flex-row items-center px-5 pt-4">
          <Avatar name={user?.name ?? 'User'} size={44} />
          <View className="ml-3 flex-1">
            <Text className="text-xs text-ink-muted">{greeting()},</Text>
            <Text className="text-lg font-bold text-ink" numberOfLines={1}>
              {user?.name ?? 'User'}
            </Text>
          </View>
          {!!user?.designation && (
            <Text className="max-w-[40%] text-right text-xs text-ink-faint" numberOfLines={2}>
              {user.designation}
            </Text>
          )}
        </View> */}

        {/* Promo carousel */}
        <ScrollView
          ref={bannerRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={BANNER_WIDTH + 12}
          snapToAlignment="start"
          disableIntervalMomentum
          onMomentumScrollEnd={onBannerScroll}
          contentContainerStyle={{ paddingHorizontal: H_PADDING, paddingTop: 16 }}>
          {dashboardBanners.map((banner, i) => (
            <Pressable
              key={banner.key}
              onPress={() => onBannerPress(banner)}
              accessibilityRole="button"
              accessibilityLabel={banner.title}
              className="overflow-hidden rounded-3xl active:opacity-90"
              style={{
                width: BANNER_WIDTH,
                marginRight: i === dashboardBanners.length - 1 ? 0 : 12,
              }}>
              <GradientFill id={`banner-${banner.key}`} colors={banner.gradient} direction="diagonal" />
              <View className="flex-row items-center justify-between p-5" style={{ minHeight: 116 }}>
                <View className="flex-1 pr-3">
                  <Text className="text-lg font-extrabold text-white" numberOfLines={1}>
                    {banner.title}
                  </Text>
                  <Text className="mt-1 text-sm text-white/85" numberOfLines={2}>
                    {banner.subtitle}
                  </Text>
                </View>
                <View className="h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                  <Text className="text-3xl">{banner.icon}</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        {/* Pagination dots */}
        <View className="mt-3 flex-row items-center justify-center gap-1.5">
          {dashboardBanners.map((banner, i) => (
            <View
              key={banner.key}
              className={
                i === bannerIndex
                  ? 'h-1.5 w-5 rounded-full bg-brand-600'
                  : 'h-1.5 w-1.5 rounded-full bg-surface-border'
              }
            />
          ))}
        </View>

        {/* Home grid — colorful tiles, 4 across. */}
        <View className="mt-6 flex-row flex-wrap px-3">
          {dashboardTiles.map(item => (
            <Pressable
              key={item.key}
              onPress={() => onItemPress(item)}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              className="mb-5 items-center px-1 active:opacity-70"
              style={{ width: '25%' }}>
              <View
                className={`h-16 w-16 items-center justify-center rounded-2xl ${TILE_TINT_BG[item.tint]}`}
                style={cardShadow}>
                <Text className="text-2xl">{item.icon}</Text>
              </View>
              <Text
                className="mt-2 text-center text-[11px] font-medium leading-tight text-ink"
                numberOfLines={2}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

/** Soft elevation shared by the header buttons and grid tiles. */
const cardShadow = {
  shadowColor: '#1A1A2E',
  shadowOpacity: 0.08,
  shadowOffset: { width: 0, height: 4 },
  shadowRadius: 8,
  elevation: 2,
};
