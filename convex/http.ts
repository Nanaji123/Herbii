import { httpRouter } from "convex/server";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { auth } from "./auth";
import { PRIVACY_SECTIONS, PRIVACY_UPDATED } from "./policies";

const http = httpRouter();
auth.addHttpRoutes(http);

/**
 * RevenueCat webhook. In RevenueCat: Project settings > Integrations > Webhooks, set the URL to
 * https://<your-deployment>.convex.site/revenuecat and the Authorization header to
 * `Bearer <REVENUECAT_WEBHOOK_SECRET>`. The payload itself is not trusted; it is only a signal
 * to re-read the user's real status from RevenueCat.
 */
http.route({
  path: "/revenuecat",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const secret = process.env.REVENUECAT_WEBHOOK_SECRET;
    if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
      return new Response("Unauthorized", { status: 401 });
    }
    const body = await request.json().catch(() => null);
    const ids = new Set<string>(
      [body?.event?.app_user_id, body?.event?.original_app_user_id, ...(body?.event?.aliases ?? [])].filter(
        (x): x is string => typeof x === "string",
      ),
    );
    for (const appUserId of ids) {
      await ctx.runAction(internal.subscription.syncUser, { appUserId });
    }
    return new Response("ok");
  }),
});

const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Public privacy policy URL for the Play Console / App Store / RevenueCat. */
http.route({
  path: "/privacy",
  method: "GET",
  handler: httpAction(async () => {
    const body = PRIVACY_SECTIONS.map(
      (s) =>
        `<h2>${esc(s.title)}</h2>${s.body.map((p) => `<p>${esc(p)}</p>`).join("")}${
          s.bullets ? `<ul>${s.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>` : ""
        }`,
    ).join("");
    const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Herbii Privacy Policy</title><style>body{font:16px/1.6 system-ui,sans-serif;max-width:720px;margin:0 auto;padding:24px;color:#10281A}h1{font-size:28px}h2{margin-top:28px;font-size:20px}</style></head><body><h1>Herbii Privacy Policy</h1><p>Last updated ${PRIVACY_UPDATED}</p>${body}</body></html>`;
    return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
  }),
});

export default http;
