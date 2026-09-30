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

const PAGE_STYLE =
  "body{font:16px/1.6 system-ui,sans-serif;max-width:720px;margin:0 auto;padding:24px;color:#10281A}h1{font-size:28px}h2{margin-top:28px;font-size:20px}label{display:block;margin-top:16px;font-weight:600}input,textarea{width:100%;box-sizing:border-box;margin-top:6px;padding:12px;font:inherit;border:1px solid #9BB5A4;border-radius:10px}button{margin-top:20px;padding:14px 22px;font:inherit;font-weight:700;color:#fff;background:#1F6B43;border:0;border-radius:24px}.hp{position:absolute;left:-9999px}";

function page(title: string, body: string) {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><style>${PAGE_STYLE}</style></head><body>${body}</body></html>`;
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
}

/** Public "delete your account and data" page, required by Google Play. */
http.route({
  path: "/delete-account",
  method: "GET",
  handler: httpAction(async () =>
    page(
      "Delete your Herbii account",
      `<h1>Delete your Herbii account</h1>
<p>Herbii - Herb Identifier &amp; Helper lets you delete your account and all data linked to it.</p>
<h2>Fastest way: inside the app</h2>
<ol><li>Open Herbii and go to the <b>Profile</b> tab.</li><li>Scroll to <b>Account</b> and tap <b>Delete account</b>.</li><li>Confirm. Your account is deleted straight away.</li></ol>
<h2>What is deleted</h2>
<ul><li>Your account and the device identifier linked to it.</li><li>All your scans and the photos you took.</li><li>Your plan record.</li></ul>
<p>To stop the free scans being reset by deleting and re-creating an account, we keep only a one-way hash of your device identifier and the number of free scans it has used. It contains no personal information.</p>
<p>Backups and provider logs may keep a copy for a short time before they are removed. If you have a subscription, cancel it in your Google Play or App Store subscription settings too, because deleting your account does not cancel it.</p>
<h2>Removed the app, or cannot open it?</h2>
<p>Herbii accounts are linked to your phone, so the easiest way is to install Herbii again on the same phone, tap <b>Get started</b> (this opens your same account) and then use <b>Profile &gt; Delete account</b>.</p>
<p>If that is not possible, for example you no longer have the phone, leave an email address where we can reach you and tell us what you can about the device and when you used the app. We will do our best to find and delete the matching account and its data.</p>
<form method="post" action="/delete-account">
<label for="email">Email address</label><input id="email" name="email" type="email" required maxlength="200" autocomplete="email">
<label for="details">Device and when you used the app (optional)</label><textarea id="details" name="details" rows="3" maxlength="1000"></textarea>
<div class="hp" aria-hidden="true"><label>Leave this empty<input name="website" tabindex="-1" autocomplete="off"></label></div>
<button type="submit">Request deletion</button>
</form>`,
    ),
  ),
});

http.route({
  path: "/delete-account",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const params = new URLSearchParams(await request.text().catch(() => ""));
    const email = (params.get("email") ?? "").trim().toLowerCase();
    const details = (params.get("details") ?? "").trim().slice(0, 1000);
    const spam = (params.get("website") ?? "") !== "";
    if (!spam && (email.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
      return page(
        "Delete your Herbii account",
        `<h1>Check your email address</h1><p>That does not look like a valid email address. <a href="/delete-account">Go back</a> and try again.</p>`,
      );
    }
    if (!spam) await ctx.runMutation(internal.deletionRequests.submit, { email, details: details || undefined });
    return page(
      "Request received",
      `<h1>Request received</h1><p>We have your deletion request and will contact you at <b>${esc(email)}</b> if we need more information to find your account.</p><p>You can also delete your account yourself at any time in the app under Profile &gt; Delete account.</p>`,
    );
  }),
});

export default http;
