import { Platform } from 'react-native';
import Purchases, {
  PACKAGE_TYPE,
  PURCHASES_ERROR_CODE,
  type PurchasesPackage,
} from 'react-native-purchases';

import type { PlanId } from '@/lib/plans';

const KEY = Platform.select({
  ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY,
  android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY,
});

/** False on web, or until the RevenueCat public key for this platform is set. */
export const purchasesEnabled = Platform.OS !== 'web' && !!KEY;

let configured = false;

/** Connects RevenueCat to the signed-in user, so purchases follow their account across devices. */
export async function connectPurchases(userId: string) {
  if (!purchasesEnabled) return;
  if (!configured) {
    Purchases.configure({ apiKey: KEY!, appUserID: userId });
    configured = true;
  } else if ((await Purchases.getAppUserID()) !== userId) {
    await Purchases.logIn(userId);
  }
}

const TYPES: Partial<Record<PACKAGE_TYPE, PlanId>> = {
  [PACKAGE_TYPE.ANNUAL]: 'yearly',
  [PACKAGE_TYPE.MONTHLY]: 'monthly',
  [PACKAGE_TYPE.WEEKLY]: 'weekly',
};

/** The packages in the "current" RevenueCat offering, keyed by our plan ids. */
export async function loadPackages(): Promise<Partial<Record<PlanId, PurchasesPackage>>> {
  const offerings = await Purchases.getOfferings();
  const out: Partial<Record<PlanId, PurchasesPackage>> = {};
  for (const pkg of offerings.current?.availablePackages ?? []) {
    const plan = TYPES[pkg.packageType];
    if (plan) out[plan] = pkg;
  }
  return out;
}

/** Returns false when the user backed out of the store sheet. */
export async function buyPackage(pkg: PurchasesPackage): Promise<boolean> {
  try {
    await Purchases.purchasePackage(pkg);
    return true;
  } catch (e) {
    const err = e as { userCancelled?: boolean; code?: string };
    if (err.userCancelled || err.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) return false;
    throw e;
  }
}

export async function restorePurchases() {
  await Purchases.restorePurchases();
}
