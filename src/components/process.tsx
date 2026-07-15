import Image from "next/image";

const STEPS = [1, 2, 3];

const BODY =
  "Connect all the tools your business runs on. SightShark pulls from ad platforms, CRMs, spreadsheets, data warehouses, and more — and keeps it synced in real time.";

function Step({ index }: { index: number }) {
  return (
    <div className="flex w-[319.333px] shrink-0 flex-col gap-[55px]">
      <div className="flex size-[39px] shrink-0 items-center justify-center rounded-[40px] border border-green-3 bg-gradient-to-b from-green-12 to-[#0c8860] px-[12px] py-[6px]">
        <span className="text-[24px] leading-[1.2] font-medium tracking-[-0.48px] text-white">
          {index}
        </span>
      </div>
      <div className="flex w-full flex-col gap-[34px]">
        <div className="flex shrink-0 items-center justify-center self-start rounded-[6px] bg-neutral-200 p-[6px]">
          <span className="text-[20px] leading-[1.2] font-medium tracking-[-0.4px] whitespace-nowrap text-[#111]">
            Connect Your Data
          </span>
        </div>
        <div className="flex w-full flex-col gap-[14px] text-[#111]">
          <p className="text-[24px] leading-[1.2] font-medium tracking-[-0.48px]">
            Connect Your Data
          </p>
          <p className="text-[18px] leading-normal font-normal tracking-[-0.36px] opacity-56">
            {BODY}
          </p>
        </div>
      </div>
    </div>
  );
}

export function Process() {
  return (
    <section className="-mb-px w-full border border-rule px-[80px]">
      <div className="relative w-full overflow-hidden bg-[linear-gradient(180deg,#010501_0%,#00190d_70.236%,#069851_100%)]">
        {/* Grain texture */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'url("/assets/texture.png")',
            backgroundSize: "337px 337px",
          }}
        />

        <div className="relative flex w-full flex-col items-start px-[40px] py-[80px]">
          <div className="flex w-[1172.177px] items-start justify-center pb-[40px]">
            <div className="flex w-[847px] flex-col items-center gap-[20px]">
              <div className="flex items-center justify-center rounded-[241.958px] bg-green-2 px-[22px] py-[10px]">
                <span className="text-[16px] leading-normal font-normal tracking-[-0.32px] whitespace-nowrap text-neutral-700">
                  How Cover Surely works
                </span>
              </div>
              <h2 className="text-center text-[44px] leading-normal font-medium tracking-[-0.88px] whitespace-nowrap text-white">
                Steps between you and real clarity.
              </h2>
            </div>
          </div>

          <div className="relative flex items-end gap-[43px] rounded-[17px] bg-green-1 px-[34px] py-[30px]">
            <div className="absolute top-[50px] left-[60px] h-px w-[811px]">
              <Image
                src="/assets/dash-h.svg"
                alt=""
                width={811}
                height={1}
                className="h-full w-full"
              />
            </div>

            <Step index={STEPS[0]} />
            <div className="h-[186px] w-px shrink-0">
              <Image
                src="/assets/dash-v.svg"
                alt=""
                width={1}
                height={186}
                className="h-full w-full"
              />
            </div>
            <Step index={STEPS[1]} />
            <div className="h-[186px] w-px shrink-0">
              <Image
                src="/assets/dash-v.svg"
                alt=""
                width={1}
                height={186}
                className="h-full w-full"
              />
            </div>
            <Step index={STEPS[2]} />
          </div>
        </div>
      </div>
    </section>
  );
}
