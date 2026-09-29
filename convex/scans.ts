import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { scanFields } from "./scanFields";

export const insert = internalMutation({
  args: { userId: v.id("users"), imageId: v.id("_storage"), ...scanFields },
  handler: async (ctx, args) => {
    const usage = await ctx.db
      .query("usage")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();
    if (usage) await ctx.db.patch(usage._id, { scans: usage.scans + 1 });
    else await ctx.db.insert("usage", { userId: args.userId, scans: 1 });
    return await ctx.db.insert("scans", args);
  },
});

export const me = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    return userId ? await ctx.db.get(userId) : null;
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const scans = await ctx.db
      .query("scans")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(100);
    return Promise.all(
      scans.map(async (s) => ({ ...s, imageUrl: await ctx.storage.getUrl(s.imageId) })),
    );
  },
});

export const get = query({
  args: { id: v.id("scans") },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    const scan = await ctx.db.get(id);
    if (!userId || !scan || scan.userId !== userId) return null;
    return { ...scan, imageUrl: await ctx.storage.getUrl(scan.imageId) };
  },
});

export const remove = mutation({
  args: { id: v.id("scans") },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    const scan = await ctx.db.get(id);
    if (!userId || !scan || scan.userId !== userId) throw new Error("Not found");
    await ctx.storage.delete(scan.imageId);
    await ctx.db.delete(id);
  },
});

export const clearAll = mutation({
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
  },
});
