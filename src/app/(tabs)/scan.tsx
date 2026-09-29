import { ConvexError } from 'convex/values';
import { useAction } from 'convex/react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useIsFocused } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Glass } from '@/components/glass';
import { GlassButton } from '@/components/glass-button';
import { Icon, type IconName } from '@/components/icon';
import { PressableScale } from '@/components/pressable-scale';
import { useDialog } from '@/components/dialog';
import { Screen } from '@/components/screen';
import { Sheet } from '@/components/sheet';
import { ThemedText } from '@/components/themed-text';
import { Brand, BrandDeep, Spacing } from '@/constants/theme';
import { useEntitlement } from '@/hooks/use-entitlement';
import { useTheme } from '@/hooks/use-theme';
import { api } from '../../../convex/_generated/api';

const SUPPORTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const FRAME_W = 290;
const FRAME_H = 350;
const STATUS = ['Studying leaf shape…', 'Matching species…', 'Checking medicinal uses…', 'Reviewing safety…'];

function ScanLine() {
  const y = useSharedValue(0);
  useEffect(() => {
    y.value = withRepeat(withTiming(FRAME_H - 60, { duration: 1900, easing: Easing.inOut(Easing.quad) }), -1, true);
  }, [y]);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  return (
    <Animated.View style={[styles.scanBand, style]}>
      <LinearGradient colors={['rgba(58,167,109,0)', 'rgba(58,167,109,0.45)']} style={{ flex: 1 }} />
      <View style={styles.scanLine} />
    </Animated.View>
  );
}

function Viewfinder({ scanning }: { scanning: boolean }) {
  return (
    <View style={styles.frame} pointerEvents="none">
      <View style={[styles.corner, styles.tl]} />
      <View style={[styles.corner, styles.tr]} />
      <View style={[styles.corner, styles.bl]} />
      <View style={[styles.corner, styles.br]} />
      {scanning && <ScanLine />}
    </View>
  );
}

function Analyzing({ uri }: { uri: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % STATUS.length), 1600);
    return () => clearInterval(t);
  }, []);
  return (
    <View style={StyleSheet.absoluteFill}>
      <Image source={{ uri }} style={StyleSheet.absoluteFill} contentFit="cover" />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(5,20,12,0.6)' }]} />
      <View style={styles.centerCol}>
        <Viewfinder scanning />
        <Glass radius={26} translucent style={styles.analyzeCard}>
          <ThemedText style={{ color: '#fff', fontWeight: '800', fontSize: 18 }}>Analysing plant</ThemedText>
          <ThemedText style={{ color: 'rgba(255,255,255,0.8)' }}>{STATUS[i]}</ThemedText>
        </Glass>
      </View>
    </View>
  );
}

function PermissionSheet({
  visible,
  canAskAgain,
  onAllow,
  onGallery,
  onLater,
}: {
  visible: boolean;
  canAskAgain: boolean;
  onAllow: () => void;
  onGallery: () => void;
  onLater: () => void;
}) {
  const theme = useTheme();
  const points: [IconName, string][] = [
    ['leaf-outline', 'Identify plants instantly from a photo'],
    ['lock-closed-outline', 'Photos are only used for identification and your history'],
    ['toggle-outline', 'You can turn access off any time in Settings'],
  ];
  return (
    <Sheet visible={visible} dismissable={false}>
      <View style={styles.permBody}>
        <LinearGradient colors={[Brand, BrandDeep]} style={styles.permIcon}>
          <Icon name="camera" size={34} color="#fff" />
        </LinearGradient>
        <ThemedText serif style={styles.permTitle}>
          Allow camera access
        </ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.permSub}>
          Herbii needs your camera to scan plants.
        </ThemedText>

        <View style={styles.permList}>
          {points.map(([icon, text]) => (
            <View key={text} style={styles.permRow}>
              <View style={[styles.permBullet, { backgroundColor: theme.brandSoft }]}>
                <Icon name={icon} size={18} color={theme.accent} />
              </View>
              <ThemedText type="small" style={{ flex: 1 }}>
                {text}
              </ThemedText>
            </View>
          ))}
        </View>

        <View style={styles.permButtons}>
          <PressableScale onPress={onAllow} style={[styles.permBtn, { backgroundColor: theme.primary }]}>
            <ThemedText style={[styles.permBtnText, { color: theme.onPrimary }]}>
              {canAskAgain ? 'Allow camera' : 'Open Settings'}
            </ThemedText>
          </PressableScale>
          <PressableScale onPress={onGallery} style={[styles.permBtn, { backgroundColor: theme.backgroundSelected }]}>
            <ThemedText style={[styles.permBtnText, { color: theme.text }]}>Choose from gallery instead</ThemedText>
          </PressableScale>
          <PressableScale onPress={onLater} style={styles.permLater}>
            <ThemedText type="smallBold" themeColor="textSecondary">
              Not now
            </ThemedText>
          </PressableScale>
        </View>
      </View>
    </Sheet>
  );
}

