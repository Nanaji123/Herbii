import * as Haptics from 'expo-haptics';
import type { ReactNode } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = Omit<PressableProps, 'style' | 'children'> & {
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  haptic?: boolean;
};

/**
 * Pressable that gently shrinks on touch and gives a light haptic tick.
 * The style goes straight on the pressable itself, so layout props (flex, width,
 * alignSelf, margins…) behave exactly as they would on a plain View.
 */
export function PressableScale({ style, children, onPress, haptic = true, ...rest }: Props) {
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      {...rest}
      style={[style, animated]}
      onPressIn={() => scale.set(withTiming(0.96, { duration: 90 }))}
      onPressOut={() => scale.set(withTiming(1, { duration: 140 }))}
      onPress={(e) => {
        if (haptic) Haptics.selectionAsync();
        onPress?.(e);
      }}>
      {children}
    </AnimatedPressable>
  );
}
