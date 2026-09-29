import * as Haptics from 'expo-haptics';
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/icon';
import { PressableScale } from '@/components/pressable-scale';
import { Sheet } from '@/components/sheet';
import { ThemedText } from '@/components/themed-text';
import { Spacing, VerdictColors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Tone = 'danger' | 'warning' | 'info' | 'success';

export type DialogOptions = {
  title: string;
  message?: string;
  confirmLabel?: string;
  /** Pass null for a single-button message. */
  cancelLabel?: string | null;
  /** Makes the confirm button red. */
  destructive?: boolean;
  tone?: Tone;
  icon?: IconName;
};

type DialogApi = {
  /** Resolves true when the user confirms, false when they cancel or dismiss. */
  confirm: (options: DialogOptions) => Promise<boolean>;
  /** Single-button message. */
  alert: (options: Omit<DialogOptions, 'cancelLabel'>) => Promise<void>;
};

const DialogContext = createContext<DialogApi | null>(null);

const TONE_COLOR: Record<Tone, string> = {
  danger: '#D64545',
  warning: VerdictColors.caution,
  info: '#3B82F6',
  success: VerdictColors.safe,
};

const TONE_ICON: Record<Tone, IconName> = {
  danger: 'trash-outline',
  warning: 'alert-circle-outline',
  info: 'information-circle-outline',
  success: 'checkmark-circle-outline',
};

export function DialogProvider({ children }: { children: ReactNode }) {
  const theme = useTheme();
  const [options, setOptions] = useState<DialogOptions | null>(null);
  const [visible, setVisible] = useState(false);
  const resolver = useRef<((value: boolean) => void) | null>(null);

  const settle = useCallback((value: boolean) => {
    setVisible(false);
    resolver.current?.(value);
    resolver.current = null;
  }, []);

  const confirm = useCallback((next: DialogOptions) => {
    return new Promise<boolean>((resolve) => {
      // If something is already open, treat it as cancelled.
      resolver.current?.(false);
      resolver.current = resolve;
      setOptions(next);
      setVisible(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    });
  }, []);

  const api = useMemo<DialogApi>(
    () => ({
      confirm,
      alert: async (o) => {
        await confirm({ ...o, cancelLabel: null });
      },
    }),
    [confirm],
  );

  const tone: Tone = options?.tone ?? (options?.destructive ? 'danger' : 'info');
  const color = TONE_COLOR[tone];
  const singleButton = options?.cancelLabel === null;

  return (
    <DialogContext.Provider value={api}>
      {children}
      <Sheet visible={visible} onClose={() => settle(false)}>
        {options && (
          <View style={styles.body}>
            <View style={[styles.iconWrap, { backgroundColor: color + '22' }]}>
              <Icon name={options.icon ?? TONE_ICON[tone]} size={30} color={color} />
            </View>
            <ThemedText serif style={styles.title}>
              {options.title}
            </ThemedText>
            {options.message ? (
              <ThemedText themeColor="textSecondary" style={styles.message}>
                {options.message}
              </ThemedText>
            ) : null}

            <View style={styles.buttons}>
              <PressableScale
                onPress={() => settle(true)}
                accessibilityRole="button"
                style={[styles.button, { backgroundColor: options.destructive ? '#D64545' : theme.primary }]}>
                <ThemedText style={[styles.buttonText, { color: options.destructive ? '#fff' : theme.onPrimary }]}>
                  {options.confirmLabel ?? 'OK'}
                </ThemedText>
              </PressableScale>

              {!singleButton && (
                <PressableScale
                  onPress={() => settle(false)}
                  accessibilityRole="button"
                  style={[styles.button, { backgroundColor: theme.backgroundSelected }]}>
                  <ThemedText style={[styles.buttonText, { color: theme.text }]}>{options.cancelLabel ?? 'Cancel'}</ThemedText>
                </PressableScale>
              )}
            </View>
          </View>
        )}
      </Sheet>
    </DialogContext.Provider>
  );
}

export function useDialog(): DialogApi {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error('useDialog must be used inside <DialogProvider>');
  return ctx;
}

const styles = StyleSheet.create({
  body: { alignItems: 'center', gap: Spacing.two + 2 },
  iconWrap: { width: 68, height: 68, borderRadius: 34, alignItems: 'center', justifyContent: 'center', marginTop: Spacing.one },
  title: { fontSize: 26, lineHeight: 32, textAlign: 'center' },
  message: { textAlign: 'center', fontSize: 15.5, lineHeight: 23, paddingHorizontal: Spacing.two },
  buttons: { alignSelf: 'stretch', gap: Spacing.two + 2, marginTop: Spacing.two },
  button: { height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center' },
  buttonText: { fontSize: 16, fontWeight: '800' },
});
