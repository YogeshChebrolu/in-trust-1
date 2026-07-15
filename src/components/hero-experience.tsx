"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CoveyButton } from "./covey-button";
import { ChatPanel } from "./chat-panel";

/* ------------------------------------------------------------------ *
 * A single pinned scene. One panel travels from the hero (right, live
 * chat) across to fold two (left, product screens) while the headline
 * fades out and the tab walkthrough fades in on the right.
 * ------------------------------------------------------------------ */

const SCENE = 760;
const CHAT_LEN = 1700; // scroll spent playing the conversation
const TRAVEL_LEN = 560; // scroll spent sliding the panel left
const TAB_LEN = 460; // scroll spent on each product tab
const N_TABS = 3;
const TOTAL = CHAT_LEN + TRAVEL_LEN + TAB_LEN * N_TABS;

/** Panel's home on the right (matching the old hero chat) and on the left. */
const RIGHT_BOX = { left: 700, top: 80, width: 560, height: 569 };
const LEFT_BOX = { left: -48, top: 56, width: 748, height: 648 };

const STATS = [
  { value: "3x", label: "Faster decision making", width: "w-[148px]" },
  { value: "1 Conversation", label: "instead of 5 calls", width: "w-[171px]" },
  { value: "100", label: "Policy transparency", width: "w-[137px]" },
  { value: "24×7", label: "AI assistance", width: "w-[82px]" },
  { value: "Minutes", label: "Instead of days", width: "w-[97px]" },
];

type Slide = { tab: string; img: string; eyebrow: string; title: string; body: string };

const SLIDES: Slide[] = [
  {
    tab: "Shortlist",
    img: "/assets/screen-shortlist.png",
    eyebrow: "The shortlist",
    title: "Every plan, ranked for you.",
    body: "We deep-verify flagship policies from every major insurer against each CIS, prospectus, and rate chart — then rank what actually fits your family, and show you exactly what got cut and why.",
  },
  {
    tab: "Activ One",
    img: "/assets/screen-activ.png",
    eyebrow: "Plan clarity",
    title: "Understand any plan in plain English.",
    body: "Open any policy and see it split into what you get and what you give up — waiting periods, room-rent caps, loadings and all — so nothing important stays buried in the fine print.",
  },
  {
    tab: "Premiums",
    img: "/assets/screen-premiums.png",
    eyebrow: "Real cost",
    title: "See the true cost, across the years.",
    body: "Compare what each plan costs today and how the premium climbs as you age, side by side — so you choose on lifetime value, not just the tempting first-year price.",
  },
];

const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

