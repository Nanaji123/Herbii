import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GlassButton } from '@/components/glass-button';
import { Screen } from '@/components/screen';
import { TermsContent } from '@/components/terms-content';
import { ThemedText } from '@/components/themed-text';
import { MaxContentWidth, Spacing } from '@/constants/theme';

export default function TermsScreen() {
  return (
    <Screen>
      <SafeAreaView edges={['top']} style={styles.safe}>
        <View style={styles.header}>
          <GlassButton icon="arrow-back" label="Back" onPress={() => router.back()} />
          <ThemedText serif style={styles.title}>
            Terms & Conditions
          </ThemedText>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <TermsContent />
        </ScrollView>
      </SafeAreaView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, width: '100%', maxWidth: MaxContentWidth, alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, paddingHorizontal: Spacing.three, paddingTop: Spacing.two, paddingBottom: Spacing.two },
  title: { fontSize: 28, lineHeight: 34, flex: 1 },
  content: { padding: Spacing.three, paddingBottom: Spacing.six },
});
