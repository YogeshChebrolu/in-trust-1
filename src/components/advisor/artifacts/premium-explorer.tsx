"use client";

// Premium explorer — quotes for THIS family, the premium-by-age curve (why
// buying before a birthday band matters), and the sum-insured ladder (the
// under-insurance teaching moment). Designed column-first: it lives in the
// ~480px artifact panel, so quotes stack as full-width rows (brand mark +
// name left, price right) and ladders stack one per policy. Chart is inline
// SVG: thin 2px lines, recessive grid, a legend row above (identity is never
// color-alone), hover crosshair + readout. Series colors are CVD-validated
// for a light surface (ΔE≥29 protan) and follow the policy, never its rank.

import { useMemo, useRef, useState } from "react";
import { TrendingUp, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { InsurerLogo } from "../insurer-logo";
import { inr, lakhLabel, type PremiumExplorerPayload, type PremiumPolicyPayload } from "./types";

const SERIES = ["#3D6BC4", "#A66A1F", "#0E8A5F"]; // validated: light surface, protan ΔE ≥ 29

interface Pt {
  age: number;
  v: number;
}

// A colored identity dot — the ONLY place series color appears outside the
// plot; every label beside it stays in text tokens.
function SeriesDot({ color }: { color: string }) {
  return (
    <span
      aria-hidden
      className="inline-block size-2 shrink-0 rounded-full"
      style={{ background: color }}
    />
  );
}

// One policy's quote — a full-width row: brand + names left, the number right,
// per-member split underneath. The series dot ties the row to its chart line.
function QuoteRow({ policy: p, color }: { policy: PremiumPolicyPayload; color: string }) {
  const annual = p.familyQuote?.annualInr ?? p.singleQuote?.annualPremiumInr;
  return (
    <div className="px-4 py-3">
      <div className="flex items-center gap-2.5">
        <InsurerLogo name={p.insurer} className="h-6 w-9" />
        <div className="min-w-0 flex-1">
          <p className="text-text-dark flex items-center gap-1.5 text-sm font-semibold">
            <SeriesDot color={color} />
            <span className="truncate">{p.productName}</span>
          </p>
          <p className="text-text-light text-[11px]">{p.insurer}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-text-dark text-lg font-bold tabular-nums">
            {annual != null ? `≈${inr(annual)}` : "—"}
            <span className="text-text-light text-xs font-normal">/yr</span>
          </p>
          {p.gstNote ? (
            <p className="text-text-light text-[10px]">{p.gstNote}</p>
          ) : null}
        </div>
      </div>
      {p.familyQuote?.perMember?.length ? (
        <p className="text-text-muted mt-1.5 pl-6 text-xs leading-snug tabular-nums">
          {p.familyQuote.perMember
            .map((m) => `${m.relation ?? "member"}${m.ageYears != null ? ` (${m.ageYears})` : ""} ${inr(m.annualPremiumInr)}`)
            .join(" · ")}
        </p>
      ) : null}
      {p.lowConfidence ? (
        <p className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-amber-50 py-0.5 pr-2.5 pl-1.5 text-[11px] font-medium text-amber-800">
          <TriangleAlert className="size-3 shrink-0 text-amber-600" />
          indicative — low rate-table confidence
        </p>
      ) : null}
    </div>
  );
}

function Chart({ policies }: { policies: PremiumPolicyPayload[] }) {
  const W = 520;
  const H = 220;
  const M = { l: 46, r: 12, t: 10, b: 24 };
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hoverAge, setHoverAge] = useState<number | null>(null);

  const series = useMemo(
    () =>
      policies
        .map((p, i) => ({
          name: p.productName ?? p.uin ?? `#${i + 1}`,
          color: SERIES[i % SERIES.length]!,
          pts: (p.curve ?? [])
            .filter((c): c is { age: number; annualPremiumInr: number } => c.age != null && c.annualPremiumInr != null)
            .map((c) => ({ age: c.age, v: c.annualPremiumInr })),
        }))
        .filter((s) => s.pts.length > 1),
    [policies],
  );
  if (!series.length) return null;

  const allPts = series.flatMap((s) => s.pts);
  const ageMin = Math.min(...allPts.map((p) => p.age));
  const ageMax = Math.max(...allPts.map((p) => p.age));
  const vMax = Math.max(...allPts.map((p) => p.v)) * 1.08;
  const X = (age: number) => M.l + ((age - ageMin) / Math.max(ageMax - ageMin, 1)) * (W - M.l - M.r);
  const Y = (v: number) => H - M.b - (v / vMax) * (H - M.t - M.b);

  const gridLines = 4;
  const ageTicks = [0, 1 / 3, 2 / 3, 1].map((f) => Math.round(ageMin + f * (ageMax - ageMin)));
  const nearest = (pts: Pt[], age: number) =>
    pts.reduce((best, p) => (Math.abs(p.age - age) < Math.abs(best.age - age) ? p : best), pts[0]!);

  function onMove(e: React.MouseEvent<SVGSVGElement>) {
    const el = svgRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const vx = ((e.clientX - r.left) / r.width) * W;
    const age = Math.round(ageMin + ((vx - M.l) / (W - M.l - M.r)) * (ageMax - ageMin));
    setHoverAge(Math.max(ageMin, Math.min(ageMax, age)));
  }

  return (
    <div className="border-border-light border-t px-4 py-3">
      <p className="text-text-light text-[11px] font-semibold uppercase tracking-wider">
        Annual premium by age
      </p>
      {/* Legend — identity in text tokens, color only on the dot. */}
      <div className="mt-1 mb-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
        {series.map((s) => (
          <span key={s.name} className="text-text-muted inline-flex min-w-0 items-center gap-1.5 text-xs">
            <SeriesDot color={s.color} />
            <span className="truncate">{s.name}</span>
          </span>
        ))}
      </div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label="Annual premium by age for the selected policies"
        onMouseMove={onMove}
        onMouseLeave={() => setHoverAge(null)}
      >
        {Array.from({ length: gridLines + 1 }, (_, i) => {
          const v = (vMax / gridLines) * i;
          return (
            <g key={i}>
              <line x1={M.l} x2={W - M.r} y1={Y(v)} y2={Y(v)} stroke="var(--border-light)" strokeWidth="1" />
              <text x={M.l - 6} y={Y(v) + 4} textAnchor="end" fontSize="11" fill="var(--text-light)" style={{ fontVariantNumeric: "tabular-nums" }}>
                {v >= 1000 ? `₹${Math.round(v / 1000)}k` : `₹${Math.round(v)}`}
              </text>
            </g>
          );
        })}
        {ageTicks.map((a) => (
          <text key={a} x={X(a)} y={H - M.b + 16} textAnchor="middle" fontSize="11" fill="var(--text-light)" style={{ fontVariantNumeric: "tabular-nums" }}>
            {a}
          </text>
        ))}
        {series.map((s) => (
          <path
            key={s.name}
            d={s.pts.map((p, i) => `${i ? "L" : "M"}${X(p.age).toFixed(1)} ${Y(p.v).toFixed(1)}`).join(" ")}
            fill="none"
            stroke={s.color}
            strokeWidth="2"
            strokeLinejoin="round"
          />
        ))}
        {hoverAge != null ? (
          <g>
            <line x1={X(hoverAge)} x2={X(hoverAge)} y1={M.t} y2={H - M.b} stroke="var(--text-light)" strokeWidth="1" strokeDasharray="3 3" />
            {series.map((s) => {
              const p = nearest(s.pts, hoverAge);
              return <circle key={s.name} cx={X(p.age)} cy={Y(p.v)} r="4" fill={s.color} stroke="var(--bg-surface)" strokeWidth="2" />;
            })}
          </g>
        ) : null}
      </svg>
      {hoverAge != null ? (
        <div className="text-text-regular flex flex-wrap items-center gap-x-4 gap-y-0.5 pt-0.5 text-xs tabular-nums">
          <span className="text-text-muted">age {hoverAge}:</span>
          {series.map((s) => {
            const p = nearest(s.pts, hoverAge);
            return (
              <span key={s.name} className="inline-flex items-center gap-1.5">
                <SeriesDot color={s.color} />
                {s.name.split(" ").slice(0, 2).join(" ")} {inr(p.v)}
              </span>
            );
          })}
        </div>
      ) : (
        <p className="text-text-light pt-0.5 text-[11px]">hover the chart to compare ages</p>
      )}
    </div>
  );
}

