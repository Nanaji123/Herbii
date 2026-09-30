import Constants, { ExecutionEnvironment } from 'expo-constants';
import type * as NotificationsType from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useSyncExternalStore } from 'react';
import { AppState, Platform } from 'react-native';

// Expo Go on Android crashes as soon as expo-notifications is imported, so it is only loaded in
// development and store builds. In Expo Go (and on web) reminders are simply unavailable.
const supported = Platform.OS !== 'web' && Constants.executionEnvironment !== ExecutionEnvironment.StoreClient;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Notifications: typeof NotificationsType = supported ? require('expo-notifications') : (null as never);

/** Whether this build can show reminders (false in Expo Go and on web). */
export const remindersSupported = supported;

/*
 * Reminders are deliberately sparse so they never feel like nagging:
 *  - "come back" nudges are scheduled relative to the last time the app was opened (3, 7 and 14
 *    days out) and are pushed back every time it is opened, so active users never see them;
 *  - a herb reminder one day after a scan;
 *  - one-off milestone and offer messages, at most one per 20 hours, offers at most once a week.
 */
const KEY = 'reminders-enabled';
const CHANNEL = 'reminders';
const HERB_ID = 'recent-herb';
const COMEBACK_PREFIX = 'comeback-';
const REMINDER_HOUR = 18;
const OFFER_HOUR = 10;
const DAY = 24 * 60 * 60 * 1000;
const MIN_GAP = 20 * 60 * 60 * 1000;
const OFFER_COOLDOWN = 7 * DAY;
const MILESTONES = [1, 5, 10, 25, 50, 100];

type Message = { title: string; body: string };

const COMEBACK: { days: number; free?: Message; pro: Message }[] = [
  {
    days: 3,
    pro: { title: 'Got a plant you are unsure about?', body: 'Snap it and Herbii will tell you what it is.' },
  },
  {
    days: 7,
    free: { title: 'Try Herbii Pro free for 3 days 🌿', body: 'Unlock every herb and unlimited scans. Cancel any time.' },
    pro: { title: 'Learn a new herb today', body: 'Browse the herb library and pick up something new.' },
  },
  {
    days: 14,
    pro: { title: 'Your herb garden misses you 🍃', body: 'Scan a plant around you and add it to your history.' },
  },
];

const MILESTONE_MESSAGES: Record<number, { free: Message; pro: Message }> = {
  1: {
    free: { title: 'Your first herb! 🌱', body: 'Nice start. Keep scanning to build your herb history.' },
    pro: { title: 'Your first herb! 🌱', body: 'Nice start. Keep scanning to build your herb history.' },
  },
  5: {
    free: { title: '5 herbs identified 🎉', body: 'You have used your free scans. Try Pro free for 3 days to keep going.' },
    pro: { title: '5 herbs identified 🎉', body: 'You are getting the hang of it. Keep exploring!' },
  },
  10: {
    free: { title: '10 herbs and counting 🌿', body: 'You are on a roll. Pro gives you unlimited scans.' },
    pro: { title: '10 herbs and counting 🌿', body: 'You are on a roll. Keep your streak going.' },
  },
  25: {
    free: { title: '25 herbs identified!', body: 'You are a real herb explorer now.' },
    pro: { title: '25 herbs identified!', body: 'You are a real herb explorer now.' },
  },
  50: {
    free: { title: '50 herbs identified!', body: 'Half a hundred plants. Impressive.' },
    pro: { title: '50 herbs identified!', body: 'Half a hundred plants. Impressive.' },
  },
  100: {
    free: { title: '100 herbs identified!', body: 'You are a Herbii master.' },
    pro: { title: '100 herbs identified!', body: 'You are a Herbii master.' },
  },
};

const LAST_SCAN_OFFER: Message = {
  title: '1 free scan left',
  body: 'Try Herbii Pro free for 3 days and never run out.',
};

let enabled = false;
let isProNow = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

if (supported) {
  // Show reminders as a banner even while the app is open.
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

async function ensurePermission() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL, {
      name: 'Reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  return (await Notifications.requestPermissionsAsync()).granted;
}

/** The next time the clock reads `hour`, at least `daysAhead` days from today. */
function at(hour: number, daysAhead: number) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  d.setHours(hour, 0, 0, 0);
  if (d.getTime() <= Date.now()) d.setDate(d.getDate() + 1);
  return d;
}

function scheduleAt(date: Date, message: Message, route: string, identifier?: string) {
  return Notifications.scheduleNotificationAsync({
    identifier,
    content: { ...message, data: { route } },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date, channelId: CHANNEL },
  });
}

