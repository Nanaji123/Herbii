// Single source for the privacy policy: rendered in the app and served as a public web page at /privacy.

export const PRIVACY_UPDATED = "29 September 2026";

export type PolicySection = { title: string; body: string[]; bullets?: string[] };

export const PRIVACY_SECTIONS: PolicySection[] = [
  {
    title: "Who we are",
    body: [
      "Herbii - Herb Identifier & Helper (\"Herbii\", \"we\") is a mobile app that helps you identify plants from a photo and learn about herbs. This policy explains what information we collect, why, and the choices you have.",
    ],
  },
  {
    title: "What we collect",
    body: ["We only collect what the app needs to work:"],
    bullets: [
      "A device identifier that links your account to your phone. It is stored only as a one-way hash, and we do not ask for your name or email address.",
      "Photos you take or choose to identify a plant, and the result of each scan (plant name, safety notes and so on). Together these are your scan history.",
      "Your plan and usage: which plan you have, when it ends, and how many free scans you have used.",
      "Purchase information handled by Google Play or the App Store and RevenueCat (our subscription provider). We never see your card or payment details.",
    ],
  },
  {
    title: "How we use it",
    bullets: [
      "To identify plants and show you the results and your history.",
      "To run your account and remember your plan, free scans and settings.",
      "To process and restore subscriptions.",
      "To keep the service secure and prevent abuse.",
    ],
    body: ["We do not sell your data, and we do not show ads."],
  },
  {
    title: "Who we share it with",
    body: ["We use a small number of service providers who process data on our behalf:"],
    bullets: [
      "Convex: stores your account, scans, photos and plan.",
      "OpenAI: your scan photo is sent to be analysed so we can identify the plant.",
      "RevenueCat, Google Play and the Apple App Store: subscriptions and purchases.",
    ],
  },
  {
    title: "Your choices and deletion",
    body: ["You are in control of your data:"],
    bullets: [
      "Delete any single scan, or your whole history, from the Profile tab.",
      "Delete your account from Profile > Delete account. This permanently removes your profile, scans, photos and plan record from our systems. To stop the free scans being reset by deleting and re-creating an account, we keep only a one-way hash of your device identifier and the number of free scans it has used.",
      "Cancel a subscription at any time in your Google Play or App Store subscription settings. Deleting your account does not cancel it automatically.",
      "Camera and photo access can be turned off any time in your phone's Settings.",
    ],
  },
  {
    title: "How long we keep data",
    body: [
      "We keep your data while your account exists. When you delete a scan or your account, the related data is deleted. Backups and provider logs may keep copies for a short time before they are removed.",
    ],
  },
  {
    title: "Children",
    body: [
      "Herbii is not directed at children under 13 (or the age of digital consent in your country if higher). If you believe a child has given us personal information, contact us and we will delete it.",
    ],
  },
  {
    title: "Not medical advice",
    body: [
      "Plant information in Herbii is AI-generated, for education only, and can be wrong. It is not medical advice. Never eat or use a plant based on the app alone.",
    ],
  },
  {
    title: "Changes to this policy",
    body: ["If we change this policy we will update the date above and, for important changes, tell you in the app."],
  },
];
