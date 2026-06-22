import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, TextField } from '../../components';
import { useAuth } from '../../context/AuthContext';

export function SignInScreen() {
  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();

  const [userId, setUserId] = useState('admin');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    if (!userId.trim() || !password) {
      setError('Please enter your User ID and password.');
      return;
    }
    setLoading(true);
    try {
      await signIn(userId, password, remember);
      // On success the RootNavigator swaps to the app flow automatically.
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {/* Brand hero */}
          <View
            className="bg-brand-600 px-6 pb-12"
            style={{ paddingTop: insets.top + 24 }}>
            <View className="flex-row items-center">
              <Text className="text-2xl font-extrabold text-white">Tech</Text>
              <Text className="text-2xl font-extrabold text-accent-500">Nova</Text>
            </View>
            <Text className="mt-8 text-3xl font-extrabold leading-9 text-white">
              Welcome to{'\n'}Employee Portal
            </Text>
            <Text className="mt-2 text-base text-white/80">
              Everything you need, in one place.
            </Text>
          </View>

          {/* Sign-in card overlapping the hero */}
          <View className="-mt-6 flex-1 rounded-t-3xl bg-white px-6 pt-8">
            <Text className="text-center text-2xl font-extrabold text-ink">
              Welcome Back!
            </Text>
            <Text className="mt-1 text-center text-base text-ink-muted">
              Sign in with your credentials.
            </Text>

            <View className="mt-8">
              <TextField
                label="User ID"
                value={userId}
                onChangeText={setUserId}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Enter your User ID"
                returnKeyType="next"
              />

              <TextField
                label="Password"
                containerClassName="mt-5"
                value={password}
                onChangeText={setPassword}
                secure
                placeholder="Enter your password"
                returnKeyType="go"
                onSubmitEditing={onSubmit}
              />

              {error ? (
                <View className="mt-4 rounded-xl bg-red-50 px-4 py-3">
                  <Text className="text-sm font-medium text-danger">{error}</Text>
                </View>
              ) : null}

              <View className="mt-5 flex-row items-center justify-between">
                <Pressable
                  className="flex-row items-center"
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: remember }}
                  onPress={() => setRemember(r => !r)}>
                  <View
                    className={`h-5 w-5 items-center justify-center rounded-md border ${
                      remember
                        ? 'border-brand-600 bg-brand-600'
                        : 'border-surface-border bg-white'
                    }`}>
                    {remember ? (
                      <Text className="text-xs font-bold text-white">✓</Text>
                    ) : null}
                  </View>
                  <Text className="ml-2 text-sm text-ink">Remember Me</Text>
                </Pressable>

                <Pressable hitSlop={8}>
                  <Text className="text-sm font-semibold text-brand-600">
                    Forgot Password?
                  </Text>
                </Pressable>
              </View>

              <Button
                label="Sign in"
                className="mt-7"
                loading={loading}
                onPress={onSubmit}
                trailing={<Text className="text-base font-semibold text-white">→</Text>}
              />

              <Text className="mt-4 text-center text-xs text-ink-faint">
                Demo login — User ID: admin · Password: password
              </Text>
            </View>

            <View className="flex-1" />
            <Text
              className="text-center text-xs text-ink-faint"
              style={{ paddingBottom: insets.bottom + 16 }}>
              © 2026 Fortune Technology Solutions LLC.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
