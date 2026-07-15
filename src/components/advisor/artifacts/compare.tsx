"use client";

// Side-by-side comparison matrix. First column = dimension, one column per
// policy. Cells carry an optional fine-print note. Horizontal scroll on
// overflow — the page never scrolls sideways.

import { Columns3 } from "lucide-react";
import { InsurerLogo } from "../insurer-logo";
import type { ComparePayload } from "./types";

export function CompareArtifact({ payload }: { payload: ComparePayload }) {
  const policies = payload.policies ?? [];
  const rows = payload.rows ?? [];
  if (!policies.length) return null;

  return (
    <div className="bg-bg-surface border-border-light overflow-hidden rounded-xl border shadow-[0px_2px_8px_rgba(0,0,0,0.08)]">
      <div className="border-border-light flex items-center gap-2.5 border-b px-4 py-3">
        <Columns3 className="text-primary-700 size-4" />
        <p className="text-text-dark text-sm font-semibold">
          {policies.map((p) => p.productName).join(" vs ")}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-bg-secondary/60">
              <th className="text-text-light min-w-36 px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider">
                Dimension
              </th>
              {policies.map((p) => (
                <th key={p.uin} className="min-w-44 px-3 py-2 text-left">
                  <span className="text-text-dark block text-sm font-semibold leading-tight">
                    {p.productName}
                  </span>
                  <span className="text-text-light inline-flex items-center gap-1.5 text-[11px] font-normal">
                    <InsurerLogo name={p.insurer} className="h-3.5 w-6" />
                    {p.insurer}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-border-light border-t">
                <td className="text-text-muted px-4 py-2.5 align-top text-xs font-medium">
                  {r.dimension}
                </td>
                {policies.map((p) => {
                  const cell = p.uin ? r.cells?.[p.uin] : undefined;
                  return (
                    <td key={p.uin} className="px-3 py-2.5 align-top">
                      <span className="text-text-dark">{cell?.value ?? "—"}</span>
                      {cell?.note ? (
                        <span className="text-text-light block text-[11px] leading-snug">
                          {cell.note}
                        </span>
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
