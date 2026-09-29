import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { Icon } from '@/components/icon';
import { PressableScale } from '@/components/pressable-scale';
import { ThemedText } from '@/components/themed-text';
import { CardShadow, Spacing, VerdictColors } from '@/constants/theme';
import { useEntitlement, useOpenHerb } from '@/hooks/use-entitlement';
import { useTheme } from '@/hooks/use-theme';
import { isHerbFree } from '@/lib/plans';
import type { Herb } from '@/lib/herbs';

export const HERB_CARD_HEIGHTS = [250, 300];

function shortName(h: Herb) {
  return h.commonName.replace(/ \(.*\)/, '');
}

export function HerbCard({ herb, height }: { herb: Herb; height: number }) {
  const theme = useTheme();
  const { isPro, loading } = useEntitlement();
  const openHerb = useOpenHerb();
  const locked = !loading && !isPro && !isHerbFree(herb.slug);
  return (
    <PressableScale
      onPress={() => openHerb(herb.slug)}
      style={[{ borderRadius: 28, backgroundColor: theme.backgroundElement }, CardShadow]}>
      <View style={[styles.card, { height }]}>
        <Image source={herb.image} style={StyleSheet.absoluteFill} contentFit="cover" transition={250} recyclingKey={herb.slug} />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(10,40,22,0.10)' }]} />
        <LinearGradient colors={['transparent', 'rgba(6,22,12,0.9)']} style={styles.shade} />
        <View style={[styles.badge, { backgroundColor: VerdictColors[herb.verdict] }]}>
          <Icon name={herb.verdict === 'safe' ? 'checkmark' : 'alert'} size={13} color="#fff" />
        </View>
        <View style={styles.text}>
          <ThemedText serif style={styles.name} numberOfLines={2}>
            {shortName(herb)}
          </ThemedText>
          <ThemedText type="small" style={styles.sci} numberOfLines={1}>
            {herb.scientificName}
          </ThemedText>
          <View style={styles.tag}>
            <ThemedText style={styles.tagText} numberOfLines={1}>
              {herb.medicinalProperties[0]}
            </ThemedText>
          </View>
        </View>
        {locked && (
          <>
            <BlurView intensity={22} tint="dark" experimentalBlurMethod="dimezisBlurView" style={StyleSheet.absoluteFill} />
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(6,22,12,0.28)' }]} />
            <View style={styles.lock}>
              <Icon name="lock-closed" size={20} color="#0E1A12" />
            </View>
          </>
        )}
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 28, overflow: 'hidden', justifyContent: 'flex-end' },
  shade: { ...StyleSheet.absoluteFill, top: '35%' },
  badge: { position: 'absolute', top: Spacing.two + 2, right: Spacing.two + 2, width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  lock: { position: 'absolute', top: '38%', alignSelf: 'center', width: 46, height: 46, borderRadius: 23, backgroundColor: '#C4F250', alignItems: 'center', justifyContent: 'center' },
  text: { padding: Spacing.three, gap: 2 },
  name: { color: '#fff', fontSize: 21, lineHeight: 25 },
  sci: { color: 'rgba(255,255,255,0.75)', fontStyle: 'italic', fontSize: 12, lineHeight: 16 },
  tag: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, paddingHorizontal: 9, paddingVertical: 3, marginTop: 6 },
  tagText: { color: '#fff', fontSize: 11, lineHeight: 15, fontFamily: 'Manrope_700Bold' },
});
