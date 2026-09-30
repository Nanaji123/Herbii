import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { internalMutation, type MutationCtx } from "./_generated/server";

/**
 * Free scans belong to the phone, not to the account: deleting the account and starting again on
 * the same phone must not hand out a fresh set. We therefore keep only a hash of the device id
 * and the number of free scans it has used.
 */
export async function rememberDeviceUsage(ctx: MutationCtx, userId: Id<"users">, scans: number) {
  if (scans <= 0) return;
  const account = await ctx.db
    .query("authAccounts")
    .withIndex("userIdAndProvider", (q) => q.eq("userId", userId).eq("provider", "device"))
    .unique();
  if (!account) return;

  const key = account.providerAccountId;
  const existing = await ctx.db
    .query("deviceUsage")
    .withIndex("by_device", (q) => q.eq("deviceKey", key))
    .unique();
  if (existing) await ctx.db.patch(existing._id, { scans: Math.max(existing.scans, scans) });
  else await ctx.db.insert("deviceUsage", { deviceKey: key, scans });
}

/** Called when a device account is created: hands back the free scans this phone already used. */
export const restore = internalMutation({
  args: { userId: v.id("users"), deviceKey: v.string() },
  handler: async (ctx, { userId, deviceKey }) => {
    const record = await ctx.db
      .query("deviceUsage")
      .withIndex("by_device", (q) => q.eq("deviceKey", deviceKey))
      .unique();
    if (!record) return;
    const usage = await ctx.db
      .query("usage")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
    if (usage) await ctx.db.patch(usage._id, { scans: Math.max(usage.scans, record.scans) });
    else await ctx.db.insert("usage", { userId, scans: record.scans });
  },
});
