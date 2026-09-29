export const FREE_SCANS = 5;
export const TRIAL_DAYS = 3;

export const PLAN_DAYS = { weekly: 7, monthly: 30, yearly: 365 } as const;
export type PlanId = keyof typeof PLAN_DAYS;

export const DAY_MS = 24 * 60 * 60 * 1000;
