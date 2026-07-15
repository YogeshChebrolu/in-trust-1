"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/** Vertical distance between one left/right pair and the next. */
const PAIR_STEP = 300;
const SCENE_HEIGHT = 741;
const SPINE_X = 299;
/** Height of the pinned view: the rail plus the section's top padding. */
const PINNED_HEIGHT = SCENE_HEIGHT + 80;
/** Headroom above the first card so the fade has empty space to sit in at rest. */
const TOP_PAD = 44;
/** Depth of the soft fade that dissolves cards at the rail's edges. */
const FADE = 72;

const RAIL_MASK = `linear-gradient(to bottom, transparent 0px, black ${FADE}px, black calc(100% - ${FADE}px), transparent 100%)`;

type NoteCard = {
  side: "left";
  name: string;
  quote: string;
  from: string;
  to: string;
  accent: string;
  /** Ink for the note text — always a deep shade of the card's own hue. */
  ink: string;
};

type TestimonialCard = {
  side: "right";
  name: string;
  quote: string;
  from: string;
  to: string;
  accent: string;
  nameColor: string;
  avatar?: string;
};

type Card = NoteCard | TestimonialCard;

/** Left = chat-style notes, right = testimonials. They alternate down the spine. */
const CARDS: Card[] = [
  {
    side: "left",
    name: "INDERDEEP",
    quote: "I still don't know what copay means.",
    from: "#30c4c0",
    to: "#21a987",
    accent: "#21a987",
    ink: "rgba(19,122,103,0.94)",
  },
  {
    side: "right",
    name: "Ramachandran",
    quote:
      "I spoke with nearly 10 customer care representatives and received different guidance from each, making the process confusing. This experience showed me the value of a dedicated agent.",
    from: "#fd9e40",
    to: "#ff750a",
    accent: "#ff750a",
    nameColor: "#713a04",
    avatar: "/assets/avatar-ramachandran.jpg",
  },
  {
    side: "left",
    name: "INDERDEEP",
    quote:
      "They often mislead customers and have very poor service, taking days to respond and not answering questions properly.",
    from: "#5ab7f1",
    to: "#299ce4",
    accent: "#299ce4",
    ink: "rgba(15,88,140,0.94)",
  },
  {
    side: "right",
    name: "Aarav",
    quote:
      "I spoke with nearly 10 customer care representatives and received different guidance from each, making the process confusing. This experience showed me the value of a dedicated agent.",
    from: "#b69bf5",
    to: "#7d5bdb",
    accent: "#7d5bdb",
    nameColor: "#3b1d7a",
  },
  {
    side: "left",
    name: "PRIYA",
    quote:
      "The agent kept pushing the plan with the highest commission. I only found out much later.",
    from: "#7dd3fc",
    to: "#0ea5e9",
    accent: "#0ea5e9",
    ink: "rgba(12,84,130,0.94)",
  },
  {
    side: "right",
    name: "Meenakshi",
    quote:
      "Nobody told me about the two year waiting period until my claim was rejected. It was all in the fine print I never read.",
    from: "#fda4af",
    to: "#f43f5e",
    accent: "#f43f5e",
    nameColor: "#7a1128",
    avatar: "/assets/avatar-meenakshi.jpg",
  },
  {
    side: "left",
    name: "ARJUN",
    quote:
      "Every website showed me the same five plans. None of them explained why.",
    from: "#5eead4",
    to: "#0d9488",
    accent: "#0d9488",
    ink: "rgba(13,105,95,0.94)",
  },
  {
    side: "right",
    name: "Sandeep",
    quote:
      "One enquiry turned into three weeks of sales calls. I stopped answering unknown numbers entirely.",
    from: "#fcd34d",
    to: "#f59e0b",
    accent: "#f59e0b",
    nameColor: "#78420a",
  },
  {
    side: "left",
    name: "FATIMA",
    quote:
      "I compared four policies across eleven PDFs and still picked the wrong one.",
    from: "#a5b4fc",
    to: "#6366f1",
    accent: "#6366f1",
    ink: "rgba(55,58,140,0.94)",
  },
  {
    side: "right",
    name: "Vikram",
    quote:
      "It took five calls and four days just to understand what my own policy actually covered.",
    from: "#f0abfc",
    to: "#c026d3",
    accent: "#c026d3",
    nameColor: "#6b1478",
    avatar: "/assets/avatar-vikram.jpg",
  },
];

