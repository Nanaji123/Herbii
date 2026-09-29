import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useIsDark, useTheme } from '@/hooks/use-theme';

const BG_DARK = require('../../assets/images/app-background.png');
const BG_LIGHT = require('../../assets/images/app-background-light.png');

/**
 * Screen background. Dark mode: the deep forest cover photo under a dark gradient.
 * Light mode: the bright sunlit-leaves photo under a soft white wash so text stays readable.
 */
export function Screen({
  children,
  style,
  hideCover = false,
}: {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  hideCover?: boolean;
}) {
  const dark = useIsDark();
  const theme = useTheme();

  const overlay = hideCover
    ? dark
      ? (['#0F1C15', '#0B140F', '#08100B'] as const)
      : (['#EAF3E3', '#DCEBD3', '#E4EFDC'] as const)
    : dark
      ? (['rgba(6, 18, 12, 0.42)', 'rgba(5, 16, 10, 0.78)', 'rgba(4, 12, 8, 0.94)'] as const)
      : (['rgba(246, 250, 242, 0.55)', 'rgba(244, 249, 240, 0.78)', 'rgba(240, 246, 235, 0.94)'] as const);

  return (
    <View style={[styles.root, { backgroundColor: theme.background }, style]}>
      {!hideCover && (
        <Image
          source={dark ? BG_DARK : BG_LIGHT}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          priority="high"
        />
      )}
      <LinearGradient
        colors={overlay}
        locations={dark ? [0, 0.42, 0.95] : [0, 0.35, 0.75]}
        start={dark ? { x: 0.2, y: 0 } : { x: 0.5, y: 0 }}
        end={dark ? { x: 0.8, y: 1 } : { x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
