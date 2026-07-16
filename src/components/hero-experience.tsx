"use client";

import Image from "next/image";
import { History, SquarePen } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CoveyButton } from "./covey-button";
import { ChatPanel } from "./chat-panel";
import { DemoPanel, panelTabKeys, PROFILE_KEY } from "./advisor/demo-panel";
import { PANEL_EVENTS, DEMO_PROFILE } from "@/lib/demo-panel";

/* ------------------------------------------------------------------ *
 * A single pinned scene showing one continuous advisor app.
 *
 *  Fold one — the whole app, centered: a slim rail, the live chat, and
 *  the tabbed panel share one window. The chat plays as you scroll and
 *  the Profile fills in step with it; the artifact tabs appear only once
 *  the chat has produced them.
 *  Transition — the entire window slides LEFT, so the rail + chat leave
 *  off the left edge and the panel is what remains; marketing copy fades
 *  in on the RIGHT.
 *  Fold two — the panel sits on the left; its tab bar steps through
 *  Shortlist → the three policies → Compare → Premiums as you scroll,
 *  with the right-hand copy changing to match.
 * ------------------------------------------------------------------ */

const SCENE = 860;
const CHAT_LEN = 1700; // scroll spent playing the conversation
const TRAVEL_LEN = 700; // scroll spent sliding the window left
const TAB_LEN = 380; // scroll spent on each panel tab

// The panel's scroll-driven tabs (Profile is pinned; the rest step on scroll).
const TAB_KEYS = panelTabKeys(PANEL_EVENTS);
const STEP_KEYS = TAB_KEYS.slice(1); // Shortlist · Activ One · Optima · Aspire · Compare · Premiums
const N_TABS = STEP_KEYS.length;
const TOTAL = CHAT_LEN + TRAVEL_LEN + TAB_LEN * N_TABS;

// The unified window: rail + chat + panel. Centered in fold one; slid left in
// fold two so only the (now roomier) panel stays on screen, with the copy to
// its right.
// Fold one keeps a centered window; fold two widens it by the 80px page margin
// so the panel bleeds across the gutter and butts the section's left rule while
// its right edge (and the copy beside it) stay put.
const WIN_W1 = 1169;
const WIN_W2 = 1249;
const WIN_H = 620;
// Coords are relative to the section's left rule (the clip bleeds to the gutter),
// so padded content carries an explicit +80 offset.
const GUTTER = 80;
const WIN_FOLD1 = { left: 135, top: 216 }; // 55 + gutter — centered as before
const WIN_FOLD2 = { left: -554, top: 110 }; // slid so the panel meets the left rule

// Right-hand copy, in the same order as STEP_KEYS.
const COPY = [
  {
    eyebrow: "The shortlist",
    title: "Every plan, ranked for you.",
    body: "We deep-verify flagship policies from every major insurer against each CIS, prospectus and rate chart — then rank what actually fits your family, and show exactly what got cut and why.",
  },
  {
    eyebrow: "Plan clarity · Activ One",
    title: "Activ One, in plain English.",
    body: "Earn up to 100% of your premium back for staying active, with day-1 chronic care — but a 3-year pre-existing wait unless you add the buy-down. Every strength and every trade-off, spelled out.",
  },
  {
    eyebrow: "Plan clarity · Optima Restore",
    title: "Optima Restore, honestly.",
    body: "Cover that grows every year and restores in full after a claim, room rent at actuals, maternity included — offset by a flat 36-month pre-existing wait and a ₹2,000 ambulance cap.",
  },
  {
    eyebrow: "Plan clarity · Aspire",
    title: "Aspire, no surprises.",
    body: "A no-claim bonus up to 10× your cover and unlimited restoration at the lowest premium of the three — as long as you respect the room-rent limit, which otherwise dents the whole bill.",
  },
  {
    eyebrow: "Side by side",
    title: "Compare on what actually matters.",
    body: "Line up your shortlist on the dimensions that decide a claim — waiting periods, room rent, co-pay, restoration and settlement record — not the glossy brochure highlights.",
  },
  {
    eyebrow: "Real cost",
    title: "See the true cost, across the years.",
    body: "What each plan costs today and how the premium climbs as you age, side by side — so you choose on lifetime value, not just the tempting first-year price.",
  },
];