const TILT_RIGHT = { transform: "rotate(8.16deg) skewX(8.16deg) scaleY(0.99)" };
const TILT_LEFT = { transform: "rotate(-8deg) skewX(-8deg) scaleY(0.99)" };

/** Screw-head dots pinned to a card's four corners. */
function CornerDots({
  src,
  positions,
}: {
  src: string;
  positions: [number, number][];
}) {
  return (
    <>
      {positions.map(([left, top]) => (
        <Image
          key={`${left}-${top}`}
          src={src}
          alt=""
          width={5}
          height={5}
          className="absolute size-[5px]"
          style={{ left, top }}
        />
      ))}
    </>
  );
}

function NoteCard({ card, y }: { card: NoteCard; y: number }) {
  return (
    <>
      {/* Soft tilted copy sitting behind the card */}
      <div
        className="absolute flex items-center justify-center"
        style={{ left: 0, top: y + 8.29, width: 245.398, height: 236.392 }}
      >
        <div
          className="rounded-[5.92px] border-[1.13px] border-[rgba(255,255,255,0.3)] opacity-20"
          style={{
            ...TILT_RIGHT,
            width: 247.905,
            height: 201.226,
            backgroundImage: `linear-gradient(180deg, ${card.to}, ${card.from})`,
          }}
        />
      </div>

      <div
        className="absolute flex items-center justify-center"
        style={{ left: 14, top: y, width: 246.973, height: 232.787 }}
      >
        <div
          className="relative overflow-hidden rounded-[9.623px]"
          style={{
            ...TILT_RIGHT,
            width: 249.401,
            height: 198.077,
            backgroundImage: `linear-gradient(180deg, ${card.from}, ${card.to})`,
          }}
        >
          <div className="absolute top-[14.91px] left-1/2 h-[161.263px] w-[206.005px] -translate-x-1/2">
            <div className="flex h-[159.227px] w-full flex-col rounded-[8px] border-[0.5px] border-[rgba(255,255,255,0.4)] bg-[rgba(255,255,255,0.5)] px-[15px] py-[8px] backdrop-blur-[11.9px]">
              <div className="flex items-center pt-[15px] pb-[8px]">
                <p
                  className="text-[14px] leading-[1.5] font-medium whitespace-nowrap"
                  style={{ color: card.ink }}
                >
                  {card.name}
                </p>
              </div>
              <p
                className="w-[183.142px] text-[12px] leading-[1.5] font-medium"
                style={{ color: card.ink }}
              >
                {card.quote}
              </p>
            </div>
          </div>
          <CornerDots
            src="/assets/dot-grey.svg"
            positions={[
              [7.07, 7.02],
              [237.3, 7.11],
              [7.07, 186.02],
              [237.3, 185.11],
            ]}
          />
        </div>
      </div>
    </>
  );
}

function TestimonialCard({ card, y }: { card: TestimonialCard; y: number }) {
  return (
    <>
      <div
        className="absolute flex items-center justify-center"
        style={{ left: 324, top: y + 16, width: 246.577, height: 232.654 }}
      >
        <div
          className="rounded-[10.349px] opacity-20"
          style={{
            ...TILT_LEFT,
            width: 249,
            height: 198,
            backgroundImage: `linear-gradient(180deg, ${card.from}, ${card.to})`,
          }}
        />
      </div>

      <div
        className="absolute flex items-center justify-center"
        style={{ left: 339, top: y, width: 246.577, height: 232.654 }}
      >
        <div
          className="relative overflow-hidden rounded-[10.349px]"
          style={{
            ...TILT_LEFT,
            width: 249,
            height: 198,
            backgroundImage: `linear-gradient(180deg, ${card.from}, ${card.to})`,
          }}
        >
          <div
            className="absolute top-[19.11px] left-[13.92px] h-[158.413px] w-[214.088px] rounded-[8.624px] border border-[rgba(255,255,255,0.4)] bg-[rgba(255,255,255,0.5)]"
            style={{ transform: "rotate(-0.93deg) skewX(-0.93deg)" }}
          />
          <div
            className="absolute top-[32.4px] left-[26.44px] flex w-[190.701px] flex-col gap-[3.45px]"
            style={{ transform: "rotate(-0.93deg) skewX(-0.93deg)" }}
          >
            <div className="flex items-center gap-[8px]">
              {card.avatar && (
                <div className="size-[34px] shrink-0 overflow-hidden rounded-full border-[0.862px] border-white bg-white">
                  <Image
                    src={card.avatar}
                    alt=""
                    width={80}
                    height={80}
                    className="size-full object-cover"
                  />
                </div>
              )}
              <p
                className="text-[17.248px] leading-[1.5] font-semibold"
                style={{ color: card.nameColor }}
              >
                {card.name}
              </p>
            </div>
            <p className="w-[189.691px] text-[12.074px] leading-[1.4] font-normal tracking-[-0.1207px] text-[rgba(0,0,0,0.55)]">
              {card.quote}
            </p>
          </div>
          <CornerDots
            src="/assets/dot-grey.svg"
            positions={[
              [7.07, 7.02],
              [237.3, 9.11],
              [7.07, 186.02],
              [237.3, 186.11],
            ]}
          />
        </div>
      </div>
    </>
  );
}

