"use client";

import {
  Check,
  CheckCircle2,
  FileText,
  MessageCircle,
  PhoneIncoming,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

const BLUE = "#0563f0";
const BLUE_SOFT = "#5b9bff";
const LAST_STEP = 4;
const SCROLL_SEGMENT = 720;
const clamp = (value: number, min = 0, max = 1) =>
  Math.min(Math.max(value, min), max);

type Step = {
  label: string;
  eyebrow: string;
  title: ReactNode;
  body: string;
};

const STEPS: Step[] = [
  {
    label: "Enquiry",
    eyebrow: "One enquiry",
    title: (
      <>
        One enquiry can become <span className="text-green-9">10 calls</span>.
      </>
    ),
    body: "You asked for a quote. What arrives next is often more conversation, not more understanding.",
  },
  {
    label: "Noise",
    eyebrow: "The follow-up",
    title: <>One form. Several very enthusiastic advisors.</>,
    body: "Calls, messages and follow-ups multiply around the same question you started with.",
  },
  {
    label: "Answers",
    eyebrow: "The explanation",
    title: <>Ten conversations. Three different answers.</>,
    body: "The benefits are easy to repeat. The conditions still send you back to the policy wording.",
  },
  {
    label: "Payment",
    eyebrow: "The decision",
    title: <>Eventually, you pay.</>,
    body: "The buying journey feels finished—even when the understanding isn’t.",
  },
  {
    label: "Policy",
    eyebrow: "The part that remains",
    title: (
      <>
        You bought the policy.{" "}
        <span className="text-green-9">But did you understand it?</span>
      </>
    ),
    body: "Room-rent limits, waiting periods and restoration rules are still waiting inside the document.",
  },
];

function MarketplaceMark() {
  return (
    <div className="flex items-center gap-2" aria-hidden>
      <span
        className="grid size-8 place-items-center rounded-[9px] text-[13px] font-bold text-white"
        style={{ backgroundColor: BLUE }}
      >
        i
      </span>
      <span className="text-[13px] font-semibold text-[#27364b]">
        compare insurance
      </span>
    </div>
  );
}

function QuoteCard({ small = false }: { small?: boolean }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[20px] border border-[#dce5f4] bg-white shadow-[0_28px_80px_-42px_rgba(26,75,150,0.45)] ${
        small ? "w-[310px] p-5" : "w-[390px] p-6"
      }`}
    >
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: BLUE }}
      />
      <MarketplaceMark />
      <p className="mt-7 text-[12px] font-semibold tracking-[0.08em] text-[#6b7890] uppercase">
        Health insurance
      </p>
      <p className="mt-2 text-[22px] leading-[1.2] font-semibold tracking-[-0.45px] text-[#16243a]">
        Find plans for your family
      </p>
      <p className="mt-6 text-[12px] font-medium text-[#6b7890]">
        Mobile number
      </p>
      <div className="mt-2 flex h-12 items-center rounded-[9px] border border-[#cbd7e8] bg-[#fbfdff] px-3 text-[14px] text-[#7b8798]">
        +91&nbsp;&nbsp;••••• •••••
      </div>
      <div
        className="mt-3 flex h-12 items-center justify-center rounded-[9px] text-[14px] font-semibold text-white"
        style={{ backgroundColor: BLUE }}
      >
        View plans
      </div>
      <p className="mt-4 text-[11px] leading-[1.45] text-[#8a95a6]">
        Your details help advisors find matching plans.
      </p>
    </div>
  );
}

const ALERTS = [
  ["Insurance advisor", "Incoming call", "left-0 top-[54px] -rotate-2", "call"],
  ["Your quotes are ready", "Tap to compare plans", "right-0 top-[126px] rotate-2", "message"],
  ["Insurance expert", "Incoming call", "left-[46px] bottom-[104px] rotate-1", "call"],
  ["Can we help you choose?", "Advisor message · now", "right-[14px] bottom-[30px] -rotate-1", "message"],
];

function NoiseScene() {
  return (
    <div className="relative h-[540px] w-[560px]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <QuoteCard small />
      </div>
      {ALERTS.map(([title, detail, place, type], index) => (
        <div
          key={title}
          className={`absolute flex w-[238px] items-center gap-3 rounded-[15px] border border-[#d9e4f3] bg-white px-4 py-3 shadow-[0_18px_48px_-26px_rgba(28,67,130,0.5)] ${place}`}
          style={{ zIndex: 10 + index }}
        >
          <span
            className="grid size-9 shrink-0 place-items-center rounded-full text-white"
            style={{ backgroundColor: type === "call" ? BLUE : BLUE_SOFT }}
          >
            {type === "call" ? (
              <PhoneIncoming className="size-4" />
            ) : (
              <MessageCircle className="size-4" />
            )}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-[#1b2b43]">
              {title}
            </p>
            <p className="truncate text-[11px] text-[#748197]">{detail}</p>
          </div>
        </div>
      ))}
      <div className="absolute right-[86px] bottom-[126px] z-30 rounded-full bg-[#17253b] px-3 py-1.5 text-[11px] font-semibold text-white">
        7 new follow-ups
      </div>
    </div>
  );
}

