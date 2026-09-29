import { useAuthActions } from '@convex-dev/auth/react';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDialog } from '@/components/dialog';
import { Glass } from '@/components/glass';
import { Icon, type IconName } from '@/components/icon';
import { PressableScale } from '@/components/pressable-scale';
import { ThemedText } from '@/components/themed-text';
import { Lime, MaxContentWidth, Spacing } from '@/constants/theme';
import { TermsSheet } from '@/components/terms-sheet';
import { HERBS } from '@/lib/herbs';

WebBrowser.maybeCompleteAuthSession();

const FEATURES: { icon: IconName; label: string }[] = [
  { icon: 'scan', label: 'AI plant scan' },
  { icon: 'medkit-outline', label: 'Medicinal uses' },
  { icon: 'shield-checkmark-outline', label: 'Safety check' },
];

/** Always rendered in the dark forest look, like the reference, in both app themes. */
export function AuthScreen() {
  const { signIn } = useAuthActions();
  const dialog = useDialog();
  const [busy, setBusy] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  async function continueWithGoogle() {
    setBusy(true);
    try {
      const redirectTo = Linking.createURL('/');
      const { redirect } = await signIn('google', { redirectTo });
      if (Platform.OS === 'web' || !redirect) return;

      const result = await WebBrowser.openAuthSessionAsync(redirect.toString(), redirectTo);
      if (result.type === 'success') {
        const code = new URL(result.url).searchParams.get('code');
        if (code) await signIn('google', { code });
      }
    } catch (e) {
      dialog.alert({
        title: 'Sign-in failed',
        message: e instanceof Error ? e.message : 'Please try again.',
        tone: 'warning',
        confirmLabel: 'Try again',
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={styles.container}>
      <Image source={HERBS[0].image} style={styles.photo} contentFit="cover" />
      <LinearGradient
        colors={['rgba(7,24,15,0.15)', 'rgba(9,35,22,0.85)', '#07120B']}
        locations={[0, 0.55, 0.85]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safe}>
        <View style={styles.brandRow}>
          <Glass radius={22} translucent style={styles.logo}>
            <Icon name="leaf" size={22} color={Lime} />
          </Glass>
          <ThemedText style={styles.brand}>Herbii</ThemedText>
        </View>

        <View style={{ flex: 1 }} />

        <View style={styles.copy}>
          <ThemedText serif style={styles.title}>Your AI{'\n'}plant doctor</ThemedText>
          <ThemedText style={styles.sub}>
            Snap any plant. Discover its healing properties and know if it&apos;s safe — instantly.
          </ThemedText>
        </View>

        <View style={styles.features}>
          {FEATURES.map((f) => (
            <Glass key={f.label} radius={22} translucent style={styles.feature}>
              <Icon name={f.icon} size={18} color={Lime} />
              <ThemedText type="small" style={{ color: '#fff', fontWeight: '600' }}>
                {f.label}
              </ThemedText>
            </Glass>
          ))}
        </View>

        <PressableScale onPress={continueWithGoogle} disabled={busy} style={styles.button}>
          {busy ? (
            <ActivityIndicator color="#0E2216" />
          ) : (
            <View style={styles.buttonRow}>
              <Icon name="logo-google" size={20} color="#0E2216" />
              <ThemedText style={styles.buttonText}>Continue with Google</ThemedText>
            </View>
          )}
        </PressableScale>
        <ThemedText type="small" style={styles.legal}>
          By continuing you agree to our{' '}
          <ThemedText type="small" onPress={() => setTermsOpen(true)} style={styles.legalLink}>
            Terms & Conditions
          </ThemedText>
          . Educational use only, not medical advice.
        </ThemedText>
        <TermsSheet visible={termsOpen} onClose={() => setTermsOpen(false)} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#07120B' },
  photo: { position: 'absolute', top: 0, left: 0, right: 0, height: '62%' },
  safe: { flex: 1, width: '100%', maxWidth: MaxContentWidth, alignSelf: 'center', padding: Spacing.four, gap: Spacing.three },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two + 2 },
  logo: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.14)', borderColor: 'rgba(255,255,255,0.3)' },
  brand: { color: '#fff', fontSize: 22, fontWeight: '800' },
  copy: { gap: Spacing.two + 2 },
  title: { color: '#fff', fontSize: 52, lineHeight: 56 },
  sub: { color: 'rgba(255,255,255,0.78)', fontSize: 16, lineHeight: 24 },
  features: { flexDirection: 'row', gap: Spacing.two, flexWrap: 'wrap' },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 2,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderColor: 'rgba(255,255,255,0.25)',
  },
  button: { backgroundColor: '#fff', borderRadius: 32, paddingVertical: Spacing.three + 4, alignItems: 'center', marginTop: Spacing.two },
  buttonRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  buttonText: { color: '#0E2216', fontWeight: '800', fontSize: 17 },
  legal: { color: 'rgba(255,255,255,0.6)', textAlign: 'center', lineHeight: 19 },
  legalLink: { color: Lime, fontWeight: '700', textDecorationLine: 'underline' },
});
