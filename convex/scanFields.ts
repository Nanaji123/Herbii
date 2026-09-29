import { v } from "convex/values";

// Shared by the schema, the insert mutation and the AI action.
export const scanFields = {
  identified: v.boolean(),
  commonName: v.string(),
  scientificName: v.string(),
  family: v.string(),
  confidence: v.number(),
  summary: v.string(),
  verdict: v.union(
    v.literal("safe"),
    v.literal("caution"),
    v.literal("toxic"),
    v.literal("unknown"),
  ),
  verdictReason: v.string(),
  medicinalProperties: v.array(v.string()),
  traditionalUses: v.array(v.string()),
  sideEffects: v.array(v.string()),
  precautions: v.array(v.string()),
  lookalikes: v.array(v.string()),
};
