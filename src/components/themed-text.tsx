import { Platform, StyleSheet, Text, type TextProps, type TextStyle } from 'react-native';

import { FontFamily, Fonts, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'small' | 'smallBold' | 'subtitle' | 'link' | 'linkPrimary' | 'code';
  themeColor?: ThemeColor;
  /** Editorial serif face for big headlines. */
  serif?: boolean;
};

function familyFor(weight: TextStyle['fontWeight']) {
  const w = Number(weight === 'bold' ? 700 : weight === 'normal' || weight == null ? 400 : weight);
  if (w >= 800) return FontFamily[800];
  if (w >= 700) return FontFamily[700];
  if (w >= 600) return FontFamily[600];
  if (w >= 500) return FontFamily[500];
  return FontFamily[400];
}

export function ThemedText({ style, type = 'default', themeColor, serif, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  const merged = StyleSheet.flatten([
    { color: theme[themeColor ?? 'text'] },
    type === 'default' && styles.default,
    type === 'title' && styles.title,
    type === 'small' && styles.small,
    type === 'smallBold' && styles.smallBold,
    type === 'subtitle' && styles.subtitle,
    type === 'link' && styles.link,
    type === 'linkPrimary' && styles.linkPrimary,
    type === 'code' && styles.code,
    style,
  ]) as TextStyle;

  if (type !== 'code') {
    // Custom fonts ship one file per weight, so pick the family and drop fontWeight
    // (leaving it would make Android synthesize a second bold on top).
    merged.fontFamily = serif ? FontFamily.serif : familyFor(merged.fontWeight);
    delete merged.fontWeight;
  }

  return <Text style={merged} {...rest} />;
}

const styles = StyleSheet.create({
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 500,
  },
  smallBold: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 700,
  },
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 500,
  },
  title: {
    fontSize: 48,
    fontWeight: 600,
    lineHeight: 52,
  },
  subtitle: {
    fontSize: 32,
    lineHeight: 44,
    fontWeight: 600,
  },
  link: {
    lineHeight: 30,
    fontSize: 14,
  },
  linkPrimary: {
    lineHeight: 30,
    fontSize: 14,
    color: '#3c87f7',
  },
  code: {
    fontFamily: Fonts.mono,
    fontWeight: Platform.select({ android: 700 }) ?? 500,
    fontSize: 12,
  },
});
