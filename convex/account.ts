import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "./_generated/server";

/** Permanently deletes the signed-in user and everything tied to them (required by the app stores). */
export const deleteAccount = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not signed in");

    const scans = await ctx.db
      .query("scans")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const s of scans) {
      await ctx.storage.delete(s.imageId);
      await ctx.db.delete(s._id);
    }

    for (const table of ["subscriptions", "usage"] as const) {
      const rows = await ctx.db
        .query(table)
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect();
      for (const r of rows) await ctx.db.delete(r._id);
    }

    // Login data from @convex-dev/auth.
    const sessions = await ctx.db
      .query("authSessions")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .collect();
    for (const session of sessions) {
      const tokens = await ctx.db
        .query("authRefreshTokens")
        .withIndex("sessionId", (q) => q.eq("sessionId", session._id))
        .collect();
      for (const t of tokens) await ctx.db.delete(t._id);
      await ctx.db.delete(session._id);
    }

    const accounts = await ctx.db
      .query("authAccounts")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
    for (const account of accounts) {
      const codes = await ctx.db
        .query("authVerificationCodes")
        .withIndex("accountId", (q) => q.eq("accountId", account._id))
        .collect();
      for (const c of codes) await ctx.db.delete(c._id);
      await ctx.db.delete(account._id);
    }

    await ctx.db.delete(userId);
  },
});
