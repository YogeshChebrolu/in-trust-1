"use client";

// The artifact registry: one dispatch point from a `ui` event's renderAs tag to
// its component. Landing-page subset — the hospital map (MapLibre) is omitted.

import type { UiEvent } from "./types";
import { FunnelArtifact } from "./funnel";
import { PolicyDetailArtifact } from "./policy-detail";
import { CompareArtifact } from "./compare";
import { PremiumExplorerArtifact } from "./premium-explorer";

export type { UiEvent } from "./types";

export function Artifact({ event }: { event: UiEvent }) {
  const payload = event.payload ?? {};
  switch (event.renderAs) {
    case "funnel":
      return <FunnelArtifact payload={payload} />;
    case "policyDetail":
      return <PolicyDetailArtifact payload={payload} />;
    case "compare":
      return <CompareArtifact payload={payload} />;
    case "premiumExplorer":
      return <PremiumExplorerArtifact payload={payload} />;
    default:
      return null;
  }
}
