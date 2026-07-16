"use client";

import { Check, FileText } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CoveyButton } from "./covey-button";

/* ------------------------------------------------------------------ *
 * WHY COVEY EXISTS — one continuous pinned scene, two movements.
 *
 *  Movement one (horizontal): four beats slide sideways —
 *    the pitch → what it skips → the hospital → the policy document.
 *  The last beat lands on the document itself.
 *
 *  Movement two (vertical): the same document scales up into a PDF
 *  viewer and the scroll travels DOWN the document. Covey cursors
 *  (multiplayer style) fly in one after another, border-highlighting
 *  clause after clause — by the end five cursors sit pinned across
 *  the pages. Outro: "Know what you're buying. Before you buy it."
 * ------------------------------------------------------------------ */

const SEG = 560; // scroll px per phase unit
const MAX_PHASE = 12.4;

// Phase map:
//  0–1     intro headline
//  1–4.5   beats 1–3 slide horizontally (centers at 1.5 / 2.5 / 3.5)
//  4.5–5.2 beat 4: the document arrives (small) + its caption
//  5.2–6.2 handoff: caption swaps, bg goes PDF-gray, document scales up
//  6.3–11  five cursor stops (centers at 7 / 8 / 9 / 10 / 11)
//  11.2+   outro
const STOP_PHASES = [7, 8, 9, 10, 11];
const FOCUS_Y = 280; // px from viewport top where an active clause settles

const clamp = (v: number, a = 0, b = 1) => Math.min(Math.max(v, a), b);
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/* ================================================================== *
 * Shared card chrome — every visual in the story uses the same shell
 * ================================================================== */

const CARD =
  "rounded-[18px] border border-[#e2e6e3] bg-white shadow-[0_32px_80px_-48px_rgba(10,40,28,0.35)]";

/* ================================================================== *
 * Beat 1 — the pitch. An advisor chat: benefits only.
 * ================================================================== */

const PITCH_POINTS = [
  "₹5 lakh cover for the whole family",
  "Cashless at 10,000+ hospitals",
  "Tax benefit under 80D",
];

function PitchCard() {
  return (
    <div className={`${CARD} w-[400px] overflow-hidden`}>
      <div className="flex items-center gap-3 border-b border-[#eceeed] px-5 py-4">
        <span className="grid size-10 place-items-center rounded-full bg-green-2 text-[14px] font-semibold text-green-9">
          RS
        </span>
        <div>
          <p className="text-[14px] font-semibold text-[#16211b]">
            Rahul · Insurance Advisor
          </p>
          <p className="flex items-center gap-1.5 text-[11px] text-[#7b857f]">
            <span className="size-1.5 rounded-full bg-[#34a853]" /> online
          </p>
        </div>
      </div>
      <div className="space-y-3 px-5 py-5">
        <div className="w-fit max-w-[300px] rounded-[14px] rounded-tl-[4px] bg-[#f2f4f3] px-4 py-3 text-[14px] leading-[1.5] text-[#232d27]">
          Sir, this is the best plan for your family. Everything is covered.
        </div>
        <div className="w-fit max-w-[320px] rounded-[14px] rounded-tl-[4px] bg-[#f2f4f3] px-4 py-3.5">
          {PITCH_POINTS.map((point) => (
            <p
              key={point}
              className="flex items-center gap-2.5 py-1 text-[13.5px] font-medium text-[#232d27]"
            >
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-green-9 text-white">
                <Check className="size-3" />
              </span>
              {point}
            </p>
          ))}
        </div>
        <div className="w-fit rounded-[14px] rounded-tl-[4px] bg-[#f2f4f3] px-4 py-3 text-[14px] text-[#232d27]">
          Shall I book it? 🙂
        </div>
      </div>
    </div>
  );
}

/* ================================================================== *
 * Beat 2 — what the pitch skips. The same chat, with the policy
 * behind it: three clauses that exist in the document, absent
 * from the conversation.
 * ================================================================== */

const SKIPPED = [
  ["4.2", "Room rent capped at 1% of cover per day"],
  ["6.1", "36-month wait for existing illnesses"],
  ["9.3", "10% co-payment on every claim"],
];

