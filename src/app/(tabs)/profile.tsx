import { useAuthActions } from '@convex-dev/auth/react';
import { useMutation, useQuery } from 'convex/react';
import Constants from 'expo-constants';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDialog } from '@/components/dialog';
import { Glass } from '@/components/glass';
import { Icon, type IconName } from '@/components/icon';
import { PressableScale } from '@/components/pressable-scale';
import { Screen } from '@/components/screen';
import { Skeleton } from '@/components/skeleton';
import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, Lime, MaxContentWidth, Spacing, VerdictColors } from '@/constants/theme';
import { useScans } from '@/hooks/use-scans';
import { useEntitlement } from '@/hooks/use-entitlement';
import { useTheme } from '@/hooks/use-theme';
import { type ThemePreference, setThemePreference, useThemePreference } from '@/lib/theme-preference';
import { api } from '../../../convex/_generated/api';

const DANGER = '#D64545';

const MODES: { key: ThemePreference; label: string; icon: IconName }[] = [
  { key: 'system', label: 'System', icon: 'phone-portrait-outline' },
  { key: 'light', label: 'Light', icon: 'sunny-outline' },
  { key: 'dark', label: 'Dark', icon: 'moon-outline' },
];

function SectionLabel({ children }: { children: string }) {
  return (
    <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionLabel}>
      {children.toUpperCase()}
    </ThemedText>
  );
}

function Stat({ value, label, icon, tint }: { value: string | number; label: string; icon: IconName; tint: string }) {
  return (
    <Glass radius={28} style={styles.stat}>
      <View style={[styles.statIcon, { backgroundColor: tint + '22' }]}>
        <Icon name={icon} size={20} color={tint} />
      </View>
      <ThemedText style={styles.statValue}>{value}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={styles.statLabel}>
        {label}
      </ThemedText>
    </Glass>
  );
}

