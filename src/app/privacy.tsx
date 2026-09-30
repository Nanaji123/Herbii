import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from '@/components/safe-area';

import { Glass } from '@/components/glass';
import { GlassButton } from '@/components/glass-button';
import { Screen } from '@/components/screen';
import { SUPPORT_EMAIL } from '@/components/terms-content';
import { ThemedText } from '@/components/themed-text';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { PRIVACY_SECTIONS, PRIVACY_UPDATED } from '../../convex/policies';

export default function PrivacyScreen() {
  const theme = useTheme();
  return (
    <Screen>
      <SafeAreaView edges={['top']} style={styles.safe}>
        <View style={styles.header}>
          <GlassButton icon="arrow-back" label="Back" onPress={() => router.back()} />
          <ThemedText serif style={styles.title}>Privacy Policy</ThemedText>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <ThemedText type="small" themeColor="textSecondary">Last updated {PRIVACY_UPDATED}</ThemedText>
          {PRIVACY_SECTIONS.map((s) => (
            <Glass key={s.title} radius={26} style={styles.card}>
              <ThemedText serif style={styles.cardTitle}>{s.title}</ThemedText>
              {s.body.map((p, i) => (
                <ThemedText key={i} style={styles.para}>{p}</ThemedText>
              ))}
              {s.bullets?.map((b, i) => (
                <View key={i} style={styles.bulletRow}>
                  <View style={[styles.dot, { backgroundColor: theme.accent }]} />
                  <ThemedText style={[styles.para, { flex: 1 }]}>{b}</ThemedText>
                </View>
              ))}
            </Glass>
          ))}
          <ThemedText type="small" themeColor="textSecondary">Questions? Contact {SUPPORT_EMAIL}</ThemedText>
        </ScrollView>
      </SafeAreaView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, width: '100%', maxWidth: MaxContentWidth, alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, paddingHorizontal: Spacing.three, paddingTop: Spacing.two, paddingBottom: Spacing.two },
  title: { fontSize: 28, lineHeight: 34, flex: 1 },
  content: { padding: Spacing.three, paddingBottom: Spacing.six, gap: Spacing.three },
  card: { padding: Spacing.three + 2, gap: Spacing.two + 2 },
  cardTitle: { fontSize: 22, lineHeight: 27 },
  para: { fontSize: 15, lineHeight: 23 },
  bulletRow: { flexDirection: 'row', gap: Spacing.two + 2, alignItems: 'flex-start' },
  dot: { width: 6, height: 6, borderRadius: 3, marginTop: 9 },
});
