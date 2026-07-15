// Tab derivation for the artifact panel: one stable tab per renderAs event
// family, with later events replacing earlier content in place.

import { BadgeCheck, Columns3, Filter, MapPinned, TrendingUp } from "lucide-react";
import type {
  ComparePayload,
  FunnelPayload,
  HospitalMapPayload,
  PolicyDetailPayload,
  PremiumExplorerPayload,
  UiEvent,
} from "./types";

export type ArtifactIcon = typeof Filter;
const DASH = "\u2014";
const ARROW = "\u2192";

export interface ArtifactTab {
  key: string;
  label: string;
  Icon: ArtifactIcon;
  /** Insurer name for single-policy artifacts; lets tabs/chips show brand marks. */
  insurer?: string;
  /** The winning/latest event for this key. */
  event: UiEvent;
  /** Index of the winning event in the flattened list, used for unread dots. */
  version: number;
}

/** Normalize a message's `ui` field: historically a single object, now an array. */
export const uiList = (ui: UiEvent[] | UiEvent | undefined): UiEvent[] =>
  Array.isArray(ui) ? ui : ui ? [ui] : [];

/** Stable tab identity for a renderAs event; null for non-artifact events. */
export function artifactKey(e: UiEvent): string | null {
  const payload = e.payload ?? {};
  switch (e.renderAs) {
    case "funnel":
      return "funnel";
    case "policyDetail": {
      const p = payload as PolicyDetailPayload;
      const id = p.uin ?? p.productName;
      return id ? `policy:${id}` : "policy:unknown";
    }
    case "compare":
      return "compare";
    case "premiumExplorer":
      return "premium";
    case "hospitalMap":
      return "hospital-map";
    default:
      return null;
  }
}

/** Short tab label + icon (+ insurer for brand marks). */
export function tabMeta(e: UiEvent): {
  label: string;
  Icon: ArtifactIcon;
  insurer?: string;
} {
  const payload = e.payload ?? {};
  switch (e.renderAs) {
    case "funnel":
      return { label: "Shortlist", Icon: Filter };
    case "policyDetail": {
      const p = payload as PolicyDetailPayload;
      return {
        label: p.productName ?? "Policy",
        Icon: BadgeCheck,
        insurer: p.insurer?.shortName ?? p.insurer?.name,
      };
    }
    case "compare":
      return { label: "Compare", Icon: Columns3 };
    case "premiumExplorer":
      return { label: "Premiums", Icon: TrendingUp };
    case "hospitalMap": {
      const p = payload as HospitalMapPayload;
      return {
        label: p.center?.label ? `Hospitals: ${p.center.label}` : "Hospitals",
        Icon: MapPinned,
      };
    }
    default:
      return { label: e.renderAs ?? "Artifact", Icon: BadgeCheck };
  }
}

/** One-line label for the in-chat reference chip. */
export function chipLabel(e: UiEvent): string {
  const payload = e.payload ?? {};
  switch (e.renderAs) {
    case "funnel": {
      const p = payload as FunnelPayload;
      const total = p.totalCatalogue;
      const final = p.stages?.length
        ? p.stages[p.stages.length - 1]?.to
        : p.survivors?.length;
      return total != null && final != null
        ? `Shortlist ${DASH} ${total} ${ARROW} ${final} plans`
        : "Shortlist";
    }
    case "policyDetail": {
      const p = payload as PolicyDetailPayload;
      return p.productName ?? "Policy details";
    }
    case "compare": {
      const p = payload as ComparePayload;
      const n = p.policies?.length ?? 0;
      return n ? `Compare ${DASH} ${n} plans` : "Comparison";
    }
    case "premiumExplorer": {
      const p = payload as PremiumExplorerPayload;
      const n = p.policies?.length ?? 0;
      return n ? `Premiums ${DASH} ${n} ${n === 1 ? "plan" : "plans"}` : "Premiums";
    }
    case "hospitalMap": {
      const p = payload as HospitalMapPayload;
      const total = p.total ?? p.hospitals?.length;
      const place = p.center?.label;
      return total != null
        ? `Hospitals ${DASH} ${total}${place ? ` near ${place}` : ""}`
        : "Hospital map";
    }
    default:
      return tabMeta(e).label;
  }
}

/** Reduce conversation events to tabs: latest event per key wins. */
export function deriveTabs(events: UiEvent[]): ArtifactTab[] {
  const order: string[] = [];
  const winners = new Map<string, { event: UiEvent; version: number }>();
  events.forEach((e, i) => {
    const key = artifactKey(e);
    if (!key) return;
    if (!winners.has(key)) order.push(key);
    winners.set(key, { event: e, version: i });
  });
  return order.map((key) => {
    const { event, version } = winners.get(key)!;
    return { key, ...tabMeta(event), event, version };
  });
}
