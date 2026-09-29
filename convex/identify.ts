import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { action } from "./_generated/server";

const MODEL = "gpt-4o";

const stringList = { type: "array", items: { type: "string" } };

const REPORT_TOOL = {
  type: "function",
  function: {
    name: "report_plant",
    description: "Report the result of analysing the plant photo.",
    parameters: {
      type: "object",
      properties: {
        identified: {
          type: "boolean",
          description: "false if the photo does not clearly show a plant or it cannot be identified",
        },
        commonName: { type: "string" },
        scientificName: { type: "string" },
        family: { type: "string" },
        confidence: { type: "number", description: "0 to 1" },
        summary: { type: "string", description: "2-3 sentence description of the plant" },
        verdict: {
          type: "string",
          enum: ["safe", "caution", "toxic", "unknown"],
          description: "Overall safety for a person using it as a herb",
        },
        verdictReason: { type: "string", description: "One or two sentences explaining the verdict" },
        medicinalProperties: { ...stringList, description: "Documented medicinal properties" },
        traditionalUses: stringList,
        sideEffects: stringList,
        precautions: {
          ...stringList,
          description: "Who should avoid it, interactions, dosage cautions",
        },
        lookalikes: { ...stringList, description: "Dangerous or similar-looking plants" },
      },
      required: [
        "identified", "commonName", "scientificName", "family", "confidence", "summary",
        "verdict", "verdictReason", "medicinalProperties", "traditionalUses",
        "sideEffects", "precautions", "lookalikes",
      ],
    },
  },
};

const SYSTEM = `You are a botanist and herbal-medicine expert. The user sends a photo of a plant. \
Identify it and call report_plant. Be honest about uncertainty: lower the confidence, and use verdict "unknown" \
if you are not sure. If the plant could be toxic or has toxic lookalikes, say so clearly. \
Never encourage eating or medicating with a plant on the strength of a photo ID alone. \
If the image is not a plant, set identified=false, use empty strings/arrays and explain in summary.`;

export const identify = action({
  args: { imageBase64: v.string(), mimeType: v.string() },
  handler: async (ctx, { imageBase64, mimeType }): Promise<Id<"scans">> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Please sign in first.");

    if (!(await ctx.runQuery(internal.subscription.canScan, { userId }))) {
      throw new ConvexError({ code: "FREE_LIMIT" });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY is not set on the Convex deployment.");

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_completion_tokens: 2000,
        tools: [REPORT_TOOL],
        tool_choice: { type: "function", function: { name: "report_plant" } },
        messages: [
          { role: "system", content: SYSTEM },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "What plant is this? Give its medicinal properties and whether it is good or bad to use.",
              },
              { type: "image_url", image_url: { url: `data:${mimeType};base64,${imageBase64}` } },
            ],
          },
        ],
      }),
    });
    if (!res.ok) {
      throw new Error(`AI request failed (${res.status}): ${(await res.text()).slice(0, 300)}`);
    }
    const data = await res.json();
    const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    if (!args) throw new Error("The AI returned no result. Try another photo.");
    const r = JSON.parse(args);

    const imageId = await ctx.storage.store(
      new Blob([Uint8Array.from(atob(imageBase64), (c) => c.charCodeAt(0))], { type: mimeType }),
    );

    return await ctx.runMutation(internal.scans.insert, {
      userId,
      imageId,
      identified: !!r.identified,
      commonName: r.commonName ?? "",
      scientificName: r.scientificName ?? "",
      family: r.family ?? "",
      confidence: Math.min(1, Math.max(0, Number(r.confidence) || 0)),
      summary: r.summary ?? "",
      verdict: r.verdict ?? "unknown",
      verdictReason: r.verdictReason ?? "",
      medicinalProperties: r.medicinalProperties ?? [],
      traditionalUses: r.traditionalUses ?? [],
      sideEffects: r.sideEffects ?? [],
      precautions: r.precautions ?? [],
      lookalikes: r.lookalikes ?? [],
    });
  },
});
