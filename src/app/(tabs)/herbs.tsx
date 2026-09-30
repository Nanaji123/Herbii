import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from '@/components/safe-area';

import { Glass } from '@/components/glass';
import { HERB_CARD_HEIGHTS, HerbCard } from '@/components/herb-card';
import { Icon, type IconName } from '@/components/icon';
import { PressableScale } from '@/components/pressable-scale';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, CardShadow, Lime, MaxContentWidth, Spacing } from '@/constants/theme';
import { useOpenHerb } from '@/hooks/use-entitlement';
import { useTheme } from '@/hooks/use-theme';
import { CATEGORIES, type Category, HERBS, type Herb, categoryCount, getHerbOfTheDay } from '@/lib/herbs';

const PAGE = 24;

function shortName(h: Herb) {
  return h.commonName.replace(/ \(.*\)/, '');
}

function FilterChip({
  label,
  icon,
  count,
  active,
  onPress,
}: {
  label: string;
  icon: IconName;
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
        <Icon name={icon} size={17} color={active ? theme.onPrimary : theme.accent} />
        <ThemedText type="smallBold" style={{ color: active ? theme.onPrimary : theme.text }}>
          {label}
        </ThemedText>
        <View
          style={[
            styles.count,
            { backgroundColor: active ? 'rgba(255,255,255,0.22)' : theme.backgroundSelected },
          ]}>
          <ThemedText
            style={{ fontSize: 11, lineHeight: 15, fontWeight: '800', color: active ? theme.onPrimary : theme.textSecondary }}>
            {count}
          </ThemedText>
        </View>
      </View>
    </PressableScale>
  );
}

function Featured({ herb }: { herb: Herb }) {
  const theme = useTheme();
  const open = useOpenHerb();
  return (
    <PressableScale
      onPress={() => open(herb.slug)}
      style={[{ borderRadius: 32, backgroundColor: theme.backgroundElement }, CardShadow]}>
      <View style={styles.feat}>
        <Image source={herb.image} style={StyleSheet.absoluteFill} contentFit="cover" transition={250} />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(10,40,22,0.14)' }]} />
        <LinearGradient
          colors={['rgba(6,22,12,0.35)', 'transparent', 'rgba(6,22,12,0.92)']}
          locations={[0, 0.4, 1]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.featTag}>
          <Icon name="sparkles" size={13} color="#0E1A12" />
          <ThemedText style={styles.featTagText}>Herb of the day</ThemedText>
        </View>
        <View style={styles.featText}>
          <ThemedText serif style={styles.featName}>
            {shortName(herb)}
          </ThemedText>
          <ThemedText type="small" style={{ color: 'rgba(255,255,255,0.8)' }} numberOfLines={2}>
            {herb.tagline} · {herb.scientificName}
          </ThemedText>
        </View>
        <View style={styles.featArrow}>
          <Icon name="arrow-forward" size={18} color="#0E1A12" />
        </View>
      </View>
    </PressableScale>
  );
}

