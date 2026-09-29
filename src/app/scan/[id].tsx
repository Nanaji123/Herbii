import { useMutation, useQuery } from 'convex/react';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

import { useDialog } from '@/components/dialog';
import { HerbView } from '@/components/herb-view';
import { Skeleton } from '@/components/skeleton';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { findHerbByScientificName } from '@/lib/herbs';
import { scheduleRecentHerbReminder } from '@/lib/reminders';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';

export default function ScanDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const scan = useQuery(api.scans.get, { id: id as Id<'scans'> });
  const remove = useMutation(api.scans.remove);
  const dialog = useDialog();

  // A scan that was just made (not one reopened from history) queues a "remember this herb?" nudge.
  useEffect(() => {
    if (!scan?.identified || Date.now() - scan._creationTime > 2 * 60 * 1000) return;
    scheduleRecentHerbReminder(scan.commonName, scan._id);
  }, [scan]);

  async function confirmDelete() {
    const ok = await dialog.confirm({
      title: 'Delete this scan?',
      message: 'It will be removed from your history, along with its photo.',
      confirmLabel: 'Delete',
      icon: 'trash-outline',
      tone: 'danger',
      destructive: true,
    });
    if (!ok) return;
    router.back();
    remove({ id: id as Id<'scans'> });
  }

  if (scan === undefined) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background, gap: Spacing.three }}>
        <Skeleton height={340} radius={0} />
        <View style={{ padding: Spacing.three, gap: Spacing.three }}>
          <Skeleton height={90} radius={20} />
          <Skeleton height={16} width="70%" />
          <Skeleton height={140} radius={20} />
        </View>
      </View>
    );
  }
  if (scan === null) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background, alignItems: 'center', justifyContent: 'center' }}>
        <ThemedText>Scan not found.</ThemedText>
      </View>
    );
  }

  const herb = scan.identified ? findHerbByScientificName(scan.scientificName) : undefined;

  return (
    <HerbView
      onDelete={confirmDelete}
      data={{
        title: scan.identified ? scan.commonName : 'Not identified',
        scientificName: scan.scientificName,
        family: scan.family || herb?.family,
        // Your own photo first, the library photo as a fallback
        image: scan.imageUrl ? { uri: scan.imageUrl } : herb?.image,
        identified: scan.identified,
        verdict: scan.verdict,
        verdictReason: scan.verdictReason,
        summary: scan.summary,
        properties: scan.medicinalProperties,
        uses: scan.traditionalUses,
        sideEffects: scan.sideEffects,
        precautions: scan.precautions,
        lookalikes: scan.lookalikes,
        confidence: scan.confidence,
        herb,
      }}
    />
  );
}
