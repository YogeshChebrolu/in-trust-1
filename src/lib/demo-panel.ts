// The fold-two panel's demo data: the persona shown on the Profile tab, plus
// the ordered list of artifact events the tab bar derives from.
//
// Three policy tabs (Activ One, Optima Restore, Aspire) mirror a real advisor
// session over the flagship-10 catalogue. Activ One is the real ported fixture
// (its family-specific fit + premium re-based onto this persona); Optima Restore
// and Aspire are authored from the same session's funnel / compare / premium
// facts so every tab stays mutually consistent.

import fixtures from "./dev-fixtures.json";
import type {
  UiEvent,
  PolicyDetailPayload,
  PremiumExplorerPayload,
} from "@/components/advisor/artifacts/types";
import type { Profile } from "@/components/advisor/profile-tab";

const fx = fixtures as Record<string, UiEvent>;

// The persona — matches the app's Profile tab for this session.
export const DEMO_PROFILE: Profile = {
  insuranceType: "health",
  forWhom: "family of 3 on a single floater",
  members: [
    { relation: "self", age: 53, gender: "male", preExistingConditions: [] },
    {
      relation: "spouse",
      age: 44,
      gender: "female",
      preExistingConditions: ["Knee surgery (past)"],
    },
    { relation: "son", age: 15, gender: "male", preExistingConditions: [] },
  ],
  city: "Bengaluru, Karnataka",
  annualBudgetInr: 35000,
  desiredCoverInr: 1000000,
  priorities: [
    "no_room_rent_trap",
    "low_or_no_copay",
    "pre_existing_cover_soon",
    "restoration_benefit",
    "day_care_cover",
  ],
  notes: [
    "Prefers a single ₹10L family floater over separate policies",
    "Spouse had knee surgery a couple of years ago — managed, no ongoing treatment",
    "Wants the surgery-related waiting period as short as possible",
    "Bengaluru is a metro zone, so premiums run a little higher here",
  ],
};

// Family-specific fit + premium for this persona (spouse's past knee surgery,
// no other pre-existing conditions), reused across the three policy tabs.
const familyPremium = (
  familyAnnualInr: number,
  perMember: [number, number, number],
  gstNote: string,
) => ({
  familyAnnualInr,
  sumInsuredInr: 1_000_000,
  gstNote,
  perMember: [
    { relation: "self", ageYears: 53, annualPremiumInr: perMember[0] },
    { relation: "spouse", ageYears: 44, annualPremiumInr: perMember[1] },
    { relation: "son", ageYears: 15, annualPremiumInr: perMember[2] },
  ],
  notes: [
    "Summed individual premiums, then floater discount where the product publishes one.",
    "Priced on Bengaluru's metro zone.",
  ],
});

// Activ One — the real fixture, with the persona-specific sections re-based onto
// this family (spouse's past knee surgery instead of the fixture's original
// father/diabetes).
const activOnePayload = fx.policyDetail.payload as PolicyDetailPayload;
const activOne: UiEvent = {
  renderAs: "policyDetail",
  payload: {
    ...activOnePayload,
    personalizedFit: {
      verdict: "strong_fit",
      bitingGotchas: [
        {
          title: "36-month wait on pre-existing conditions",
          severity: "caution",
          explanation:
            "Anything tied to the past knee surgery is covered only after 36 months — reducible to 24 or 1 month with an optional add-on.",
          whoItAffects: "spouse's knee surgery",
        },
      ],
      applicableWaitingPeriods: [
        {
          condition: "Knee surgery (past)",
          whoHasIt: "spouse",
          waitMonths: 36,
          modifiable: true,
          note: "PED wait, reducible to 24/1mo via add-on",
        },
      ],
      ridersToConsider: [
        {
          name: "Reduction in PED Waiting Period",
          whyForThisPerson: "Cuts the 36-month knee-surgery wait down to 24 or 1 month.",
        },
      ],
      notes: [],
    },
    indicativePremium: familyPremium(
      35_881,
      [15_200, 12_681, 8_000],
      "excludes GST (18% applies)",
    ),
  },
};

