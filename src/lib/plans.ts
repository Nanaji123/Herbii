import { HERBS } from '@/lib/herbs';

export type PlanId = 'yearly' | 'monthly' | 'weekly';

/** Library herbs anyone can open; the rest need a plan. */
export const FREE_HERB_COUNT = 6;
export const TRIAL_DAYS = 3;

const FREE_SLUGS = new Set(HERBS.slice(0, FREE_HERB_COUNT).map((h) => h.slug));
export const isHerbFree = (slug: string) => FREE_SLUGS.has(slug);

export type Plan = { id: PlanId; title: string; note: string; per: string };

// Display text only. Prices come from the store via RevenueCat (see paywall.tsx).
export const PLANS: Plan[] = [
  { id: 'yearly', title: 'Yearly', note: 'Best value plan', per: 'year' },
  { id: 'monthly', title: 'Monthly', note: 'No free trial included', per: 'month' },
  { id: 'weekly', title: 'Weekly', note: 'Billed weekly, cancel anytime', per: 'week' },
];
