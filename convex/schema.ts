import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { scanFields } from "./scanFields";

export default defineSchema({
  ...authTables,
  scans: defineTable({
    userId: v.id("users"),
    imageId: v.id("_storage"),
    ...scanFields,
  }).index("by_user", ["userId"]),
  subscriptions: defineTable({
    userId: v.id("users"),
    plan: v.union(v.literal("weekly"), v.literal("monthly"), v.literal("yearly")),
    startedAt: v.number(),
    trialEndsAt: v.optional(v.number()),
    expiresAt: v.number(),
  }).index("by_user", ["userId"]),
  usage: defineTable({
    userId: v.id("users"),
    scans: v.number(),
  }).index("by_user", ["userId"]),
});
