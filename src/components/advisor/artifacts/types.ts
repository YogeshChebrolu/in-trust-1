// Payload shapes for the advisor's UI artifacts — the browser-side mirror of
// what the catalogue tools emit (packages/intrust-agent/src/catalogue-tools.ts).
// Kept deliberately loose (all optional) so a payload evolution never crashes a
// render; components guard every field.

export interface UiEvent {
  tool?: string;
  renderAs?: string;
  /** Full tool output for artifact events. */
  payload?: Record<string, unknown>;
  /** askUser form spec (legacy shape kept for the generative form). */
  spec?: unknown;
}

// --- funnel -------------------------------------------------------------------

export interface FunnelRemoval {
  uin?: string;
  productName?: string;
  insurer?: string;
  reason?: string;
}

export interface FunnelStagePayload {
  rule?: string;
  from?: number;
  to?: number;
  removed?: FunnelRemoval[];
  exceptions?: string[];
}

export interface FunnelCandidatePayload {
  uin?: string;
  productName?: string;
  insurer?: string;
  fitScore?: number;
  verdict?: string;
  fitReasons?: string[];
  watchOuts?: { title?: string; severity?: string }[];
  indicativeAnnualPremiumInr?: number;
  premiumNote?: string;
  tagline?: string;
}

export interface FunnelPayload {
  totalCatalogue?: number;
  catalogueNote?: string;
  stages?: FunnelStagePayload[];
  survivors?: FunnelCandidatePayload[];
  flags?: string[];
}

// --- policy detail -------------------------------------------------------------

export interface EnrichedClaimPayload {
  text?: string;
  basis?: string;
}

export interface PolicyDetailPayload {
  uin?: string;
  productName?: string;
  insurer?: { name?: string; shortName?: string };
  sumInsured?: { label?: string };
  eligibility?: {
    minEntryAgeAdultYears?: number | null;
    maxEntryAgeAdultYears?: number | null;
    lifelongRenewability?: boolean;
  };
  enrichment?: {
    tagline?: string;
    plainSummary?: string;
    bestFor?: string[];
    notFor?: string[];
    strengths?: EnrichedClaimPayload[];
    sacrifices?: EnrichedClaimPayload[];
  };
  personalizedFit?: {
    verdict?: string;
    bitingGotchas?: { title?: string; severity?: string; explanation?: string; whoItAffects?: string }[];
    applicableWaitingPeriods?: { condition?: string; whoHasIt?: string; waitMonths?: number | null; modifiable?: boolean; note?: string }[];
    ridersToConsider?: { name?: string; whyForThisPerson?: string }[];
    notes?: string[];
  };
  indicativePremium?: {
    familyAnnualInr?: number;
    perMember?: { relation?: string; ageYears?: number; annualPremiumInr?: number }[];
    sumInsuredInr?: number;
    gstNote?: string;
    notes?: string[];
  };
  coverages?: { name?: string; category?: string; inclusion?: string; limit?: string }[];
  costSharing?: {
    mandatoryCoPays?: { percentage?: number | null; trigger?: string; condition?: string }[];
    roomRent?: { policyType?: string; roomCategory?: string; icuLimit?: string; proportionateDeductionApplies?: boolean } | null;
    proportionateDeduction?: { applies?: boolean; appliesTo?: string } | null;
    subLimits?: { appliesTo?: string; value?: number | null; percent?: number | null; note?: string }[];
  };
  waitingPeriods?: {
    initialDays?: number | null;
    pedMonths?: number | null;
    pedReducible?: boolean;
    pedReductionOptionsMonths?: number[];
    specifiedDiseaseMonths?: number | null;
    maternityMonths?: number | null;
    maternityCovered?: boolean;
  };
  intrinsicGotchas?: { title?: string; severity?: string; explanation?: string }[];
}

// --- compare ---------------------------------------------------------------------

export interface ComparePayload {
  policies?: { uin?: string; productName?: string; insurer?: string }[];
  rows?: { dimension?: string; cells?: Record<string, { value?: string; note?: string }> }[];
}

// --- premium explorer ---------------------------------------------------------------

export interface PremiumPolicyPayload {
  uin?: string;
  productName?: string;
  insurer?: string;
  error?: string;
  zone?: { used?: string; assumed?: boolean; note?: string };
  confidence?: number;
  lowConfidence?: boolean;
  familyQuote?: {
    annualInr?: number;
    perMember?: { relation?: string; ageYears?: number; annualPremiumInr?: number }[];
    model?: string;
    notes?: string[];
    error?: string;
  };
  singleQuote?: { annualPremiumInr?: number; ageBand?: string };
  curve?: { age?: number; annualPremiumInr?: number }[];
  siLadder?: { sumInsuredInr?: number; annualPremiumInr?: number }[];
  gstNote?: string;
}

export interface PremiumExplorerPayload {
  sumInsuredInr?: number;
  referenceMembers?: { relation?: string; ageYears?: number }[];
  /** Set when no members were passed: the numbers are for a generic single person. */
  pricingBasis?: string;
  policies?: PremiumPolicyPayload[];
  disclaimer?: string;
}

// --- hospital map -----------------------------------------------------------------

export interface HospitalHitPayload {
  id?: string;
  name?: string;
  address?: string;
  city?: string;
  pincode?: string;
  lat?: number;
  lng?: number;
  geoPrecision?: "pincode" | "region" | "ungeocoded";
  /** e.g. "city_pincode_mismatch" — position is approximate/suspect. */
  geoFlag?: string | null;
  chain?: string | null;
  distanceKm?: number;
  /** network keys this hospital belongs to, e.g. ["care","aditya_birla"]. */
  insurers?: string[];
  networks?: Record<string, { listVersion?: string | null; sourcePage?: number | null; nameAsListed?: string }>;
}

export interface HospitalMapPayload {
  center?: { lat?: number; lng?: number; label?: string; source?: "coords" | "pincode" | "city" };
  radiusKm?: number;
  total?: number;
  returned?: number;
  capped?: boolean;
  countsByInsurer?: Record<string, number>;
  nearestByChain?: { chain?: string; id?: string; name?: string; distanceKm?: number }[];
  hospitals?: HospitalHitPayload[];
  /** network key -> display legend. */
  insurers?: Record<string, { name?: string; listVersion?: string }>;
  note?: string;
  requestedUins?: string[];
  insurerFilterNote?: string;
}

// --- shared helpers ---------------------------------------------------------------

export const inr = (n: number | null | undefined): string =>
  n == null ? "—" : `₹${Math.round(n).toLocaleString("en-IN")}`;

export const lakhLabel = (n: number | null | undefined): string =>
  n == null
    ? "—"
    : n >= 10_000_000
      ? `₹${(n / 10_000_000).toFixed(n % 10_000_000 ? 1 : 0)}Cr`
      : `₹${Math.round(n / 100_000)}L`;