const ANSWERS = [
  ["Advisor 01", "“Yes, this is fully covered.”", "left-0 top-[54px]", BLUE],
  ["Advisor 02", "“It depends on the room category.”", "right-0 top-[174px]", "#3b82f6"],
  ["Advisor 03", "“Please check the policy wording.”", "left-[38px] bottom-[64px]", "#0b4fc6"],
];

function AnswersScene() {
  return (
    <div className="relative h-[520px] w-[560px]">
      <div className="absolute top-1/2 left-1/2 h-[340px] w-px -translate-x-1/2 -translate-y-1/2 bg-[#e4e9f0]" />
      {ANSWERS.map(([speaker, answer, place, color]) => (
        <div
          key={speaker}
          className={`absolute w-[330px] rounded-[18px] border border-[#dce4ef] bg-white p-5 shadow-[0_20px_52px_-34px_rgba(17,41,78,0.4)] ${place}`}
        >
          <div className="flex items-center gap-2">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: color }}
            />
            <p className="text-[11px] font-semibold tracking-[0.08em] text-[#788499] uppercase">
              {speaker}
            </p>
          </div>
          <p className="mt-3 text-[17px] leading-[1.45] font-medium text-[#1d2b41]">
            {answer}
          </p>
        </div>
      ))}
      <div className="absolute top-1/2 left-1/2 z-20 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-white bg-[#f2f5f8] text-[18px] font-semibold text-[#6d788a]">
        ?
      </div>
    </div>
  );
}