function SkippedScene() {
  return (
    <div className="relative h-[500px] w-[660px]">
      <div className="absolute top-[42px] left-0 origin-top-left scale-[0.82] opacity-85">
        <PitchCard />
      </div>
      <div className={`${CARD} absolute top-[86px] right-0 w-[350px] p-6`}>
        <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.08em] text-[#79847d] uppercase">
          <FileText className="size-3.5" /> In the policy · never in the pitch
        </p>
        <div className="mt-4 space-y-3">
          {SKIPPED.map(([clause, text]) => (
            <div
              key={clause}
              className="rounded-[10px] border border-[#f0dcc0] bg-[#fdf8ef] px-4 py-3"
            >
              <p className="text-[10px] font-semibold tracking-[0.06em] text-[#a2731f] uppercase">
                Clause {clause}
              </p>
              <p className="mt-1 text-[13.5px] leading-[1.45] font-medium text-[#4a4438]">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================================================== *
 * Beat 3 — the hospital. A claim settlement advice, short by ₹90,000.
 * ================================================================== */

function ClaimCard() {
  return (
    <div className={`${CARD} w-[420px] overflow-hidden`}>
      <div className="border-b border-[#eceeed] bg-[#fafbfa] px-6 py-4">
        <p className="text-[11px] font-semibold tracking-[0.09em] text-[#79847d] uppercase">
          Claim settlement advice
        </p>
        <p className="mt-1 text-[15px] font-semibold text-[#16211b]">
          City Care Hospital · Cashless request
        </p>
      </div>
      <div className="px-6 py-5">
        <div className="flex items-baseline justify-between py-2">
          <span className="text-[13.5px] text-[#5d6862]">Amount claimed</span>
          <span className="text-[17px] font-semibold text-[#16211b]">
            ₹2,80,000
          </span>
        </div>
        <div className="flex items-baseline justify-between border-t border-[#eef0ef] py-2">
          <span className="text-[13.5px] text-[#5d6862]">Amount approved</span>
          <span className="text-[17px] font-semibold text-[#16211b]">
            ₹1,90,000
          </span>
        </div>
        <div className="mt-3 rounded-[10px] border border-[#f2d1cc] bg-[#fdf3f2] px-4 py-3.5">
          <div className="flex items-baseline justify-between">
            <span className="text-[12px] font-semibold text-[#9c2f23]">
              Deduction
            </span>
            <span className="text-[15px] font-semibold text-[#9c2f23]">
              – ₹90,000
            </span>
          </div>
          <p className="mt-1 text-[12.5px] leading-[1.5] text-[#7a4a43]">
            Room rent limit exceeded — proportionate deduction as per{" "}
            <span className="font-semibold">Clause 4.2</span> of policy wording.
          </p>
        </div>
        <p className="mt-4 text-[12.5px] text-[#79847f]">
          Balance payable by patient at discharge:{" "}
          <span className="font-semibold text-[#16211b]">₹90,000</span>
        </p>
      </div>
    </div>
  );
}

/* ================================================================== *
 * The document — a real digital PDF. Serif body, justified legalese,
 * page furniture, footer folios. Rendered once; movement one shows it
 * small (the last beat), movement two scrolls through it.
 * ================================================================== */

const SERIF: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
};

const FILLER = [
  "The Company shall indemnify the Insured Person for Medical Expenses incurred for Hospitalisation during the Policy Period, up to the Sum Insured specified in the Policy Schedule, provided that such Hospitalisation is Medically Necessary and follows the written advice of a Medical Practitioner.",
  "All claims under this Policy shall be subject to the terms, conditions, limitations and exclusions contained herein or endorsed hereon, and to the due observance and fulfilment by the Insured Person of the obligations set out in this Policy Wording.",
  "Words and expressions used but not defined in this Policy shall have the meanings assigned to them under the Insurance Act, 1938, the IRDAI (Health Insurance) Regulations, or as commonly understood in the ordinary course of health insurance business in India.",
  "Any payment made under this Section shall reduce the Sum Insured for the remainder of the Policy Year, and the Company's total liability shall not exceed the Sum Insured plus accrued Cumulative Bonus, if any, as stated in the Policy Schedule.",
];

function Para({ index, width = 100 }: { index: number; width?: number }) {
  return (
    <p
      className="text-justify text-[10.5px] leading-[1.75] text-[#454e49]"
      style={{ ...SERIF, width: `${width}%` }}
    >
      {FILLER[index % FILLER.length]}
    </p>
  );
}

type ClauseSpec = {
  page: number;
  section: string;
  heading: string;
  wording: string;
  cursor: string;
  color: string;
  note: string;
  good?: boolean;
};

const CLAUSES: ClauseSpec[] = [
  {
    page: 4,
    section: "4.2",
    heading: "Room Rent, Boarding and Nursing Expenses",
    wording:
      "Expenses towards room rent, boarding and nursing shall be payable up to 1% of the Sum Insured per day. Where the Insured Person occupies a room with rent exceeding this limit, the Company shall apply a proportionate deduction to all associated Medical Expenses, including but not limited to surgeon's fees, anaesthetist's fees, operation theatre charges and diagnostics.",
    cursor: "Covey · Limits",
    color: "#1d4ed8",
    note: "Your room is capped at ₹5,000/day. Go over it, and every bill on the claim shrinks — not just the room.",
  },
  {
    page: 9,
    section: "6.1",
    heading: "Waiting Period — Pre-Existing Diseases",
    wording:
      "Expenses related to the treatment of a Pre-Existing Disease and its direct complications shall be excluded until the expiry of 36 (thirty-six) months of continuous coverage after the date of inception of the first Policy with the Company.",
    cursor: "Covey · Waiting",
    color: "#b45309",
    note: "Existing illnesses: not covered for 3 years. Anything you already have waits until then.",
  },
  {
    page: 14,
    section: "7.4",
    heading: "Sub-Limits on Specified Procedures",
    wording:
      "Notwithstanding the Sum Insured, the Company's liability in respect of the procedures listed hereunder shall not exceed: (a) Cataract surgery — ₹40,000 per eye; (b) Total knee replacement — ₹1,50,000 per knee; (c) Cardiac procedures — ₹2,50,000 per Policy Year.",
    cursor: "Covey · Sub-limits",
    color: "#7c3aed",
    note: "Cataract, knees, cardiac — each capped separately, no matter how big your cover is.",
  },
  {
    page: 21,
    section: "9.3",
    heading: "Co-Payment",
    wording:
      "Each and every claim under this Policy shall be subject to a Co-Payment of 10% applicable to the admissible claim amount. The Co-Payment shall be borne by the Insured Person and shall not reduce the Sum Insured.",
    cursor: "Covey · Co-pay",
    color: "#be185d",
    note: "You pay 10% of every claim from your own pocket. Always.",
  },
  {
    page: 33,
    section: "12.1",
    heading: "Restoration of Sum Insured",
    wording:
      "If the Sum Insured and accrued Cumulative Bonus are exhausted due to claims paid during the Policy Year, the Company shall restore 100% of the Sum Insured once in that Policy Year for subsequent claims, provided such claims are unrelated to the illness for which earlier claims were paid.",
    cursor: "Covey · Benefits",
    color: "#0a5136",
    note: "This one's good — your cover refills once a year if you use it up. Worth having.",
    good: true,
  },
];

function CoveyCursor({
  label,
  color,
  active,
}: {
  label: string;
  color: string;
  active: number;
}) {
  return (
    <div
      className="absolute -top-4 -right-3 z-20 flex items-start"
      style={{
        opacity: active,
        transform: `translate(${(1 - active) * 46}px, ${(1 - active) * 38}px)`,
      }}
    >
      <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden>
        <path
          d="M4.5 2.8 20.6 10 13.4 12.2 10.2 19z"
          fill={color}
          stroke="#fff"
          strokeWidth="1.4"
        />
      </svg>
      <span
        className="mt-2.5 -ml-0.5 rounded-full px-2.5 py-1 text-[11px] leading-none font-semibold whitespace-nowrap text-white shadow-sm"
        style={{ backgroundColor: color }}
      >
        {label}
      </span>
    </div>
  );
}

function ClauseBlock({
  clause,
  active,
  blockRef,
}: {
  clause: ClauseSpec;
  active: number;
  blockRef: (node: HTMLDivElement | null) => void;
}) {
  return (
    <div ref={blockRef} className="relative my-5">
      {/* the highlight border Covey draws */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-3.5 -inset-y-3 rounded-[10px] border-2"
        style={{
          borderColor: clause.color,
          backgroundColor: `${clause.color}0d`,
          opacity: active,
          transform: `scale(${1.04 - active * 0.04})`,
        }}
      />
      <CoveyCursor label={clause.cursor} color={clause.color} active={active} />

      <p className="text-[11px] font-bold text-[#1d2621]" style={SERIF}>
        {clause.section} {clause.heading}
      </p>
      <p
        className="mt-1.5 text-justify text-[10.5px] leading-[1.75] text-[#454e49]"
        style={SERIF}
      >
        {clause.wording}
      </p>

      {/* Covey's margin note */}
      <div
        className="absolute top-0 left-[calc(100%+44px)] hidden w-[290px] lg:block"
        style={{
          opacity: active,
          transform: `translateX(${(1 - active) * 14}px)`,
        }}
      >
        <div
          className="rounded-[12px] border border-[#e2e6e3] bg-white p-4 shadow-[0_20px_50px_-30px_rgba(10,40,28,0.4)]"
          style={{ borderLeft: `3px solid ${clause.color}` }}
        >
          <p
            className="text-[10px] font-semibold tracking-[0.08em] uppercase"
            style={{ color: clause.color }}
          >
            {clause.good ? "Covey found — keep this" : "Covey found"}
          </p>
          <p className="mt-1.5 text-[13.5px] leading-[1.5] text-[#232d27]">
            {clause.note}
          </p>
        </div>
      </div>
    </div>
  );
}

function Sheet({
  page,
  children,
}: {
  page: number;
  children: React.ReactNode;
}) {
  return (
    <div className="relative rounded-[4px] border border-[#dfe2e0] bg-white px-14 pt-11 pb-9 shadow-[0_18px_44px_-26px_rgba(20,30,25,0.3)]">
      <div className="mb-7 flex items-baseline justify-between border-b border-[#e8eae8] pb-3">
        <p
          className="text-[9.5px] tracking-[0.14em] text-[#8a938d] uppercase"
          style={SERIF}
        >
          HealthShield Plus — Policy Wording
        </p>
        <p className="text-[9px] text-[#a0a8a3]" style={SERIF}>
          UIN: HSHLIP24101V012324
        </p>
      </div>
      <div className="min-h-[660px] space-y-4">{children}</div>
      <p
        className="mt-8 text-center text-[9.5px] text-[#a0a8a3]"
        style={SERIF}
      >
        Page {page} of 48
      </p>
    </div>
  );
}

function PolicyDocument({
  activations,
  clauseRef,
}: {
  activations: number[];
  clauseRef: (index: number) => (node: HTMLDivElement | null) => void;
}) {
  return (
    <div className="w-[620px] space-y-7">
      {/* Cover sheet — what beat 4 lands on */}
      <div className="relative flex h-[780px] flex-col items-center justify-center rounded-[4px] border border-[#dfe2e0] bg-white px-14 text-center shadow-[0_18px_44px_-26px_rgba(20,30,25,0.3)]">
        <p
          className="text-[10px] tracking-[0.28em] text-[#8a938d] uppercase"
          style={SERIF}
        >
          HealthShield General Insurance Co. Ltd.
        </p>
        <h4
          className="mt-8 text-[34px] leading-[1.15] font-normal text-[#1d2621]"
          style={SERIF}
        >
          HealthShield Plus
        </h4>
        <p className="mt-2 text-[16px] text-[#5d6862]" style={SERIF}>
          Policy Wording &amp; Terms
        </p>
        <div className="mt-10 h-px w-24 bg-[#d8dcd9]" />
        <p className="mt-10 text-[11px] leading-[2] text-[#8a938d]" style={SERIF}>
          UIN: HSHLIP24101V012324
          <br />
          48 pages · Please read carefully before purchase
        </p>
      </div>

      {CLAUSES.map((clause, index) => (
        <Sheet key={clause.section} page={clause.page}>
          <Para index={index} />
          <Para index={index + 1} width={94} />
          <ClauseBlock
            clause={clause}
            active={activations[index]}
            blockRef={clauseRef(index)}
          />
          <Para index={index + 2} />
          <Para index={index + 3} width={88} />
        </Sheet>
      ))}
    </div>
  );
}

/* ================================================================== *
 * Copy
 * ================================================================== */

const BEATS = [
  { line: "The advisor tells you what's covered.", visual: <PitchCard /> },
  { line: "Not what isn't.", visual: <SkippedScene /> },
  { line: "You find out at the hospital.", visual: <ClaimCard /> },
];

const BEAT4_LINE = "It was all in the policy. Nobody read it to you.";

/* ================================================================== *
 * The pinned scene
 * ================================================================== */

function Scene({ phase }: { phase: number }) {
  const docRef = useRef<HTMLDivElement>(null);
  const clauseNodes = useRef<(HTMLDivElement | null)[]>([]);
  const [stopY, setStopY] = useState<number[]>([]);

  // Measure where each clause sits inside the document (offsetTop chain —
  // immune to the transforms we apply while animating).
  useEffect(() => {
    const measure = () => {
      const doc = docRef.current;
      if (!doc) return;
      setStopY(
        clauseNodes.current.map((node) => {
          let y = 0;
          let el: HTMLElement | null = node;
          while (el && el !== doc) {
            y += el.offsetTop;
            el = el.offsetParent as HTMLElement | null;
          }
          return y;
        }),
      );
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // ---- movement one: horizontal beats -----------------------------
  const introOpacity = 1 - smoothstep(0.35, 0.95, phase);

  // ---- handoff -----------------------------------------------------
  const grow = smoothstep(5.2, 6.2, phase); // document scales up
  const pdfBg = smoothstep(5.4, 6.4, phase) - smoothstep(11.4, 12.1, phase);

  // ---- movement two: travel down the document ----------------------
  // Anchors: (phase, docY). Smoothstep between anchors = dwell at stops.
  let docShift = 0;
  if (stopY.length === CLAUSES.length) {
    const anchors: [number, number][] = [
      [6.3, 0],
      ...STOP_PHASES.map(
        (p, i) => [p, Math.max(stopY[i] - FOCUS_Y, 0)] as [number, number],
      ),
    ];
    docShift = anchors[anchors.length - 1][1];
    for (let i = 0; i < anchors.length - 1; i++) {
      if (phase <= anchors[i + 1][0]) {
        const [pa, ya] = anchors[i];
        const [pb, yb] = anchors[i + 1];
        docShift = ya + (yb - ya) * smoothstep(pa, pb, phase);
        break;
      }
    }
    if (phase < anchors[0][0]) docShift = 0;
  }

  const activations = CLAUSES.map((_, i) =>
    smoothstep(STOP_PHASES[i] - 0.55, STOP_PHASES[i] - 0.12, phase),
  );

  // Document container: slides in as the 4th beat, then scales to full.
  const docRel = Math.min(phase - 4.5, 0); // <0 while arriving
  const docX = Math.max(docRel, -1.5) * -88;
  const docScale = 0.52 + 0.48 * grow;
  const docOpacity = clamp(1 + docRel / 0.7) * (1 - smoothstep(11.5, 12.2, phase));

  // Current folio for the viewer chrome.
  const stopIndex = STOP_PHASES.findLastIndex((p) => phase >= p - 0.3);
  const folio = stopIndex >= 0 ? CLAUSES[stopIndex].page : 1;

  // Bottom caption: one line at a time.
  const beat4CaptionOpacity =
    smoothstep(4.6, 4.95, phase) - smoothstep(5.15, 5.55, phase);
  const meetCoveyOpacity =
    smoothstep(5.6, 5.95, phase) - smoothstep(6.35, 6.8, phase);
  const outroOpacity = smoothstep(11.5, 12.1, phase);

  return (
    <div className="relative h-[100svh] min-h-[640px] overflow-hidden bg-white">
      {/* PDF-viewer canvas tint for movement two */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[#eef0ef]"
        style={{ opacity: pdfBg }}
      />

      {/* Intro */}
      <div
        className="absolute inset-0 z-40 flex flex-col items-center justify-center px-6 text-center"
        style={{
          opacity: introOpacity,
          transform: `translateY(${phase * -40}px)`,
          pointerEvents: "none",
        }}
        aria-hidden={introOpacity < 0.5}
      >
        <p className="text-[11px] font-semibold tracking-[0.16em] text-green-9 uppercase sm:text-[13px]">
          Why Covey exists
        </p>
        <h2 className="mt-5 max-w-[980px] text-[clamp(44px,5.8vw,78px)] leading-[1] font-medium tracking-[-0.05em] text-[#111513]">
          Here&rsquo;s how insurance is sold today.
        </h2>
      </div>

      {/* Beats 1–3, sliding horizontally */}
      {BEATS.map((beat, index) => {
        const center = index + 1.5;
        const rel = phase - center;
        const opacity = clamp(1 - Math.abs(rel) / 0.62);
        if (opacity === 0) return null;
        return (
          <div key={beat.line} aria-hidden={opacity < 0.5}>
            <div
              className="pointer-events-none absolute top-[8vh] bottom-[26vh] left-1/2 z-10 flex items-center justify-center"
              style={{
                transform: `translateX(calc(-50% + ${rel * -88}vw)) scale(${1 - Math.abs(rel) * 0.06})`,
                opacity,
              }}
            >
              <div className="origin-center scale-[0.62] sm:scale-[0.78] md:scale-[0.9] lg:scale-100">
                {beat.visual}
              </div>
            </div>
            <div
              className="pointer-events-none absolute inset-x-5 bottom-[clamp(44px,8vh,84px)] z-30 text-center"
              style={{
                opacity: clamp(1 - Math.abs(rel) / 0.42),
                transform: `translateX(${rel * -60}px)`,
              }}
            >
              <h3 className="mx-auto max-w-[860px] text-[clamp(28px,3.4vw,48px)] leading-[1.08] font-medium tracking-[-0.04em] text-[#111513]">
                {beat.line}
              </h3>
            </div>
          </div>
        );
      })}

      {/* The document — beat 4, then the whole of movement two */}
      <div
        className="absolute top-[64px] left-1/2 z-20"
        style={{
          transform: `translateX(calc(-50% + ${docX}vw))`,
          opacity: docOpacity,
        }}
        aria-hidden={docOpacity < 0.5}
      >
        <div
          className="origin-top"
          style={{
            transform: `scale(${docScale}) translateY(${-docShift + (1 - grow) * 30}px)`,
          }}
        >
          <div ref={docRef} className="relative">
            <PolicyDocument
              activations={activations}
              clauseRef={(index) => (node) => {
                clauseNodes.current[index] = node;
              }}
            />
          </div>
        </div>
      </div>

      {/* PDF viewer chrome */}
      <div
        className="absolute top-[18px] left-1/2 z-30 flex w-[620px] max-w-[calc(100vw-40px)] -translate-x-1/2 items-center justify-between rounded-[10px] border border-[#dfe2e0] bg-white/95 px-4 py-2.5 shadow-sm backdrop-blur"
        style={{ opacity: pdfBg }}
        aria-hidden={pdfBg < 0.5}
      >
        <p className="flex items-center gap-2 text-[12px] font-medium text-[#3c4640]">
          <FileText className="size-3.5 text-[#79847d]" />
          HealthShield-Plus-Policy-Wording.pdf
        </p>
        <p className="text-[12px] tabular-nums text-[#79847d]">
          Page {folio} / 48
        </p>
      </div>

      {/* Scrim so the handoff captions stay legible over the document */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[260px] bg-gradient-to-t from-white via-white/90 to-transparent"
        style={{ opacity: Math.max(beat4CaptionOpacity, meetCoveyOpacity) }}
      />

      {/* Bottom captions: beat 4 → meet Covey → (outro is full-screen) */}
      <div className="pointer-events-none absolute inset-x-5 bottom-[clamp(40px,7vh,72px)] z-30 text-center">
        <h3
          className="mx-auto max-w-[820px] text-[clamp(26px,3.2vw,44px)] leading-[1.1] font-medium tracking-[-0.04em] text-[#111513]"
          style={{ opacity: beat4CaptionOpacity }}
          aria-hidden={beat4CaptionOpacity < 0.5}
        >
          {BEAT4_LINE}
        </h3>
        <div
          className="absolute inset-x-0 bottom-0"
          style={{ opacity: meetCoveyOpacity }}
          aria-hidden={meetCoveyOpacity < 0.5}
        >
          <p className="text-[11px] font-semibold tracking-[0.15em] text-green-9 uppercase">
            Meet Covey
          </p>
          <h3 className="mt-2 text-[clamp(26px,3.2vw,44px)] leading-[1.1] font-medium tracking-[-0.04em] text-[#111513]">
            Covey reads it. All of it.
          </h3>
        </div>
      </div>

      {/* Outro */}
      <div
        className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-white/88 px-6 text-center backdrop-blur-[6px]"
        style={{
          opacity: outroOpacity,
          pointerEvents: outroOpacity > 0.6 ? "auto" : "none",
        }}
        aria-hidden={outroOpacity < 0.5}
      >
        <h2 className="max-w-[900px] text-[clamp(38px,4.8vw,68px)] leading-[1.02] font-medium tracking-[-0.05em] text-[#111513]">
          Know what you&rsquo;re buying.
          <br />
          <span className="text-green-9">Before you buy it.</span>
        </h2>
        <div className="mt-9">
          <CoveyButton>Ask Covey about any policy</CoveyButton>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== *
 * Reduced-motion fallback — the same story, stacked and static.
 * ================================================================== */

function StaticStory() {
  return (
    <div className="hidden motion-reduce:block">
      <div className="px-5 py-20 text-center">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-green-9 uppercase">
          Why Covey exists
        </p>
        <h2 className="mx-auto mt-5 max-w-[900px] text-[clamp(40px,5.5vw,68px)] leading-[1] font-medium tracking-[-0.05em] text-[#111513]">
          Here&rsquo;s how insurance is sold today.
        </h2>
      </div>
      <div className="space-y-20 px-5 pb-16">
        {[...BEATS, { line: BEAT4_LINE, visual: null }].map((beat) => (
          <article key={beat.line} className="mx-auto max-w-[860px] text-center">
            {beat.visual && (
              <div className="flex items-center justify-center overflow-hidden rounded-[24px] border border-[#e0e5e2] bg-[#fafbfa] py-14">
                <div className="origin-center scale-[0.62] sm:scale-[0.8]">
                  {beat.visual}
                </div>
              </div>
            )}
            <h3 className="mt-8 text-[clamp(26px,3.4vw,42px)] leading-[1.1] font-medium tracking-[-0.04em] text-[#111513]">
              {beat.line}
            </h3>
          </article>
        ))}
        <div className="mx-auto max-w-[860px] text-center">
          <p className="text-[11px] font-semibold tracking-[0.15em] text-green-9 uppercase">
            Meet Covey
          </p>
          <h3 className="mt-3 text-[clamp(26px,3.4vw,42px)] font-medium tracking-[-0.04em] text-[#111513]">
            Covey reads it. All of it.
          </h3>
          <div className="mt-10 flex justify-center rounded-[24px] border border-[#e0e5e2] bg-[#eef0ef] py-14">
            <div className="origin-top scale-[0.55] sm:scale-[0.8]">
              <PolicyDocument
                activations={CLAUSES.map(() => 1)}
                clauseRef={() => () => {}}
              />
            </div>
          </div>
          <h3 className="mt-12 text-[clamp(26px,3.4vw,42px)] font-medium tracking-[-0.04em] text-[#111513]">
            Know what you&rsquo;re buying.{" "}
            <span className="text-green-9">Before you buy it.</span>
          </h3>
          <div className="mt-8 flex justify-center">
            <CoveyButton>Ask Covey about any policy</CoveyButton>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== *
 * Export — scroll plumbing identical to the rest of the site.
 * ================================================================== */

export function WhyCovey() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const update = () => {
      frame = 0;
      if (reducedMotion.matches) {
        setPhase(0);
        return;
      }
      const distance = Math.max(track.offsetHeight - window.innerHeight, 1);
      const value = clamp(-track.getBoundingClientRect().top / distance);
      setPhase(value * MAX_PHASE);
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reducedMotion.addEventListener("change", schedule);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reducedMotion.removeEventListener("change", schedule);
    };
  }, []);

  return (
    <section className="-mb-px w-full border border-rule bg-white">
      <div
        ref={trackRef}
        className="relative w-full motion-reduce:hidden"
        style={{ height: `calc(100svh + ${Math.round(SEG * MAX_PHASE)}px)` }}
      >
        <div className="sticky top-0">
          <Scene phase={phase} />
        </div>
      </div>
      <StaticStory />
    </section>
  );
}
