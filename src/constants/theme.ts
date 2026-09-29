/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#10281A',
    background: '#DCEBD3',
    backgroundElement: 'rgba(255,255,255,0.95)',
    backgroundSelected: 'rgba(16,40,26,0.09)',
    textSecondary: 'rgba(16,40,26,0.76)',
    border: 'rgba(16,40,26,0.10)',
    brandSoft: 'rgba(43,117,72,0.16)',
    accent: '#2B7548',
    solid: '#FFFFFF',
    primary: '#10281A',
    onPrimary: '#FFFFFF',
    bar: '#FFFFFF',
  },
  dark: {
    text: '#FFFFFF',
    background: '#07160E',
    backgroundElement: 'rgba(14,36,25,0.78)',
    backgroundSelected: 'rgba(255,255,255,0.10)',
    textSecondary: 'rgba(255,255,255,0.65)',
    border: 'rgba(255,255,255,0.12)',
    brandSoft: 'rgba(213,242,107,0.14)',
    accent: '#D5F26B',
    solid: '#16261C',
    primary: '#D5F26B',
    onPrimary: '#0E1A12',
    bar: '#0A1E13',
  },
} as const;

export const Gradients = {
  light: ['#E9EFE2', '#DEE7D6', '#E4EBDC'],
  dark: ['#0F1C15', '#0B140F', '#08100B'],
} as const;

export const Brand = '#3AA76D';
export const BrandDeep = '#0E5A32';
export const Lime = '#C4F250';
export const LimeLight = '#D4F870';

export const VerdictColors = {
  safe: '#2E9E5B',
  caution: '#E08A00',
  toxic: '#D64545',
  unknown: '#6B7280',
} as const;

export const FontFamily = {
  400: 'Manrope_400Regular',
  500: 'Manrope_500Medium',
  600: 'Manrope_600SemiBold',
  700: 'Manrope_700Bold',
  800: 'Manrope_800ExtraBold',
  serif: 'DMSerifDisplay_400Regular',
} as const;

export const CardShadow = {
  shadowColor: '#0B2A16',
  shadowOpacity: 0.09,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 8 },
  elevation: 3,
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = 104;
export const MaxContentWidth = 800;
