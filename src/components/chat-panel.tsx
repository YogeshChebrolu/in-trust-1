"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Message = {
  from: "user" | "covey";
  /** Rendered as separate paragraphs inside one bubble. */
  lines: string[];
};

const SCRIPT: Message[] = [
  { from: "user", lines: ["Health cover for my family"] },
  {
    from: "covey",
    lines: [
      "Hey! Happy to help you find the right health cover for your family. 🙏",
      "Let me ask a few quick things so I can look up the right options",
    ],
  },
  { from: "covey", lines: ["Who should the policy cover?"] },
  { from: "user", lines: ["Me, my wife and our 2 year old"] },
  {
    from: "covey",
    lines: [
      "Got it. Any existing conditions I should factor in — diabetes, BP, anything ongoing?",
    ],
  },
  { from: "user", lines: ["My wife has thyroid. Nothing else."] },
  {
    from: "covey",
    lines: [
      "Thanks — thyroid usually means a waiting period, not a rejection. Good to know upfront.",
      "What feels like a comfortable premium per year?",
    ],
  },
  { from: "user", lines: ["Around ₹25,000"] },
  {
    from: "covey",
    lines: [
      "Found 3 plans: ₹10L cover, no copay, and thyroid covered after 24 months.",
      "Want me to compare them side by side?",
    ],
  },
  { from: "user", lines: ["Yes, please"] },
  {
    from: "covey",
    lines: [
      "Here they are — compared on what actually matters: waiting period, room rent, and claim settlement rate.",
      "No jargon, no sales calls. Take your time.",
    ],
  },
  {
    from: "user",
    lines: ["Found the right one for my family. Thank you! 🙏"],
  },
];

/** How long Covey "types" before each of its replies, and the beat after any message. */
const TYPING_MS = 1100;
const AFTER_USER_MS = 700;
const AFTER_COVEY_MS = 1400;
const RESTART_MS = 5000;

function CoveyLabel() {
  return (
    <div className="flex w-full items-center gap-[6px]">
      <Image
        src="/assets/logo-small.svg"
        alt=""
        width={12}
        height={13}
        className="h-[13px] w-[11.44px]"
      />
      <span className="font-plex text-[12px] leading-[18px] font-medium text-[#344054]">
        Covey
      </span>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex w-full items-start">
      <div className="flex w-[378px] max-w-[720px] flex-col gap-[6px]">
        <CoveyLabel />
        <div className="flex w-full flex-col pl-[16px]">
          <div className="flex w-fit items-center gap-[4px] rounded-tr-[8px] rounded-br-[8px] rounded-bl-[8px] border border-[#eaecf0] bg-[#f9fafb] px-[14px] py-[14px]">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="size-[6px] animate-bounce rounded-full bg-[#98a2b3]"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Bubble({ message, showLabel }: { message: Message; showLabel: boolean }) {
  if (message.from === "user") {
    return (
      <div className="flex w-full justify-end">
        <div className="flex max-w-[355px] justify-end">
          <div className="flex w-full items-center rounded-tl-[8px] rounded-br-[8px] rounded-bl-[8px] bg-green-9 px-[14px] py-[10px]">
            <p className="text-[14px] leading-[20px] text-white">
              {message.lines[0]}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full items-start">
      <div className="flex w-[378px] max-w-[720px] flex-col gap-[6px]">
        {showLabel && <CoveyLabel />}
        <div className="flex w-full flex-col pl-[16px]">
          <div className="w-full rounded-tr-[8px] rounded-br-[8px] rounded-bl-[8px] border border-[#eaecf0] bg-[#f9fafb] px-[14px] py-[10px] text-[14px] text-[#101828]">
            {message.lines.map((line, i) => (
              <p
                key={line}
                className={`leading-[20px] ${
                  i < message.lines.length - 1 ? "mb-[14px]" : ""
                }`}
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ChatPanel({ scrollProgress }: { scrollProgress?: number }) {
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
    shownCount = Math.min(SCRIPT.length, Math.floor(t));
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
    <div className="flex h-[569px] w-full flex-col items-center gap-[26px] border-t border-l border-rule px-[14px] py-[24px]">
      <div className="flex w-full flex-1 flex-col justify-between overflow-hidden px-[24px]">
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
              />
            </div>
          ))}
          {showTyping && (
            <div className="w-full animate-[fadeInUp_320ms_ease-out]">
              <TypingBubble />
            </div>
          )}
        </div>

        {/* Prompt input */}
        <div className="flex w-full flex-col gap-[24px] pt-[24px]">
          <div className="flex w-full flex-col rounded-[6px] border border-[#e6e5e5] bg-white p-[12px]">
            <div className="flex w-full items-start p-[8px]">
              <p className="font-inter flex-1 text-[15px] leading-[24px] tracking-[-0.3px] text-[#7b7b7b]">
                Describe your task — AI handles the tools.
              </p>
            </div>
            <div className="flex w-full items-center justify-end">
              <div className="relative flex size-[34.286px] items-center justify-center rounded-[8.571px] bg-green-9 shadow-[0px_1.714px_3.429px_-0.857px_rgba(13,13,13,0.5),0px_0px_0px_0.857px_black]">
                <Image
                  src="/assets/arrow-top.svg"
                  alt="Send"
                  width={17}
                  height={17}
                  className="size-[17.143px]"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-[8.571px] shadow-[inset_0px_0.429px_0.857px_0px_rgba(255,255,255,0.15),inset_0px_-0.857px_1.029px_0.3px_black]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
