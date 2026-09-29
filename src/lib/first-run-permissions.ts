import { Camera } from 'expo-camera';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { remindersSupported, setRemindersEnabled } from '@/lib/reminders';

const KEY = 'first-run-permissions-asked';

/**
 * Right after the first sign-in, asks for camera and notification access one after the other.
 * Allowing notifications also switches the reminders on. Only ever runs once per install; after
 * that the user can change these in Profile or the phone settings.
 */
export async function askFirstRunPermissions() {
  if (Platform.OS === 'web') return;
  try {
    if (await SecureStore.getItemAsync(KEY)) return;
    await SecureStore.setItemAsync(KEY, '1');
    await Camera.requestCameraPermissionsAsync();
    if (remindersSupported) await setRemindersEnabled(true);
  } catch {
    // the permissions can still be granted later, when they are first needed
  }
}
