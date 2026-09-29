import { useQuery } from 'convex/react';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  type ViewStyle,
  Animated,
  useWindowDimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/icon';
import { PressableScale } from '@/components/pressable-scale';
import { Screen } from '@/components/screen';
import { Skeleton } from '@/components/skeleton';
import { PlanBadge } from '@/components/plan-badge';
import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, Lime, MaxContentWidth, Spacing, VerdictColors } from '@/constants/theme';
import { useScans } from '@/hooks/use-scans';
import { useOpenHerb } from '@/hooks/use-entitlement';
import { useIsDark, useTheme } from '@/hooks/use-theme';
import { FEATURED_HERBS, type Herb, getHerbOfTheDay } from '@/lib/herbs';
import { setThemePreference } from '@/lib/theme-preference';
import { api } from '../../../convex/_generated/api';

const CARD_HEIGHT = 410;
const SPACING = 8;

type LoopItem = { herb: Herb; key: string };
const HERB_COUNT = FEATURED_HERBS.length;
const LOOP: LoopItem[] = [0, 1, 2].flatMap((copy) =>
  FEATURED_HERBS.map((herb) => ({ herb, key: `${herb.slug}-${copy}` })),
);


function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
}

function timeAgo(ms: number) {
  const m = Math.floor((Date.now() - ms) / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

type Palette = ReturnType<typeof usePalette>;

function usePalette() {
  const dark = useIsDark();
  const theme = useTheme();
  return useMemo(
    () => ({
      dark,
      text: theme.text,
      textDim: theme.textSecondary,
      textFaint: dark ? 'rgba(255,255,255,0.4)' : 'rgba(16,40,26,0.5)',
      card: theme.backgroundElement,
      cardBorder: theme.border,
      chip: theme.backgroundSelected,
      accentText: theme.accent,
      headlineAccent: dark ? Lime : '#2B7548',
      avatarBorder: dark ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.9)',
      iconBox: dark ? 'rgba(20, 52, 34, 0.9)' : 'rgba(43, 117, 72, 0.16)',
      iconBoxBorder: dark ? 'rgba(196, 242, 80, 0.6)' : 'rgba(43, 117, 72, 0.45)',
      dot: dark ? 'rgba(255,255,255,0.25)' : 'rgba(16,40,26,0.28)',
      divider: dark ? 'rgba(255,255,255,0.10)' : 'rgba(16,40,26,0.10)',
      stepBg: dark ? 'rgba(213, 242, 107, 0.12)' : 'rgba(43, 117, 72, 0.12)',
      shadow: (dark
        ? {}
        : { shadowColor: '#0B2A16', shadowOpacity: 0.1, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 3 }) as ViewStyle,
      stepBorder: dark ? 'rgba(213, 242, 107, 0.4)' : 'rgba(43, 117, 72, 0.4)',
    }),
    [dark, theme],
  );
}

export default function HomeScreen() {
  const openHerb = useOpenHerb();
  const { width: windowWidth } = useWindowDimensions();
  const containerWidth = Math.min(windowWidth, MaxContentWidth);
  const CARD_WIDTH = Math.round(containerWidth * 0.77);
  const SNAP_INTERVAL = CARD_WIDTH + SPACING;
  const SIDE_SPACER = (containerWidth - CARD_WIDTH) / 2;
  const P = usePalette();
  const styles = useMemo(() => makeStyles(P), [P]);
  const dark = P.dark;
  const user = useQuery(api.scans.me);
  const { scans } = useScans();
  const [favorites, setFavorites] = useState<Record<string, boolean>>({ tulsi: true, ginger: true });

  const toggleFavorite = (slug: string) => {
    setFavorites((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  const displayName = user?.name ? user.name.split(' ')[0] : 'Nanaji';
  const avatarLetter = user?.name ? user.name.charAt(0).toUpperCase() : 'N';

  const herbOfDay = getHerbOfTheDay();

  // Infinite spotlight carousel: three copies of the list, always parked on the middle copy.
  // Whenever a scroll settles in the first/last copy we silently jump one copy over,
  // so swiping (or auto-scrolling) never runs out and never rewinds visibly.
  const [scrollX] = useState(() => new Animated.Value(0));
  const flatListRef = useRef<FlatList<LoopItem>>(null);
  const idxRef = useRef(HERB_COUNT);
  const ready = useRef(false);
  const isUserDragging = useRef(false);
  const [activeDot, setActiveDot] = useState(0);

  const normalize = (idx: number) => {
    let i = idx;
    if (i < HERB_COUNT) i += HERB_COUNT;
    else if (i >= HERB_COUNT * 2) i -= HERB_COUNT;
    if (i !== idx) {
      flatListRef.current?.scrollToOffset({ offset: i * SNAP_INTERVAL, animated: false });
    }
    idxRef.current = i;
    setActiveDot(i % HERB_COUNT);
  };

  // Auto-advance every 3.6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      if (isUserDragging.current || !ready.current) return;
      const next = idxRef.current + 1;
      idxRef.current = next;
      flatListRef.current?.scrollToOffset({ offset: next * SNAP_INTERVAL, animated: true });
      setActiveDot(next % HERB_COUNT);
      setTimeout(() => {
        if (!isUserDragging.current) normalize(next);
      }, 550);
    }, 3600);
    return () => clearInterval(timer);
  }, []);

  return (
    <Screen>
      <SafeAreaView edges={['top']} style={styles.safe}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.six }]}>
          
          {/* Header Row */}
          <View style={styles.header}>
            <PressableScale onPress={() => router.navigate('/profile')} accessibilityLabel="Profile">
              <View style={styles.avatarWrap}>
                {user?.image ? (
                  <Image source={{ uri: user.image }} style={styles.avatar} />
                ) : (
                  <ThemedText style={styles.avatarLetter}>{avatarLetter}</ThemedText>
                )}
              </View>
            </PressableScale>

            <View style={{ flex: 1, gap: 1 }}>
              <ThemedText style={styles.greetingText}>
                {greeting()}
              </ThemedText>
              <ThemedText style={styles.userNameText} numberOfLines={1}>
                {displayName}
              </ThemedText>
            </View>

            <PlanBadge />

            {/* Sun / Theme Button */}
            <PressableScale
              onPress={() => setThemePreference(dark ? 'light' : 'dark')}
              accessibilityLabel="Toggle Theme"
              style={styles.themeBtn}>
              <Icon name={dark ? 'sunny-outline' : 'moon-outline'} size={21} color={P.text} />
            </PressableScale>
          </View>

          {/* Headline */}
          <View style={styles.headlineWrap}>
            <ThemedText serif style={styles.headlineWhite}>
              Find the herbs
            </ThemedText>
            <ThemedText serif style={styles.headlineLime}>
              your body needs
            </ThemedText>
          </View>

          {/* Search Bar */}
          <PressableScale onPress={() => router.navigate('/herbs')} accessibilityLabel="Search herbs">
            <View style={styles.searchBar}>
              <Icon name="search-outline" size={21} color={P.textDim} />
              <ThemedText style={styles.searchPlaceholder}>
                Search herbs, benefits...
              </ThemedText>
              <View style={styles.filterIconCircle}>
                <Icon name="options-outline" size={19} color="#0E1A12" />
              </View>
            </View>
          </PressableScale>

          {/* Herb of the Day Card with 4-side seamless image fading */}
          <PressableScale onPress={() => openHerb(herbOfDay.slug)}>
            <View style={styles.dayCard}>
              {/* Solid dark forest background */}
              <View style={[StyleSheet.absoluteFill, { backgroundColor: '#0C2618' }]} />

              {/* Seamlessly faded ginger showcase image on right side */}
              <View style={styles.dayImageWrapper} pointerEvents="none">
                <Image
                  source={herbOfDay.image}
                  style={StyleSheet.absoluteFill}
                  contentFit="cover"
                  priority="high"
                />

                {/* Thin left feather so the card text stays readable but the plant stays vivid */}
                <LinearGradient
                  colors={['#0C2618', 'rgba(12, 38, 24, 0.55)', 'transparent']}
                  locations={[0, 0.1, 0.24]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={StyleSheet.absoluteFill}
                />

                {/* Very subtle top / bottom softening */}
                <LinearGradient
                  colors={['rgba(12, 38, 24, 0.55)', 'transparent', 'transparent', 'rgba(12, 38, 24, 0.5)']}
                  locations={[0, 0.16, 0.84, 1]}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
              </View>

              {/* Left Content */}
              <View style={styles.dayContent}>
                <View style={styles.dayTag}>
                  <Icon name="sparkles" size={12} color="#0E1A12" />
                  <ThemedText style={styles.dayTagText}>Herb of the day</ThemedText>
                </View>

                <View style={{ gap: 4, maxWidth: '55%' }}>
                  <ThemedText serif style={styles.dayHerbTitle} numberOfLines={2}>
                    {herbOfDay.commonName.replace(/ \(.*\)/, '')}
                  </ThemedText>
                  <ThemedText style={styles.dayHerbSubtitle} numberOfLines={2}>
                    {herbOfDay.tagline}
                  </ThemedText>
                </View>

                <View style={styles.learnMoreBtn}>
                  <ThemedText style={styles.learnMoreText}>Learn more</ThemedText>
                  <Icon name="arrow-forward" size={15} color="#0E1A12" />
                </View>
              </View>
            </View>
          </PressableScale>

          {/* Identify Plant With AI Banner */}
          <PressableScale onPress={() => router.navigate('/scan')}>
            <View style={styles.aiBanner}>
              <View style={styles.aiIconBox}>
                <Icon name="scan" size={24} color={P.accentText} />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <ThemedText style={styles.aiBannerTitle}>
                  Identify a plant with AI
                </ThemedText>
                <ThemedText style={styles.aiBannerSubtitle}>
                  Point your camera at any leaf or flower
                </ThemedText>
              </View>
              <View style={styles.chevronCircle}>
                <Icon name="chevron-forward" size={18} color={P.textDim} />
              </View>
            </View>
          </PressableScale>

          {/* Spotlight Popular Herbs Section */}
          <View style={styles.sectionHeader}>
            <View>
              <ThemedText serif style={styles.sectionTitle}>
                Popular herbs
              </ThemedText>
              <ThemedText style={styles.sectionSubtitle}>
                In the spotlight
              </ThemedText>
            </View>
            <PressableScale
              onPress={() => router.navigate('/herbs')}
              haptic={false}
              style={styles.viewAllBtn}>
              <ThemedText style={styles.viewAllText}>View all</ThemedText>
              <Icon name="chevron-forward" size={14} color={P.accentText} />
            </PressableScale>
          </View>

          {/* Infinite auto-scrolling spotlight carousel (centre card tall, side cards shorter) */}
          <View style={styles.carouselContainer}>
            <Animated.FlatList
              ref={flatListRef}
              horizontal
              data={LOOP}
              keyExtractor={(l) => l.key}
              showsHorizontalScrollIndicator={false}
              snapToInterval={SNAP_INTERVAL}
              snapToAlignment="start"
              decelerationRate="fast"
              initialNumToRender={LOOP.length}
              maxToRenderPerBatch={LOOP.length}
              windowSize={LOOP.length}
              // Extra room above/below so the card shadows are not clipped by the list; the negative margins keep the layout the same
              contentContainerStyle={{ paddingHorizontal: SIDE_SPACER, paddingTop: 10, paddingBottom: 44 }}
              style={{ marginTop: -10, marginBottom: -32 }}
              onContentSizeChange={() => {
                if (ready.current) return;
                ready.current = true;
                flatListRef.current?.scrollToOffset({ offset: HERB_COUNT * SNAP_INTERVAL, animated: false });
              }}
              onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                useNativeDriver: true,
              })}
              scrollEventThrottle={16}
              onScrollBeginDrag={() => {
                isUserDragging.current = true;
              }}
              onScrollEndDrag={() => {
                setTimeout(() => {
                  isUserDragging.current = false;
                }, 2000);
              }}
              onMomentumScrollEnd={(e) => {
                normalize(Math.round(e.nativeEvent.contentOffset.x / SNAP_INTERVAL));
                setTimeout(() => {
                  isUserDragging.current = false;
                }, 1500);
              }}
              renderItem={({ item, index }) => {
                const herb = item.herb;
                const inputRange = [
                  (index - 1) * SNAP_INTERVAL,
                  index * SNAP_INTERVAL,
                  (index + 1) * SNAP_INTERVAL,
                ];

                // Side cards shrink noticeably so they read shorter than the centre card.
                const scale = scrollX.interpolate({
                  inputRange,
                  outputRange: [0.86, 1, 0.86],
                  extrapolate: 'clamp',
                });
                const opacity = scrollX.interpolate({
                  inputRange,
                  outputRange: [0.75, 1, 0.75],
                  extrapolate: 'clamp',
                });

                const isFav = !!favorites[herb.slug];

                return (
                  <View style={{ width: CARD_WIDTH, marginRight: SPACING }}>
                    <Animated.View style={[styles.spotlightCardWrap, { width: CARD_WIDTH, transform: [{ scale }], opacity }]}>
                      <PressableScale onPress={() => openHerb(herb.slug)} style={styles.spotlightCard}>
                        <Image source={herb.image} style={StyleSheet.absoluteFill} contentFit="cover" transition={250} />

                        <LinearGradient
                          colors={['rgba(0,0,0,0.15)', 'transparent', 'rgba(5, 18, 11, 0.75)', 'rgba(3, 12, 7, 0.96)']}
                          locations={[0, 0.35, 0.7, 1]}
                          style={StyleSheet.absoluteFill}
                        />

                        <View style={styles.cardTopRow}>
                          <View style={styles.propertyBadge}>
                            <Icon name="sparkles" size={11} color="#0E1A12" />
                            <ThemedText style={styles.propertyBadgeText}>
                              {herb.medicinalProperties[0] || 'Herbal'}
                            </ThemedText>
                          </View>

                          <PressableScale
                            onPress={() => toggleFavorite(herb.slug)}
                            style={styles.cardFavBtn}
                            accessibilityLabel={isFav ? 'Remove from favorites' : 'Add to favorites'}>
                            <Icon
                              name={isFav ? 'heart' : 'heart-outline'}
                              size={18}
                              color={isFav ? '#FF4F4F' : '#FFFFFF'}
                            />
                          </PressableScale>
                        </View>

                        <View style={styles.cardBottomInfo}>
                          <View style={[styles.verdictBadge, { backgroundColor: VerdictColors[herb.verdict] }]}>
                            <Icon name={herb.verdict === 'safe' ? 'checkmark' : 'alert'} size={11} color="#fff" />
                            <ThemedText style={styles.verdictBadgeText}>
                              {herb.verdict === 'safe' ? 'Safe to use' : 'Caution'}
                            </ThemedText>
                          </View>

                          <ThemedText serif style={styles.spotlightTitle} numberOfLines={1}>
                            {herb.commonName.replace(/ \(.*\)/, '')}
                          </ThemedText>
                          <ThemedText style={styles.spotlightSci} numberOfLines={1}>
                            {herb.scientificName}
                          </ThemedText>
                        </View>
                      </PressableScale>
                    </Animated.View>
                  </View>
                );
              }}
            />

            {/* Pagination Dots */}
            <View style={styles.paginationRow}>
              {FEATURED_HERBS.map((_, i) => (
                <View key={i} style={[styles.dot, activeDot === i && styles.dotActive]} />
              ))}
            </View>
          </View>

          {/* Recent Scans Section */}
          <View style={[styles.sectionHeader, { marginTop: Spacing.two }]}>
            <View>
              <ThemedText serif style={styles.sectionTitle}>
                Recent scans
              </ThemedText>
              <ThemedText style={styles.sectionSubtitle}>
                {scans && scans.length > 0 ? 'Your latest plant discoveries' : 'Your plant discovery journey'}
              </ThemedText>
            </View>
            {scans && scans.length > 0 && (
              <PressableScale onPress={() => router.navigate('/history')} haptic={false} style={styles.viewAllBtn}>
                <ThemedText style={styles.viewAllText}>See all</ThemedText>
                <Icon name="chevron-forward" size={14} color={P.accentText} />
              </PressableScale>
            )}
          </View>

          {scans === undefined ? (
            <View style={{ gap: 12 }}>
              <Skeleton height={206} radius={28} style={{ backgroundColor: P.chip }} />
              <Skeleton height={64} radius={22} style={{ backgroundColor: P.chip }} />
              <Skeleton height={64} radius={22} style={{ backgroundColor: P.chip }} />
            </View>
          ) : scans.length === 0 ? (
            <View style={styles.emptyScansCard}>
              <ThemedText serif style={styles.emptyHeading}>
                Start your collection
              </ThemedText>
              <View style={styles.stepsRow}>
                {(
                  [
                    ['camera-outline', 'Snap'],
                    ['sparkles-outline', 'Analyse'],
                    ['book-outline', 'Learn'],
                  ] as [IconName, string][]
                ).map(([icon, label], i) => (
                  <View key={label} style={styles.stepWrap}>
                    <View style={styles.step}>
                      <View style={styles.stepIcon}>
                        <Icon name={icon} size={20} color={P.accentText} />
                      </View>
                      <ThemedText style={styles.stepLabel}>{label}</ThemedText>
                    </View>
                    {i < 2 && <Icon name="chevron-forward" size={14} color={P.textFaint} />}
                  </View>
                ))}
              </View>
              <PressableScale
                onPress={() => router.navigate('/scan')}
                style={styles.emptyScanBtn}
                accessibilityLabel="Scan your first plant">
                <Icon name="scan" size={18} color="#0E1A12" />
                <ThemedText style={styles.emptyScanBtnText}>Scan your first plant</ThemedText>
              </PressableScale>
            </View>
          ) : (
            <View style={{ gap: 14 }}>
              {/* Quick stats */}
              <View style={styles.statsRow}>
                {(
                  [
                    ['scan-outline', scans.length, 'Scans'],
                    ['shield-checkmark-outline', scans.filter((s) => s.identified && s.verdict === 'safe').length, 'Safe'],
                    [
                      'warning-outline',
                      scans.filter((s) => s.identified && (s.verdict === 'caution' || s.verdict === 'toxic')).length,
                      'Caution',
                    ],
                  ] as [IconName, number, string][]
                ).map(([icon, value, label]) => (
                  <View key={label} style={styles.statTile}>
                    <Icon name={icon} size={18} color={P.accentText} />
                    <ThemedText style={styles.statValue}>{value}</ThemedText>
                    <ThemedText style={styles.statLabel}>{label}</ThemedText>
                  </View>
                ))}
              </View>

              {/* Latest scan, featured */}
              {(() => {
                const latest = scans[0];
                const vColor = VerdictColors[latest.verdict];
                const pct = Math.round(latest.confidence * 100);
                return (
                  <PressableScale
                    onPress={() => router.push({ pathname: '/scan/[id]', params: { id: latest._id } })}
                    style={styles.latestCard}>
                    {latest.imageUrl ? (
                      <Image source={{ uri: latest.imageUrl }} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
                    ) : (
                      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(16, 42, 28, 0.95)' }]} />
                    )}
                    <LinearGradient
                      colors={['rgba(0,0,0,0.35)', 'transparent', 'rgba(3, 12, 7, 0.95)']}
                      locations={[0, 0.4, 1]}
                      style={StyleSheet.absoluteFill}
                    />
                    <View style={styles.latestTop}>
                      <View style={styles.latestTag}>
                        <Icon name="time-outline" size={12} color="#0E1A12" />
                        <ThemedText style={styles.latestTagText}>Latest · {timeAgo(latest._creationTime)}</ThemedText>
                      </View>
                      {latest.identified && (
                        <View style={[styles.latestVerdict, { backgroundColor: vColor }]}>
                          <Icon name={latest.verdict === 'safe' ? 'checkmark' : 'alert'} size={12} color="#fff" />
                          <ThemedText style={styles.latestVerdictText}>
                            {latest.verdict === 'safe' ? 'Safe' : latest.verdict === 'unknown' ? 'Unknown' : 'Caution'}
                          </ThemedText>
                        </View>
                      )}
                    </View>
                    <View style={{ gap: 4 }}>
                      <ThemedText serif style={styles.latestTitle} numberOfLines={1}>
                        {latest.identified ? latest.commonName : 'Unknown plant'}
                      </ThemedText>
                      <ThemedText style={styles.latestSci} numberOfLines={1}>
                        {latest.identified ? latest.scientificName : 'Try a clearer photo'}
                      </ThemedText>
                      {latest.identified && (
                        <View style={styles.matchRow}>
                          <View style={styles.matchTrack}>
                            <View style={[styles.matchFill, { width: `${pct}%` }]} />
                          </View>
                          <ThemedText style={styles.matchText}>{pct}% match</ThemedText>
                        </View>
                      )}
                    </View>
                  </PressableScale>
                );
              })()}

              {/* Earlier scans, compact list */}
              {scans.length > 1 && (
                <View style={styles.listCard}>
                  {scans.slice(1, 4).map((item, i, arr) => {
                    const vColor = VerdictColors[item.verdict];
                    return (
                      <PressableScale
                        key={item._id}
                        onPress={() => router.push({ pathname: '/scan/[id]', params: { id: item._id } })}
                        style={[styles.listRow, i < arr.length - 1 && styles.listRowDivider]}>
                        <View style={styles.listThumb}>
                          {item.imageUrl && (
                            <Image source={{ uri: item.imageUrl }} style={StyleSheet.absoluteFill} contentFit="cover" />
                          )}
                        </View>
                        <View style={{ flex: 1, gap: 2 }}>
                          <ThemedText style={styles.listTitle} numberOfLines={1}>
                            {item.identified ? item.commonName : 'Unknown plant'}
                          </ThemedText>
                          <ThemedText style={styles.listSub} numberOfLines={1}>
                            {item.identified ? item.scientificName : 'Try a clearer photo'} · {timeAgo(item._creationTime)}
                          </ThemedText>
                        </View>
                        {item.identified && <View style={[styles.listDot, { backgroundColor: vColor }]} />}
                        <Icon name="chevron-forward" size={16} color={P.textFaint} />
                      </PressableScale>
                    );
                  })}
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Screen>
  );
}

const makeStyles = (P: Palette) =>
  StyleSheet.create({
  safe: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  content: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    gap: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: Spacing.one,
  },
  avatarWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#788E9B',
    borderWidth: 1.5,
    borderColor: P.avatarBorder,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 46,
    height: 46,
  },
  avatarLetter: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  greetingText: {
    color: P.textDim,
    fontSize: 13,
    fontWeight: '400',
  },
  userNameText: {
    color: P.text,
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 22,
  },
  themeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: P.chip,
    borderWidth: 1,
    borderColor: P.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headlineWrap: {
    marginTop: Spacing.one,
    marginBottom: Spacing.half,
  },
  headlineWhite: {
    fontSize: 38,
    lineHeight: 44,
    color: P.text,
    letterSpacing: -0.5,
  },
  headlineLime: {
    fontSize: 38,
    lineHeight: 44,
    color: P.headlineAccent,
    letterSpacing: -0.5,
  },
  searchBar: {
    ...P.shadow,
    height: 58,
    borderRadius: 29,
    backgroundColor: P.card,
    borderWidth: 1,
    borderColor: P.cardBorder,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 18,
    paddingRight: 7,
    gap: 12,
  },
  searchPlaceholder: {
    flex: 1,
    color: P.textDim,
    fontSize: 15,
  },
  filterIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Lime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bleed: {
    marginHorizontal: -Spacing.three,
  },
  dayCard: {
    borderRadius: 28,
    minHeight: 220,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(100, 200, 120, 0.22)',
    backgroundColor: '#0C2618',
    flexDirection: 'row',
    padding: 20,
    position: 'relative',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  dayImageWrapper: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '74%',
    overflow: 'hidden',
  },
  dayContent: {
    flex: 1,
    justifyContent: 'space-between',
    gap: 12,
    zIndex: 2,
  },
  dayTag: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Lime,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  dayTagText: {
    color: '#0E1A12',
    fontSize: 12,
    fontWeight: '800',
  },
  dayHerbTitle: {
    color: '#FFFFFF',
    fontSize: 34,
    lineHeight: 38,
  },
  dayHerbSubtitle: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 13.5,
    lineHeight: 18,
  },
  learnMoreBtn: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Lime,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  learnMoreText: {
    color: '#0E1A12',
    fontSize: 13.5,
    fontWeight: '700',
  },
  aiBanner: {
    ...P.shadow,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 24,
    backgroundColor: P.card,
    borderWidth: 1,
    borderColor: P.cardBorder,
  },
  aiIconBox: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: P.iconBox,
    borderWidth: 1.5,
    borderColor: P.iconBoxBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiBannerTitle: {
    color: P.text,
    fontSize: 15.5,
    fontWeight: '700',
  },
  aiBannerSubtitle: {
    color: P.textDim,
    fontSize: 12.5,
  },
  chevronCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: P.chip,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.one,
  },
  sectionTitle: {
    fontSize: 25,
    lineHeight: 30,
    color: P.text,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: P.textDim,
    marginTop: 1,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '700',
    color: P.accentText,
  },
  carouselContainer: {
    marginHorizontal: -Spacing.three,
    marginTop: Spacing.one,
    gap: 12,
  },
  spotlightCardWrap: {
    borderRadius: 28,
    shadowColor: P.dark ? '#000' : '#0B2A16',
    shadowOpacity: P.dark ? 0.4 : 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: P.dark ? 10 : 6,
  },
  spotlightCard: {
    height: CARD_HEIGHT,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: 'rgba(12, 32, 20, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    justifyContent: 'space-between',
    padding: 16,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 5,
  },
  propertyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Lime,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  propertyBadgeText: {
    color: '#0E1A12',
    fontSize: 11.5,
    fontWeight: '800',
  },
  cardFavBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBottomInfo: {
    gap: 4,
    zIndex: 5,
  },
  verdictBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 10,
    marginBottom: 4,
  },
  verdictBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  spotlightTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    lineHeight: 30,
  },
  spotlightSci: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 13,
    fontStyle: 'italic',
  },
  spotlightCaption: {
    alignItems: 'center',
    marginTop: 10,
    gap: 2,
    paddingHorizontal: 8,
  },
  captionTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  captionSubtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 13,
    textAlign: 'center',
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: P.dot,
  },
  dotActive: {
    width: 22,
    backgroundColor: P.accentText,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statTile: {
    ...P.shadow,
    flex: 1,
    borderRadius: 22,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: P.card,
    borderWidth: 1,
    borderColor: P.cardBorder,
    gap: 2,
  },
  statValue: {
    color: P.text,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
    marginTop: 4,
  },
  statLabel: {
    color: P.textDim,
    fontSize: 12,
    fontWeight: '600',
  },
  latestCard: {
    height: 206,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: 'rgba(14, 38, 26, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'space-between',
    padding: 14,
  },
  latestTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  latestTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Lime,
    borderRadius: 13,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  latestTagText: {
    color: '#0E1A12',
    fontSize: 11.5,
    fontWeight: '800',
  },
  latestVerdict: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 13,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  latestVerdictText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
  },
  latestTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 32,
  },
  latestSci: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 13,
    fontStyle: 'italic',
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  matchTrack: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  matchFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: Lime,
  },
  matchText: {
    color: Lime,
    fontSize: 12,
    fontWeight: '800',
  },
  listCard: {
    ...P.shadow,
    borderRadius: 24,
    backgroundColor: P.card,
    borderWidth: 1,
    borderColor: P.cardBorder,
    paddingHorizontal: 12,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  listRowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: P.divider,
  },
  listThumb: {
    width: 52,
    height: 52,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: P.chip,
  },
  listTitle: {
    color: P.text,
    fontSize: 15,
    fontWeight: '700',
  },
  listSub: {
    color: P.textDim,
    fontSize: 12,
  },
  listDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  emptyScansCard: {
    ...P.shadow,
    padding: 20,
    borderRadius: 28,
    backgroundColor: P.card,
    borderWidth: 1,
    borderColor: P.cardBorder,
    gap: 18,
    alignItems: 'center',
  },
  emptyHeading: {
    color: P.text,
    fontSize: 24,
    lineHeight: 28,
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  step: {
    alignItems: 'center',
    gap: 8,
    width: 84,
  },
  stepIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: P.stepBg,
    borderWidth: 1,
    borderColor: P.stepBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLabel: {
    color: P.textDim,
    fontSize: 12.5,
    fontWeight: '700',
  },
  emptyScanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    alignSelf: 'stretch',
    backgroundColor: Lime,
    paddingVertical: 14,
    borderRadius: 24,
  },
  emptyScanBtnText: {
    color: '#0E1A12',
    fontSize: 15,
    fontWeight: '800',
  },
  });
