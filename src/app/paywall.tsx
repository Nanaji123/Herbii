import { useAction } from 'convex/react';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import type { PurchasesPackage } from 'react-native-purchases';
import { ActivityIndicator, Linking, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from '@/components/safe-area';

import { useDialog } from '@/components/dialog';
import { Icon, type IconName } from '@/components/icon';
import { PressableScale } from '@/components/pressable-scale';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Lime, MaxContentWidth, Spacing } from '@/constants/theme';
import { useEntitlement } from '@/hooks/use-entitlement';
import { useIsDark, useTheme } from '@/hooks/use-theme';
import { FREE_HERB_COUNT, PLANS, TRIAL_DAYS, type PlanId } from '@/lib/plans';
import { buyPackage, loadPackages, purchasesEnabled, restorePurchases } from '@/lib/purchases';
import { api } from '../../convex/_generated/api';

const PERKS: [IconName, string][] = [
  ['scan-outline', 'Unlimited plant scans'],
  ['leaf-outline', 'Full herb library, nothing locked'],
  ['shield-checkmark-outline', 'Safety checks & look-alike warnings'],
];

function close() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}

export default function PaywallScreen() {
  const theme = useTheme();
  const dark = useIsDark();
  // Lime only reads on dark; light mode uses deep green with white text.
  const accent = dark ? Lime : '#1F6B43';
  const onAccent = dark ? '#0E1A12' : '#FFFFFF';
  const dialog = useDialog();
  const sync = useAction(api.subscription.sync);
  const { isPro, trialing, plan: activePlan, expiresAt, scansLeft, scansLimit } = useEntitlement();
  const [selected, setSelected] = useState<PlanId>('yearly');
  const [busy, setBusy] = useState(false);
  const [packages, setPackages] = useState<Partial<Record<PlanId, PurchasesPackage>>>({});

  useEffect(() => {
    if (!purchasesEnabled) {
      console.warn('[plans] RevenueCat is off: EXPO_PUBLIC_REVENUECAT_ANDROID_KEY is not set in this bundle.');
      return;
    }
    loadPackages()
      .then((found) => {
        if (Object.keys(found).length === 0) {
          console.warn('[plans] RevenueCat returned no weekly/monthly/annual packages in the current offering.');
        }
        setPackages(found);
      })
      .catch((e) => console.warn('[plans] Could not load prices from RevenueCat:', e));
  }, []);

  // Prices come from the store (already in the user's currency); PLANS is only the fallback.
  const priceOf = (id: PlanId) => packages[id]?.product.priceString;
  const numeric = (id: PlanId) => packages[id]?.product.price;
  const currency = packages.yearly?.product.currencyCode;
  const yearlyAtMonthly =
    numeric('monthly') && currency
      ? new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 0 }).format(numeric('monthly')! * 12)
      : undefined;
  const discount =
    numeric('yearly') && numeric('monthly')
      ? Math.round((1 - numeric('yearly')! / (numeric('monthly')! * 12)) * 100)
      : null;

  const plan = PLANS.find((p) => p.id === selected)!;
  const yearlyPkg = packages.yearly;
  const trial = selected === 'yearly' && (!yearlyPkg || yearlyPkg.product.introPrice?.price === 0);

  async function start() {
    if (busy) return;
    const pkg = packages[selected];
    if (!pkg) {
      dialog.alert({
        title: 'Plans unavailable',
        message: 'We could not load the plans from the store. Please check your connection and try again.',
        tone: 'warning',
        confirmLabel: 'Got it',
      });
      return;
    }
    setBusy(true);
    try {
      if (!(await buyPackage(pkg))) return;
      await sync();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await dialog.alert({
        title: trial ? 'Your free trial has started' : 'You are all set',
        message: 'Unlimited scans and the full herb library are now unlocked.',
        confirmLabel: 'Start exploring',
      });
      close();
    } catch {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      dialog.alert({
        title: 'Purchase failed',
        message: 'Nothing was charged. Please try again.',
        tone: 'warning',
        confirmLabel: 'Got it',
      });
    } finally {
      setBusy(false);
    }
  }

  function manage() {
    Linking.openURL(
      Platform.OS === 'ios' ? 'https://apps.apple.com/account/subscriptions' : 'https://play.google.com/store/account/subscriptions',
    );
  }

  async function restore() {
    if (busy) return;
    setBusy(true);
    try {
      if (purchasesEnabled) await restorePurchases();
      const { isPro: restored } = await sync();
      dialog.alert({
        title: restored ? 'Plan restored' : 'Nothing to restore',
        message: restored ? 'Your plan is active on this account.' : 'We could not find an active plan for this store account.',
        confirmLabel: 'OK',
      });
      if (restored) close();
    } catch {
      dialog.alert({ title: 'Could not restore', message: 'Please try again in a moment.', tone: 'warning', confirmLabel: 'OK' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <SafeAreaView style={styles.safe}>
        <View style={styles.top}>
          <View style={[styles.proTag, { backgroundColor: accent }]}>
            <Icon name="diamond" size={15} color={onAccent} />
            <ThemedText style={[styles.proText, { color: onAccent }]}>PRO</ThemedText>
          </View>
          <PressableScale onPress={close} accessibilityLabel="Close" style={[styles.closeBtn, { backgroundColor: theme.backgroundSelected }]}>
            <Icon name="close" size={22} />
          </PressableScale>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <View style={styles.hero}>
            <ThemedText style={styles.sparkle}>✨</ThemedText>
            <Image source={require('../../assets/images/icon.png')} style={styles.logo} />
            <ThemedText style={styles.sparkle}>✨</ThemedText>
          </View>

          <ThemedText themeColor="textSecondary" style={styles.kicker}>
            Advanced AI Plant Identification
          </ThemedText>
          <ThemedText serif style={styles.headline}>
            {trial ? `Not charged right now,\nFree trial for ${TRIAL_DAYS} days` : 'Unlimited scans,\nthe whole herb library'}
          </ThemedText>
          {!isPro && (
            <ThemedText type="small" themeColor="textSecondary" style={{ textAlign: 'center' }}>
              {scansLeft > 0
                ? `${scansLeft} of ${scansLimit} free scans left · ${FREE_HERB_COUNT} free herbs`
                : `You have used all ${scansLimit} free scans`}
            </ThemedText>
          )}

          <View style={styles.perks}>
            {PERKS.map(([icon, text]) => (
              <View key={text} style={styles.perk}>
                <View style={[styles.perkIcon, { backgroundColor: theme.brandSoft }]}>
                  <Icon name={icon} size={17} color={theme.accent} />
                </View>
                <ThemedText type="smallBold">{text}</ThemedText>
              </View>
            ))}
          </View>

          <View style={{ gap: Spacing.two + 2 }}>
            {PLANS.map((p) => {
              const active = p.id === selected;
              return (
                <PressableScale
                  key={p.id}
                  onPress={() => setSelected(p.id)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: active }}
                  style={[
                    styles.plan,
                    {
                      backgroundColor: active ? (dark ? 'rgba(196,242,80,0.10)' : 'rgba(31,107,67,0.10)') : theme.backgroundElement,
                      borderColor: active ? accent : dark ? theme.border : 'rgba(16,40,26,0.22)',
                      borderWidth: active ? 2 : 1,
                    },
                  ]}>
                  {p.id === 'yearly' && (discount === null || discount > 0) && (
                    <View style={[styles.offBadge, { backgroundColor: accent }]}>
                      <ThemedText style={[styles.offText, { color: onAccent }]}>{discount ?? 44}% OFF</ThemedText>
                    </View>
                  )}
                  <View style={[styles.radio, { borderColor: active ? accent : dark ? theme.border : 'rgba(16,40,26,0.35)', backgroundColor: active ? accent : 'transparent' }]}>
                    {active && <Icon name="checkmark" size={16} color={onAccent} />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <ThemedText style={styles.planTitle}>{p.title}</ThemedText>
                    <ThemedText type="small" style={{ color: p.id === 'yearly' ? (dark ? '#3FBF6B' : '#1F6B43') : theme.textSecondary }}>
                      {p.note}
                    </ThemedText>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <ThemedText style={styles.price}>
                      {priceOf(p.id) ?? '—'}
                      <ThemedText themeColor="textSecondary" style={styles.per}> /{p.per}</ThemedText>
                    </ThemedText>
                    {p.id === 'yearly' && yearlyAtMonthly && (
                      <ThemedText themeColor="textSecondary" style={styles.strike}>
                        {yearlyAtMonthly} /year
                      </ThemedText>
                    )}
                  </View>
                </PressableScale>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.bottom}>
          {isPro ? (
            <>
              <View style={[styles.active, { borderColor: accent }]}>
                <Icon name="checkmark-circle" size={22} color={accent} />
                <ThemedText style={{ flex: 1, fontFamily: 'Manrope_700Bold' }}>
                  {`You are on Pro${activePlan ? ` (${activePlan})` : ''}`}
                </ThemedText>
              </View>
              <ThemedText type="small" themeColor="textSecondary" style={{ textAlign: 'center' }}>
                {`${trialing ? 'Free trial ends' : 'Active until'} ${expiresAt ? new Date(expiresAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : ''}`}
              </ThemedText>
              <PressableScale onPress={manage} haptic={false} accessibilityRole="button" style={[styles.manage, { borderColor: theme.border }]}>
                <ThemedText type="smallBold">Manage subscription</ThemedText>
              </PressableScale>
            </>
          ) : (
            <>
          <PressableScale onPress={start} disabled={busy} haptic={false} accessibilityRole="button">
            <LinearGradient colors={dark ? [Lime, '#5FC76B'] : ['#2B7548', '#10281A']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cta}>
              {busy ? (
                <ActivityIndicator color={onAccent} />
              ) : (
                <ThemedText style={[styles.ctaText, { color: onAccent }]}>{trial ? 'Start Free Trial' : 'Continue'}</ThemedText>
              )}
            </LinearGradient>
          </PressableScale>
          <ThemedText type="small" themeColor="textSecondary" style={{ textAlign: 'center' }}>
            {trial
              ? `${TRIAL_DAYS} days free, then ${priceOf(selected) ?? ''} /${plan.per}`
              : `${priceOf(selected) ?? ''} /${plan.per}, cancel anytime`}
          </ThemedText>
            </>
          )}
          <View style={styles.links}>
            <PressableScale onPress={restore} haptic={false}>
              <ThemedText type="small" themeColor="textSecondary">Restore</ThemedText>
            </PressableScale>
            <ThemedText type="small" themeColor="textSecondary">·</ThemedText>
            <PressableScale onPress={() => router.push('/terms')} haptic={false}>
              <ThemedText type="small" themeColor="textSecondary">Terms</ThemedText>
            </PressableScale>
          </View>
        </View>
      </SafeAreaView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, width: '100%', maxWidth: MaxContentWidth, alignSelf: 'center' },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.three, paddingTop: Spacing.two },
  proTag: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Lime, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6 },
  proText: { color: '#0E1A12', fontWeight: '800', fontSize: 13, lineHeight: 17, letterSpacing: 1 },
  closeBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: Spacing.three, paddingTop: Spacing.three, paddingBottom: Spacing.three, gap: Spacing.three },
  hero: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.four },
  logo: { width: 76, height: 76, borderRadius: 22 },
  sparkle: { fontSize: 30, lineHeight: 38 },
  kicker: { textAlign: 'center', fontSize: 16, fontFamily: 'Manrope_600SemiBold' },
  headline: { textAlign: 'center', fontSize: 31, lineHeight: 38 },
  perks: { gap: Spacing.two + 2, alignSelf: 'center', marginVertical: Spacing.one },
  perk: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two + 2 },
  perkIcon: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  plan: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, borderRadius: 24, paddingHorizontal: Spacing.three, paddingVertical: Spacing.three },
  radio: { width: 30, height: 30, borderRadius: 15, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  planTitle: { fontSize: 19, lineHeight: 25, fontFamily: 'Manrope_700Bold' },
  price: { fontSize: 19, lineHeight: 25, fontFamily: 'Manrope_800ExtraBold' },
  per: { fontSize: 14, fontFamily: 'Manrope_500Medium' },
  strike: { fontSize: 13, lineHeight: 18, textDecorationLine: 'line-through' },
  offBadge: { position: 'absolute', top: -13, right: 16, backgroundColor: Lime, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  offText: { color: '#0E1A12', fontSize: 12, lineHeight: 16, fontWeight: '800' },
  bottom: { paddingHorizontal: Spacing.three, paddingBottom: Spacing.three, gap: Spacing.two + 2 },
  cta: { height: 58, borderRadius: 29, alignItems: 'center', justifyContent: 'center' },
  ctaText: { color: '#0E1A12', fontSize: 18, fontWeight: '800' },
  active: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, height: 58, borderRadius: 29, borderWidth: 2, paddingHorizontal: Spacing.three },
  manage: { height: 48, borderRadius: 24, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  links: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.two },
});
