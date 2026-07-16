"use client";

// One policy, honestly: enrichment (tagline, best-for/not-for, strengths &
// sacrifices — compile-time verified), personalized fit (which gotchas bite
// THIS family), an indicative premium, and the full facts behind a disclosure
// triangle. This is the "what a broker wouldn't volunteer" card.

import { useState } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  Check,
  ChevronRight,
  ShieldQuestion,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { InsurerLogo } from "../insurer-logo";
import { inr, type PolicyDetailPayload } from "./types";

const VERDICT_STYLE: Record<string, string> = {
  strong_fit: "bg-primary-50 text-primary-800",
  fit_with_caveats: "bg-amber-100 text-amber-900",
  poor_fit: "bg-red-50 text-red-800",
};

function Facts({ p }: { p: PolicyDetailPayload }) {
  const [open, setOpen] = useState(false);
  const wp = p.waitingPeriods;
  const cs = p.costSharing;
  return (
    <div className="border-border-light border-t">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="hover:bg-bg-secondary flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors"
      >
        <ChevronRight className={cn("text-text-light size-4 transition-transform", open && "rotate-90")} />
        <span className="text-text-muted">
          Full facts — waiting periods, cost-sharing, {p.coverages?.length ?? 0} benefits
        </span>
      </button>
      {open ? (
        <div className="grid gap-4 px-4 pb-4 sm:grid-cols-2">
          <div>
            <p className="text-text-light mb-1.5 text-[11px] font-semibold uppercase tracking-wider">
              Waiting periods
            </p>
            <ul className="text-text-regular flex flex-col gap-1 text-sm">
              <li>Initial: {wp?.initialDays != null ? `${wp.initialDays} days` : "—"}</li>
              <li>
                Pre-existing: {wp?.pedMonths != null ? `${wp.pedMonths} months` : "—"}
                {wp?.pedReducible ? (
                  <span className="text-primary-700"> · reducible via add-on</span>
                ) : null}
              </li>
              <li>Specified diseases: {wp?.specifiedDiseaseMonths != null ? `${wp.specifiedDiseaseMonths} months` : "—"}</li>
              <li>
                Maternity: {wp?.maternityCovered ? `${wp?.maternityMonths ?? "?"} months wait` : "not covered"}
              </li>
            </ul>
            <p className="text-text-light mt-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider">
              Cost sharing
            </p>
            <ul className="text-text-regular flex flex-col gap-1 text-sm">
              <li>
                Mandatory co-pay:{" "}
                {cs?.mandatoryCoPays?.length
                  ? cs.mandatoryCoPays
                      .map((c) => `${c.percentage ?? "?"}% (${(c.trigger ?? "").replace(/_/g, " ")})`)
                      .join("; ")
                  : "none"}
              </li>
              <li>
                Room: {cs?.roomRent?.roomCategory ?? cs?.roomRent?.policyType?.replace(/_/g, " ") ?? "see wording"}
                {cs?.proportionateDeduction?.applies ? (
                  <span className="text-red-700"> · proportionate deduction applies</span>
                ) : null}
              </li>
              {cs?.subLimits?.length ? (
                <li>
                  Sub-limits: {cs.subLimits.slice(0, 4).map((s) => s.appliesTo).join(", ")}
                  {cs.subLimits.length > 4 ? ` +${cs.subLimits.length - 4} more` : ""}
                </li>
              ) : null}
            </ul>
          </div>
          <div>
            <p className="text-text-light mb-1.5 text-[11px] font-semibold uppercase tracking-wider">
              Benefits ({p.coverages?.length ?? 0})
            </p>
            <ul className="text-text-regular flex max-h-56 flex-col gap-1 overflow-y-auto pr-2 text-sm">
              {(p.coverages ?? []).map((c, i) => (
                <li key={i} className="flex items-baseline justify-between gap-2">
                  <span className="min-w-0 truncate">{c.name}</span>
                  {c.limit ? <span className="text-text-light shrink-0 text-xs">{c.limit}</span> : null}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function PolicyDetailArtifact({ payload: p }: { payload: PolicyDetailPayload }) {
  const e = p.enrichment;
  const fit = p.personalizedFit;
  const prem = p.indicativePremium;

  return (
    <div className="bg-bg-surface border-border-light overflow-hidden rounded-xl border shadow-[0px_2px_8px_rgba(0,0,0,0.08)]">
      {/* header */}
      <div className="border-border-light border-b px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-text-light flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider">
              <InsurerLogo
                name={p.insurer?.shortName ?? p.insurer?.name}
                className="h-4 w-7"
              />
              {p.insurer?.shortName ?? p.insurer?.name}
            </p>
            <h3 className="text-text-dark text-lg font-semibold leading-tight">{p.productName}</h3>
            {e?.tagline ? <p className="text-text-muted mt-0.5 text-sm italic">{e.tagline}</p> : null}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <p className="text-text-muted text-[10px] whitespace-nowrap">
              cover {p.sumInsured?.label}
            </p>
            {fit?.verdict ? (
              <span
                className={cn(
                  "inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap",
                  VERDICT_STYLE[fit.verdict] ?? "bg-bg-secondary text-text-muted",
                )}
              >
                {fit.verdict.replace(/_/g, " ")}
              </span>
            ) : null}
          </div>
        </div>
        {e?.plainSummary ? (
          <p className="text-text-regular mt-2 text-sm leading-relaxed">{e.plainSummary}</p>
        ) : null}
      </div>

      {/* strengths / sacrifices */}
      {(e?.strengths?.length || e?.sacrifices?.length) ? (
        <div className="grid gap-0 sm:grid-cols-2">
          <div className="border-border-light border-b px-4 py-3 sm:border-b-0 sm:border-r">
            <p className="text-primary-700 mb-1.5 text-[11px] font-semibold uppercase tracking-wider">
              What you get
            </p>
            <ul className="flex flex-col gap-1.5">
              {(e?.strengths ?? []).map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm leading-relaxed">
                  <Check className="text-primary-light mt-0.5 size-3.5 shrink-0" />
                  <span className="text-text-regular">{s.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="px-4 py-3">
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-red-700">
              What you give up
            </p>
            <ul className="flex flex-col gap-1.5">
              {(e?.sacrifices ?? []).map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm leading-relaxed">
                  <X className="mt-0.5 size-3.5 shrink-0 text-red-400" />
                  <span className="text-text-regular">{s.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      {/* best for / not for */}
      {(e?.bestFor?.length || e?.notFor?.length) ? (
        <div className="border-border-light bg-bg-secondary/50 border-t px-4 py-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-text-light mb-1 text-[11px] font-semibold uppercase tracking-wider">
                Shortlist it if
              </p>
              <ul className="text-text-regular flex flex-col gap-1 text-xs leading-relaxed">
                {(e?.bestFor ?? []).map((b, i) => (
                  <li key={i}>· {b}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-text-light mb-1 text-[11px] font-semibold uppercase tracking-wider">
                Skip it if
              </p>
              <ul className="text-text-regular flex flex-col gap-1 text-xs leading-relaxed">
                {(e?.notFor ?? []).map((b, i) => (
                  <li key={i}>· {b}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}

      {/* personalized: gotchas that bite + waits */}
      {fit?.bitingGotchas?.length || fit?.applicableWaitingPeriods?.length ? (
        <div className="border-border-light border-t px-4 py-3">
          <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-amber-700">
            <ShieldQuestion className="size-3.5" /> For your family specifically
          </p>
          <ul className="flex flex-col gap-2">
            {(fit?.bitingGotchas ?? []).map((g, i) => (
              <li key={`g${i}`} className="flex items-start gap-2 text-sm leading-relaxed">
                <AlertTriangle
                  className={cn(
                    "mt-0.5 size-3.5 shrink-0",
                    g.severity === "critical" || g.severity === "warning" ? "text-red-500" : "text-amber-500",
                  )}
                />
                <span className="text-text-regular">
                  <span className="font-medium">{g.title}.</span> {g.explanation}
                  {g.whoItAffects ? <span className="text-text-muted"> ({g.whoItAffects})</span> : null}
                </span>
              </li>
            ))}
            {(fit?.applicableWaitingPeriods ?? []).map((w, i) => (
              <li key={`w${i}`} className="flex items-start gap-2 text-sm leading-relaxed">
                <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-amber-500" />
                <span className="text-text-regular">
                  <span className="font-medium">{w.condition}</span>
                  {w.whoHasIt ? ` (${w.whoHasIt})` : ""}: {w.waitMonths != null ? `${w.waitMonths}-month wait` : "wait applies"}
                  {w.modifiable ? <span className="text-primary-700"> — reducible via add-on</span> : null}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* indicative premium */}
      {prem?.familyAnnualInr != null ? (
        <div className="border-border-light bg-primary-25 border-t px-4 py-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-text-regular text-sm">
              Indicative for your family
              {prem.sumInsuredInr ? ` at ₹${Math.round(prem.sumInsuredInr / 100_000)}L each` : ""}
            </p>
            <p className="text-primary-800 text-lg font-semibold tabular-nums">
              ≈{inr(prem.familyAnnualInr)}
              <span className="text-text-muted text-xs font-normal">/yr · {prem.gstNote}</span>
            </p>
          </div>
          {prem.perMember?.length ? (
            <p className="text-text-muted mt-0.5 text-xs tabular-nums">
              {prem.perMember
                .map((m) => `${m.relation ?? "member"} (${m.ageYears}) ${inr(m.annualPremiumInr)}`)
                .join(" · ")}
            </p>
          ) : null}
        </div>
      ) : null}

      <Facts p={p} />

      <div className="border-border-light text-text-light flex items-center gap-1.5 border-t px-4 py-1.5 text-[10px]">
        <BadgeCheck className="size-3" />
        UIN {p.uin} — every claim above is verified against the policy's own documents.
      </div>
    </div>
  );
}