export function HeroExperience() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(0);

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
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Derived scene state.
  const chatProgress = clamp(scrolled / CHAT_LEN, 0, 1);
  const travel = clamp((scrolled - CHAT_LEN) / TRAVEL_LEN, 0, 1);
  const tabIndex = clamp(
    Math.floor((scrolled - CHAT_LEN - TRAVEL_LEN) / TAB_LEN),
    0,
    N_TABS - 1,
  );
  const slide = SLIDES[tabIndex];

  const e = easeInOut(travel);
  const box = {
    left: lerp(RIGHT_BOX.left, LEFT_BOX.left, e),
    top: lerp(RIGHT_BOX.top, LEFT_BOX.top, e),
    width: lerp(RIGHT_BOX.width, LEFT_BOX.width, e),
    height: lerp(RIGHT_BOX.height, LEFT_BOX.height, e),
  };

  const headlineOpacity = 1 - smoothstep(0, 0.4, travel);
  const chatOpacity = 1 - smoothstep(0, 0.45, travel);
  const productOpacity = smoothstep(0.35, 0.9, travel);
  const textOpacity = smoothstep(0.55, 1, travel);

  return (
    <section className="-mb-px w-full border border-rule px-[80px]">
      <div className="w-full border-x border-rule">
        {/* Tall track — the scene pins while the panel travels and tabs step. */}
        <div
          ref={trackRef}
          className="relative w-full"
          style={{ height: SCENE + TOTAL }}
        >
          <div
            className="sticky top-0 overflow-hidden"
            style={{ height: SCENE }}
          >
            {/* Headline (hero) — fades as the panel leaves */}
            <div
              className="absolute flex flex-col gap-[62px]"
              style={{
                left: 40,
                top: 80,
                width: 614,
                opacity: headlineOpacity,
                transform: `translateY(${-24 * (1 - headlineOpacity)}px)`,
                pointerEvents: headlineOpacity < 0.5 ? "none" : "auto",
              }}
            >
              <div className="flex w-full flex-col gap-[22px]">
                <h1
                  className="w-[610px] bg-clip-text text-[60px] leading-[1.15] font-medium tracking-[-1.2px] text-transparent"
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
                <p className="w-full text-[20px] leading-[1.5] font-medium tracking-[-0.4px] text-[rgba(0,0,0,0.5)]">
                  Buying insurance shouldn&apos;t mean endless calls, confusing
                  jargon, or pressure from sales agents.
                </p>
              </div>
              <div className="flex flex-col items-start gap-[8px]">
                <CoveyButton>Try Covey</CoveyButton>
                <p className="text-[14px] font-medium tracking-[-0.28px] whitespace-nowrap text-neutral-400">
                  Free to try · No phone number required · No spam. Ever.
                </p>
              </div>
            </div>

            {/* Tab walkthrough (fold two) — fades in on the right */}
            <div
              className="absolute flex flex-col justify-center border-l border-rule px-[56px]"
              style={{
                left: 748,
                top: 0,
                right: 0,
                height: SCENE,
                opacity: textOpacity,
                pointerEvents: textOpacity < 0.5 ? "none" : "auto",
              }}
            >
              <div className="flex items-center gap-[8px]">
                {SLIDES.map((s, i) => (
                  <span
                    key={s.tab}
                    className={`rounded-full px-[12px] py-[5px] text-[13px] font-medium transition-colors duration-300 ${
                      i === tabIndex
                        ? "bg-green-2 text-green-12"
                        : "bg-[#f3f4f6] text-neutral-400"
                    }`}
                  >
                    {s.tab}
                  </span>
                ))}
              </div>

              <div key={tabIndex} className="mt-[28px] animate-[fadeInUp_450ms_ease-out]">
                <p className="text-[14px] font-semibold tracking-[0.4px] text-green-9 uppercase">
                  {slide.eyebrow}
                </p>
                <h2 className="mt-[12px] text-[38px] leading-[1.1] font-medium tracking-[-0.76px] text-black">
                  {slide.title}
                </h2>
                <p className="mt-[18px] max-w-[400px] text-[18px] leading-[1.6] font-normal tracking-[-0.36px] text-[rgba(0,0,0,0.55)]">
                  {slide.body}
                </p>
              </div>

              <div className="mt-[36px] flex items-center gap-[10px]">
                {SLIDES.map((s, i) => (
                  <span
                    key={s.tab}
                    className={`h-[3px] rounded-full transition-all duration-300 ${
                      i === tabIndex ? "w-[40px] bg-green-9" : "w-[20px] bg-[#e5e7eb]"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* The traveling panel */}
            <div className="absolute" style={{ ...box }}>
              {/* Product screens (fold two) */}
              <div
                className="absolute inset-0 overflow-hidden rounded-[14px] bg-[#eef1f0]"
                style={{ opacity: productOpacity }}
              >
                {SLIDES.map((s, i) => (
                  <div
                    key={s.tab}
                    className={`absolute inset-0 transition-opacity duration-500 ease-out ${
                      i === tabIndex ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <div className="absolute top-1/2 right-[-1px] h-[88%] -translate-y-1/2">
                      <Image
                        src={s.img}
                        alt={`${s.tab} screen`}
                        width={1320}
                        height={940}
                        className="h-full w-auto max-w-none rounded-l-[14px] border border-r-0 border-[#e5e7eb] shadow-[0px_30px_60px_-20px_rgba(0,0,0,0.25)]"
                        priority={i === 0}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Live chat (hero) — anchored top-right, fades as it leaves */}
              <div
                className="absolute top-0 right-0"
                style={{
                  width: RIGHT_BOX.width,
                  height: RIGHT_BOX.height,
                  opacity: chatOpacity,
                  pointerEvents: chatOpacity < 0.5 ? "none" : "auto",
                }}
              >
                <ChatPanel scrollProgress={chatProgress} />
              </div>
            </div>
          </div>
        </div>

        {/* Stats strip — now after the whole experience */}
        <div className="flex w-full items-center overflow-hidden border-t border-rule px-[40px] py-[48px]">
          <div className="flex flex-1 items-center justify-center border-t border-b border-l border-[#d6dade] py-px">
            {STATS.map((stat) => (
              <div
                key={stat.value}
                className="relative h-[87.555px] min-w-0 flex-1 border-r border-[#d6dade] bg-[#f5f5f5] first:border-l"
              >
                <div
                  className={`absolute top-[19.25px] left-[35.28px] flex flex-col gap-[8px] ${stat.width}`}
                >
                  <p
                    className="font-display w-full text-[28.219px] leading-[32.169px] font-normal tracking-[-1.4109px] whitespace-nowrap text-black"
                    style={{ fontVariationSettings: '"opsz" 14, "wdth" 100' }}
                  >
                    {stat.value}
                  </p>
                  <p className="w-full text-[12px] leading-normal font-normal tracking-[-0.28px] whitespace-nowrap text-[#6b6a6a] uppercase">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
