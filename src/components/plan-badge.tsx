import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Icon } from '@/components/icon';
import { PressableScale } from '@/components/pressable-scale';
import { ThemedText } from '@/components/themed-text';
import { Lime } from '@/constants/theme';
import { useEntitlement } from '@/hooks/use-entitlement';
import { useIsDark } from '@/hooks/use-theme';

/** Small pill showing "PRO" or "Free"; tapping it opens the plans. */
export function PlanBadge() {
  const { loading, isPro, trialing } = useEntitlement();
  const dark = useIsDark();
  if (loading) return null;

  // Lime only reads on the dark background; in light mode flip to deep green.
  const accent = dark ? Lime : '#10281A';
  const pillStyle = isPro
    ? { backgroundColor: accent }
    : { backgroundColor: dark ? 'rgba(196,242,80,0.14)' : 'rgba(16,40,26,0.08)', borderWidth: 1, borderColor: dark ? 'rgba(196,242,80,0.5)' : 'rgba(16,40,26,0.35)', paddingRight: 4 };
  const textColor = isPro ? (dark ? '#0E1A12' : Lime) : accent;

  return (
    <PressableScale
      onPress={() => router.push('/paywall')}
      accessibilityLabel={isPro ? 'Your plan' : 'Upgrade to Pro'}
      style={[styles.pill, pillStyle]}>
      <Icon name={isPro ? 'diamond' : 'sparkles'} size={14} color={textColor} />
      <ThemedText style={[styles.text, { color: textColor }]}>
        {isPro ? (trialing ? 'PRO TRIAL' : 'PRO') : 'FREE'}
      </ThemedText>
      {!isPro && (
        <View style={[styles.upgrade, { backgroundColor: accent }]}>
          <ThemedText style={[styles.upgradeText, { color: dark ? '#0E1A12' : '#FFFFFF' }]}>Upgrade</ThemedText>
        </View>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  pill: { flexDirection: 'row', alignItems: 'center', gap: 5, height: 36, borderRadius: 18, paddingHorizontal: 11 },
  text: { fontSize: 12, lineHeight: 16, fontWeight: '800', letterSpacing: 0.6 },
  upgrade: { borderRadius: 14, paddingHorizontal: 9, height: 26, justifyContent: 'center' },
  upgradeText: { fontSize: 11, lineHeight: 15, fontWeight: '800' },
});
