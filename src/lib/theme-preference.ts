import * as SecureStore from 'expo-secure-store';
import { useSyncExternalStore } from 'react';
import { Appearance, Platform } from 'react-native';

export type ThemePreference = 'system' | 'light' | 'dark';

const KEY = 'theme-preference';
let current: ThemePreference = 'system';
const listeners = new Set<() => void>();

function apply(pref: ThemePreference) {
  // Overriding the app-level scheme makes every useColorScheme() consumer follow it.
  Appearance.setColorScheme(pref === 'system' ? 'unspecified' : pref);
}

/** Call once at startup to restore the saved choice. */
export async function loadThemePreference() {
  if (Platform.OS === 'web') return;
  try {
    const saved = await SecureStore.getItemAsync(KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'system') setThemePreference(saved, false);
  } catch {
    // keep the default
  }
}

export function setThemePreference(pref: ThemePreference, persist = true) {
  current = pref;
  apply(pref);
  listeners.forEach((l) => l());
  if (persist && Platform.OS !== 'web') SecureStore.setItemAsync(KEY, pref).catch(() => {});
}

export function useThemePreference() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => current,
  );
}
