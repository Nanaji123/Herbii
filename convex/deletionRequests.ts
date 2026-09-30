import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

/** Stores a request made from the public delete-account web page. */
export const submit = internalMutation({
  args: { email: v.string(), details: v.optional(v.string()) },
  handler: async (ctx, { email, details }) => {
    await ctx.db.insert("deletionRequests", { email, details, status: "pending" });
  },
});