export default function ScanScreen() {
  const insets = useSafeAreaInsets();
  const focused = useIsFocused();
  const identify = useAction(api.identify.identify);
  const dialog = useDialog();
  const { isPro, loading: planLoading, scansLeft } = useEntitlement();
  const [permission, requestPermission] = useCameraPermissions();
  const camera = useRef<CameraView>(null);
  const [ready, setReady] = useState(false);
  const [torch, setTorch] = useState(false);
  const [captured, setCaptured] = useState<string | null>(null);

  /** True (and opens the plans) when a free user has used all their scans. */
  function outOfScans() {
    if (planLoading || isPro || scansLeft > 0) return false;
    router.push('/paywall');
    return true;
  }

  async function analyse(uri: string, base64: string, mime?: string | null) {
    if (outOfScans()) return;
    setCaptured(uri);
    try {
      const mimeType = mime && SUPPORTED_TYPES.includes(mime) ? mime : 'image/jpeg';
      const id = await identify({ imageBase64: base64, mimeType });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.push({ pathname: '/scan/[id]', params: { id } });
      // Free users see the plans after every scan; closing them lands on the result.
      if (!isPro) setTimeout(() => router.push('/paywall'), 350);
      setTimeout(() => setCaptured(null), 400);
    } catch (e) {
      setCaptured(null);
      if (e instanceof ConvexError && e.data?.code === 'FREE_LIMIT') {
        router.push('/paywall');
        return;
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      dialog.alert({
        title: 'Could not identify',
        message: e instanceof Error ? e.message : 'Please try again.',
        tone: 'warning',
        confirmLabel: 'Got it',
      });
    }
  }

  async function shoot() {
    if (!camera.current || captured || outOfScans()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const photo = await camera.current.takePictureAsync({ quality: 0.5, base64: true, shutterSound: false });
    if (photo?.base64) await analyse(photo.uri, photo.base64, 'image/jpeg');
  }

  async function pickFromGallery() {
    if (outOfScans()) return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.5, base64: true });
    const asset = result.assets?.[0];
    if (!result.canceled && asset?.base64) await analyse(asset.uri, asset.base64, asset.mimeType);
  }

  function allow() {
    if (permission?.canAskAgain === false) Linking.openSettings();
    else requestPermission();
  }

  if (!permission) return <View style={styles.black} />;
  if (!permission.granted) {
    return (
      <View style={{ flex: 1 }}>
        <Screen>
          <View style={[styles.centerCol, { opacity: 0.55 }]} pointerEvents="none">
            <Viewfinder scanning={false} />
          </View>
        </Screen>
        <View style={[styles.topLeft, { top: insets.top + Spacing.two }]}>
          <GlassButton icon="close" label="Close" onPress={() => router.navigate('/')} />
        </View>
        {/* Only shown while this tab is on screen, so it never covers other tabs */}
        <PermissionSheet
          visible={focused}
          canAskAgain={permission.canAskAgain}
          onAllow={allow}
          onGallery={pickFromGallery}
          onLater={() => router.navigate('/')}
        />
      </View>
    );
  }

  return (
    <View style={styles.black}>
      {focused && (
        <CameraView
          ref={camera}
          style={StyleSheet.absoluteFill}
          facing="back"
          enableTorch={torch}
          onCameraReady={() => setReady(true)}
        />
      )}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(5,20,12,0.18)' }]} pointerEvents="none" />

      <View style={styles.centerCol} pointerEvents="none">
        <Viewfinder scanning={ready} />
        <Glass radius={22} translucent style={styles.hint}>
          <Icon name="leaf-outline" size={16} color="#fff" />
          <ThemedText type="small" style={{ color: '#fff' }}>
            Fit the leaf or flower inside the frame
          </ThemedText>
        </Glass>
      </View>

      <View style={[styles.topBar, { top: insets.top + Spacing.two }]}>
        <GlassButton overlay icon="close" label="Close scanner" onPress={() => router.navigate('/')} />
        <ThemedText style={styles.topTitle}>Scan your plant</ThemedText>
        <GlassButton
          overlay
          icon={torch ? 'flash' : 'flash-outline'}
          label="Toggle flashlight"
          active={torch}
          onPress={() => setTorch((t) => !t)}
        />
      </View>

      <View style={[styles.controls, { bottom: Math.max(insets.bottom, Spacing.three) + Spacing.three }]}>
        <GlassButton overlay icon="images-outline" label="Choose from gallery" size={56} onPress={pickFromGallery} />
        <PressableScale onPress={shoot} haptic={false} style={styles.shutterOuter} accessibilityLabel="Take photo">
          <View style={styles.shutterInner} />
        </PressableScale>
        <View style={{ width: 56 }} />
      </View>

      {captured && <Analyzing uri={captured} />}
    </View>
  );
}

