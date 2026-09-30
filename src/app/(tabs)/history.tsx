import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from '@/components/safe-area';

import { Glass } from '@/components/glass';
import { HERB_CARD_HEIGHTS, HerbCard } from '@/components/herb-card';
import { Icon, type IconName } from '@/components/icon';
import { PressableScale } from '@/components/pressable-scale';
import { Screen } from '@/components/screen';
import { Skeleton } from '@/components/skeleton';
import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, Lime, MaxContentWidth, Spacing, VerdictColors } from '@/constants/theme';
import { type ScanItem, useScans } from '@/hooks/use-scans';
import { useTheme } from '@/hooks/use-theme';
import { HERBS } from '@/lib/herbs';

type Filter = 'all' | 'safe' | 'caution' | 'unknown';

type Row = { type: 'header'; key: string; label: string } | { type: 'scan'; key: string; scan: ScanItem };

const VERDICT_LABEL = { safe: 'Safe', caution: 'Caution', toxic: 'Toxic', unknown: 'Unknown' } as const;
const VERDICT_ICON: Record<ScanItem['verdict'], IconName> = {
  safe: 'shield-checkmark',
  caution: 'warning',
  toxic: 'skull',
  unknown: 'help-circle',
};

function timeAgo(ms: number) {
  const m = Math.floor((Date.now() - ms) / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function dayLabel(ms: number) {
  const startOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diff = Math.round((startOf(new Date()) - startOf(new Date(ms))) / 86400000);
  if (diff <= 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return 'This week';
  return 'Earlier';
}

function matches(scan: ScanItem, filter: Filter) {
  if (filter === 'all') return true;
  if (filter === 'safe') return scan.identified && scan.verdict === 'safe';
  if (filter === 'caution') return scan.identified && (scan.verdict === 'caution' || scan.verdict === 'toxic');
  return !scan.identified || scan.verdict === 'unknown';
}

function FilterChip({
  label,
  count,
  active,
  onPress,
}: {
  label: string;
  count: number;
  active: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <PressableScale onPress={onPress} accessibilityState={{ selected: active }}>
      <View
        style={[
          styles.chip,
          {
            backgroundColor: active ? theme.primary : theme.backgroundElement,
            borderColor: active ? theme.primary : theme.border,
          },
        ]}>
        <ThemedText type="smallBold" style={{ color: active ? theme.onPrimary : theme.text }}>
          {label}
        </ThemedText>
        <View style={[styles.count, { backgroundColor: active ? 'rgba(255,255,255,0.22)' : theme.backgroundSelected }]}>
          <ThemedText style={{ fontSize: 11, lineHeight: 15, fontWeight: '800', color: active ? theme.onPrimary : theme.textSecondary }}>
            {count}
          </ThemedText>
        </View>
      </View>
    </PressableScale>
  );
}

function ScanCard({ scan }: { scan: ScanItem }) {
  const theme = useTheme();
  const color = scan.identified ? VerdictColors[scan.verdict] : VerdictColors.unknown;
  const pct = Math.round(scan.confidence * 100);

  return (
    <PressableScale onPress={() => router.push({ pathname: '/scan/[id]', params: { id: scan._id } })}>
      <Glass radius={30} style={styles.card}>
        <View style={[styles.photo, { backgroundColor: theme.backgroundSelected }]}>
          {scan.imageUrl ? (
            <Image source={{ uri: scan.imageUrl }} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
          ) : (
            <View style={styles.photoFallback}>
              <Icon name="leaf-outline" size={28} color={theme.textSecondary} />
            </View>
          )}
          <LinearGradient colors={['transparent', 'rgba(4,14,8,0.75)']} style={styles.photoShade} />
          {scan.identified && (
            <View style={styles.pct}>
              <ThemedText style={styles.pctText}>{pct}%</ThemedText>
            </View>
          )}
        </View>

        <View style={styles.body}>
          <View style={[styles.pill, { backgroundColor: color + '22' }]}>
            <Icon name={scan.identified ? VERDICT_ICON[scan.verdict] : 'help-circle'} size={12} color={color} />
            <ThemedText style={{ color, fontSize: 11.5, lineHeight: 15, fontWeight: '800' }}>
              {scan.identified ? VERDICT_LABEL[scan.verdict] : 'Not identified'}
            </ThemedText>
          </View>

          <ThemedText serif numberOfLines={2} style={styles.name}>
            {scan.identified ? scan.commonName : 'Unknown plant'}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" numberOfLines={1} style={{ fontStyle: 'italic' }}>
            {scan.identified ? scan.scientificName : 'Try a clearer photo'}
          </ThemedText>

          <View style={styles.meta}>
            <Icon name="time-outline" size={13} color={theme.textSecondary} />
            <ThemedText type="small" themeColor="textSecondary" style={{ fontSize: 12, flex: 1 }}>
              {timeAgo(scan._creationTime)}
            </ThemedText>
            <View style={[styles.go, { backgroundColor: theme.brandSoft }]}>
              <Icon name="arrow-forward" size={14} color={theme.accent} />
            </View>
          </View>
        </View>
      </Glass>
    </PressableScale>
  );
}

function ListSkeleton() {
  return (
    <View style={{ gap: Spacing.three }}>
      {[0, 1, 2, 3].map((i) => (
        <Skeleton key={i} height={136} radius={30} />
      ))}
    </View>
  );
}

function ExploreHerbs() {
  const herbs = HERBS.slice(0, 5);
  const left = herbs.filter((_, i) => i % 2 === 0);
  const right = herbs.filter((_, i) => i % 2 === 1);
  const theme = useTheme();
  return (
    <View style={styles.explore}>
      <View style={styles.exploreHead}>
        <ThemedText serif style={{ fontSize: 26, lineHeight: 32 }}>Explore</ThemedText>
        <PressableScale onPress={() => router.navigate('/herbs')} style={styles.viewAll}>
          <ThemedText type="smallBold" style={{ color: theme.accent }}>View all</ThemedText>
          <Icon name="arrow-forward" size={15} color={theme.accent} />
        </PressableScale>
      </View>
      <View style={styles.masonry}>
        <View style={styles.col}>
          {left.map((h, i) => (
            <HerbCard key={h.slug} herb={h} height={HERB_CARD_HEIGHTS[i % 2]} />
          ))}
        </View>
        <View style={[styles.col, { marginTop: Spacing.five }]}>
          {right.map((h, i) => (
            <HerbCard key={h.slug} herb={h} height={HERB_CARD_HEIGHTS[(i + 1) % 2]} />
          ))}
        </View>
      </View>
    </View>
  );
}

export default function HistoryScreen() {
  const theme = useTheme();
  const { scans, refresh, refreshing } = useScans();
  const [filter, setFilter] = useState<Filter>('all');

  const counts = useMemo(() => {
    const all = scans ?? [];
    return {
      all: all.length,
      safe: all.filter((s) => matches(s, 'safe')).length,
      caution: all.filter((s) => matches(s, 'caution')).length,
      unknown: all.filter((s) => matches(s, 'unknown')).length,
    };
  }, [scans]);

  const rows = useMemo<Row[]>(() => {
    const out: Row[] = [];
    let last = '';
    for (const scan of (scans ?? []).filter((s) => matches(s, filter))) {
      const label = dayLabel(scan._creationTime);
      if (label !== last) {
        out.push({ type: 'header', key: `h-${label}`, label });
        last = label;
      }
      out.push({ type: 'scan', key: scan._id, scan });
    }
    return out;
  }, [scans, filter]);

  const hasAny = (scans?.length ?? 0) > 0;

  return (
    <Screen>
      <SafeAreaView edges={['top']} style={styles.safe}>
        <View style={styles.header}>
          <ThemedText serif style={styles.title}>History</ThemedText>
          {hasAny && (
            <ThemedText themeColor="textSecondary">
              {counts.all} {counts.all === 1 ? 'plant' : 'plants'} scanned
            </ThemedText>
          )}
        </View>

        {hasAny && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips} style={styles.chipsWrap}>
            <FilterChip label="All" count={counts.all} active={filter === 'all'} onPress={() => setFilter('all')} />
            <FilterChip label="Safe" count={counts.safe} active={filter === 'safe'} onPress={() => setFilter('safe')} />
            <FilterChip label="Caution" count={counts.caution} active={filter === 'caution'} onPress={() => setFilter('caution')} />
            <FilterChip label="Unknown" count={counts.unknown} active={filter === 'unknown'} onPress={() => setFilter('unknown')} />
          </ScrollView>
        )}

        {scans === undefined ? (
          <View style={styles.list}>
            <ListSkeleton />
          </View>
        ) : (
          <FlatList
            data={rows}
            keyExtractor={(r) => r.key}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={theme.accent} colors={[theme.accent]} />}
            ListEmptyComponent={
              hasAny ? (
                <View style={styles.filterEmpty}>
                  <Icon name="funnel-outline" size={30} color={theme.textSecondary} />
                  <ThemedText themeColor="textSecondary">No scans match this filter.</ThemedText>
                </View>
              ) : (
                <View style={styles.empty}>
                  <View style={[styles.emptyIcon, { backgroundColor: theme.brandSoft }]}>
                    <Icon name="leaf" size={38} color={theme.accent} />
                  </View>
                  <ThemedText serif style={{ fontSize: 26, lineHeight: 32 }}>Nothing here yet</ThemedText>
                  <ThemedText themeColor="textSecondary" style={{ textAlign: 'center' }}>
                    Plants you scan will be saved here so you can revisit them.
                  </ThemedText>
                  <PressableScale onPress={() => router.navigate('/scan')} style={[styles.cta, { backgroundColor: theme.primary }]}>
                    <Icon name="scan" size={18} color={theme.onPrimary} />
                    <ThemedText style={{ color: theme.onPrimary, fontWeight: '800' }}>Scan a plant</ThemedText>
                  </PressableScale>
                  <ExploreHerbs />
                </View>
              )
            }
            renderItem={({ item }) =>
              item.type === 'header' ? (
                <View style={styles.sectionHead}>
                  <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionText}>
                    {item.label.toUpperCase()}
                  </ThemedText>
                  <View style={[styles.sectionLine, { backgroundColor: theme.border }]} />
                </View>
              ) : (
                <ScanCard scan={item.scan} />
              )
            }
          />
        )}
      </SafeAreaView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, width: '100%', maxWidth: MaxContentWidth, alignSelf: 'center' },
  header: { paddingHorizontal: Spacing.four, paddingTop: Spacing.three, paddingBottom: Spacing.two },
  title: { fontSize: 38, lineHeight: 44 },
  chipsWrap: { flexGrow: 0, marginBottom: Spacing.two },
  chips: { paddingHorizontal: Spacing.three, gap: Spacing.two },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingLeft: Spacing.three, paddingRight: 10, height: 42, borderRadius: 21, borderWidth: 1 },
  count: { minWidth: 24, height: 22, borderRadius: 11, paddingHorizontal: 6, alignItems: 'center', justifyContent: 'center' },
  list: { paddingHorizontal: Spacing.three, paddingTop: Spacing.two, paddingBottom: BottomTabInset + Spacing.five, gap: Spacing.three },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two + 2, marginTop: Spacing.one, paddingHorizontal: Spacing.one },
  sectionText: { letterSpacing: 1.2, fontSize: 12 },
  sectionLine: { flex: 1, height: StyleSheet.hairlineWidth * 2 },
  card: { flexDirection: 'row', padding: 10, gap: Spacing.three, alignItems: 'stretch' },
  photo: { width: 104, height: 124, borderRadius: 22, overflow: 'hidden' },
  photoFallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  photoShade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 56 },
  pct: { position: 'absolute', left: 8, bottom: 8, backgroundColor: 'rgba(8, 20, 13, 0.7)', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: 'rgba(213, 242, 107, 0.45)' },
  pctText: { color: Lime, fontSize: 11.5, lineHeight: 15, fontWeight: '800' },
  body: { flex: 1, paddingVertical: 4, paddingRight: 4, justifyContent: 'space-between', gap: 2 },
  pill: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 12, paddingHorizontal: 9, paddingVertical: 4 },
  name: { fontSize: 22, lineHeight: 26 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  go: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  filterEmpty: { alignItems: 'center', gap: Spacing.two, paddingTop: Spacing.five },
  empty: { alignItems: 'center', gap: Spacing.two + 2, paddingTop: Spacing.six, paddingHorizontal: Spacing.four },
  emptyIcon: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.two },
  // Cancel the empty state's side padding so the cards match the Herbs tab width.
  explore: { alignSelf: 'stretch', marginHorizontal: -Spacing.four, gap: Spacing.two + 2, marginTop: Spacing.four },
  exploreHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  masonry: { flexDirection: 'row', gap: Spacing.three, alignItems: 'flex-start' },
  col: { flex: 1, gap: Spacing.three },
  viewAll: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, borderRadius: 26, paddingHorizontal: Spacing.four, paddingVertical: Spacing.three, marginTop: Spacing.two },
});
