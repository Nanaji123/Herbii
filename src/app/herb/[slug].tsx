import { Redirect, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { HerbView } from '@/components/herb-view';
import { Icon } from '@/components/icon';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { useEntitlement } from '@/hooks/use-entitlement';
import { getHerb } from '@/lib/herbs';
import { isHerbFree } from '@/lib/plans';

export default function HerbDetail() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const herb = getHerb(slug);
  const { isPro, loading } = useEntitlement();

  // Backstop for deep links and any path that skipped the card lock.
  if (herb && !loading && !isPro && !isHerbFree(herb.slug)) return <Redirect href="/paywall" />;

  if (!herb) {
    return (
      <Screen>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Icon name="leaf-outline" size={40} />
          <ThemedText>Herb not found.</ThemedText>
        </View>
      </Screen>
    );
  }

  return (
    <HerbView
      data={{
        title: herb.commonName,
        scientificName: herb.scientificName,
        family: herb.family,
        image: herb.image,
        identified: true,
        verdict: herb.verdict,
        verdictReason: herb.verdictReason,
        summary: herb.summary,
        properties: herb.medicinalProperties,
        uses: herb.traditionalUses,
        sideEffects: herb.sideEffects,
        precautions: herb.precautions,
        lookalikes: herb.lookalikes,
        tagline: herb.tagline,
        herb,
      }}
    />
  );
}