// One policy's cover ladder, full width. The rung matching the quoted sum
// insured is emphasized; the others recede — the point is the RATIO, not the
// individual bars.
function Ladder({
  policy,
  color,
  referenceSiInr,
}: {
  policy: PremiumPolicyPayload;
  color: string;
  referenceSiInr?: number;
}) {
  const rungs = (policy.siLadder ?? []).filter(
    (r): r is { sumInsuredInr: number; annualPremiumInr: number } =>
      r.sumInsuredInr != null && r.annualPremiumInr != null,
  );
  if (rungs.length < 2) return null;
  const maxP = Math.max(...rungs.map((r) => r.annualPremiumInr));
  const first = rungs[0]!;
  const last = rungs[rungs.length - 1]!;
  const covRatio = last.sumInsuredInr / first.sumInsuredInr;
  const costRatio = last.annualPremiumInr / first.annualPremiumInr;
  return (
    <div>
      <p className="text-text-dark flex items-center gap-1.5 text-xs font-semibold">
        <SeriesDot color={color} />
        <span className="truncate">{policy.productName}</span>
        <span className="text-text-muted font-normal">
          — {covRatio.toFixed(0)}× the cover costs {costRatio.toFixed(1)}× the premium
        </span>
      </p>
      <div className="mt-1.5 flex flex-col gap-1">
        {rungs.map((r) => {
          const isRef = referenceSiInr != null && r.sumInsuredInr === referenceSiInr;
          return (
            <div key={r.sumInsuredInr} className="flex items-center gap-2">
              <span
                className={cn(
                  "w-11 shrink-0 text-right text-[11px] tabular-nums",
                  isRef ? "text-text-dark font-semibold" : "text-text-light",
                )}
              >
                {lakhLabel(r.sumInsuredInr)}
              </span>
              <div className="h-3.5 flex-1 overflow-hidden rounded-sm bg-bg-secondary">
                <div
                  className="h-full rounded-sm"
                  style={{
                    width: `${(r.annualPremiumInr / maxP) * 100}%`,
                    background: color,
                    opacity: isRef ? 1 : 0.45,
                  }}
                />
              </div>
              <span
                className={cn(
                  "w-16 shrink-0 text-[11px] tabular-nums",
                  isRef ? "text-text-dark font-semibold" : "text-text-muted",
                )}
              >
                {inr(r.annualPremiumInr)}
                {isRef ? " ←" : ""}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function PremiumExplorerArtifact({ payload }: { payload: PremiumExplorerPayload }) {
  const policies = (payload.policies ?? []).filter((p) => !p.error);
  const failed = (payload.policies ?? []).filter((p) => p.error);

  return (
    <div className="bg-bg-surface border-border-light overflow-hidden rounded-xl border shadow-[0px_2px_8px_rgba(0,0,0,0.08)]">
      <div className="border-border-light flex items-center gap-2.5 border-b px-4 py-3">
        <TrendingUp className="text-primary-700 size-4" />
        <div>
          <p className="text-text-dark text-sm font-semibold">
            What this costs — today, and across the years
          </p>
          {payload.referenceMembers?.length ? (
            <p className="text-text-light text-xs">
              priced for {payload.referenceMembers.map((m) => `${m.relation ?? "member"} (${m.ageYears})`).join(", ")} at{" "}
              {lakhLabel(payload.sumInsuredInr)} each
            </p>
          ) : payload.pricingBasis ? (
            <p className="text-xs font-medium text-amber-700">{payload.pricingBasis}</p>
          ) : null}
        </div>
      </div>

      {/* quotes — stacked rows, one per policy */}
      <div className="divide-border-light flex flex-col divide-y">
        {policies.map((p, i) => (
          <QuoteRow key={p.uin} policy={p} color={SERIES[i % SERIES.length]!} />
        ))}
        {failed.map((p) => (
          <div key={p.uin} className="px-4 py-3">
            <p className="text-text-muted text-xs font-medium">{p.uin}</p>
            <p className="text-text-light text-xs">{p.error}</p>
          </div>
        ))}
      </div>

      <Chart policies={policies} />

      {/* SI ladders — stacked, one per policy */}
      {policies.some((p) => (p.siLadder?.length ?? 0) > 1) ? (
        <div className="border-border-light border-t px-4 py-3">
          <p className="text-text-light mb-2 text-[11px] font-semibold uppercase tracking-wider">
            The cover ladder — bigger cover costs less than you&apos;d think
          </p>
          <div className="flex flex-col gap-4">
            {policies.slice(0, 3).map((p, i) => (
              <Ladder
                key={p.uin}
                policy={p}
                color={SERIES[i % SERIES.length]!}
                referenceSiInr={payload.sumInsuredInr}
              />
            ))}
          </div>
        </div>
      ) : null}

      {payload.disclaimer ? (
        <p className="border-border-light text-text-light border-t px-4 py-2 text-[10px] leading-relaxed">
          {payload.disclaimer}
        </p>
      ) : null}
    </div>
  );
}
