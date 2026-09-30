import Google from "@auth/core/providers/google";
import { ConvexCredentials } from "@convex-dev/auth/providers/ConvexCredentials";
import { convexAuth, createAccount } from "@convex-dev/auth/server";
import { createRemoteJWKSet, jwtVerify } from "jose";
import type { DataModel } from "./_generated/dataModel";

// Deep-link schemes the mobile app may be sent back to after Google sign-in.
// "exp://" is Expo Go / the dev server, "herbiiidentifier://" is a real build.
const APP_SCHEMES = ["herbiiidentifier://", "exp://", "exps://"];

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

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Google, Apple],
  callbacks: {
    async redirect({ redirectTo }) {
      if (APP_SCHEMES.some((scheme) => redirectTo.startsWith(scheme))) {
        return redirectTo;
      }
      const siteUrl = process.env.SITE_URL;
      if (siteUrl && redirectTo.startsWith(siteUrl)) {
        return redirectTo;
      }
      throw new Error(`Invalid redirectTo URI ${redirectTo}`);
    },
  },
});