export default function HerbsScreen() {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category | null>(null); // null = All
  const [limit, setLimit] = useState(PAGE);

  const q = query.trim().toLowerCase();
  const filtering = q.length > 0 || category !== null;

  const data = useMemo(
    () =>
      HERBS.filter(
        (h) =>
          (!category || h.categories.includes(category)) &&
          (!q ||
            h.commonName.toLowerCase().includes(q) ||
            h.scientificName.toLowerCase().includes(q) ||
            h.medicinalProperties.some((p) => p.toLowerCase().includes(q)) ||
            h.traditionalUses.some((u) => u.toLowerCase().includes(q))),
      ),
    [q, category],
  );

  const featured = !filtering ? getHerbOfTheDay() : null;
  const rest = featured ? data.filter((h) => h.slug !== featured.slug) : data;
  const visible = rest.slice(0, limit);
  const left = visible.filter((_, i) => i % 2 === 0);
  const right = visible.filter((_, i) => i % 2 === 1);

  const activeCategory = CATEGORIES.find((c) => c.key === category);

  function pickCategory(next: Category | null) {
    setCategory(next);
    setLimit(PAGE);
  }

  return (
    <Screen>
      <SafeAreaView edges={['top']} style={styles.safe}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.five }]}>
          <View style={{ gap: 4 }}>
            <ThemedText serif style={styles.title}>
              Herb library
            </ThemedText>
            <ThemedText themeColor="textSecondary">
              {HERBS.length} herbs · benefits, uses and safety
            </ThemedText>
          </View>

          <Glass radius={30} style={styles.search}>
            <Icon name="search-outline" size={20} color={theme.textSecondary} />
            <TextInput
              value={query}
              onChangeText={(t) => {
                setQuery(t);
                setLimit(PAGE);
              }}
              placeholder="Search herbs, benefits, uses…"
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { color: theme.text }]}
              returnKeyType="search"
              autoCorrect={false}
            />
            {query.length > 0 && (
              <PressableScale onPress={() => setQuery('')} haptic={false} accessibilityLabel="Clear search">
                <Icon name="close-circle" size={20} color={theme.textSecondary} />
              </PressableScale>
            )}
          </Glass>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips} style={styles.bleed}>
            <FilterChip
              label="All"
              icon="apps-outline"
              count={HERBS.length}
              active={category === null}
              onPress={() => pickCategory(null)}
            />
            {CATEGORIES.map((c) => (
              <FilterChip
                key={c.key}
                label={c.label}
                icon={c.icon}
                count={categoryCount(c.key)}
                active={category === c.key}
                onPress={() => pickCategory(category === c.key ? null : c.key)}
              />
            ))}
          </ScrollView>

          {featured && <Featured herb={featured} />}

          <View style={styles.resultRow}>
            <ThemedText serif style={styles.resultTitle}>
              {activeCategory ? activeCategory.label : q ? 'Search results' : 'All herbs'}
            </ThemedText>
            <ThemedText type="smallBold" themeColor="textSecondary">
              {data.length} {data.length === 1 ? 'herb' : 'herbs'}
            </ThemedText>
          </View>

          {data.length === 0 ? (
            <View style={styles.empty}>
              <View style={[styles.emptyIcon, { backgroundColor: theme.brandSoft }]}>
                <Icon name="leaf-outline" size={34} color={theme.accent} />
              </View>
              <ThemedText serif style={{ fontSize: 24 }}>
                No herbs found
              </ThemedText>
              <ThemedText themeColor="textSecondary">Try a different search or category.</ThemedText>
            </View>
          ) : (
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
          )}

          {rest.length > limit && (
            <PressableScale onPress={() => setLimit((l) => l + PAGE)} style={[styles.more, { backgroundColor: theme.primary }]}>
              <ThemedText type="smallBold" style={{ color: theme.onPrimary }}>
                Show more herbs
              </ThemedText>
              <View style={[styles.count, { backgroundColor: 'rgba(255,255,255,0.22)' }]}>
                <ThemedText style={{ fontSize: 11, lineHeight: 15, fontWeight: '800', color: theme.onPrimary }}>
                  {rest.length - limit}
                </ThemedText>
              </View>
            </PressableScale>
          )}
        </ScrollView>
      </SafeAreaView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, width: '100%', maxWidth: MaxContentWidth, alignSelf: 'center' },
  content: { paddingHorizontal: Spacing.three, paddingTop: Spacing.three, gap: Spacing.three },
  title: { fontSize: 38, lineHeight: 44, letterSpacing: -0.5 },
  search: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, paddingHorizontal: Spacing.three, height: 56 },
  input: { flex: 1, fontSize: 16, height: '100%', fontFamily: 'Manrope_500Medium' },
  bleed: { marginHorizontal: -Spacing.three },
  chips: { paddingHorizontal: Spacing.three, gap: Spacing.two },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingLeft: Spacing.three, paddingRight: 10, height: 46, borderRadius: 23, borderWidth: 1 },
  count: { minWidth: 24, height: 22, borderRadius: 11, paddingHorizontal: 6, alignItems: 'center', justifyContent: 'center' },
  resultRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: Spacing.one },
  resultTitle: { fontSize: 26, lineHeight: 32 },
  feat: { height: 230, borderRadius: 32, overflow: 'hidden', justifyContent: 'flex-end' },
  featTag: { position: 'absolute', top: Spacing.three, left: Spacing.three, flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Lime, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 5 },
  featTagText: { color: '#0E1A12', fontSize: 12, lineHeight: 16, fontWeight: '800' },
  featText: { padding: Spacing.three + 2, paddingRight: 80, gap: 2 },
  featName: { color: '#fff', fontSize: 32, lineHeight: 36 },
  featArrow: { position: 'absolute', right: Spacing.three, bottom: Spacing.three, width: 46, height: 46, borderRadius: 23, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  masonry: { flexDirection: 'row', gap: Spacing.three, alignItems: 'flex-start' },
  col: { flex: 1, gap: Spacing.three },
  more: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, height: 54, borderRadius: 27, marginTop: Spacing.two },
  empty: { alignItems: 'center', gap: Spacing.two, paddingTop: Spacing.five },
  emptyIcon: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
});
