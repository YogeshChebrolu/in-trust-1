import Image from "next/image";
import { CoveyButton } from "./covey-button";

export function Navbar() {
  return (
    <header className="-mb-px flex w-full items-center justify-between px-4 py-[13px] sm:px-6 lg:px-8">
      <div className="flex shrink-0 items-center gap-[5.319px] px-[5.427px] py-[4.342px]">
        <Image
          src="/assets/logo.svg"
          alt="Cover Wisely"
          width={23}
          height={26}
          className="h-[23px] w-auto"
        />
        <span className="whitespace-nowrap text-[20px] font-semibold text-green-12">
          Cover Wisely
        </span>
      </div>

      <CoveyButton size="sm">Try Covey</CoveyButton>
    </header>
  );
}