const CORNER = 44;
const styles = StyleSheet.create({
  black: { flex: 1, backgroundColor: '#000' },
  centerCol: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', gap: Spacing.four },
  frame: { width: FRAME_W, height: FRAME_H },
  corner: { position: 'absolute', width: CORNER, height: CORNER, borderColor: '#fff', borderWidth: 4 },
  tl: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 26 },
  tr: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 26 },
  bl: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 26 },
  br: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 26 },
  scanBand: { position: 'absolute', top: 0, left: 6, right: 6, height: 60 },
  scanLine: { height: 3, borderRadius: 2, backgroundColor: '#5BE38F', shadowColor: '#5BE38F', shadowOpacity: 1, shadowRadius: 10, elevation: 6 },
  hint: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, paddingHorizontal: Spacing.three, paddingVertical: Spacing.two + 2 },
  analyzeCard: { alignItems: 'center', gap: 2, paddingHorizontal: Spacing.four, paddingVertical: Spacing.three },
  topBar: { position: 'absolute', left: Spacing.three, right: Spacing.three, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  topLeft: { position: 'absolute', left: Spacing.three },
  topTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  controls: { position: 'absolute', left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' },
  shutterOuter: { width: 84, height: 84, borderRadius: 42, borderWidth: 5, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  shutterInner: { width: 62, height: 62, borderRadius: 31, backgroundColor: '#fff' },
  permBody: { alignItems: 'center', gap: Spacing.two + 2 },
  permIcon: { width: 72, height: 72, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginTop: Spacing.one },
  permTitle: { fontSize: 28, lineHeight: 34, textAlign: 'center' },
  permSub: { textAlign: 'center' },
  permList: { alignSelf: 'stretch', gap: Spacing.two + 4, marginVertical: Spacing.two },
  permRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  permBullet: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  permButtons: { alignSelf: 'stretch', gap: Spacing.two + 2 },
  permBtn: { height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center' },
  permBtnText: { fontSize: 16, fontWeight: '800' },
  permLater: { alignSelf: 'center', padding: Spacing.two },
});
