import Google from "@auth/core/providers/google";
import { convexAuth } from "@convex-dev/auth/server";

// Deep-link schemes the mobile app may be sent back to after Google sign-in.
// "exp://" is Expo Go / the dev server, "herbiiidentifier://" is a real build.
const APP_SCHEMES = ["herbiiidentifier://", "exp://", "exps://"];

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Google],
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