function Row({
  icon,
  title,
  subtitle,
  onPress,
  danger,
  value,
  last,
}: {
  icon: IconName;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  danger?: boolean;
  value?: string;
  last?: boolean;
}) {
  const theme = useTheme();
  return (
    <PressableScale
      onPress={onPress}
      disabled={!onPress}
      haptic={!!onPress}
      style={[styles.row, !last && { borderBottomWidth: StyleSheet.hairlineWidth * 2, borderBottomColor: theme.border }]}>
      <View style={[styles.rowIcon, { backgroundColor: danger ? DANGER + '22' : theme.brandSoft }]}>
        <Icon name={icon} size={19} color={danger ? DANGER : theme.accent} />
      </View>
      <View style={{ flex: 1, gap: 1 }}>
        <ThemedText style={{ fontWeight: '700', fontSize: 15.5, color: danger ? DANGER : theme.text }}>{title}</ThemedText>
        {subtitle ? (
          <ThemedText type="small" themeColor="textSecondary" style={{ fontSize: 12.5 }}>
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
      {value ? (
        <ThemedText type="small" themeColor="textSecondary">
          {value}
        </ThemedText>
      ) : onPress && !danger ? (
        <Icon name="chevron-forward" size={18} color={theme.textSecondary} />
      ) : null}
    </PressableScale>
  );
}

function AppearanceCard() {
  const theme = useTheme();
  const pref = useThemePreference();
  return (
    <Glass radius={28} style={{ padding: Spacing.three, gap: Spacing.three }}>
      <View style={styles.appearHead}>
        <View style={[styles.rowIcon, { backgroundColor: theme.brandSoft }]}>
          <Icon name="color-palette-outline" size={19} color={theme.accent} />
        </View>
        <View style={{ flex: 1, gap: 1 }}>
          <ThemedText style={{ fontWeight: '700', fontSize: 15.5 }}>Appearance</ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={{ fontSize: 12.5 }}>
            Choose how Herbii looks
          </ThemedText>
        </View>
      </View>
      <View style={[styles.segment, { backgroundColor: theme.backgroundSelected }]}>
        {MODES.map((m) => {
          const active = pref === m.key;
          return (
            <PressableScale
              key={m.key}
              onPress={() => setThemePreference(m.key)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              style={[styles.segItem, active && { backgroundColor: theme.primary }]}>
              <Icon name={m.icon} size={16} color={active ? theme.onPrimary : theme.textSecondary} />
              <ThemedText type="smallBold" style={{ color: active ? theme.onPrimary : theme.textSecondary }}>
                {m.label}
              </ThemedText>
            </PressableScale>
          );
        })}
      </View>
    </Glass>
  );
}

function MembershipCard() {
  const theme = useTheme();
  const { loading, isPro, trialing, plan, expiresAt, scansLeft, scansLimit } = useEntitlement();
  if (loading) return <Skeleton width="100%" height={132} radius={28} />;

  const used = scansLimit - scansLeft;
  const planName = plan ? plan[0].toUpperCase() + plan.slice(1) : '';
  const date = expiresAt ? new Date(expiresAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '';

  return (
    <PressableScale onPress={() => router.push('/paywall')} accessibilityLabel="Manage plan">
      <LinearGradient
        colors={isPro ? [Lime, '#7FD66B'] : ['#173525', '#0B1F14']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.member, !isPro && { borderWidth: 1, borderColor: 'rgba(196,242,80,0.35)' }]}>
        <View style={styles.memberTop}>
          <View style={[styles.memberIcon, { backgroundColor: isPro ? 'rgba(14,26,18,0.12)' : 'rgba(196,242,80,0.16)' }]}>
            <Icon name={isPro ? 'diamond' : 'sparkles'} size={22} color={isPro ? '#0E1A12' : Lime} />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <ThemedText style={[styles.memberTitle, { color: isPro ? '#0E1A12' : '#fff' }]}>
              {isPro ? (trialing ? 'Herbii Pro · Free trial' : 'Herbii Pro') : 'Free plan'}
            </ThemedText>
            <ThemedText style={[styles.memberSub, { color: isPro ? 'rgba(14,26,18,0.75)' : 'rgba(255,255,255,0.7)' }]}>
              {isPro
                ? `${planName} plan · ${trialing ? 'trial ends' : 'active until'} ${date}`
                : `${scansLeft} of ${scansLimit} free scans left`}
            </ThemedText>
          </View>
          <Icon name="chevron-forward" size={20} color={isPro ? '#0E1A12' : 'rgba(255,255,255,0.7)'} />
        </View>

        {!isPro && (
          <>
            <View style={styles.meter}>
              <View style={[styles.meterFill, { width: `${Math.min(100, (used / scansLimit) * 100)}%` }]} />
            </View>
            <View style={styles.upgradeBtn}>
              <ThemedText style={styles.upgradeText}>Upgrade to Pro · 3 days free</ThemedText>
            </View>
          </>
        )}
      </LinearGradient>
    </PressableScale>
  );
}

export default function ProfileScreen() {
  const theme = useTheme();
  const user = useQuery(api.scans.me);
  const { scans } = useScans();
  const clearAll = useMutation(api.scans.clearAll);
  const { signOut } = useAuthActions();
  const deleteAccount = useMutation(api.account.deleteAccount);
  const dialog = useDialog();

  const identified = scans?.filter((s) => s.identified).length ?? 0;
  const safe = scans?.filter((s) => s.identified && s.verdict === 'safe').length ?? 0;
  const memberSince = user?._creationTime
    ? new Date(user._creationTime).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
    : null;
  const version = Constants.expoConfig?.version ?? '1.0.0';

  async function confirmSignOut() {
    const ok = await dialog.confirm({
      title: 'Sign out?',
      message: 'You can sign back in with Google any time.',
      confirmLabel: 'Sign out',
      icon: 'log-out-outline',
      tone: 'warning',
      destructive: true,
    });
    if (ok) signOut();
  }

  async function confirmClear() {
    const ok = await dialog.confirm({
      title: 'Clear scan history?',
      message: 'This permanently deletes all your scans and photos. This cannot be undone.',
      confirmLabel: 'Delete all',
      icon: 'trash-outline',
      tone: 'danger',
      destructive: true,
    });
    if (ok) clearAll();
  }

  async function confirmDelete() {
    const ok = await dialog.confirm({
      title: 'Delete your account?',
      message:
        'This permanently deletes your profile, scans, photos and plan record. It cannot be undone. If you have a subscription, cancel it in your Play Store or App Store settings too.',
      confirmLabel: 'Delete forever',
      icon: 'person-remove-outline',
      tone: 'danger',
      destructive: true,
    });
    if (!ok) return;
    try {
      await deleteAccount();
      await signOut();
    } catch {
      dialog.alert({ title: 'Could not delete account', message: 'Please try again.', tone: 'warning', confirmLabel: 'OK' });
    }
  }

  return (
    <Screen>
      <SafeAreaView edges={['top']} style={styles.safe}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <ThemedText serif style={styles.title}>
            Profile
          </ThemedText>

          {/* Identity */}
          <LinearGradient colors={['#1F6B43', '#0B3823']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
            <View style={[styles.deco, { width: 220, height: 220, top: -80, right: -70 }]} />
            <View style={[styles.deco, { width: 130, height: 130, bottom: -50, left: -40 }]} />
            <View style={styles.leafMark}>
              <Icon name="leaf" size={120} color="rgba(255,255,255,0.07)" />
            </View>

            <View style={styles.heroRow}>
              <View style={styles.avatarRing}>
                {user === undefined ? (
                  <Skeleton width={84} height={84} radius={42} />
                ) : user?.image ? (
                  <Image source={{ uri: user.image }} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatar, styles.avatarFallback]}>
                    <Icon name="person" size={38} color="#fff" />
                  </View>
                )}
              </View>
              <View style={{ flex: 1, gap: 3 }}>
                <ThemedText serif numberOfLines={2} style={styles.name}>
                  {user?.name ?? 'Herb explorer'}
                </ThemedText>
                {user?.email ? (
                  <ThemedText numberOfLines={1} style={styles.email}>
                    {user.email}
                  </ThemedText>
                ) : null}
              </View>
            </View>

            <View style={styles.badges}>
              <View style={styles.badge}>
                <Icon name="logo-google" size={13} color="#fff" />
                <ThemedText style={styles.badgeText}>Google account</ThemedText>
              </View>
              {memberSince ? (
                <View style={styles.badge}>
                  <Icon name="calendar-outline" size={13} color={Lime} />
                  <ThemedText style={styles.badgeText}>Since {memberSince}</ThemedText>
                </View>
              ) : null}
            </View>
          </LinearGradient>

          {/* Stats */}
          <View style={styles.stats}>
            <Stat icon="scan-outline" value={scans === undefined ? '–' : scans.length} label="Scans" tint={theme.accent} />
            <Stat icon="leaf-outline" value={scans === undefined ? '–' : identified} label="Identified" tint="#3B82F6" />
            <Stat icon="shield-checkmark-outline" value={scans === undefined ? '–' : safe} label="Safe herbs" tint={VerdictColors.safe} />
          </View>

          <MembershipCard />

          <SectionLabel>Preferences</SectionLabel>
          <AppearanceCard />

          <SectionLabel>Your data</SectionLabel>
          <Glass radius={28}>
            <Row
              icon="trash-outline"
              title="Clear scan history"
              subtitle="Delete all your scans and photos"
              onPress={confirmClear}
              last
            />
          </Glass>

          <SectionLabel>About</SectionLabel>
          <Glass radius={28}>
            <Row
              icon="document-text-outline"
              title="Terms & Conditions"
              subtitle="How Herbii works and how your data is used"
              onPress={() => router.push('/terms')}
            />
            <Row
              icon="shield-checkmark-outline"
              title="Privacy Policy"
              subtitle="What we collect and your choices"
              onPress={() => router.push('/privacy')}
            />
            <Row icon="information-circle-outline" title="Version" value={version} last />
          </Glass>

          <SectionLabel>Account</SectionLabel>
          <Glass radius={28}>
            <Row icon="log-out-outline" title="Sign out" onPress={confirmSignOut} danger />
            <Row
              icon="person-remove-outline"
              title="Delete account"
              subtitle="Permanently remove your account and data"
              onPress={confirmDelete}
              danger
              last
            />
          </Glass>

          <View style={styles.footer}>
            <View style={[styles.footMark, { backgroundColor: theme.brandSoft }]}>
              <Icon name="leaf" size={18} color={theme.accent} />
            </View>
            <ThemedText type="smallBold">Herbii · v{version}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.disclaimer}>
              AI-generated plant information for education only. Not medical advice.{'\n'}Plant photos: Wikimedia Commons (CC BY / CC
              BY-SA / CC0).
            </ThemedText>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, width: '100%', maxWidth: MaxContentWidth, alignSelf: 'center' },
  content: { padding: Spacing.three, gap: Spacing.three, paddingBottom: BottomTabInset + Spacing.five },
  title: { fontSize: 38, lineHeight: 44, paddingHorizontal: Spacing.one },
  hero: { borderRadius: 34, padding: Spacing.four - 4, gap: Spacing.three, overflow: 'hidden' },
  deco: { position: 'absolute', borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.06)' },
  leafMark: { position: 'absolute', right: 14, bottom: 30 },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  avatarRing: { width: 96, height: 96, borderRadius: 48, backgroundColor: Lime, padding: 3, alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 90, height: 90, borderRadius: 45 },
  avatarFallback: { backgroundColor: '#2C8C5A', alignItems: 'center', justifyContent: 'center' },
  name: { color: '#fff', fontSize: 28, lineHeight: 33 },
  email: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  badges: { flexDirection: 'row', gap: Spacing.two, flexWrap: 'wrap' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: 14, paddingHorizontal: 11, paddingVertical: 6, borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)' },
  badgeText: { color: '#fff', fontSize: 12, lineHeight: 16, fontWeight: '700' },
  member: { borderRadius: 28, padding: Spacing.three + 2, gap: Spacing.three },
  memberTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  memberIcon: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  memberTitle: { fontSize: 18, lineHeight: 24, fontFamily: 'Manrope_800ExtraBold' },
  memberSub: { fontSize: 13, lineHeight: 18 },
  meter: { height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.14)', overflow: 'hidden' },
  meterFill: { height: 8, borderRadius: 4, backgroundColor: Lime },
  upgradeBtn: { height: 48, borderRadius: 24, backgroundColor: Lime, alignItems: 'center', justifyContent: 'center' },
  upgradeText: { color: '#0E1A12', fontSize: 15, lineHeight: 20, fontWeight: '800' },
  stats: { flexDirection: 'row', gap: Spacing.two + 2 },
  stat: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: Spacing.three + 2, paddingHorizontal: Spacing.two },
  statIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  statValue: { fontSize: 30, lineHeight: 34, fontWeight: '800' },
  statLabel: { fontSize: 12.5, textAlign: 'center' },
  sectionLabel: { letterSpacing: 1.2, fontSize: 12, paddingHorizontal: Spacing.two, marginTop: Spacing.one },
  appearHead: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two + 4 },
  segment: { flexDirection: 'row', borderRadius: 22, padding: 4 },
  segItem: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 11, borderRadius: 18 },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two + 4, padding: Spacing.three },
  rowIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  footer: { alignItems: 'center', gap: 6, marginTop: Spacing.two, paddingHorizontal: Spacing.three },
  footMark: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  disclaimer: { textAlign: 'center', fontSize: 12, lineHeight: 17 },
});
