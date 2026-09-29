import { Linking, StyleSheet, View } from 'react-native';

import { Glass } from '@/components/glass';
import { Icon, type IconName } from '@/components/icon';
import { PressableScale } from '@/components/pressable-scale';
import { ThemedText } from '@/components/themed-text';
import { Spacing, VerdictColors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// TODO: replace with your real support address before publishing.
export const SUPPORT_EMAIL = 'gundapunanaji123@example.com';
export const TERMS_UPDATED = '29 September 2026';

type Section = { icon: IconName; title: string; body: string[]; bullets?: string[] };

const SHORT_VERSION: string[] = [
  'Herbii is for education. It is not medical advice.',
  'AI plant identification can be wrong. Never eat or use a plant based on the app alone.',
  'Your scan photos are sent to an AI service to be analysed and are saved to your history.',
  'You can delete any scan, or your whole history, at any time from Profile.',
];

const SECTIONS: Section[] = [
  {
    icon: 'document-text-outline',
    title: 'Using Herbii',
    body: [
      'By creating an account or using Herbii you agree to these Terms & Conditions. If you do not agree, please do not use the app.',
      'You must be old enough to agree to these terms where you live (at least 13, or the age of digital consent in your country if higher).',
    ],
  },
  {
    icon: 'medkit-outline',
    title: 'Not medical advice',
    body: [
      'Everything in Herbii, including plant names, medicinal properties, uses, side effects and safety ratings, is general information for education only. It is not a diagnosis, treatment or professional advice.',
      'Always speak to a qualified doctor or pharmacist before using any herb, especially if you are pregnant, breastfeeding, have a medical condition, or take medicines. Herbs can cause side effects and interact with drugs.',
      'If you think someone has swallowed a poisonous plant, contact your local emergency number or poison control centre straight away.',
    ],
  },
  {
    icon: 'sparkles-outline',
    title: 'AI identification',
    body: [
      'Herbii uses artificial intelligence to analyse the photos you take or choose. Results are estimates and may be wrong, incomplete or out of date. Many plants look alike and some look-alikes are toxic.',
      'Never eat, drink, apply or give a plant to anyone based only on a result from Herbii. Confirm with an expert first.',
    ],
  },
  {
    icon: 'person-circle-outline',
    title: 'Your account',
    body: [
      'You sign in with Google. We receive your name, email address and profile picture from Google to create and identify your account.',
      'You are responsible for activity on your account. Sign out on shared devices.',
    ],
  },
  {
    icon: 'images-outline',
    title: 'Your photos and scan history',
    body: [
      'When you scan a plant, the photo and the result are saved to your history so you can view them later. Only you can see your scans.',
      'You can delete a single scan, or clear your whole history, from the app. Deleting removes the scan and its photo from our storage.',
      'Only upload photos you have the right to use, and do not upload images of people or anything unlawful.',
    ],
  },
  {
    icon: 'shield-checkmark-outline',
    title: 'Privacy and your data',
    body: ['What we collect and why:'],
    bullets: [
      'Google profile details (name, email, picture) to run your account.',
      'Scan photos and results to show your history.',
      'Basic technical data needed to keep the service working.',
      'We do not sell your personal data.',
    ],
  },
  {
    icon: 'server-outline',
    title: 'Services we rely on',
    body: [
      'To provide Herbii we use trusted third-party services: Google (sign-in), Convex (database, file storage and back end) and OpenAI (analysing scan photos). Your data is handled by them under their own terms and privacy policies.',
      'A photo you scan is sent to the AI provider only to produce your result.',
    ],
  },
  {
    icon: 'hand-left-outline',
    title: 'Acceptable use',
    body: ['Please do not:'],
    bullets: [
      'Use Herbii for anything unlawful or to harm others.',
      'Try to break, overload, copy or reverse engineer the app or its back end.',
      'Use automated tools to scrape content or make bulk requests.',
      'Present Herbii results as professional medical or botanical advice.',
    ],
  },
  {
    icon: 'ribbon-outline',
    title: 'Content and credits',
    body: [
      'The Herbii app, its design and its written herb information belong to Herbii and its licensors. You may use them for your own personal use.',
      'Plant photos in the herb library come from Wikimedia Commons and are used under their Creative Commons (CC BY, CC BY-SA) or public domain (CC0) licences. Credit goes to the individual photographers.',
    ],
  },
  {
    icon: 'cloud-outline',
    title: 'Availability and changes',
    body: [
      'Herbii is provided "as is" and "as available". We may change, pause or stop features at any time, and we do not promise the app will always be available or error-free.',
    ],
  },
  {
    icon: 'scale-outline',
    title: 'Limits of liability',
    body: [
      'To the fullest extent the law allows, Herbii and its owners are not responsible for any harm, loss or damage that results from relying on information or identifications in the app, including harm from eating, applying or using any plant.',
      'Nothing in these terms limits any right or liability that cannot be limited by law.',
    ],
  },
  {
    icon: 'refresh-outline',
    title: 'Changes to these terms',
    body: [
      'We may update these terms from time to time. The date at the top shows when they last changed. If you keep using Herbii after an update, you accept the new terms.',
    ],
  },
];

function Bullet({ text }: { text: string }) {
  const theme = useTheme();
  return (
    <View style={styles.bulletRow}>
      <View style={[styles.bulletDot, { backgroundColor: theme.accent }]} />
      <ThemedText style={styles.bulletText}>{text}</ThemedText>
    </View>
  );
}

function SectionCard({ section, index }: { section: Section; index: number }) {
  const theme = useTheme();
  return (
    <Glass radius={26} style={styles.card}>
      <View style={styles.cardHead}>
        <View style={[styles.iconBubble, { backgroundColor: theme.brandSoft }]}>
          <Icon name={section.icon} size={19} color={theme.accent} />
        </View>
        <View style={{ flex: 1 }}>
          <ThemedText style={[styles.index, { color: theme.textSecondary }]}>{String(index + 1).padStart(2, '0')}</ThemedText>
          <ThemedText serif style={styles.cardTitle}>
            {section.title}
          </ThemedText>
        </View>
      </View>
      {section.body.map((p, i) => (
        <ThemedText key={i} style={styles.paragraph}>
          {p}
        </ThemedText>
      ))}
      {section.bullets?.map((b, i) => <Bullet key={i} text={b} />)}
    </Glass>
  );
}

/** The full terms as a list of cards. The parent supplies the scroll view. */
export function TermsContent() {
  const theme = useTheme();
  return (
    <View style={{ gap: Spacing.three }}>
      <ThemedText type="small" themeColor="textSecondary" style={{ paddingHorizontal: Spacing.one }}>
        Last updated {TERMS_UPDATED}
      </ThemedText>

      <Glass radius={28} style={[styles.card, { borderColor: VerdictColors.caution + '88' }]}>
        <View style={styles.cardHead}>
          <View style={[styles.iconBubble, { backgroundColor: VerdictColors.caution + '26' }]}>
            <Icon name="alert-circle" size={20} color={VerdictColors.caution} />
          </View>
          <ThemedText serif style={styles.cardTitle}>
            The short version
          </ThemedText>
        </View>
        {SHORT_VERSION.map((t, i) => (
          <Bullet key={i} text={t} />
        ))}
      </Glass>

      {SECTIONS.map((s, i) => (
        <SectionCard key={s.title} section={s} index={i} />
      ))}

      <Glass radius={26} style={styles.card}>
        <View style={styles.cardHead}>
          <View style={[styles.iconBubble, { backgroundColor: theme.brandSoft }]}>
            <Icon name="mail-outline" size={19} color={theme.accent} />
          </View>
          <ThemedText serif style={styles.cardTitle}>
            Contact us
          </ThemedText>
        </View>
        <ThemedText style={styles.paragraph}>Questions about these terms or your data? Get in touch:</ThemedText>
        <PressableScale onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}`)} style={styles.mail}>
          <ThemedText type="smallBold" style={{ color: theme.accent }}>
            {SUPPORT_EMAIL}
          </ThemedText>
          <Icon name="open-outline" size={15} color={theme.accent} />
        </PressableScale>
      </Glass>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: Spacing.three + 2, gap: Spacing.two + 2 },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two + 4 },
  iconBubble: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  index: { fontSize: 11, lineHeight: 14, fontWeight: '800', letterSpacing: 1 },
  cardTitle: { fontSize: 22, lineHeight: 27 },
  paragraph: { fontSize: 15, lineHeight: 23 },
  bulletRow: { flexDirection: 'row', gap: Spacing.two + 2, alignItems: 'flex-start' },
  bulletDot: { width: 6, height: 6, borderRadius: 3, marginTop: 9 },
  bulletText: { flex: 1, fontSize: 15, lineHeight: 23 },
  mail: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start' },
});
