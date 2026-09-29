import { useEffect, useState, type ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { Spacing } from '@/constants/theme';
import { useIsDark, useTheme } from '@/hooks/use-theme';

type Props = {
  visible: boolean;
  onClose?: () => void;
  /** When false, tapping the backdrop or pressing back does nothing (the sheet needs an answer). */
  dismissable?: boolean;
  children: ReactNode;
};

/**
 * Bottom sheet: a dimmed backdrop and a rounded panel that slides up from the bottom edge.
 * Used for every pop-up in the app instead of the system alert.
 */
export function Sheet({ visible, onClose, dismissable = true, children }: Props) {
  const theme = useTheme();
  const dark = useIsDark();
  const insets = useSafeAreaInsets();
  const [mounted, setMounted] = useState(visible);
  const progress = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMounted(true);
      progress.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) });
    } else if (mounted) {
      progress.value = withTiming(0, { duration: 220, easing: Easing.in(Easing.cubic) }, (finished) => {
        if (finished) scheduleOnRN(setMounted, false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const backdrop = useAnimatedStyle(() => ({ opacity: progress.value }));
  const panel = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(progress.value, [0, 1], [520, 0]) }],
  }));

  if (!mounted) return null;

  return (
    <Modal
      transparent
      visible
      animationType="none"
      statusBarTranslucent
      onRequestClose={dismissable ? onClose : undefined}>
      <View style={StyleSheet.absoluteFill}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, backdrop]}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={dismissable ? onClose : undefined}
            accessibilityLabel="Close"
            accessibilityRole="button"
          />
        </Animated.View>

        <View style={styles.bottom} pointerEvents="box-none">
          <Animated.View
            style={[
              styles.panel,
              {
                backgroundColor: dark ? '#11271B' : '#FFFFFF',
                borderColor: theme.border,
                paddingBottom: Math.max(insets.bottom, Spacing.three) + Spacing.two,
              },
              panel,
            ]}>
            <View style={[styles.grabber, { backgroundColor: theme.backgroundSelected }]} />
            {children}
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { backgroundColor: 'rgba(3, 10, 6, 0.62)' },
  bottom: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
  panel: {
    width: '100%',
    maxWidth: 560,
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderBottomWidth: 0,
    paddingHorizontal: Spacing.four - 4,
    paddingTop: Spacing.two + 2,
    gap: Spacing.three,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: -8 },
    elevation: 24,
  },
  grabber: { alignSelf: 'center', width: 42, height: 5, borderRadius: 3, marginBottom: Spacing.one },
});
