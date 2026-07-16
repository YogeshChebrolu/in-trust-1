"use client";

// The profile ("persona") content — the pinned first tab of the artifact
// panel. Landing-page variant of the product's ProfileView: the live app reads
// this from Convex; here it takes a static profile prop and reveals section by
// section as the scripted chat plays.

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  ArrowDownIcon,
  CheckIcon,
  HeartIcon,
  MapPinIcon,
  NotesIcon,
  ShieldCheckIcon,
  TargetIcon,
  TobaccoIcon,
  UsersIcon,
  WalletIcon,
  type StreamlineIcon,
} from "./streamline-icons";

export interface ProfileMember {
  relation?: string;
  age?: number;
  gender?: string;
  preExistingConditions?: string[];
  smokerOrTobacco?: boolean;
}

export interface Profile {
  insuranceType?: "health" | "life" | "unsure";
  forWhom?: string;
  members?: ProfileMember[];
  city?: string;
  annualBudgetInr?: number;
  desiredCoverInr?: number;
  priorities?: string[];
  notes?: string[];
}

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

// Big sums read best in Indian shorthand: ₹25,00,000 → ₹25L, ₹1,00,00,000 → ₹1Cr.
const inrCompact = (n: number) => {
  if (n >= 1_00_00_000) {
    const cr = n / 1_00_00_000;
    return `₹${Number.isInteger(cr) ? cr : cr.toFixed(1)}Cr`;
  }
  if (n >= 1_00_000) {
    const l = n / 1_00_000;
    return `₹${Number.isInteger(l) ? l : l.toFixed(1)}L`;
  }
  return inr(n);
};

// The agent sometimes stores machine slugs ("pre_existing_cover_soon") —
// never show an underscore to the user.
const humanize = (s: string) => {
  const t = s
    .replace(/_/g, " ")
    .trim()
    // domain terms that read wrong without their hyphen
    .replace(/\bpre existing\b/gi, "pre-existing")
    .replace(/\bco pay\b/gi, "co-pay")
    .replace(/\bcopay\b/gi, "co-pay");
  return t.charAt(0).toUpperCase() + t.slice(1);
};

const TYPE_LABEL: Record<NonNullable<Profile["insuranceType"]>, string> = {
  health: "Health cover",
  life: "Life cover",
  unsure: "Still deciding",
};

function memberName(relation?: string) {
  if (!relation) return "Person";
  const r = relation.toLowerCase();
  if (["self", "me", "myself", "i"].includes(r)) return "You";
  return humanize(relation);
}

const NOTES_PREVIEW = 4;

// ─── Notes cleanup + grouping ───
// The agent writes notes in third-person telemetry voice ("User has chosen…",
// "User aware of…"). For display: drop the boilerplate prefix, then bucket by
// what the note IS — a decision made, advice given, or a plain detail.
// Heuristic on free text, so anything unmatched falls into "Details".