// Optima Restore (HDFC ERGO) — authored from this session's funnel/compare data.
const optimaRestore: UiEvent = {
  renderAs: "policyDetail",
  payload: {
    uin: "HDFHLIP25012V082425",
    productName: "Optima Restore",
    insurer: { name: "HDFC ERGO General Insurance", shortName: "HDFC ERGO" },
    sumInsured: { label: "₹3L–₹1cr" },
    eligibility: { minEntryAgeAdultYears: 18, maxEntryAgeAdultYears: null, lifelongRenewability: true },
    enrichment: {
      tagline:
        "The plan that grows cover yearly even after a claim, but leaves you with a ₹2,000 ambulance.",
      plainSummary:
        "Optima Restore restores your full sum insured the first time you claim, and a multiplier benefit grows your base cover year on year — even after claims. Room rent is at actuals with no proportionate-deduction trap, and maternity is covered. The catch: the pre-existing wait is a flat 36 months with no buy-down, and the road-ambulance benefit is capped at ₹2,000.",
      bestFor: [
        "Families who want cover that keeps growing every year, claim or no claim.",
        "Anyone who wants room rent at actuals — no category cap, no proportionate deduction.",
        "Couples who may need maternity cover down the line.",
      ],
      notFor: [
        "People needing pre-existing cover sooner — the 36-month wait can't be shortened.",
        "Buyers who care about a generous ambulance benefit (capped at ₹2,000).",
      ],
      strengths: [
        { text: "Restore Benefit refills 100% of the base sum insured the first time you claim — a bad year can't leave you uncovered." },
        { text: "Multiplier grows your base cover 50% a year up to 100%, and it doesn't reset when you claim." },
        { text: "Room rent at actuals — no category cap and no proportionate-deduction trap on the whole bill." },
        { text: "No mandatory co-pay at any age, and maternity is covered." },
      ],
      sacrifices: [
        { text: "Pre-existing disease wait is a flat 36 months with no buy-down option — the longest that still cleared our shortlist." },
        { text: "Road ambulance is capped at ₹2,000 per hospitalization." },
        { text: "Cashless pre-authorization turnaround is up to 2 hours." },
      ],
    },
    personalizedFit: {
      verdict: "fit_with_caveats",
      bitingGotchas: [
        {
          title: "36-month wait on pre-existing conditions",
          severity: "warning",
          explanation:
            "Anything linked to the past knee surgery waits a full 36 months — and unlike Activ One, this plan has no add-on to shorten it.",
          whoItAffects: "spouse's knee surgery",
        },
      ],
      applicableWaitingPeriods: [
        {
          condition: "Knee surgery (past)",
          whoHasIt: "spouse",
          waitMonths: 36,
          modifiable: false,
          note: "PED wait, not reducible on this product",
        },
      ],
      notes: [],
    },
    indicativePremium: familyPremium(
      42_853,
      [18_000, 15_353, 9_500],
      "excludes 18% GST",
    ),
    coverages: [
      { name: "In-patient hospitalization", limit: "Up to base sum insured" },
      { name: "Restore Benefit (100% refill)", limit: "Once per year" },
      { name: "Multiplier Benefit", limit: "+50%/yr up to 100%" },
      { name: "Pre & post hospitalization", limit: "60 / 180 days" },
      { name: "Day-care procedures", limit: "All listed" },
      { name: "Maternity", limit: "As per plan option" },
      { name: "Road ambulance", limit: "₹2,000 / hospitalization" },
    ],
    waitingPeriods: {
      initialDays: 30,
      pedMonths: 36,
      pedReducible: false,
      specifiedDiseaseMonths: 24,
      maternityMonths: 24,
      maternityCovered: true,
    },
    costSharing: {
      mandatoryCoPays: [],
      roomRent: { policyType: "at_actuals", roomCategory: "At actuals" },
      proportionateDeduction: { applies: false },
      subLimits: [{ appliesTo: "Road ambulance" }],
    },
  },
};

