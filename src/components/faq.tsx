"use client";

import { useState } from "react";

const ITEMS: { question: string; answer: string }[] = [
  {
    question: "How does Covey find the right policy for me?",
    answer:
      "You tell Covey about your family, your health, and your budget in plain language — no forms, no jargon. It reads the policy documents for you and recommends only the plans that actually fit, with a clear reason why each one made the list.",
  },
  {
    question: "Do I need to share my phone number?",
    answer:
      "No. You can start instantly and get a full recommendation without giving us a phone number, so a single enquiry never turns into weeks of sales calls.",
  },
  {
    question: "Is Covey free to use?",
    answer:
      "Yes, finding and comparing policies is free. We're paid by the insurer only when you choose to buy, and that never changes which policies Covey shows you or how it ranks them.",
  },
  {
    question: "What does copay actually mean?",
    answer:
      "Copay is the share of every claim you agree to pay yourself — a 10% copay on a ₹5,00,000 claim means you pay ₹50,000. Covey explains terms like this, along with waiting periods and exclusions, before you commit to anything.",
  },
  {
    question: "Can Covey compare policies I'm already considering?",
    answer:
      "Yes. Paste in the plans you're weighing up and Covey will put them side by side on the things that matter — coverage, exclusions, claim settlement, and real cost over time — instead of marketing bullet points.",
  },
  {
    question: "How long does the whole thing take?",
    answer:
      "About 10 minutes. One conversation replaces the five phone calls and the days of research that buying insurance usually costs you.",
  },
];

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className={`shrink-0 transition-transform duration-200 ${
        open ? "rotate-180" : ""
      }`}
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="#0a5136"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="w-full border border-rule px-[80px]">
      <div className="w-full">
        <div className="flex w-full items-start px-[40px] py-[80px]">
          <div className="flex flex-1 flex-col items-center gap-[64px]">
            <h2 className="w-[756px] text-center text-[44px] leading-normal font-medium tracking-[-0.88px] text-black">
              FAQ&rsquo;s
            </h2>

            <div className="w-[756px] border-t border-neutral-300">
              {ITEMS.map((item, i) => {
                const isOpen = open === i;
                return (
                  <div key={item.question} className="border-b border-neutral-300">
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-[24px] py-[24px] text-left"
                    >
                      <span className="text-[20px] leading-normal font-medium tracking-[-0.4px] text-black">
                        {item.question}
                      </span>
                      <Chevron open={isOpen} />
                    </button>
                    <div
                      className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="pr-[44px] pb-[24px] text-[18px] leading-[1.6] font-normal tracking-[-0.36px] text-black opacity-56">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