/** Short line joining a card to the spine, plus the node it lands on. */
function Connector({
  card,
  y,
}: {
  card: Card;
  y: number;
}) {
  const isLeft = card.side === "left";
  const lineY = isLeft ? y + 128 : y + 142.68;
  const nodeY = isLeft ? y + 129 : y + 259.05 - 116;

  return (
    <>
      <div
        className="absolute h-px w-[39px] origin-center"
        style={{
          left: isLeft ? 260 : SPINE_X,
          top: lineY,
          backgroundColor: card.accent,
          transform: `rotate(${isLeft ? 7.31 : -7.31}deg)`,
        }}
      />
      <div
        className="absolute size-[7px] rounded-full"
        style={{
          left: SPINE_X - 3,
          top: nodeY - 3,
          backgroundColor: card.accent,
        }}
      />
    </>
  );
}

export function Issues() {
  const positions = CARDS.map((card, i) => {
    const pair = Math.floor(i / 2);
    const y = card.side === "left" ? pair * PAIR_STEP : pair * PAIR_STEP + 116;
    return y + TOP_PAD;
  });

  const contentHeight = Math.max(...positions) + 280;
  /** How far the rail must travel to reveal the last card. */
  const railTravel = Math.max(0, contentHeight - SCENE_HEIGHT);

  const trackRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const track = trackRef.current;
      const canvas = canvasRef.current;
      if (!track || !canvas) return;

      // How far we've scrolled through the pinned stretch, as 0 → 1.
      const distance = track.offsetHeight - PINNED_HEIGHT;
      const scrolled = -track.getBoundingClientRect().top;
      const progress = Math.min(Math.max(scrolled / distance, 0), 1);

      canvas.style.transform = `translate3d(0, ${-progress * railTravel}px, 0)`;
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
  }, [railTravel]);

  return (
    <section className="-mb-px w-full border border-rule px-[80px]">
      <div className="w-full">
        {/* Tall track: the section stays pinned for as long as the rail needs to travel. */}
        <div
          ref={trackRef}
          className="relative w-full"
          style={{ height: PINNED_HEIGHT + railTravel }}
        >
          <div
            className="sticky top-0 flex w-full items-start overflow-hidden pt-[80px] pl-[40px]"
            style={{ height: PINNED_HEIGHT }}
          >
            <div className="flex w-[1172.177px] items-start justify-between">
              <div className="w-[561px] shrink-0">
                <h2 className="w-[482px] text-[44px] leading-normal font-medium tracking-[-0.88px] text-black">
                  Most people buy insurance{" "}
                  <span className="text-green-9">without knowing</span> what
                  they&apos;re actually buying.
                </h2>
              </div>

              {/* Card rail — driven by page scroll, not its own scrollbar. */}
              <div
                className="w-[603px] shrink-0 overflow-hidden"
                style={{
                  height: SCENE_HEIGHT,
                  // Dissolve cards at the edges instead of slicing them off.
                  maskImage: RAIL_MASK,
                  WebkitMaskImage: RAIL_MASK,
                }}
              >
                <div
                  ref={canvasRef}
                  className="relative w-[603px] will-change-transform"
                  style={{ height: contentHeight }}
                >
                  {/* Spine */}
                  <div
                    className="absolute top-0 w-px bg-[#e3e3e3]"
                    style={{ left: SPINE_X, height: contentHeight }}
                  />

                  {CARDS.map((card, i) => (
                    <div key={`${card.name}-${i}`}>
                      <Connector card={card} y={positions[i]} />
                      {card.side === "left" ? (
                        <NoteCard card={card} y={positions[i]} />
                      ) : (
                        <TestimonialCard card={card} y={positions[i]} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