// Aspire (Niva Bupa) — authored from this session's funnel/compare data.
const aspire: UiEvent = {
  renderAs: "policyDetail",
  payload: {
    uin: "NBHHLIP26049V022526",
    productName: "Aspire",
    insurer: { name: "Niva Bupa Health Insurance", shortName: "Niva Bupa" },
    sumInsured: { label: "₹5L–₹1cr" },
    eligibility: { minEntryAgeAdultYears: 18, maxEntryAgeAdultYears: null, lifelongRenewability: true },
    enrichment: {
      tagline:
        "Bonus up to 10X SI & unlimited restoration — but maternity is a token and room upgrades sting.",
      plainSummary:
        "Aspire stacks a large no-claim bonus (up to 10× the sum insured) with unlimited restoration, and its pre-existing wait can be bought down. Great for growing cover cheaply — but the room-rent limit triggers a proportionate deduction if you upgrade, and the maternity benefit is token.",
      bestFor: [
        "Younger, healthier members who'll bank the 10× bonus over the years — a fit for the kids in a split structure.",
        "Anyone who wants the pre-existing wait shortened via an add-on.",
        "Households wanting unlimited restoration at a low premium.",
      ],
      notFor: [
        "Anyone likely to take a room above their eligible category — proportionate deduction bites the whole bill.",
        "Couples counting on meaningful maternity cover.",
      ],
      strengths: [
        { text: "No-claim bonus grows your cover up to 10× the base sum insured — the most generous on the shortlist." },
        { text: "Unlimited restoration refills the sum insured any number of times in a year." },
        { text: "Pre-existing wait is reducible via an optional add-on, and there's no mandatory co-pay." },
        { text: "Lowest indicative family premium of the three shortlisted plans." },
      ],
      sacrifices: [
        { text: "Room rent is capped by category — go above it and a proportionate deduction applies to the entire claim." },
        { text: "Maternity cover is a token amount, not a real benefit." },
        { text: "The big bonus only pays off if you stay claim-free for several years." },
      ],
    },
    personalizedFit: {
      verdict: "fit_with_caveats",
      bitingGotchas: [
        {
          title: "Proportionate deduction on room rent",
          severity: "warning",
          explanation:
            "If anyone takes a room above the eligible category, the deduction applies to the whole bill — not just the room charge.",
          whoItAffects: "the whole family",
        },
        {
          title: "36-month wait on pre-existing conditions",
          severity: "caution",
          explanation:
            "The past knee surgery waits 36 months, but here it's reducible with an add-on.",
          whoItAffects: "spouse's knee surgery",
        },
      ],
      applicableWaitingPeriods: [
        {
          condition: "Knee surgery (past)",
          whoHasIt: "spouse",
          waitMonths: 36,
          modifiable: true,
          note: "PED wait, reducible via add-on",
        },
      ],
      notes: [],
    },
    indicativePremium: familyPremium(
      33_988,
      [14_300, 11_988, 7_700],
      "excludes 18% GST",
    ),
    coverages: [
      { name: "In-patient hospitalization", limit: "Up to base sum insured" },
      { name: "Unlimited restoration", limit: "Any number of times/yr" },
      { name: "No-claim bonus", limit: "Up to 10× sum insured" },
      { name: "Pre & post hospitalization", limit: "60 / 180 days" },
      { name: "Day-care procedures", limit: "All listed" },
      { name: "Maternity", limit: "Token benefit" },
    ],
    waitingPeriods: {
      initialDays: 30,
      pedMonths: 36,
      pedReducible: true,
      pedReductionOptionsMonths: [24, 12],
      specifiedDiseaseMonths: 24,
      maternityCovered: true,
      maternityMonths: 36,
    },
    costSharing: {
      mandatoryCoPays: [],
      roomRent: { policyType: "room_category", roomCategory: "Single Private Room" },
      proportionateDeduction: { applies: true, appliesTo: "the entire claim" },
      subLimits: [{ appliesTo: "Maternity" }],
    },
  },
};

// The Premiums fixture is priced for the fixture's original persona
// (self/spouse/father); re-base its member references onto this family of 3 so
// the quote rows and header read consistently with the Profile tab.
const PREMIUM_SPLIT: Record<string, [number, number, number]> = {
  "Activ One": [15_200, 12_681, 8_000],
  "Optima Restore": [18_000, 15_353, 9_500],
};
const premiumBase = fx.premiumExplorer.payload as PremiumExplorerPayload;
const premiumExplorer: UiEvent = {
  renderAs: "premiumExplorer",
  payload: {
    ...premiumBase,
    referenceMembers: [
      { relation: "self", ageYears: 53 },
      { relation: "spouse", ageYears: 44 },
      { relation: "son", ageYears: 15 },
    ],
    policies: (premiumBase.policies ?? []).map((p) => {
      const split = p.productName ? PREMIUM_SPLIT[p.productName] : undefined;
      if (!split || !p.familyQuote) return p;
      return {
        ...p,
        familyQuote: {
          ...p.familyQuote,
          perMember: [
            { relation: "self", ageYears: 53, annualPremiumInr: split[0] },
            { relation: "spouse", ageYears: 44, annualPremiumInr: split[1] },
            { relation: "son", ageYears: 15, annualPremiumInr: split[2] },
          ],
        },
      };
    }),
  },
};

// The event stream the tab bar derives from. Order sets tab order:
// Shortlist · Activ One · Optima Restore · Aspire · Compare · Premiums.
export const PANEL_EVENTS: UiEvent[] = [
  fx.funnel,
  activOne,
  optimaRestore,
  aspire,
  fx.compare,
  premiumExplorer,
];
