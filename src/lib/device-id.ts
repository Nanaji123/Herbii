import * as Application from 'expo-application';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const KEY = 'device-id';
// Some old Android builds share this ANDROID_ID across many phones, so it cannot identify anyone.
const BROKEN_ANDROID_ID = '9774d56d682e549c';

/**
 * The identifier this phone signs in with. On Android it is the app-scoped ANDROID_ID, which stays
 * the same after a reinstall, so the user gets their scans and plan back. Everywhere else (and if
 * the Android ID is unusable) a random secret is created once and kept in the secure store.
 */
export async function getDeviceId() {
  if (Platform.OS === 'android') {
    const androidId = Application.getAndroidId();
    if (androidId && androidId !== BROKEN_ANDROID_ID) return `android:${androidId}`;
  }
  const saved = await SecureStore.getItemAsync(KEY);
  if (saved) return saved;
  const created = `random:${Crypto.randomUUID()}${Crypto.randomUUID()}`;
  await SecureStore.setItemAsync(KEY, created);
  return created;
}