function PolicyDocument({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[14px] border border-[#dce5f4] bg-white shadow-[0_30px_80px_-48px_rgba(15,45,90,0.4)] ${className}`}
    >
      <div className="flex items-center justify-between border-b border-[#e6edf7] bg-[#f5f8ff] px-6 py-4">
        <span className="flex items-center gap-2 text-[12px] font-semibold tracking-[0.06em] text-[#5b6577] uppercase">
          <FileText className="size-4" /> Policy wording
        </span>
        <span className="text-[11px] text-[#8994a6]">Page 21 of 48</span>
      </div>
      <div className="space-y-3 px-7 py-6">
        {[74, 100, 92, 82].map((width) => (
          <div
            key={width}
            className="h-2 rounded-full bg-[#eef2fa]"
            style={{ width: `${width}%` }}
          />
        ))}
        <div className="my-5 rounded-[10px] border border-[#efd8b9] bg-[#fff8ef] p-4">
          <p className="text-[10px] font-semibold tracking-[0.08em] text-[#a45d14] uppercase">
            Room rent restriction
          </p>
          <p className="mt-2 text-[12px] leading-[1.65] text-[#5d5145]">
            Room rent shall be limited to 1% of the sum insured per day.
            Proportionate deductions may apply as specified.
          </p>
        </div>
        {[100, 86, 95].map((width) => (
          <div
            key={width}
            className="h-2 rounded-full bg-[#eef2fa]"
            style={{ width: `${width}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function PaymentScene() {
  return (
    <div className="relative h-[520px] w-[560px]">
      <PolicyDocument className="absolute top-[112px] left-[142px] h-[370px] w-[360px] rotate-[3deg] opacity-75" />
      <div className="absolute top-[50px] left-[42px] z-10 w-[375px] overflow-hidden rounded-[20px] border border-[#dce5f4] bg-white shadow-[0_34px_90px_-44px_rgba(15,63,140,0.5)]">
        <div className="h-1" style={{ backgroundColor: BLUE }} />
        <div className="p-7">
          <div className="flex justify-between">
            <MarketplaceMark />
            <CheckCircle2 className="size-6" style={{ color: BLUE }} />
          </div>
          <p className="mt-9 text-[12px] font-semibold tracking-[0.08em] text-[#6e7b91] uppercase">
            Payment successful
          </p>
          <p className="mt-2 text-[34px] font-semibold tracking-[-1.2px] text-[#17263d]">
            ₹18,430
          </p>
          <p className="text-[13px] text-[#7b8799]">
            Family health insurance · 1 year
          </p>
          <div className="mt-7 flex items-center gap-2 border-t border-[#e6ebf2] pt-5 text-[12px] text-[#67748a]">
            <Check className="size-4" style={{ color: BLUE }} />
            Policy document sent to your email
          </div>
        </div>
      </div>
    </div>
  );
}

function PolicyScene() {
  return (
    <div className="relative h-[560px] w-[560px]">
      <PolicyDocument className="absolute top-[24px] left-[56px] h-[500px] w-[448px]" />
      <div className="absolute right-0 bottom-[92px] w-[285px] rounded-[16px] border border-[#cfe0fb] bg-[#eff5ff] p-5 shadow-[0_24px_60px_-38px_rgba(15,63,140,0.4)]">
        <p
          className="text-[11px] font-semibold tracking-[0.08em] uppercase"
          style={{ color: BLUE }}
        >
          Still unclear
        </p>
        <p className="mt-2 text-[16px] leading-[1.4] font-medium text-[#16243a]">
          What would this clause mean during a real claim?
        </p>
      </div>
    </div>
  );
}

function Scene({ index }: { index: number }) {
  if (index === 0) return <QuoteCard />;
  if (index === 1) return <NoiseScene />;
  if (index === 2) return <AnswersScene />;
  if (index === 3) return <PaymentScene />;
  return <PolicyScene />;
}

const MAX_PHASE = STEPS.length;

const smoothstep = (start: number, end: number, value: number) => {
  const amount = clamp((value - start) / (end - start));
  return amount * amount * (3 - 2 * amount);
};

function StoryCard({
  index,
  phase,
}: {
  index: number;
  phase: number;
}) {
  const step = STEPS[index];
  const relative = phase - (index + 1);
  const distance = Math.abs(relative);
  const bounded = clamp(relative, -1, 1);
  const angle = bounded * Math.PI * 0.64;
  const arcX = Math.sin(angle) * 38;
  const arcY = (1 - Math.cos(angle)) * 18;
  const visualOpacity = Math.pow(clamp(1 - distance / 0.78), 1.35);
  const captionOpacity = Math.pow(clamp(1 - distance / 0.38), 1.15);
  const scale = 1 - clamp(distance) * 0.13;
  const rotation = bounded * 16;

  return (
    <>
      <div
        className="pointer-events-none absolute top-[clamp(42px,7vh,76px)] left-1/2 z-10 h-[430px] w-[600px] origin-center"
        style={{
          left: `calc(50% + ${arcX}vw)`,
          opacity: visualOpacity,
          transform: `translate(-50%, ${arcY}vh) rotate(${rotation}deg) scale(${scale})`,
          zIndex: 30 - Math.round(distance * 10),
        }}
        aria-hidden={visualOpacity < 0.5}
      >
        <div className="flex size-full origin-center items-center justify-center scale-[0.54] sm:scale-[0.66] md:scale-[0.78] lg:scale-[0.84]">
          <div className={index === LAST_STEP ? "-translate-y-14" : undefined}>
            <Scene index={index} />
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-5 bottom-[clamp(46px,7vh,74px)] z-40 mx-auto max-w-[820px] text-center"
        style={{
          opacity: captionOpacity,
          transform: `translateY(${relative * -20}px)`,
        }}
        aria-hidden={captionOpacity < 0.5}
      >
        <p className="text-[11px] font-semibold tracking-[0.13em] text-green-9 uppercase sm:text-[12px]">
          {step.eyebrow}
        </p>
        <h3 className="mt-3 text-[clamp(28px,3.5vw,46px)] leading-[1.08] font-medium tracking-[-0.04em] text-[#111513]">
          {step.title}
        </h3>
        {index === LAST_STEP && (
          <div className="mx-auto mt-4 flex w-fit items-center gap-2 border-t border-[#dfe4e1] px-3 pt-4 text-[12px] font-medium text-green-12 sm:text-[14px]">
            <span className="grid size-7 place-items-center rounded-full bg-green-9 text-white">
              <Check className="size-3.5" />
            </span>
            Buying insurance should leave you informed—not exhausted.
          </div>
        )}
      </div>
    </>
  );
}

function CarouselStory({ phase }: { phase: number }) {
  const introOpacity = 1 - smoothstep(0.35, 0.82, phase);

  return (
    <div className="relative h-[100svh] min-h-[640px] overflow-hidden bg-white">
      <div
        className="absolute inset-0 z-40 flex flex-col items-center justify-center px-6 text-center"
        style={{
          opacity: introOpacity,
          transform: `translateY(${phase * -42}px)`,
          pointerEvents: introOpacity > 0.5 ? "auto" : "none",
        }}
        aria-hidden={introOpacity < 0.5}
      >
        <p className="text-[11px] font-semibold tracking-[0.16em] text-green-9 uppercase sm:text-[13px]">
          Why InTrust exists
        </p>
        <h2 className="mt-5 max-w-[1020px] text-[clamp(46px,6vw,82px)] leading-[0.98] font-medium tracking-[-0.055em] text-[#111513]">
          Buying insurance should leave you{" "}
          <span className="text-green-9">informed</span>—not exhausted.
        </h2>
        <p className="mt-7 max-w-[620px] text-[16px] leading-[1.6] text-[#6a746f] sm:text-[18px]">
          Scroll to see why the usual buying journey creates more activity than understanding.
        </p>
      </div>

      {STEPS.map((step, index) => (
        <StoryCard key={step.label} index={index} phase={phase} />
      ))}
    </div>
  );
}

function ReducedMotionStory() {
  return (
    <div className="hidden motion-reduce:block">
      <div className="px-5 py-20 text-center sm:px-10">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-green-9 uppercase">
          Why InTrust exists
        </p>
        <h2 className="mx-auto mt-5 max-w-[900px] text-[clamp(42px,6vw,72px)] leading-[1] font-medium tracking-[-0.05em] text-[#111513]">
          Buying insurance should leave you informed—not exhausted.
        </h2>
      </div>
      <div className="space-y-24 px-5 pb-24 sm:px-10">
        {STEPS.map((step, index) => (
          <article key={step.label} className="mx-auto max-w-[900px] text-center">
            <div className="flex h-[390px] items-center justify-center overflow-hidden rounded-[24px] border border-[#e0e5e2] bg-[#fafbfa]">
              <div className="origin-center scale-[0.6] sm:scale-[0.72]">
                <Scene index={index} />
              </div>
            </div>
            <p className="mt-8 text-[11px] font-semibold tracking-[0.13em] text-green-9 uppercase">
              {step.eyebrow}
            </p>
            <h3 className="mt-3 text-[clamp(30px,4vw,46px)] leading-[1.08] font-medium tracking-[-0.04em] text-[#111513]">
              {step.title}
            </h3>
          </article>
        ))}
      </div>
    </div>
  );
}

export function Issues() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let frame = 0;

    const update = () => {
      frame = 0;
      if (reducedMotion.matches) {
        setPhase(0);
        return;
      }

      const distance = Math.max(track.offsetHeight - window.innerHeight, 1);
      const value = clamp(-track.getBoundingClientRect().top / distance);
      setPhase(value * MAX_PHASE);
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reducedMotion.addEventListener("change", schedule);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reducedMotion.removeEventListener("change", schedule);
    };
  }, []);

  return (
    <section className="-mb-px w-full border border-rule bg-white">
      <div
        ref={trackRef}
        className="relative w-full motion-reduce:hidden"
        style={{
          height: `calc(100svh + ${SCROLL_SEGMENT * MAX_PHASE}px)`,
        }}
      >
        <div className="sticky top-0">
          <CarouselStory phase={phase} />
        </div>
      </div>
      <ReducedMotionStory />
    </section>
  );
}
