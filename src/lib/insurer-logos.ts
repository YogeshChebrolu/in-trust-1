// Insurer logo registry — optimized brand marks served from /public/insurers
// (see that folder's provenance in the design assets bundle). Payloads carry
// insurer names as free-ish strings ("HDFC ERGO", "Star Health and Allied
// Insurance Company Limited", …), so lookup is alias-substring based rather
// than exact. Anything unmatched (e.g. SBI General — no licensed asset yet)
// falls back to the monogram in <InsurerLogo/>.

export interface InsurerLogoAsset {
  name: string;
  src: string;
  width: number;
  height: number;
}

const LOGOS = {
  "aditya-birla-health": {
    name: "Aditya Birla Health Insurance",
    src: "/insurers/aditya-birla-health.png",
    width: 104,
    height: 42,
  },
  "bajaj-general": {
    name: "Bajaj General Insurance",
    src: "/insurers/bajaj-general.svg",
    width: 77,
    height: 36,
  },
  "care-health": {
    name: "Care Health Insurance",
    src: "/insurers/care-health.svg",
    width: 555,
    height: 171.6,
  },
  "hdfc-ergo": {
    name: "HDFC ERGO",
    src: "/insurers/hdfc-ergo.png",
    width: 358,
    height: 278,
  },
  "icici-lombard": {
    name: "ICICI Lombard General Insurance",
    src: "/insurers/icici-lombard.svg",
    width: 165,
    height: 40,
  },
  manipalcigna: {
    name: "ManipalCigna Health Insurance",
    src: "/insurers/manipalcigna.png",
    width: 283,
    height: 56,
  },
  "niva-bupa": {
    name: "Niva Bupa Health Insurance",
    src: "/insurers/niva-bupa.svg",
    width: 222.68,
    height: 129.373,
  },
  "star-health": {
    name: "Star Health and Allied Insurance",
    src: "/insurers/star-health.png",
    width: 400,
    height: 173,
  },
  "tata-aig": {
    name: "Tata AIG General Insurance",
    src: "/insurers/tata-aig.png",
    width: 208,
    height: 197,
  },
} as const satisfies Record<string, InsurerLogoAsset>;

// Longest-first substring aliases against a lowercased insurer name.
// "Bajaj Allianz" → bajaj-general (the company's post-2025 rebrand).
const ALIASES: [alias: string, id: keyof typeof LOGOS][] = [
  ["aditya birla", "aditya-birla-health"],
  ["icici lombard", "icici-lombard"],
  ["manipalcigna", "manipalcigna"],
  ["manipal cigna", "manipalcigna"],
  ["star health", "star-health"],
  ["care health", "care-health"],
  ["niva bupa", "niva-bupa"],
  ["hdfc ergo", "hdfc-ergo"],
  ["tata aig", "tata-aig"],
  ["bajaj", "bajaj-general"],
  ["icici", "icici-lombard"],
  ["hdfc", "hdfc-ergo"],
];

/** Resolve an insurer name (short or legal-entity long form) to its logo
 *  asset, or null when we don't carry the brand (render a monogram then). */
export function insurerLogo(
  name: string | null | undefined,
): InsurerLogoAsset | null {
  if (!name) return null;
  const n = name.toLowerCase();
  for (const [alias, id] of ALIASES) {
    if (n.includes(alias)) return LOGOS[id];
  }
  return null;
}

/** 1–2 letter monogram for insurers without a logo asset ("SBI General" → "SG"). */
export function insurerMonogram(name: string | null | undefined): string {
  if (!name) return "?";
  const words = name.trim().split(/\s+/);
  return words
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
}
