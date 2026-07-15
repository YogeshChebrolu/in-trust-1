import Image from "next/image";

const ROWS: { feature: string; covey: string; traditional: string }[] = [
  {
    feature: "Finding the Right Policy",
    covey:
      "AI recommends only the policies that match your health, budget, and lifestyle—with clear reasons why.",
    traditional: "Generic recommendations with little context or explanation.",
  },
  {
    feature: "Understanding Your Policy",
    covey:
      "Every benefit, exclusion, and insurance term explained in plain English.",
    traditional:
      "Complex policy documents with important details often overlooked.",
  },
  {
    feature: "Policy Comparison",
    covey: "Compare plans visually based on what actually matters.",
    traditional: "Manual comparisons across multiple websites and PDFs.",
  },
  {
    feature: "Personalized Advice",
    covey: "Recommendations tailored to your profile and future needs.",
    traditional: "One-size-fits-most recommendations.",
  },
  {
    feature: "Insurance Education",
    covey:
      "Understand copay, waiting periods, exclusions, and more before buying.",
    traditional: "You're expected to figure it out yourself.",
  },
  {
    feature: "Privacy",
    covey: "Start instantly without sharing your phone number.",
    traditional: "One enquiry often leads to endless sales calls.",
  },
  {
    feature: "Speed",
    covey: "Find the right insurance in around 10 minutes.",
    traditional: "Multiple calls and days of research.",
  },
];

const CELL =
  "-mr-px -mb-px flex flex-1 items-center justify-center border border-neutral-300 px-[31px] py-[22px] text-center text-[20px] leading-normal font-medium tracking-[-0.4px] text-black";

export function Comparison() {
  return (
    <section className="-mb-px w-full border border-rule px-[80px]">
      <div className="w-full">
        <div className="flex w-full items-start px-[40px] py-[80px]">
          <div className="flex flex-1 flex-col items-center gap-[64px]">
            <h2 className="w-[756px] text-center text-[44px] leading-normal font-medium tracking-[-0.88px] text-black">
              Every difference matters when you&apos;re protecting your family.
            </h2>

            <div className="flex w-full flex-col">
              {/* Header row */}
              <div className="flex w-full items-stretch">
                <div className="-mr-px -mb-px h-[83px] flex-1 border border-neutral-300 bg-white" />
                <div className="-mr-px -mb-px flex flex-1 items-center justify-center border border-neutral-300 bg-success-50 p-[8px]">
                  <div className="flex items-center gap-[5.319px] px-[5.427px] py-[4.342px]">
                    <Image
                      src="/assets/logo.svg"
                      alt=""
                      width={23}
                      height={26}
                      className="h-[25.903px] w-[22.794px]"
                    />
                    <span className="text-[21.448px] font-semibold whitespace-nowrap text-green-12">
                      Cover Wisely
                    </span>
                  </div>
                </div>
                <div className="-mb-px flex flex-1 items-center justify-center border border-neutral-300 bg-error-50 px-[31px] py-[22px]">
                  <span className="text-center text-[24px] font-medium tracking-[-0.48px] whitespace-nowrap text-black">
                    Traditional Platforms
                  </span>
                </div>
              </div>

              {ROWS.map((row) => (
                <div key={row.feature} className="flex w-full items-stretch">
                  <div className={`${CELL} bg-white`}>{row.feature}</div>
                  <div className={`${CELL} bg-success-50`}>{row.covey}</div>
                  <div className={`${CELL} mr-0 bg-error-50`}>
                    {row.traditional}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