/** (Re)starts the "come back" countdown from now, so anyone opening the app is never nagged. */
async function armComeback() {
  await Promise.all(
    COMEBACK.map(async (c) => {
      const id = COMEBACK_PREFIX + c.days;
      await Notifications.cancelScheduledNotificationAsync(id).catch(() => {});
      const free = !isProNow && c.free;
      await scheduleAt(at(REMINDER_HOUR, c.days), free || c.pro, free ? '/paywall' : '/scan', id);
    }),
  );
}

async function clearLegacyDaily() {
  await Promise.all(
    [0, 1, 2, 3, 4, 5, 6].map((i) => Notifications.cancelScheduledNotificationAsync('daily-' + i).catch(() => {})),
  );
}

let watching = false;

/** Call once at startup: restores the saved choice and re-arms the schedule. */
export async function loadReminders() {
  if (!supported) return;
  try {
    const saved = await SecureStore.getItemAsync(KEY);
    // Off until the user opts in, so the permission prompt only appears on their request.
    enabled = saved === '1';
    emit();
    if (!enabled || !(await Notifications.getPermissionsAsync()).granted) return;
    await clearLegacyDaily();
    await armComeback();
    if (!watching) {
      watching = true;
      AppState.addEventListener('change', (s) => {
        if (s === 'active' && enabled) armComeback().catch(() => {});
      });
    }
  } catch {
    // leave reminders off
  }
}

/** Turns reminders on or off. Resolves to false when the user denied the permission. */
export async function setRemindersEnabled(next: boolean) {
  if (!supported) return false;
  if (next) {
    if (!(await ensurePermission())) return false;
    await clearLegacyDaily();
    await armComeback();
  } else {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }
  enabled = next;
  emit();
  SecureStore.setItemAsync(KEY, next ? '1' : '0').catch(() => {});
  return true;
}

/** The day after a scan, nudge the user back to the herb they looked up. */
export async function scheduleRecentHerbReminder(name: string, scanId: string) {
  if (!supported || !enabled) return;
  try {
    await scheduleAt(
      at(REMINDER_HOUR, 1),
      { title: `Remember ${name}?`, body: 'Take another look at its uses, precautions and look-alikes.' },
      `/scan/${scanId}`,
      HERB_ID,
    );
  } catch {
    // reminders are best-effort
  }
}

async function readNumber(key: string) {
  const v = await SecureStore.getItemAsync(key);
  return v === null ? null : Number(v);
}

/**
 * Called whenever the signed-in user's scan count or plan is known. Sends a milestone message
 * when a new milestone was reached, or a one-time offer when a free user is down to their last
 * scan. The first call only records the current count, so existing users are not congratulated
 * for old scans.
 */
export async function onScansChanged(count: number, plan: { isPro: boolean; scansLeft: number }) {
  if (!supported) return;
  isProNow = plan.isPro;
  try {
    // Tracked even while reminders are off, so turning them on later does not miss a milestone.
    const seen = await readNumber('reminders-scans-seen');
    await SecureStore.setItemAsync('reminders-scans-seen', String(count));
    if (!enabled || seen === null || count <= seen) return;

    const now = Date.now();
    const lastSent = (await readNumber('reminders-last-sent')) ?? 0;
    if (now - lastSent < MIN_GAP) return;

    const milestone = [...MILESTONES].reverse().find((m) => seen < m && m <= count);
    if (milestone) {
      const msg = MILESTONE_MESSAGES[milestone][plan.isPro ? 'pro' : 'free'];
      const upsell = !plan.isPro && (milestone === 5 || milestone === 10);
      // A little later, so it does not land on top of the scan result.
      await scheduleAt(new Date(now + 20 * 60 * 1000), msg, upsell ? '/paywall' : '/scan');
      await SecureStore.setItemAsync('reminders-last-sent', String(now));
      if (upsell) await SecureStore.setItemAsync('reminders-last-offer', String(now));
      return;
    }

    if (!plan.isPro && plan.scansLeft === 1) {
      const lastOffer = (await readNumber('reminders-last-offer')) ?? 0;
      if (now - lastOffer < OFFER_COOLDOWN) return;
      await scheduleAt(at(OFFER_HOUR, 1), LAST_SCAN_OFFER, '/paywall');
      await SecureStore.setItemAsync('reminders-last-sent', String(now));
      await SecureStore.setItemAsync('reminders-last-offer', String(now));
    }
  } catch {
    // reminders are best-effort
  }
}

/** Opens the screen a tapped reminder points at, including when the tap launched the app. */
export function useReminderTaps(open: (route: string) => void) {
  useEffect(() => {
    if (!supported) return;
    const handle = (r: NotificationsType.NotificationResponse | null) => {
      const route = r?.notification.request.content.data?.route;
      if (typeof route === 'string' && r?.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER) open(route);
    };
    handle(Notifications.getLastNotificationResponse());
    const sub = Notifications.addNotificationResponseReceivedListener(handle);
    return () => sub.remove();
  }, [open]);
}

export function useRemindersEnabled() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => enabled,
  );
}
