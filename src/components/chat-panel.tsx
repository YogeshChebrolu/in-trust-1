"use client";

import Image from "next/image";
import { ArrowUp, Loader2, Mic } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Message = {
  from: "user" | "covey";
  /** Rendered as separate paragraphs inside one bubble. */
  lines: string[];
};

const SCRIPT: Message[] = [
  { from: "user", lines: ["I'm looking for health insurance for my family"] },
  {
    from: "covey",
    lines: [
      "Glad to help you find the right health cover. 🙏",
      "Let me ask a few quick things so I can look up the best options.",
    ],
  },
  { from: "covey", lines: ["Who should the policy cover?"] },
  { from: "user", lines: ["Two adults and our 15-year-old son"] },
  {
    from: "covey",
    lines: [
      "Got it. Any existing conditions I should factor in — diabetes, BP, past surgeries, anything ongoing?",
    ],
  },
  { from: "user", lines: ["My wife had knee surgery a couple of years ago. Otherwise all healthy."] },
  {
    from: "covey",
    lines: [
      "Thanks — a past knee surgery usually means a short waiting period, not a rejection. Good to know upfront.",
      "Which city are you in, and what yearly premium feels comfortable?",
    ],
  },
  { from: "user", lines: ["Bengaluru. Around ₹35,000 a year."] },
  {
    from: "covey",
    lines: [
      "Got it — Bengaluru is a metro zone, so I'll factor that in and target ₹10L cover with no copay.",
      "Shortlisting from every major insurer now…",
    ],
  },
  { from: "user", lines: ["Sounds good, go ahead"] },
  {
    from: "covey",
    lines: [
      "Done — 10 verified plans narrowed to a shortlist of 3.",
      "Everything's on the right — your profile, the shortlist, each plan in plain English, a comparison and premiums. No jargon, no sales calls.",
    ],
  },
  {
    from: "user",
    lines: ["This is exactly what I needed. Thank you! 🙏"],
  },
];

/** How long Covey "types" before each of its replies, and the beat after any message. */
const TYPING_MS = 1100;
const AFTER_USER_MS = 700;
const AFTER_COVEY_MS = 1400;
const RESTART_MS = 5000;

// The advisor's byline — a spark mark + name, matching the product's
// reading-surface chat (an assistant turn is headed, not bubbled).
function AdvisorLabel({ responding }: { responding?: boolean }) {
  return (
    <div className="flex w-full items-center gap-[6px]">
      <Image
        src="/assets/logo-small.svg"
        alt=""
        width={12}
        height={13}
        className="h-[13px] w-[11.44px]"
      />
      {responding ? (
        <span className="animate-pulse text-[12px] leading-[18px] font-medium text-green-9">
          Responding…
        </span>
      ) : (
        <span className="text-[12px] leading-[18px] font-medium text-text-muted">
          Covey
        </span>
      )}
    </div>
  );
}

