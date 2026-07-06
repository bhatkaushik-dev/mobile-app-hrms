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
import { AppIcon, Button, HeroBackground, TextField } from '../../components';
import { useSignIn } from '../../api/auth';
import { loginSchema, type LoginErrors } from '../../utils/validators/login.schema';

export function SignInScreen() {
  const insets = useSafeAreaInsets();
  const { signIn, isLoading, error: apiError } = useSignIn();

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<LoginErrors>({});

  const loading = isLoading;

  const onSubmit = async () => {
    // Validate with zod; surface per-field messages if it fails.
    const result = loginSchema.safeParse({ userId, password, remember });
    if (!result.success) {
      const errors: LoginErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof LoginErrors;
        if (key && !errors[key]) errors[key] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    try {
      await signIn(result.data.userId, result.data.password, result.data.remember);
      // On success the RootNavigator swaps to the app flow automatically.
    } catch {
      // `useSignIn` already surfaces the message via `apiError`.
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
            className="shrink-0 overflow-hidden"
            style={{
              paddingTop: insets.top + 24,
              paddingBottom: 40,
              height: insets.top + 244,
            }}>
            <HeroBackground />
            <View className="flex-row items-center px-6">
              <AppIcon width={120} height={58} />
            </View>
            <Text className="mt-5 px-6 text-3xl font-extrabold leading-9 text-white">
              Welcome to{'\n'}Employee Portal
            </Text>
            {/* <Text className="mt-2 text-base text-white/80">
              Everything you need, in one place.
            </Text> */}
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
                onChangeText={text => {
                  setUserId(text);
                  if (fieldErrors.userId) {
                    setFieldErrors(prev => ({ ...prev, userId: undefined }));
                  }
                }}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Enter your User ID"
                returnKeyType="next"
                error={fieldErrors.userId}
              />

              <TextField
                label="Password"
                containerClassName="mt-5"
                value={password}
                onChangeText={text => {
                  setPassword(text);
                  if (fieldErrors.password) {
                    setFieldErrors(prev => ({ ...prev, password: undefined }));
                  }
                }}
                secure
                placeholder="Enter your password"
                returnKeyType="go"
                onSubmitEditing={onSubmit}
                error={fieldErrors.password}
              />

              {apiError ? (
                <View className="mt-4 rounded-xl bg-red-50 px-4 py-3">
                  <Text className="text-sm font-medium text-danger">{apiError}</Text>
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
