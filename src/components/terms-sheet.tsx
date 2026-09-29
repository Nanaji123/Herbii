import { Modal, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { GlassButton } from '@/components/glass-button';
import { Screen } from '@/components/screen';
import { TermsContent } from '@/components/terms-content';
import { ThemedText } from '@/components/themed-text';
import { MaxContentWidth, Spacing } from '@/constants/theme';

/** Full-screen sheet with the Terms & Conditions, for places outside the signed-in navigation. */
export function TermsSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaProvider>
        <Screen>
          <SafeAreaView edges={['top']} style={styles.safe}>
            <View style={styles.header}>
              <ThemedText serif style={styles.title}>
                Terms & Conditions
              </ThemedText>
              <GlassButton icon="close" label="Close terms" onPress={onClose} />
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
              <TermsContent />
            </ScrollView>
          </SafeAreaView>
        </Screen>
      </SafeAreaProvider>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, width: '100%', maxWidth: MaxContentWidth, alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.four, paddingTop: Spacing.three, paddingBottom: Spacing.two },
  title: { fontSize: 30, lineHeight: 36, flex: 1 },
  content: { padding: Spacing.three, paddingBottom: Spacing.six },
});