// The "Covey is replying" beat before an assistant turn lands.
function TypingBubble() {
  return (
    <div className="flex w-full flex-col gap-[8px]">
      <AdvisorLabel responding />
      <div className="flex items-center gap-[4px] pl-[2px]">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-[6px] animate-bounce rounded-full bg-primary-light"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

function Bubble({
  message,
  showLabel,
  wide,
}: {
  message: Message;
  showLabel: boolean;
  wide?: boolean;
}) {
  // User turn — a soft light-green bubble, right-aligned (product parity).
  if (message.from === "user") {
    return (
      <div className="flex w-full justify-end">
        <div
          className={`rounded-xl bg-primary-50 px-[16px] py-[10px] ${
            wide ? "max-w-[70%]" : "max-w-[85%]"
          }`}
        >
          <p className="text-[14px] leading-[20px] text-text-dark">
            {message.lines[0]}
          </p>
        </div>
      </div>
    );
  }

  // Assistant turn — a headed reading surface, no bubble.
  return (
    <div className="flex w-full flex-col gap-[6px]">
      {showLabel && <AdvisorLabel />}
      <div
        className={`flex flex-col gap-[10px] text-[14px] leading-[20px] text-text-dark ${
          wide ? "max-w-[80%]" : ""
        }`}
      >
        {message.lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </div>
  );
}

export function ChatPanel({
  scrollProgress,
  wide,
  embedded,
}: {
  scrollProgress?: number;
  wide?: boolean;
  /** Render bare (no outer card) so it can sit inside the unified app window. */
  embedded?: boolean;
}) {
  // When scrollProgress is provided the conversation is driven by page scroll;
  // otherwise it auto-plays on a timer and loops.
  const auto = scrollProgress === undefined;
  const [shown, setShown] = useState(0);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!auto) return;

    // Replay the script from the top once it has finished.
    if (shown >= SCRIPT.length) {
      const restart = setTimeout(() => setShown(0), RESTART_MS);
      return () => clearTimeout(restart);
    }

    const next = SCRIPT[shown];
    const previous = shown > 0 ? SCRIPT[shown - 1] : null;
    const beat = !previous
      ? 600
      : previous.from === "user"
        ? AFTER_USER_MS
        : AFTER_COVEY_MS;

    // Covey "types" before replying; the user's messages just land.
    if (next.from === "covey") {
      const startTyping = setTimeout(() => setTyping(true), beat);
      const send = setTimeout(() => {
        setTyping(false);
        setShown((n) => n + 1);
      }, beat + TYPING_MS);
      return () => {
        clearTimeout(startTyping);
        clearTimeout(send);
      };
    }

    const send = setTimeout(() => setShown((n) => n + 1), beat);
    return () => clearTimeout(send);
  }, [shown, auto]);

  // Map scroll progress → how many messages are revealed, with a typing beat
  // as the reader scrolls toward each of Covey's replies.
  let shownCount = shown;
  let showTyping = typing;
  if (!auto) {
    const t = Math.min(Math.max(scrollProgress, 0), 1) * SCRIPT.length;
    // Always keep the opening message on screen so the chat never reads blank.
    shownCount = Math.min(SCRIPT.length, Math.max(1, Math.floor(t)));
    const frac = t - shownCount;
    const nextIsCovey =
      shownCount < SCRIPT.length && SCRIPT[shownCount].from === "covey";
    showTyping = nextIsCovey && frac > 0.25;
  }

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [shownCount, showTyping]);

  const visible = SCRIPT.slice(0, shownCount);

  return (
    <div
      className={`flex h-full w-full flex-col items-center gap-[26px] overflow-hidden bg-white px-[14px] py-[24px] ${
        embedded ? "" : "rounded-[14px] border border-[#e5e7eb]"
      }`}
    >
      <div className={`flex w-full flex-1 flex-col justify-between overflow-hidden ${wide ? "px-[40px]" : "px-[24px]"}`}>
        <div
          ref={scrollRef}
          className="no-scrollbar flex flex-1 flex-col gap-[16px] overflow-y-auto pt-[8px]"
        >
          {visible.map((message, i) => (
            <div
              key={`${i}-${message.lines[0]}`}
              className="w-full animate-[fadeInUp_320ms_ease-out]"
            >
              <Bubble
                message={message}
                showLabel={i === 0 || visible[i - 1].from !== "covey"}
                wide={wide}
              />
            </div>
          ))}
          {showTyping && (
            <div className="w-full animate-[fadeInUp_320ms_ease-out]">
              <TypingBubble />
            </div>
          )}
        </div>

        {/* Composer — mirrors the product's chat input: a read-surface card
            holding the prompt, a mic, and the teal send orb. */}
        <div className="flex w-full flex-col pt-[24px]">
          <div className="flex w-full items-end gap-[8px] rounded-xl border border-border-light bg-white p-[8px] shadow-sm">
            <p className="flex-1 px-[8px] py-[6px] text-[15px] leading-[24px] tracking-[-0.3px] text-text-muted">
              Ask anything about your insurance…
            </p>
            <div className="grid size-[36px] shrink-0 place-items-center rounded-full text-green-9">
              <Mic className="size-[18px]" />
            </div>
            {/* While Covey is responding the send orb shows a disabled loading
                state instead of the ready-to-send arrow. */}
            <div
              aria-disabled={showTyping}
              className={`grid size-[36px] shrink-0 place-items-center rounded-full shadow-sm ${
                showTyping
                  ? "bg-neutral-200 text-text-light"
                  : "bg-green-9 text-white"
              }`}
            >
              {showTyping ? (
                <Loader2 className="size-[16px] animate-spin" />
              ) : (
                <ArrowUp className="size-[16px]" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
