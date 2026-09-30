import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets, type Edge } from 'react-native-safe-area-context';

/**
 * Drop-in for react-native-safe-area-context's SafeAreaView. The native one reports zero insets
 * inside iOS native modals (e.g. the fullScreenModal paywall), so pad from the hook instead.
 * Any padding passed in `style` is added on top of the inset.
 */
export function SafeAreaView({
  children,
  style,
  edges = ['top', 'right', 'bottom', 'left'],
}: {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  edges?: readonly Edge[];
}) {
  const insets = useSafeAreaInsets();
  const flat = StyleSheet.flatten(style) ?? {};
  const pad = (edge: Edge, key: 'paddingTop' | 'paddingRight' | 'paddingBottom' | 'paddingLeft') => {
    const base = flat[key] ?? flat[edge === 'top' || edge === 'bottom' ? 'paddingVertical' : 'paddingHorizontal'] ?? flat.padding ?? 0;
    return (typeof base === 'number' ? base : 0) + (edges.includes(edge) ? insets[edge] : 0);
  };

  return (
    <View
      style={[
        style,
        {
          paddingTop: pad('top', 'paddingTop'),
          paddingRight: pad('right', 'paddingRight'),
          paddingBottom: pad('bottom', 'paddingBottom'),
          paddingLeft: pad('left', 'paddingLeft'),
        },
      ]}>
      {children}
    </View>
  );
}
