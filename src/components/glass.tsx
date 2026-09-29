import { BlurView } from 'expo-blur';
import type { ReactNode } from 'react';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { CardShadow } from '@/constants/theme';
import { useIsDark, useTheme } from '@/hooks/use-theme';

type Props = {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  radius?: number;
  /** Always-dark frosted surface for overlays on photos and the camera. */
  translucent?: boolean;
  flat?: boolean;
  intensity?: number;
};

/**
 * The app's card surface: frosted dark glass in dark mode, frosted white glass in light mode.
 * `translucent` is for things floating over photos/camera, so it stays dark in both modes.
 */
export function Glass({ children, style, radius = 24, translucent, flat, intensity = 30 }: Props) {
  const theme = useTheme();
  const dark = useIsDark();
  const overlayDark = translucent || dark;

  return (
    <View
      style={[
        {
          borderRadius: radius,
          overflow: 'hidden',
          backgroundColor: translucent ? 'rgba(20, 32, 25, 0.45)' : theme.backgroundElement,
          borderWidth: 1,
          borderColor: translucent ? 'rgba(255, 255, 255, 0.28)' : theme.border,
        },
        !flat && !overlayDark && CardShadow,
        style,
      ]}>
      {Platform.OS === 'ios' && (
        <BlurView
          intensity={intensity}
          tint={overlayDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
      )}
      {children}
    </View>
  );
}
