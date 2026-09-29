import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Linking, ScrollView, Share, StyleSheet, View, type ImageSourcePropType } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Glass } from '@/components/glass';
import { GlassButton } from '@/components/glass-button';
import { Icon, type IconName } from '@/components/icon';
import { PressableScale } from '@/components/pressable-scale';
import { Sheet } from '@/components/sheet';
import { ThemedText } from '@/components/themed-text';
import { Lime, MaxContentWidth, Spacing, VerdictColors } from '@/constants/theme';
import { useOpenHerb } from '@/hooks/use-entitlement';
import { useIsDark, useTheme } from '@/hooks/use-theme';
import { type Herb, type Verdict, formatPrice, getRelatedHerbs } from '@/lib/herbs';

export type HerbViewData = {
  title: string;
  scientificName: string;
  family?: string;
  image?: ImageSourcePropType;
  identified: boolean;
  verdict: Verdict;
  verdictReason: string;
  summary: string;
  properties: string[];
  uses: string[];
  sideEffects: string[];
  precautions: string[];
  lookalikes: string[];
  /** 0–1, only for AI scans. */
  confidence?: number;
  tagline?: string;
  /** The matching library entry, which adds origin, preparation, forms and price. */
  herb?: Herb;
};

const HERO_H = 380;

const VERDICT: Record<Verdict, { label: string; icon: IconName }> = {
  safe: { label: 'Generally safe', icon: 'shield-checkmark' },
  caution: { label: 'Use with caution', icon: 'warning' },
  toxic: { label: 'Toxic — avoid', icon: 'skull' },
  unknown: { label: 'Safety unknown', icon: 'help-circle' },
};

function storeLinks(name: string) {
  const q = encodeURIComponent(`${name} herb`);
  return [
    { label: 'Amazon', note: 'Wide range, fast delivery', icon: 'logo-amazon' as IconName, url: `https://www.amazon.com/s?k=${q}` },
    { label: 'iHerb', note: 'Herbs and supplements', icon: 'leaf-outline' as IconName, url: `https://www.iherb.com/search?kw=${q}` },
    { label: 'Walmart', note: 'Everyday groceries', icon: 'cart-outline' as IconName, url: `https://www.walmart.com/search?q=${q}` },
    { label: 'Google Shopping', note: 'Compare many sellers', icon: 'logo-google' as IconName, url: `https://www.google.com/search?tbm=shop&q=${q}` },
  ];
}

