import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/icon';
import { PressableScale } from '@/components/pressable-scale';
import { ThemedText } from '@/components/themed-text';
import { Lime } from '@/constants/theme';
import { useIsDark, useTheme } from '@/hooks/use-theme';

const ICONS: Record<string, { on: IconName; off: IconName; label: string }> = {
  index: { on: 'home', off: 'home-outline', label: 'Home' },
  herbs: { on: 'leaf', off: 'leaf-outline', label: 'Herbs' },
  history: { on: 'time', off: 'time-outline', label: 'History' },
  profile: { on: 'person', off: 'person-outline', label: 'Profile' },
};

/**
 * Four labelled tabs in a rounded pill, plus the scanner as its own round action button
 * beside it. The scanner screen is full-screen, so the bar hides there.
 */
function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const dark = useIsDark();
  const theme = useTheme();
  const current = state.routes[state.index]?.name;

  if (current === 'scan') return null;

  function go(name: string, key: string, focused: boolean) {
    const event = navigation.emit({ type: 'tabPress', target: key, canPreventDefault: true });
    if (!focused && !event.defaultPrevented) navigation.navigate(name);
  }

  const scanRoute = state.routes.find((r) => r.name === 'scan');
  const bottomOffset = insets.bottom > 0 ? insets.bottom + 4 : 16;

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { bottom: bottomOffset }]}>
      <View style={styles.row}>
        <LinearGradient
          colors={dark ? ['#173525', '#0B1F14'] : ['#FFFFFF', '#EDF5E7']}
          style={[styles.pill, !dark && styles.pillLight]}>
          {state.routes.map((route) => {
            const meta = ICONS[route.name];
            if (!meta) return null;
            const focused = state.routes[state.index]?.key === route.key;
            const tint = focused ? theme.accent : dark ? 'rgba(255,255,255,0.55)' : 'rgba(16,40,26,0.5)';

            return (
              <PressableScale
                key={route.key}
                onPress={() => go(route.name, route.key, focused)}
                accessibilityLabel={meta.label}
                accessibilityState={{ selected: focused }}
                style={[styles.item, focused && { backgroundColor: theme.brandSoft }]}>
                <Icon name={focused ? meta.on : meta.off} size={23} color={tint} />
                <ThemedText style={[styles.label, { color: tint }]}>{meta.label}</ThemedText>
              </PressableScale>
            );
          })}
        </LinearGradient>

        {scanRoute && (
          <PressableScale
            haptic={false}
            accessibilityLabel="Scan a plant"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              go(scanRoute.name, scanRoute.key, false);
            }}>
            <LinearGradient colors={[Lime, '#5FC76B']} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }} style={styles.fab}>
              <Icon name="scan" size={30} color="#0E1A12" />
            </LinearGradient>
          </PressableScale>
        )}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: 'transparent' },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="herbs" options={{ title: 'Herbs' }} />
      <Tabs.Screen name="scan" options={{ title: 'Scan' }} />
      <Tabs.Screen name="history" options={{ title: 'History' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    maxWidth: 440,
  },
  pill: {
    flex: 1,
    height: 74,
    borderRadius: 37,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 16,
  },
  pillLight: {
    borderColor: 'rgba(16, 40, 26, 0.12)',
    shadowColor: '#0B2A16',
    shadowOpacity: 0.28,
    shadowRadius: 20,
  },
  item: {
    flex: 1,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  label: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
  },
  fab: {
    width: 74,
    height: 74,
    borderRadius: 37,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Lime,
    shadowOpacity: 0.5,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 14,
  },
});