const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

// The desktop composition's design width: the clip runs from the section's
// left rule to its right edge (80px gutter + 1280px padded content).
const DESIGN_W = 1360;

export function HeroExperience() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(0);
  const [vw, setVw] = useState<number | null>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const track = trackRef.current;
      if (!track) return;
      const raw = -track.getBoundingClientRect().top;
      setScrolled(clamp(raw, 0, TOTAL));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onResize = () => {
      setVw(window.innerWidth);
      onScroll();
    };
    onResize();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Three tiers: phones get a stacked scene, mid widths get the desktop
  // composition zoomed to fit, full width gets it as designed.
  const isMobile = (vw ?? 1440) < 768;
  const zoom =
    vw === null ? 1 : Math.min(1, Math.max((vw - 32) / DESIGN_W, 0.45));
  const zoomed = !isMobile && zoom < 1;

  // Derived scene state.
  const chatProgress = clamp(scrolled / CHAT_LEN, 0, 1);
  const travel = clamp((scrolled - CHAT_LEN) / TRAVEL_LEN, 0, 1);
  const chatDone = scrolled >= CHAT_LEN;
  const inFold2 = scrolled >= CHAT_LEN + TRAVEL_LEN;
  const tabIndex = clamp(
    Math.floor((scrolled - CHAT_LEN - TRAVEL_LEN) / TAB_LEN),
    0,
    N_TABS - 1,
  );

  // The panel shows the ranked tabs only after the chat has produced them; the
  // active tab is Profile through fold one, then steps on scroll in fold two.
  const panelEvents = chatDone ? PANEL_EVENTS : [];
  const activeKey = inFold2 ? STEP_KEYS[tabIndex] : PROFILE_KEY;
  const copy = inFold2 ? COPY[tabIndex] : COPY[0];

  // The headline + button clear within the first bit of scroll, and the window
  // rises to fill the space. It then slides left during the transition while the
  // right-hand copy fades in.
  const rise = smoothstep(0.02, 0.16, chatProgress);
  const headlineOpacity = 1 - rise;
  const slide = smoothstep(0.1, 0.9, travel);
  const winLeft = lerp(WIN_FOLD1.left, WIN_FOLD2.left, slide);
  const winTop = lerp(WIN_FOLD1.top, WIN_FOLD2.top, rise);
  const winW = lerp(WIN_W1, WIN_W2, slide);
  const copyOpacity = smoothstep(0.55, 0.98, travel);

  // ---- Mobile: chat full-width in fold one; in fold two the panel takes
  // the top of the screen and the step copy sits underneath, same phases. ----
  if (isMobile) {
    return (
      <section className="-mb-px w-full border border-rule px-3">
        <div
          ref={trackRef}
          className="relative w-full"
          style={{ height: `calc(100svh + ${TOTAL}px)` }}
        >
          <div className="sticky top-0 h-[100svh] overflow-hidden">
            {/* Headline — fades as the chat takes over */}
            <div
              className="absolute inset-x-1 top-7 z-10 flex flex-col items-center gap-4 text-center"
              style={{
                opacity: headlineOpacity,
                transform: `translateY(${-20 * (1 - headlineOpacity)}px)`,
                pointerEvents: headlineOpacity < 0.5 ? "none" : "auto",
              }}
            >
              <h1
                className="bg-clip-text text-[clamp(25px,7.4vw,34px)] leading-[1.15] font-medium tracking-[-0.6px] text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(139.5deg, #333333 3.47%, #000000 94.75%)",
                }}
              >
                Find the right insurance in{" "}
                <span className="text-[#0f6642]">10 minutes</span>.{" "}
                <span className="line-through decoration-solid">
                  Not 10 days.
                </span>
              </h1>
              <CoveyButton size="sm">Try Covey</CoveyButton>
            </div>

            {/* Chat — fold one; rises as the headline clears, leaves on travel */}
            <div
              className="absolute inset-x-0 overflow-hidden rounded-[14px] border border-border-light bg-bg-surface shadow-[0px_2px_6px_-2px_rgba(0,0,0,0.04),0px_18px_50px_-24px_rgba(0,0,0,0.12)]"
              style={{
                top: lerp(190, 68, rise),
                bottom: 14,
                opacity: 1 - slide,
                transform: `translateY(${-28 * slide}px)`,
                pointerEvents: slide > 0.5 ? "none" : "auto",
              }}
            >
              <ChatPanel scrollProgress={chatProgress} embedded />
            </div>

            {/* Panel — fold two, top of the screen */}
            <div
              className="absolute inset-x-0 top-3 overflow-hidden rounded-[14px] border border-border-light bg-bg-surface shadow-[0px_2px_6px_-2px_rgba(0,0,0,0.04),0px_18px_50px_-24px_rgba(0,0,0,0.12)]"
              style={{
                height: "58svh",
                opacity: slide,
                transform: `translateY(${16 * (1 - slide)}px)`,
                pointerEvents: slide > 0.5 ? "auto" : "none",
              }}
              aria-hidden={slide < 0.5}
            >
              <DemoPanel
                events={panelEvents}
                profile={DEMO_PROFILE}
                activeKey={activeKey}
                progress={chatProgress}
                embedded
              />
            </div>

            {/* Step copy — fold two, under the panel */}
            <div
              className="absolute inset-x-2 bottom-0 flex flex-col justify-center"
              style={{
                top: "calc(58svh + 12px)",
                opacity: copyOpacity,
                pointerEvents: copyOpacity < 0.5 ? "none" : "auto",
              }}
              aria-hidden={copyOpacity < 0.5}
            >
              <div key={activeKey} className="animate-[fadeInUp_450ms_ease-out]">
                <p className="text-[11px] font-semibold tracking-[0.4px] text-green-9 uppercase">
                  {copy.eyebrow}
                </p>
                <h2 className="mt-1.5 text-[clamp(19px,5.6vw,25px)] leading-[1.15] font-medium tracking-[-0.5px] text-black">
                  {copy.title}
                </h2>
                <p className="mt-2 line-clamp-3 text-[13.5px] leading-[1.55] text-[rgba(0,0,0,0.55)]">
                  {copy.body}
                </p>
              </div>
              <div className="mt-3.5 flex items-center gap-2">
                {STEP_KEYS.map((key, i) => (
                  <span
                    key={key}
                    className={`h-[3px] rounded-full transition-all duration-300 ${
                      inFold2 && i === tabIndex
                        ? "w-[32px] bg-green-9"
                        : "w-[16px] bg-[#e5e7eb]"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="-mb-px w-full border border-rule"
      style={{ paddingInline: zoomed ? 16 : 80 }}
    >
      <div className="w-full">
        {/* Tall track — the scene pins while the chat plays and the tabs step. */}
        <div
          ref={trackRef}
          className="relative w-full"
          style={{ height: SCENE * zoom + TOTAL }}
        >
          {/* The clip bleeds across the left 80px gutter to the section rule, so
              its origin sits at the rule; padded content offsets by GUTTER.
              Below the design width the whole composition zooms to fit. */}
          <div
            className={`sticky top-0 overflow-hidden ${zoomed ? "" : "-ml-[80px] w-[calc(100%+80px)]"}`}
            style={{
              height: SCENE,
              ...(zoomed ? { width: DESIGN_W, zoom } : {}),
            }}
          >
            {/* Headline (hero) — centered on top, fades as the app takes over */}
            <div
              className="absolute flex flex-col items-center gap-[20px] px-[40px] text-center"
              style={{
                left: GUTTER,
                right: 0,
                top: 28,
                opacity: headlineOpacity,
                transform: `translateY(${-24 * (1 - headlineOpacity)}px)`,
                pointerEvents: headlineOpacity < 0.5 ? "none" : "auto",
              }}
            >
              <h1
                className="bg-clip-text text-[40px] leading-[1.12] font-medium tracking-[-0.8px] whitespace-nowrap text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(139.5deg, #333333 3.47%, #000000 94.75%)",
                }}
              >
                Find the right insurance in{" "}
                <span className="text-[#0f6642]">10 minutes</span>.{" "}
                <span className="line-through decoration-solid">Not 10 days.</span>
              </h1>
              <CoveyButton>Try Covey</CoveyButton>
            </div>

            {/* Fold-two copy — fades in on the right as the window leaves left */}
            <div
              className="absolute flex flex-col justify-center px-[24px]"
              style={{
                left: 646 + GUTTER,
                top: 0,
                width: 606,
                height: SCENE,
                opacity: copyOpacity,
                pointerEvents: copyOpacity < 0.5 ? "none" : "auto",
              }}
            >
              <div key={activeKey} className="animate-[fadeInUp_450ms_ease-out]">
                <p className="text-[14px] font-semibold tracking-[0.4px] text-green-9 uppercase">
                  {copy.eyebrow}
                </p>
                <h2 className="mt-[12px] max-w-[540px] text-[40px] leading-[1.1] font-medium tracking-[-0.8px] text-black">
                  {copy.title}
                </h2>
                <p className="mt-[18px] max-w-[480px] text-[18px] leading-[1.6] font-normal tracking-[-0.36px] text-[rgba(0,0,0,0.55)]">
                  {copy.body}
                </p>
              </div>
              <div className="mt-[36px] flex items-center gap-[10px]">
                {STEP_KEYS.map((key, i) => (
                  <span
                    key={key}
                    className={`h-[3px] rounded-full transition-all duration-300 ${
                      inFold2 && i === tabIndex
                        ? "w-[40px] bg-green-9"
                        : "w-[20px] bg-[#e5e7eb]"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* The unified app window — one border/shadow around rail + chat + panel */}
            <div
              className="absolute overflow-hidden rounded-[16px] border border-border-light bg-bg-surface shadow-[0px_2px_6px_-2px_rgba(0,0,0,0.04),0px_18px_50px_-24px_rgba(0,0,0,0.12)]"
              style={{ left: winLeft, top: winTop, width: winW, height: WIN_H }}
            >
              <div className="flex h-full w-full">
                {/* Slim rail */}
                <div className="flex w-[46px] shrink-0 flex-col items-center gap-[18px] border-r border-border-light bg-bg-page py-[16px]">
                  <Image
                    src="/assets/logo-small.svg"
                    alt=""
                    width={14}
                    height={16}
                    className="h-[16px] w-auto"
                  />
                  <span className="grid size-[26px] place-items-center rounded-full bg-green-9 text-white">
                    <SquarePen className="size-[13px]" />
                  </span>
                  <History className="size-[16px] text-text-light" />
                  <span className="mt-auto grid size-[26px] place-items-center rounded-full bg-neutral-200 text-[11px] font-semibold text-text-muted">
                    T
                  </span>
                </div>

                {/* Chat column */}
                <div className="h-full w-[508px] shrink-0 border-r border-border-light">
                  <ChatPanel scrollProgress={chatProgress} wide embedded />
                </div>

                {/* Tabbed artifact panel */}
                <div className="h-full min-w-0 flex-1">
                  <DemoPanel
                    events={panelEvents}
                    profile={DEMO_PROFILE}
                    activeKey={activeKey}
                    progress={chatProgress}
                    embedded
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
