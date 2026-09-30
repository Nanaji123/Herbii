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
  // Requests from the public /delete-account page, for people who cannot delete inside the app.
  deletionRequests: defineTable({
    email: v.string(),
    details: v.optional(v.string()),
    status: v.union(v.literal("pending"), v.literal("done")),
  }),
  // Free scans already used on a phone (hashed device id), kept after the account is deleted.
  deviceUsage: defineTable({
    deviceKey: v.string(),
    scans: v.number(),
  }).index("by_device", ["deviceKey"]),
  usage: defineTable({
    userId: v.id("users"),
    scans: v.number(),
  }).index("by_user", ["userId"]),
});