const cleanNote = (s: string) => {
  const t = s
    .trim()
    .replace(/^user (has been |has |is |was |'s )?/i, "")
    .replace(/^been /i, "")
    .replace(/\.$/, "")
    .trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
};

const NOTE_BUCKETS: { label: string; re: RegExp }[] = [
  {
    label: "Decisions",
    re: /^(chosen|chose|decided|considering|comparing|compared|picked|selected|prefers?)\b/i,
  },
  {
    label: "Briefed on",
    re: /^(aware|advised|briefed|informed|understands?|knows|told|explained)\b/i,
  },
];

function groupNotes(notes: string[]) {
  const groups = new Map<string, string[]>();
  for (const raw of notes) {
    const note = cleanNote(raw);
    const bucket =
      NOTE_BUCKETS.find((b) => b.re.test(note))?.label ?? "Details";
    (groups.get(bucket) ?? groups.set(bucket, []).get(bucket)!).push(note);
  }
  // Stable display order: decisions first, advice second, everything else last.
  const order = ["Decisions", "Briefed on", "Details"];
  return order
    .filter((l) => groups.has(l))
    .map((l) => ({ label: l, items: groups.get(l)! }));
}

export function ProfileTab({
  profile: p,
  progress = 1,
}: {
  profile: Profile;
  /** 0..1 — how far the chat has played; sections reveal in step with it. */
  progress?: number;
}) {
  const [allNotes, setAllNotes] = useState(false);

  // Each section appears once the conversation has surfaced it.
  const show = {
    lookingFor: progress >= 0.06,
    whoCovered: progress >= 0.24,
    cityBudget: progress >= 0.56,
    priorities: progress >= 0.66,
    notes: progress >= 0.82,
  };

  if (!show.lookingFor) {
    return (
      <div>
        <Header />
        <p className="text-text-muted text-xs leading-relaxed">
          Nothing noted yet. As we talk, I&apos;ll quietly keep track of who
          you&apos;re insuring, ages, any health conditions, your budget and what
          matters to you — and it&apos;ll show up here.
        </p>
      </div>
    );
  }

  const notes = p.notes ?? [];

  return (
    <div>
      <Header />
      <div className="flex flex-col gap-5">
        {/* Quick facts — context on one line, not sections. */}
        {(p.insuranceType || (show.cityBudget && p.city)) && (
          <div className="flex flex-wrap gap-1.5">
            {p.insuranceType && (
              <FactPill Icon={HeartIcon}>{TYPE_LABEL[p.insuranceType]}</FactPill>
            )}
            {show.cityBudget && p.city && (
              <FactPill Icon={MapPinIcon}>{p.city}</FactPill>
            )}
          </div>
        )}

        {/* Who's covered — a divided member list; conditions carry the accent. */}
        {show.whoCovered && (p.forWhom || p.members?.length) ? (
          <section>
            <SectionLabel Icon={UsersIcon}>Who&apos;s covered</SectionLabel>
            {p.forWhom && !p.members?.length ? (
              <p className="text-text-dark text-sm">{humanize(p.forWhom)}</p>
            ) : null}
            {p.members?.length ? (
              <ul className="border-border-light divide-border-light divide-y rounded-lg border">
                {p.members.map((m, i) => (
                  <li key={i} className="flex items-start gap-2.5 px-3 py-2.5">
                    <span className="bg-primary-50 text-primary-800 mt-0.5 grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold">
                      {memberName(m.relation).charAt(0)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-text-dark text-sm font-medium">
                        {memberName(m.relation)}
                        {typeof m.age === "number" && (
                          <span className="text-text-muted font-normal">
                            {" "}
                            · {m.age}
                            {m.gender ? `, ${m.gender}` : ""}
                          </span>
                        )}
                      </p>
                      {m.preExistingConditions?.length ? (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {m.preExistingConditions.map((c) => (
                            <span
                              key={c}
                              className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-800"
                            >
                              {humanize(c)}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-text-light text-[11px]">
                          No pre-existing conditions
                        </p>
                      )}
                      {m.smokerOrTobacco ? (
                        <p className="text-text-muted mt-0.5 inline-flex items-center gap-1 text-[11px]">
                          <TobaccoIcon className="size-3" /> uses tobacco
                        </p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ) : null}

        {/* Budget & cover — the two numbers decisions hang on; stat tiles. */}
        {show.cityBudget && (p.annualBudgetInr || p.desiredCoverInr) && (
          <section>
            <SectionLabel Icon={WalletIcon}>Budget &amp; cover</SectionLabel>
            <div className="grid grid-cols-2 gap-2">
              {p.annualBudgetInr ? (
                <StatTile label="Budget">
                  {inr(p.annualBudgetInr)}
                  <span className="text-text-muted text-xs font-normal"> /yr</span>
                </StatTile>
              ) : null}
              {p.desiredCoverInr ? (
                <StatTile label="Cover">{inrCompact(p.desiredCoverInr)}</StatTile>
              ) : null}
            </div>
          </section>
        )}

        {/* Priorities — humanized, check-marked. */}
        {show.priorities && p.priorities?.length ? (
          <section>
            <SectionLabel Icon={TargetIcon}>What matters to you</SectionLabel>
            <div className="flex flex-wrap gap-1.5">
              {p.priorities.map((pr) => (
                <span
                  key={pr}
                  className="bg-secondary text-text-dark inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
                >
                  <CheckIcon className="text-primary-light size-3 shrink-0" />
                  {humanize(pr)}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        {/* Notes — the quiet audit trail: boilerplate stripped, grouped by
            kind (decisions / advice given / details), previewed then
            expandable. */}
        {show.notes && notes.length ? (
          <section>
            <SectionLabel Icon={NotesIcon}>Notes</SectionLabel>
            <div className="flex flex-col gap-3">
              {(() => {
                let budget = allNotes ? Infinity : NOTES_PREVIEW;
                return groupNotes(notes).map(({ label, items }) => {
                  if (budget <= 0) return null;
                  const shown = items.slice(0, budget);
                  budget -= shown.length;
                  return (
                    <div key={label}>
                      <p className="text-text-light mb-1 text-[10px] font-semibold tracking-wider uppercase">
                        {label}
                      </p>
                      <ul className="flex flex-col gap-1">
                        {shown.map((n, i) => (
                          <li
                            key={i}
                            className="text-text-muted flex gap-2 text-xs leading-relaxed"
                          >
                            <span
                              aria-hidden
                              className="bg-primary-light mt-1.5 size-1 shrink-0 rounded-full"
                            />
                            {n}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                });
              })()}
            </div>
            {notes.length > NOTES_PREVIEW ? (
              <button
                type="button"
                onClick={() => setAllNotes((v) => !v)}
                aria-expanded={allNotes}
                className="text-primary-700 hover:text-primary-dark mt-2 inline-flex items-center gap-1 text-xs font-medium transition-colors"
              >
                {allNotes ? "Show fewer" : `Show all ${notes.length} notes`}
                <ArrowDownIcon
                  className={cn("size-3.5 transition-transform", allNotes && "rotate-180")}
                />
              </button>
            ) : null}
          </section>
        ) : null}
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="mb-4 flex items-start justify-between gap-2">
      <div>
        <h2 className="text-text-dark text-sm font-semibold">Your profile</h2>
        <p className="text-text-muted text-xs">What I&apos;ve understood so far</p>
      </div>
      <ShieldCheckIcon className="text-primary-light mt-0.5 size-4 shrink-0" />
    </div>
  );
}

function FactPill({
  Icon,
  children,
}: {
  Icon: StreamlineIcon;
  children: React.ReactNode;
}) {
  return (
    <span className="bg-primary-50 text-primary-800 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium">
      <Icon className="size-3.5 shrink-0" />
      {children}
    </span>
  );
}

function SectionLabel({
  Icon,
  children,
}: {
  Icon: StreamlineIcon;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-2 flex items-center gap-1.5">
      <Icon className="text-primary-light size-3.5" />
      <span className="text-text-muted text-xs font-medium tracking-wide uppercase">
        {children}
      </span>
    </div>
  );
}

function StatTile({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-border-light rounded-lg border px-3 py-2.5">
      <p className="text-text-light text-[10px] font-semibold tracking-wider uppercase">
        {label}
      </p>
      <p className="text-text-dark mt-0.5 text-base font-semibold tabular-nums">
        {children}
      </p>
    </div>
  );
}
