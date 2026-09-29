import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import {
  action,
  internalAction,
  internalMutation,
  internalQuery,
  query,
  type ActionCtx,
  type QueryCtx,
} from "./_generated/server";
import { FREE_SCANS, type PlanId } from "./plans";

/** Must match the entitlement identifier you create in RevenueCat. */
const ENTITLEMENT = "pro";

async function loadStatus(ctx: QueryCtx, userId: Id<"users">) {
  const sub = await ctx.db
    .query("subscriptions")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .unique();
  const usage = await ctx.db
    .query("usage")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .unique();

  const now = Date.now();
  const isPro = !!sub && sub.expiresAt > now;
  const scansUsed = usage?.scans ?? 0;
  return {
    isPro,
    plan: isPro ? sub!.plan : null,
    trialing: isPro && !!sub!.trialEndsAt && sub!.trialEndsAt > now,
    expiresAt: sub?.expiresAt ?? null,
    scansUsed,
    scansLimit: FREE_SCANS,
    scansLeft: Math.max(0, FREE_SCANS - scansUsed),
  };
}

/** Everything the app needs to decide what to lock. `null` when signed out. */
export const status = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    return userId ? await loadStatus(ctx, userId) : null;
  },
});

/** Used by the identify action to enforce the free-scan limit on the server. */
export const canScan = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const s = await loadStatus(ctx, userId);
    return s.isPro || s.scansLeft > 0;
  },
});

const planValidator = v.union(v.literal("weekly"), v.literal("monthly"), v.literal("yearly"));

/** Writes (or clears) the user's plan. Only ever called with data fetched from RevenueCat. */
export const apply = internalMutation({
  args: {
    appUserId: v.string(),
    plan: v.optional(planValidator),
    startedAt: v.optional(v.number()),
    trialEndsAt: v.optional(v.number()),
    expiresAt: v.optional(v.number()),
  },
  handler: async (ctx, { appUserId, plan, startedAt, trialEndsAt, expiresAt }) => {
    const userId = ctx.db.normalizeId("users", appUserId);
    if (!userId) return; // anonymous / unknown RevenueCat id

    const existing = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (!plan || !expiresAt || expiresAt <= Date.now()) {
      if (existing) await ctx.db.delete(existing._id);
      return;
    }
    const row = { userId, plan, startedAt: startedAt ?? Date.now(), trialEndsAt, expiresAt };
    if (existing) await ctx.db.replace(existing._id, row);
    else await ctx.db.insert("subscriptions", row);
  },
});

/** "com.herbii.yearly", "pro_annual:base", "weekly" ... -> our plan id. */
function planFromProduct(productId: string): PlanId | undefined {
  if (/week/i.test(productId)) return "weekly";
  if (/month/i.test(productId)) return "monthly";
  if (/year|annual/i.test(productId)) return "yearly";
  return undefined;
}

/** Asks RevenueCat (server to server) what this user owns and mirrors it into our database. */
async function syncFromRevenueCat(ctx: ActionCtx, appUserId: string): Promise<boolean> {
  const secret = process.env.REVENUECAT_SECRET_KEY;
  if (!secret) throw new Error("REVENUECAT_SECRET_KEY is not set on the Convex deployment.");

  const res = await fetch(`https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(appUserId)}`, {
    headers: { authorization: `Bearer ${secret}`, "content-type": "application/json" },
  });
  if (!res.ok) throw new Error(`RevenueCat request failed (${res.status})`);

  const { subscriber } = await res.json();
  const ent = subscriber?.entitlements?.[ENTITLEMENT];
  const expiresAt: number | undefined = ent
    ? ent.expires_date
      ? Date.parse(ent.expires_date)
      : Number.MAX_SAFE_INTEGER // lifetime
    : undefined;
  const plan = ent ? planFromProduct(ent.product_identifier) : undefined;
  const period = ent ? subscriber?.subscriptions?.[ent.product_identifier] : undefined;

  await ctx.runMutation(internal.subscription.apply, {
    appUserId,
    plan,
    expiresAt,
    startedAt: ent?.purchase_date ? Date.parse(ent.purchase_date) : undefined,
    trialEndsAt: period?.period_type === "trial" && expiresAt ? expiresAt : undefined,
  });
  return !!expiresAt && expiresAt > Date.now() && !!plan;
}

/** Called by the app right after a purchase / restore / launch. */
export const sync = action({
  args: {},
  handler: async (ctx): Promise<{ isPro: boolean }> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { isPro: false };
    return { isPro: await syncFromRevenueCat(ctx, userId) };
  },
});

/** Called by the RevenueCat webhook (renewals, cancellations, refunds, billing issues). */
export const syncUser = internalAction({
  args: { appUserId: v.string() },
  handler: async (ctx, { appUserId }) => {
    await syncFromRevenueCat(ctx, appUserId);
  },
});
