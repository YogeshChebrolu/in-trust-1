"use client";

// The elimination funnel — the transparency artifact. Shows every stage of the
// cut (rule, counts, who fell and why, exceptions kept), the ranked survivors
// with fit + indicative premium, and honesty flags. Floating-card language:
// white surface, hairline dividers, soft shadow, forest-green accents.

import { useState } from "react";
import { ChevronRight, Filter, ShieldAlert, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { InsurerLogo } from "../insurer-logo";
import { inr, type FunnelPayload, type FunnelStagePayload } from "./types";

function Stage({ stage, total }: { stage: FunnelStagePayload; total: number }) {
  const [open, setOpen] = useState(false);
  const from = stage.from ?? 0;
  const to = stage.to ?? 0;
  const removed = stage.removed ?? [];
  return (
    <div className="border-border-light border-b last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="hover:bg-bg-secondary flex w-full items-center gap-3 px-4 py-3 text-left transition-colors"
      >
        <span className="text-text-dark flex min-w-16 items-baseline gap-1 font-semibold tabular-nums">
          <span className="text-text-light text-sm font-normal">{from}</span>
          <span className="text-text-light text-xs">→</span>
          <span>{to}</span>
        </span>
        <span className="flex-1 text-sm">
          {stage.rule}
          <span className="text-destructive/80 ml-2 text-xs">
            −{from - to}
          </span>
        </span>
        <ChevronRight
          className={cn("text-text-light size-4 shrink-0 transition-transform", open && "rotate-90")}
        />
      </button>
      {/* survivors bar */}
      <div className="mx-4 mb-2 h-1 overflow-hidden rounded-full bg-bg-secondary">
        <div
          className="bg-primary-700 h-full rounded-full transition-all"
          style={{ width: `${Math.max(4, (to / Math.max(total, 1)) * 100)}%` }}
        />
      </div>
      {open ? (
        <div className="px-4 pb-3 pl-[4.75rem] max-sm:pl-4">
          <ul className="flex flex-col gap-1.5">
            {removed.map((r, i) => (
              <li key={i} className="text-sm leading-relaxed">
                <span className="text-text-dark font-medium">{r.productName}</span>
                {r.insurer ? <span className="text-text-light"> · {r.insurer}</span> : null}
                <span className="text-text-muted"> — {r.reason}</span>
              </li>
            ))}
          </ul>
          {stage.exceptions?.length ? (
            <div className="bg-primary-25 border-primary-100 mt-2 rounded-lg border px-3 py-2 text-xs leading-relaxed">
              <span className="text-primary-700 font-semibold uppercase tracking-wide">
                kept anyway
              </span>
              {stage.exceptions.map((e, i) => (
                <p key={i} className="text-text-regular mt-0.5">
                  {e}
                </p>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function FunnelArtifact({ payload }: { payload: FunnelPayload }) {
  // Collapsed by default: the header line + top survivors are the story; the
  // stage-by-stage cuts and full ranking expand on demand (a re-run funnel in a
  // long thread shouldn't cost a screen of scroll).
  const [expanded, setExpanded] = useState(false);
  const total = payload.totalCatalogue ?? 10;
  const stages = payload.stages ?? [];
  const survivors = payload.survivors ?? [];
  const final = stages.length ? (stages[stages.length - 1]?.to ?? total) : total;
  const removedCount = stages.reduce((n, s) => n + ((s.from ?? 0) - (s.to ?? 0)), 0);
  const shownSurvivors = expanded ? survivors : survivors.slice(0, 2);

  return (
    <div className="bg-bg-surface border-border-light overflow-hidden rounded-xl border shadow-[0px_2px_8px_rgba(0,0,0,0.08)]">
      <div className="border-border-light flex items-center gap-2.5 border-b px-4 py-3">
        <Filter className="text-primary-700 size-4" />
        <div className="flex-1">
          <p className="text-text-dark text-sm font-semibold">
            {total} verified plans → {final} still standing
          </p>
          {payload.catalogueNote ? (
            <p className="text-text-light text-xs">{payload.catalogueNote}</p>
          ) : null}
        </div>
      </div>

      {stages.length ? (
        expanded ? (
          <div>
            {stages.map((s, i) => (
              <Stage key={i} stage={s} total={total} />
            ))}
          </div>
        ) : (
          <div className="px-4 py-2.5">
            {/* one compressed funnel bar stands in for the stage list */}
            <div className="h-1 overflow-hidden rounded-full bg-bg-secondary">
              <div
                className="bg-primary-700 h-full rounded-full"
                style={{ width: `${Math.max(4, (final / Math.max(total, 1)) * 100)}%` }}
              />
            </div>
            <p className="text-text-muted mt-1.5 text-xs">
              {stages.length} {stages.length === 1 ? "cut" : "cuts"} removed {removedCount}{" "}
              {removedCount === 1 ? "plan" : "plans"} — expand to see who fell and why.
            </p>
          </div>
        )
      ) : (
        <p className="text-text-muted px-4 py-3 text-sm">
          No eliminations yet — every plan still fits what we know so far.
        </p>
      )}

      {survivors.length ? (
        <div className="border-border-light border-t px-4 py-3">
          <p className="text-text-light mb-2 text-[11px] font-semibold uppercase tracking-wider">
            Ranked for you{!expanded && survivors.length > 2 ? ` — top 2 of ${survivors.length}` : ""}
          </p>
          <ul className="flex flex-col gap-2">
            {shownSurvivors.map((s) => (
              <li key={s.uin} className="flex items-start gap-3">
                <span
                  className={cn(
                    "mt-0.5 inline-flex h-6 min-w-10 items-center justify-center rounded-full px-1.5 text-xs font-bold tabular-nums",
                    (s.fitScore ?? 0) >= 80
                      ? "bg-primary-50 text-primary-800"
                      : "bg-bg-secondary text-text-muted",
                  )}
                >
                  {s.fitScore ?? "—"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-text-dark flex items-center gap-1.5 text-sm font-medium">
                    <InsurerLogo name={s.insurer} className="h-4 w-6" />
                    <span className="min-w-0 truncate">
                      {s.productName}
                      <span className="text-text-light font-normal"> · {s.insurer}</span>
                    </span>
                  </p>
                  {s.tagline ? (
                    <p className="text-text-muted text-xs italic leading-relaxed">{s.tagline}</p>
                  ) : null}
                  {s.watchOuts?.length ? (
                    <p className="text-text-muted mt-0.5 text-xs">
                      watch: {s.watchOuts.map((w) => w.title).join(" · ")}
                    </p>
                  ) : null}
                </div>
                {s.indicativeAnnualPremiumInr != null ? (
                  <div className="text-right">
                    <p className="text-text-dark text-sm font-semibold tabular-nums">
                      ≈{inr(s.indicativeAnnualPremiumInr)}
                      <span className="text-text-light text-xs font-normal">/yr</span>
                    </p>
                    {s.premiumNote ? (
                      <p className="text-text-light max-w-36 text-[10px] leading-tight">{s.premiumNote}</p>
                    ) : null}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {payload.flags?.length ? (
        <div className="border-border-light bg-amber-50/60 border-t px-4 py-2.5">
          {payload.flags.map((f, i) => (
            <p key={i} className="flex items-start gap-2 text-xs leading-relaxed text-amber-900">
              <ShieldAlert className="mt-0.5 size-3.5 shrink-0 text-amber-600" />
              {f}
            </p>
          ))}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
        className="border-border-light text-text-light hover:bg-bg-secondary hover:text-text-regular flex w-full items-center gap-1.5 border-t px-4 py-2 text-[11px] font-medium transition-colors"
      >
        <Sparkles className="size-3 shrink-0" />
        {expanded
          ? "Collapse — every cut is computed from the policy documents"
          : `Show every cut and the full ranking (${stages.length} ${stages.length === 1 ? "stage" : "stages"}${survivors.length > 2 ? ` · ${survivors.length} plans ranked` : ""})`}
        <ChevronRight
          className={cn("ml-auto size-3.5 shrink-0 transition-transform", expanded && "rotate-90")}
        />
      </button>
    </div>
  );
}
