"use client";

// The right-side artifact panel, landing-page variant. Same chrome as the
// product's ArtifactPanel — a horizontal tab bar (Profile pinned first, one tab
// per artifact) over a scrollable content area — but the active tab is driven
// by the caller (page scroll) instead of clicks + Convex.

import { useEffect, useRef } from "react";
import { UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { InsurerLogo } from "./insurer-logo";
import { Artifact, type UiEvent } from "./artifacts";
import { deriveTabs, type ArtifactIcon } from "./artifacts/tabs";
import { ProfileTab, type Profile } from "./profile-tab";

export const PROFILE_KEY = "profile";

/** The panel's tab keys in order, so the page can map a scroll step → tab. */
export function panelTabKeys(events: UiEvent[]): string[] {
  return [PROFILE_KEY, ...deriveTabs(events).map((t) => t.key)];
}

export function DemoPanel({
  events,
  profile,
  activeKey,
  progress = 1,
  embedded,
}: {
  events: UiEvent[];
  profile: Profile;
  activeKey: string;
  /** 0..1 chat progress — drives the Profile tab's progressive reveal. */
  progress?: number;
  /** Render bare (no rounded card / shadow) inside the unified app window. */
  embedded?: boolean;
}) {
  const tabs = deriveTabs(events);
  const showProfile = activeKey === PROFILE_KEY || !tabs.some((t) => t.key === activeKey);
  const activeTab = tabs.find((t) => t.key === activeKey);

  return (
    <div
      className={cn(
        "bg-bg-surface flex h-full w-full flex-col overflow-hidden",
        !embedded &&
          "rounded-[14px] shadow-[0px_30px_60px_-30px_rgba(0,0,0,0.25)] ring-1 ring-border-light",
      )}
    >
      {/* Horizontal tab bar — the panel's only chrome. */}
      <div className="border-border-light flex items-center gap-1 border-b px-2 py-2">
        <div className="no-scrollbar flex flex-1 items-center gap-1 overflow-x-auto">
          <TabButton label="Profile" Icon={UserRound} active={showProfile} />
          {tabs.map((tab) => (
            <TabButton
              key={tab.key}
              label={tab.label}
              Icon={tab.Icon}
              insurer={tab.insurer}
              active={tab.key === activeKey}
            />
          ))}
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <div
          key={activeKey}
          className="no-scrollbar h-full overflow-hidden p-4 animate-[fadeInUp_450ms_ease-out]"
        >
          {showProfile ? (
            <ProfileTab profile={profile} progress={progress} />
          ) : (
            <Artifact event={activeTab!.event} />
          )}
        </div>
        {/* Soft fade at the bottom — a tall card peeks out of the panel. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[64px] bg-gradient-to-t from-bg-surface to-transparent" />
      </div>
    </div>
  );
}

function TabButton({
  label,
  Icon,
  insurer,
  active,
}: {
  label: string;
  Icon: ArtifactIcon;
  insurer?: string;
  active: boolean;
}) {
  // Keep the active tab in view as the scroll-driven selection moves along an
  // overflowing bar.
  const ref = useRef<HTMLSpanElement | null>(null);
  useEffect(() => {
    if (active) ref.current?.scrollIntoView({ inline: "nearest", block: "nearest" });
  }, [active]);

  return (
    <span
      ref={ref}
      aria-pressed={active}
      className={cn(
        "relative inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition-colors duration-300",
        active
          ? "bg-sidebar-accent text-primary-dark"
          : "text-text-muted",
      )}
    >
      {insurer ? (
        <InsurerLogo name={insurer} className="size-4" />
      ) : (
        <Icon className="size-3.5 shrink-0" />
      )}
      <span className="max-w-28 truncate">{label}</span>
    </span>
  );
}
