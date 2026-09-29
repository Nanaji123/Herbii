import { ConvexAuthProvider } from '@convex-dev/auth/react';
import { useAction, useConvexAuth, useQuery } from 'convex/react';
import { DarkTheme, DefaultTheme, type Href, Stack, ThemeProvider, router, useRootNavigationState } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display';
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
} from '@expo-google-fonts/manrope';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { useColorScheme, View } from 'react-native';

import { AuthScreen } from '@/components/auth-screen';
import { DialogProvider } from '@/components/dialog';
import { Brand, Colors } from '@/constants/theme';
import { useEntitlement } from '@/hooks/use-entitlement';
import { connectPurchases, purchasesEnabled } from '@/lib/purchases';
import { authStorage, convex } from '@/lib/convex';
import { api } from '../../convex/_generated/api';
import { askFirstRunPermissions } from '@/lib/first-run-permissions';
import { loadReminders, onScansChanged, useReminderTaps } from '@/lib/reminders';
import { loadThemePreference } from '@/lib/theme-preference';

SplashScreen.preventAutoHideAsync();

// Custom navigation themes so every screen, header and transition uses our background instead of
// the default white â€” this is what caused the white flash when navigating back.
const AppLight = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Brand,
    background: Colors.light.background,
    card: Colors.light.background,
    text: Colors.light.text,
    border: Colors.light.border,
  },
};
const AppDark = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Brand,
    background: Colors.dark.background,
    card: Colors.dark.background,
    text: Colors.dark.text,
    border: Colors.dark.border,
  },
};

// Offer the plans once per app launch to signed-in users who do not have one.
let paywallShown = false;

function Gate({ background }: { background: string }) {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { loading, isPro, scansLeft } = useEntitlement();
  const navReady = !!useRootNavigationState()?.key;
  const me = useQuery(api.scans.me);
  const sync = useAction(api.subscription.sync);

  // Tie the store purchases to this account, then pull the latest plan (covers renewals).
  useEffect(() => {
    if (!purchasesEnabled || !me?._id) return;
    connectPurchases(me._id)
      .then(() => sync())
      .catch(() => {});
  }, [me?._id, sync]);

  useEffect(() => {
    if (isAuthenticated) askFirstRunPermissions();
  }, [isAuthenticated]);

  // Milestone and offer reminders follow the scan count and the plan.
  const scans = useQuery(api.scans.list, isAuthenticated ? {} : 'skip');
  useEffect(() => {
    if (scans !== undefined && !loading) onScansChanged(scans.length, { isPro, scansLeft });
  }, [scans, loading, isPro, scansLeft]);

  useEffect(() => {
    if (paywallShown || !navReady || loading || !isAuthenticated || isPro) return;
    paywallShown = true;
    router.push('/paywall');
  }, [navReady, loading, isAuthenticated, isPro]);

  if (isLoading) return <View style={{ flex: 1, backgroundColor: background }} />;
  if (!isAuthenticated) return <AuthScreen />;
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        animationDuration: 250,
        contentStyle: { backgroundColor: background },
      }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="scan/[id]" />
      <Stack.Screen name="herb/[slug]" />
      <Stack.Screen name="terms" />
      <Stack.Screen name="privacy" />
      <Stack.Screen name="paywall" options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }} />
    </Stack>
  );
}

const openRoute = (route: string) => router.push(route as Href);

export default function RootLayout() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const background = Colors[scheme].background;
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
    DMSerifDisplay_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  useEffect(() => {
    loadThemePreference();
    loadReminders();
  }, []);

  // Tapping a reminder opens the screen it points at.
  useReminderTaps(openRoute);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(background);
  }, [background]);

  return (
    <ConvexAuthProvider client={convex} storage={authStorage}>
      <ThemeProvider value={scheme === 'dark' ? AppDark : AppLight}>
        <View style={{ flex: 1, backgroundColor: background }}>
          <StatusBar style="auto" />
          {fontsLoaded ? (
            <DialogProvider>
              <Gate background={background} />
            </DialogProvider>
          ) : null}
        </View>
      </ThemeProvider>
    </ConvexAuthProvider>
  );
}