function SectionHead({ icon, title, subtitle }: { icon: IconName; title: string; subtitle?: string }) {
  const theme = useTheme();
  return (
    <View style={styles.sectionHead}>
      <View style={[styles.sectionIcon, { backgroundColor: theme.brandSoft }]}>
        <Icon name={icon} size={19} color={theme.accent} />
      </View>
      <View style={{ flex: 1 }}>
        <ThemedText serif style={styles.sectionTitle}>
          {title}
        </ThemedText>
        {subtitle ? (
          <ThemedText type="small" themeColor="textSecondary">
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
    </View>
  );
}

function Pill({ text, icon, tint }: { text: string; icon?: IconName; tint?: string }) {
  const theme = useTheme();
  const color = tint ?? theme.accent;
  return (
    <View style={[styles.pill, { backgroundColor: tint ? tint + '1F' : theme.brandSoft }]}>
      {icon ? <Icon name={icon} size={14} color={color} /> : null}
      <ThemedText type="smallBold" style={{ color: tint ?? theme.text, fontSize: 13.5 }}>
        {text}
      </ThemedText>
    </View>
  );
}

function FactTile({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  const theme = useTheme();
  return (
    <Glass radius={22} style={styles.fact}>
      <View style={[styles.factIcon, { backgroundColor: theme.brandSoft }]}>
        <Icon name={icon} size={17} color={theme.accent} />
      </View>
      <View style={{ flex: 1, gap: 1 }}>
        <ThemedText type="small" themeColor="textSecondary" style={{ fontSize: 11.5 }}>
          {label}
        </ThemedText>
        <ThemedText type="smallBold" numberOfLines={3} style={{ fontSize: 14 }}>
          {value}
        </ThemedText>
      </View>
    </Glass>
  );
}

function ListCard({ icon, title, items, tint }: { icon: IconName; title: string; items: string[]; tint: string }) {
  if (items.length === 0) return null;
  return (
    <Glass radius={26} style={styles.card}>
      <View style={styles.cardHead}>
        <View style={[styles.cardIcon, { backgroundColor: tint + '22' }]}>
          <Icon name={icon} size={18} color={tint} />
        </View>
        <ThemedText style={styles.cardTitle}>{title}</ThemedText>
      </View>
      {items.map((t, i) => (
        <View key={i} style={styles.bulletRow}>
          <View style={[styles.bullet, { backgroundColor: tint }]} />
          <ThemedText style={styles.bulletText}>{t}</ThemedText>
        </View>
      ))}
    </Glass>
  );
}

function RelatedCard({ herb }: { herb: Herb }) {
  const openHerb = useOpenHerb();
  return (
    <PressableScale onPress={() => openHerb(herb.slug)} style={styles.related}>
      <Image source={herb.image} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
      <LinearGradient colors={['transparent', 'rgba(4,14,8,0.88)']} style={styles.relatedShade} />
      <View style={{ padding: 12, gap: 1 }}>
        <ThemedText serif numberOfLines={2} style={styles.relatedName}>
          {herb.commonName.replace(/ \(.*\)/, '')}
        </ThemedText>
        <ThemedText numberOfLines={1} style={styles.relatedSci}>
          {herb.scientificName}
        </ThemedText>
      </View>
    </PressableScale>
  );
}

function BuySheet({ visible, onClose, name, priceText }: { visible: boolean; onClose: () => void; name: string; priceText?: string }) {
  const theme = useTheme();
  return (
    <Sheet visible={visible} onClose={onClose}>
      <View style={{ gap: Spacing.two + 2 }}>
        <View style={{ alignItems: 'center', gap: 4 }}>
          <View style={[styles.buyBadge, { backgroundColor: theme.brandSoft }]}>
            <Icon name="bag-handle-outline" size={28} color={theme.accent} />
          </View>
          <ThemedText serif style={styles.buyTitle}>
            Where to buy
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={{ textAlign: 'center' }} numberOfLines={2}>
            {name}
            {priceText ? ` · about ${priceText}` : ''}
          </ThemedText>
        </View>

        {storeLinks(name).map((s) => (
          <PressableScale
            key={s.label}
            onPress={() => Linking.openURL(s.url)}
            accessibilityRole="link"
            style={[styles.store, { backgroundColor: theme.backgroundSelected }]}>
            <View style={[styles.storeIcon, { backgroundColor: theme.brandSoft }]}>
              <Icon name={s.icon} size={20} color={theme.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={{ fontWeight: '800', fontSize: 15.5 }}>{s.label}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={{ fontSize: 12.5 }}>
                {s.note}
              </ThemedText>
            </View>
            <Icon name="open-outline" size={18} color={theme.textSecondary} />
          </PressableScale>
        ))}

        <ThemedText type="small" themeColor="textSecondary" style={styles.note}>
          Opens each store&apos;s search results. Prices are rough estimates and vary by seller, quality and country.
        </ThemedText>
      </View>
    </Sheet>
  );
}

export function HerbView({ data, onDelete }: { data: HerbViewData; onDelete?: () => void }) {
  const theme = useTheme();
  const dark = useIsDark();
  const insets = useSafeAreaInsets();
  const [buyOpen, setBuyOpen] = useState(false);
  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });

  const heroStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(scrollY.value, [-240, 0, HERO_H], [-120, 0, HERO_H * 0.35], Extrapolation.CLAMP) },
      { scale: interpolate(scrollY.value, [-240, 0], [1.6, 1], Extrapolation.CLAMP) },
    ],
  }));
  const titleBar = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [HERO_H - 170, HERO_H - 110], [0, 1], Extrapolation.CLAMP),
  }));

  const herb = data.herb;
  const surface = dark ? '#0B1A11' : '#F1F6EC';
  const verdict = VERDICT[data.verdict];
  const vColor = VerdictColors[data.verdict];
  const related = herb ? getRelatedHerbs(herb) : [];
  const priceText = herb ? formatPrice(herb.price) : undefined;
  const searchName = herb ? herb.commonName.replace(/ \(.*\)/, '') : data.title;

  const facts: { icon: IconName; label: string; value: string }[] = [];
  if (data.family) facts.push({ icon: 'git-network-outline', label: 'Family', value: data.family });
  if (herb?.nativeTo) facts.push({ icon: 'earth-outline', label: 'Native to', value: herb.nativeTo });
  if (herb?.partsUsed.length) facts.push({ icon: 'leaf-outline', label: 'Parts used', value: herb.partsUsed.join(', ') });
  if (data.confidence != null) facts.push({ icon: 'analytics-outline', label: 'AI match', value: `${Math.round(data.confidence * 100)}%` });

  function share() {
    Share.share({
      message: `${data.title} (${data.scientificName})\n${data.summary}\n\nShared from Herbii`,
    });
  }

  return (
    <View style={[styles.root, { backgroundColor: surface }]}>
      {/* Parallax hero */}
      <Animated.View style={[styles.hero, heroStyle]} pointerEvents="none">
        {data.image ? (
          <Image source={data.image} style={StyleSheet.absoluteFill} contentFit="cover" transition={250} />
        ) : (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.backgroundSelected }]} />
        )}
        <LinearGradient colors={['rgba(0,0,0,0.45)', 'transparent', 'rgba(0,0,0,0.25)']} locations={[0, 0.4, 1]} style={StyleSheet.absoluteFill} />
      </Animated.View>

      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: HERO_H - 40 }}>
        <View style={[styles.sheet, { backgroundColor: surface }]}>
          <View style={styles.inner}>
            {/* Title */}
            <View style={{ gap: 6 }}>
              <View style={styles.badgeRow}>
                {data.identified && (
                  <View style={[styles.verdictBadge, { backgroundColor: vColor + '22' }]}>
                    <Icon name={verdict.icon} size={14} color={vColor} />
                    <ThemedText style={{ color: vColor, fontSize: 12.5, lineHeight: 16, fontWeight: '800' }}>{verdict.label}</ThemedText>
                  </View>
                )}
                {data.tagline ? (
                  <ThemedText type="small" themeColor="textSecondary" numberOfLines={1} style={{ flex: 1, fontStyle: 'italic' }}>
                    {data.tagline}
                  </ThemedText>
                ) : null}
              </View>
              <ThemedText serif style={styles.title}>
                {data.title}
              </ThemedText>
              {data.identified && (
                <ThemedText themeColor="textSecondary" style={{ fontStyle: 'italic', fontSize: 16 }}>
                  {data.scientificName}
                </ThemedText>
              )}
            </View>

            {!data.identified ? (
              <Glass radius={26} style={styles.card}>
                <View style={styles.cardHead}>
                  <View style={[styles.cardIcon, { backgroundColor: VerdictColors.unknown + '22' }]}>
                    <Icon name="camera-outline" size={18} color={VerdictColors.unknown} />
                  </View>
                  <ThemedText style={styles.cardTitle}>Couldn&apos;t identify a plant</ThemedText>
                </View>
                <ThemedText style={styles.paragraph}>
                  {data.summary || 'Try a closer, well-lit photo of the leaves or flowers.'}
                </ThemedText>
                {['Fill the frame with a single leaf, flower or the whole plant.', 'Use natural light and keep the photo sharp.', 'Try a different angle or include the flower.'].map((t) => (
                  <View key={t} style={styles.bulletRow}>
                    <View style={[styles.bullet, { backgroundColor: theme.accent }]} />
                    <ThemedText style={styles.bulletText}>{t}</ThemedText>
                  </View>
                ))}
              </Glass>
            ) : (
              <>
                {/* Other names */}
                {herb && herb.otherNames.length > 0 && (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.nameRow} style={styles.bleed}>
                    <ThemedText type="small" themeColor="textSecondary" style={{ alignSelf: 'center' }}>
                      Also known as
                    </ThemedText>
                    {herb.otherNames.map((n) => (
                      <Pill key={n} text={n} />
                    ))}
                  </ScrollView>
                )}

                {/* Quick facts */}
                {facts.length > 0 && (
                  <View style={styles.facts}>
                    {facts.map((f, i) => (
                      <View key={f.label} style={[styles.factCell, facts.length % 2 === 1 && i === facts.length - 1 && { width: '100%' }]}>
                        <FactTile {...f} />
                      </View>
                    ))}
                  </View>
                )}

                {/* About */}
                <View style={{ gap: Spacing.two + 2 }}>
                  <SectionHead icon="information-circle-outline" title="About" />
                  <ThemedText style={styles.paragraph}>{data.summary}</ThemedText>
                </View>

                {/* Safety */}
                <Glass radius={28} style={[styles.card, { borderColor: vColor + '88' }]}>
                  <View style={styles.cardHead}>
                    <View style={[styles.cardIcon, { backgroundColor: vColor + '22' }]}>
                      <Icon name={verdict.icon} size={19} color={vColor} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <ThemedText type="small" themeColor="textSecondary" style={{ fontSize: 11.5 }}>
                        SAFETY
                      </ThemedText>
                      <ThemedText style={[styles.cardTitle, { color: vColor }]}>{verdict.label}</ThemedText>
                    </View>
                  </View>
                  <ThemedText style={styles.paragraph}>{data.verdictReason}</ThemedText>
                </Glass>

                {/* Benefits */}
                {data.properties.length > 0 && (
                  <View style={{ gap: Spacing.two + 4 }}>
                    <SectionHead icon="medkit-outline" title="Medicinal properties" subtitle="What it is traditionally valued for" />
                    <View style={styles.pills}>
                      {data.properties.map((p) => (
                        <Pill key={p} text={p} icon="checkmark-circle" />
                      ))}
                    </View>
                  </View>
                )}

                {/* Uses */}
                {data.uses.length > 0 && (
                  <View style={{ gap: Spacing.two + 4 }}>
                    <SectionHead icon="book-outline" title="Traditional uses" />
                    {data.uses.map((u, i) => (
                      <Glass key={u} radius={22} style={styles.useRow}>
                        <View style={[styles.useNum, { backgroundColor: theme.brandSoft }]}>
                          <ThemedText style={{ color: theme.accent, fontWeight: '800' }}>{i + 1}</ThemedText>
                        </View>
                        <ThemedText style={[styles.bulletText, { flex: 1 }]}>{u}</ThemedText>
                      </Glass>
                    ))}
                  </View>
                )}

                {/* How to use */}
                {herb && herb.howToUse.length > 0 && (
                  <View style={{ gap: Spacing.two + 4 }}>
                    <SectionHead icon="cafe-outline" title="How to use" subtitle="Common, gentle ways to prepare it" />
                    {herb.howToUse.map((s, i) => (
                      <View key={s} style={styles.step}>
                        <View style={styles.stepRail}>
                          <View style={[styles.stepDot, { backgroundColor: theme.primary }]}>
                            <ThemedText style={{ color: theme.onPrimary, fontSize: 12, fontWeight: '800', lineHeight: 16 }}>{i + 1}</ThemedText>
                          </View>
                          {i < herb.howToUse.length - 1 && <View style={[styles.stepLine, { backgroundColor: theme.border }]} />}
                        </View>
                        <ThemedText style={[styles.bulletText, { flex: 1, paddingBottom: Spacing.three }]}>{s}</ThemedText>
                      </View>
                    ))}
                  </View>
                )}

                {/* Cautions */}
                <View style={{ gap: Spacing.three }}>
                  <SectionHead icon="alert-circle-outline" title="Before you use it" />
                  <ListCard icon="sad-outline" title="Possible side effects" items={data.sideEffects} tint={VerdictColors.caution} />
                  <ListCard icon="shield-outline" title="Precautions" items={data.precautions} tint="#3B82F6" />
                  <ListCard icon="eye-outline" title="Look-alikes to watch for" items={data.lookalikes} tint={VerdictColors.toxic} />
                </View>

                {/* Buying guide */}
                <View style={{ gap: Spacing.two + 4 }}>
                  <SectionHead icon="bag-handle-outline" title="Buying guide" subtitle="If you want to get some" />

                  <LinearGradient
                    colors={dark ? ['#1E4A31', '#12281C'] : ['#2F7D4F', '#123C26']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.priceCard}>
                    {herb ? (
                      <>
                        <ThemedText style={styles.priceLabel}>APPROX. PRICE</ThemedText>
                        <View style={styles.priceRow}>
                          <ThemedText serif style={styles.priceValue}>
                            {priceText}
                          </ThemedText>
                          <ThemedText style={styles.priceUnit}>/ {herb.price.unit}</ThemedText>
                        </View>
                        <ThemedText style={styles.priceNote}>Rough estimate in US dollars. Real prices vary by seller and quality.</ThemedText>
                      </>
                    ) : (
                      <>
                        <ThemedText style={styles.priceLabel}>WANT TO BUY IT?</ThemedText>
                        <ThemedText serif style={styles.priceValue}>
                          Find it online
                        </ThemedText>
                        <ThemedText style={styles.priceNote}>Compare sellers on popular stores. Check the label and quality first.</ThemedText>
                      </>
                    )}
                    <PressableScale onPress={() => setBuyOpen(true)} style={styles.priceBtn}>
                      <Icon name="bag-handle" size={18} color="#0E1A12" />
                      <ThemedText style={styles.priceBtnText}>Where to buy</ThemedText>
                    </PressableScale>
                  </LinearGradient>

                  {herb && herb.forms.length > 0 && (
                    <View style={{ gap: Spacing.two }}>
                      <ThemedText type="smallBold" themeColor="textSecondary" style={styles.miniLabel}>
                        AVAILABLE AS
                      </ThemedText>
                      <View style={styles.pills}>
                        {herb.forms.map((f) => (
                          <Pill key={f} text={f} />
                        ))}
                      </View>
                    </View>
                  )}

                  <ListCard
                    icon="checkmark-done-outline"
                    title="What to look for"
                    tint={theme.accent}
                    items={[
                      `Check the label for the botanical name (${data.scientificName}) so you get the right plant.`,
                      'Choose organic or lab-tested products when you can.',
                      'Buy small amounts of dried herbs and store them airtight, away from light and heat.',
                      'Avoid products with added sugar, fillers or blends that hide the amount.',
                      ...(data.verdict !== 'safe' ? ['Ask a doctor or pharmacist before buying medicinal-strength products.'] : []),
                    ]}
                  />
                </View>

                {/* Related */}
                {related.length > 0 && (
                  <View style={{ gap: Spacing.two + 4 }}>
                    <SectionHead icon="sparkles-outline" title="You may also like" />
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.relatedRow} style={styles.bleed}>
                      {related.map((r) => (
                        <RelatedCard key={r.slug} herb={r} />
                      ))}
                    </ScrollView>
                  </View>
                )}
              </>
            )}

            <ThemedText type="small" themeColor="textSecondary" style={styles.disclaimer}>
              For education only, not medical advice. AI results can be wrong. Never eat or use a plant based on this alone.
              Talk to a qualified professional first.
            </ThemedText>
          </View>
        </View>
      </Animated.ScrollView>

      {/* Compact title bar that fades in once you scroll past the hero */}
      <Animated.View style={[styles.titleBar, { paddingTop: insets.top + 6, backgroundColor: surface }, titleBar]} pointerEvents="none">
        <ThemedText serif numberOfLines={1} style={styles.titleBarText}>
          {data.title}
        </ThemedText>
      </Animated.View>

      {/* Floating actions */}
      <View style={[styles.topBar, { top: insets.top + Spacing.two }]}>
        <GlassButton overlay icon="arrow-back" label="Back" onPress={() => router.back()} />
        <View style={{ flexDirection: 'row', gap: Spacing.two }}>
          <GlassButton overlay icon="share-outline" label="Share" onPress={share} />
          {onDelete && <GlassButton overlay icon="trash-outline" label="Delete scan" onPress={onDelete} color="#FF8A8A" />}
        </View>
      </View>

      {/* Sticky buy bar */}
      {data.identified && (
        <View style={[styles.buyBarWrap, { paddingBottom: Math.max(insets.bottom, Spacing.three) }]} pointerEvents="box-none">
          <View style={[styles.buyBar, { backgroundColor: dark ? '#14301F' : '#FFFFFF', borderColor: theme.border }]}>
            <View style={{ flex: 1 }}>
              <ThemedText type="small" themeColor="textSecondary" style={{ fontSize: 11.5 }}>
                {herb ? `Approx. per ${herb.price.unit}` : 'Buy online'}
              </ThemedText>
              <ThemedText serif style={{ fontSize: 22, lineHeight: 27 }}>
                {priceText ?? 'Compare stores'}
              </ThemedText>
            </View>
            <PressableScale onPress={() => setBuyOpen(true)} style={[styles.buyBtn, { backgroundColor: Lime }]}>
              <Icon name="bag-handle" size={18} color="#0E1A12" />
              <ThemedText style={{ color: '#0E1A12', fontWeight: '800', fontSize: 15 }}>Where to buy</ThemedText>
            </PressableScale>
          </View>
        </View>
      )}

      <BuySheet visible={buyOpen} onClose={() => setBuyOpen(false)} name={searchName} priceText={priceText} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  hero: { position: 'absolute', top: 0, left: 0, right: 0, height: HERO_H + 60 },
  sheet: { borderTopLeftRadius: 38, borderTopRightRadius: 38, minHeight: 700, paddingBottom: 140 },
  inner: { padding: Spacing.three + 2, paddingTop: Spacing.four, gap: Spacing.four - 4, width: '100%', maxWidth: MaxContentWidth, alignSelf: 'center' },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  verdictBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 14, paddingHorizontal: 11, paddingVertical: 6 },
  title: { fontSize: 36, lineHeight: 42, letterSpacing: -0.5 },
  bleed: { marginHorizontal: -(Spacing.three + 2) },
  nameRow: { paddingHorizontal: Spacing.three + 2, gap: Spacing.two, alignItems: 'center' },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 7 },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  facts: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two + 2 },
  factCell: { width: '48.2%' },
  fact: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: Spacing.two + 4 },
  factIcon: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two + 4 },
  sectionIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { fontSize: 25, lineHeight: 30 },
  paragraph: { fontSize: 16, lineHeight: 25 },
  card: { padding: Spacing.three + 2, gap: Spacing.two + 4 },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two + 4 },
  cardIcon: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 17, fontWeight: '800' },
  bulletRow: { flexDirection: 'row', gap: Spacing.two + 2, alignItems: 'flex-start' },
  bullet: { width: 6, height: 6, borderRadius: 3, marginTop: 10 },
  bulletText: { flex: 1, fontSize: 15.5, lineHeight: 23 },
  useRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, padding: Spacing.two + 4 },
  useNum: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  step: { flexDirection: 'row', gap: Spacing.three },
  stepRail: { alignItems: 'center', width: 26 },
  stepDot: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  stepLine: { flex: 1, width: 2, marginTop: 4, marginBottom: -2, borderRadius: 1 },
  miniLabel: { letterSpacing: 1.1, fontSize: 11.5 },
  priceCard: { borderRadius: 30, padding: Spacing.four - 4, gap: 6, overflow: 'hidden' },
  priceLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11.5, fontWeight: '800', letterSpacing: 1.3 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' },
  priceValue: { color: '#fff', fontSize: 38, lineHeight: 44 },
  priceUnit: { color: 'rgba(255,255,255,0.8)', fontSize: 15, fontWeight: '600' },
  priceNote: { color: 'rgba(255,255,255,0.7)', fontSize: 12.5, lineHeight: 18 },
  priceBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Lime, height: 50, borderRadius: 25, marginTop: Spacing.two + 2 },
  priceBtnText: { color: '#0E1A12', fontSize: 15.5, fontWeight: '800' },
  related: { width: 150, height: 190, borderRadius: 26, overflow: 'hidden', justifyContent: 'flex-end' },
  relatedShade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 110 },
  relatedName: { color: '#fff', fontSize: 18, lineHeight: 22 },
  relatedSci: { color: 'rgba(255,255,255,0.75)', fontSize: 11.5, fontStyle: 'italic' },
  relatedRow: { paddingHorizontal: Spacing.three + 2, gap: Spacing.three },
  disclaimer: { textAlign: 'center', paddingHorizontal: Spacing.two, marginTop: Spacing.two },
  titleBar: { position: 'absolute', top: 0, left: 0, right: 0, paddingBottom: 12, alignItems: 'center', justifyContent: 'flex-end' },
  titleBarText: { fontSize: 20, lineHeight: 26, maxWidth: '62%' },
  topBar: { position: 'absolute', left: Spacing.three, right: Spacing.three, flexDirection: 'row', justifyContent: 'space-between' },
  buyBarWrap: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: Spacing.three, alignItems: 'center' },
  buyBar: {
    width: '100%',
    maxWidth: MaxContentWidth,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.two + 4,
    paddingLeft: Spacing.four - 4,
    borderRadius: 34,
    borderWidth: StyleSheet.hairlineWidth * 2,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 16,
  },
  buyBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 52, paddingHorizontal: Spacing.four - 4, borderRadius: 26 },
  buyBadge: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.one },
  buyTitle: { fontSize: 28, lineHeight: 34 },
  store: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, padding: Spacing.two + 4, borderRadius: 24 },
  storeIcon: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  note: { textAlign: 'center', fontSize: 12, lineHeight: 17 },
});
