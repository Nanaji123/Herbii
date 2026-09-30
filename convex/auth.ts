import { ConvexCredentials } from "@convex-dev/auth/providers/ConvexCredentials";
import { convexAuth, createAccount, retrieveAccount } from "@convex-dev/auth/server";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { internal } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";

const APPLE_KEYS = createRemoteJWKSet(new URL("https://appleid.apple.com/auth/keys"));

// Apple identity tokens are issued for the app's bundle ID. Expo Go tokens are issued for
// "host.exp.Exponent"; to test there, add it on the dev deployment only:
//   npx convex env set APPLE_AUDIENCES com.herbii.identifier,host.exp.Exponent
function appleAudiences() {
  return (process.env.APPLE_AUDIENCES ?? "com.herbii.identifier").split(",").map((s) => s.trim());
}

/**
 * Native Sign in with Apple. The app sends the identity token from the iOS Apple sheet;
 * we only trust it after checking Apple's signature, issuer, audience and expiry.
 */
const Apple = ConvexCredentials<DataModel>({
  id: "apple",
  authorize: async (credentials, ctx) => {
    const token = credentials.identityToken;
    if (typeof token !== "string") throw new Error("Missing Apple identity token.");

    const { payload } = await jwtVerify(token, APPLE_KEYS, {
      issuer: "https://appleid.apple.com",
      audience: appleAudiences(),
    });
    if (!payload.sub) throw new Error("Invalid Apple identity token.");

    const email = typeof payload.email === "string" ? payload.email : undefined;
    const verified = payload.email_verified === true || payload.email_verified === "true";
    // Apple only shares the name on the very first sign-in, and only with the app, not in the token.
    const name = typeof credentials.name === "string" && credentials.name.trim() ? credentials.name.trim() : undefined;

    const { user } = await createAccount(ctx, {
      provider: "apple",
      account: { id: payload.sub },
      profile: {
        ...(email && { email }),
        ...(email && verified && { emailVerificationTime: Date.now() }),
        ...(name && { name }),
      },
      // Same verified email as an existing Google account → same Herbii account.
      shouldLinkViaEmail: !!email && verified,
    });
    return { userId: user._id };
  },
});

async function sha256(text: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Anonymous, per-device sign-in. The app sends an identifier that belongs to this phone; the first
 * time it is seen an account is created, and every later time the same account is returned.
 * Only a hash of the identifier is stored.
 */
const Device = ConvexCredentials<DataModel>({
  id: "device",
  authorize: async (credentials, ctx) => {
    const deviceId = credentials.deviceId;
    if (typeof deviceId !== "string" || deviceId.length < 16 || deviceId.length > 200) {
      throw new Error("Invalid device.");
    }
    const id = await sha256(`herbii-device:${deviceId}`);
    try {
      const { user } = await retrieveAccount(ctx, { provider: "device", account: { id } });
      return { userId: user._id };
    } catch {
      const { user } = await createAccount(ctx, {
        provider: "device",
        account: { id },
        profile: { name: "Herb explorer" },
      });
      // A phone that already used some free scans (before its account was deleted) keeps that count.
      await ctx.runMutation(internal.deviceUsage.restore, { userId: user._id, deviceKey: id });
      return { userId: user._id };
    }
  },
});

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Device, Apple],
});
