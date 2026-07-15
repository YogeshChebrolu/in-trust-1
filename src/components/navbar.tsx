import Image from "next/image";
import { CoveyButton } from "./covey-button";

const LINKS = [
  { label: "How it works", weight: "font-normal text-[#1f1f1f]" },
  { label: "Insurance 101", weight: "font-medium text-[#3d3d3d]" },
  { label: "Features", weight: "font-normal text-[#3d3d3d]" },
];

export function Navbar() {
  return (
    <header className="-mb-px flex w-full items-center justify-between px-[100px] py-[22px]">
      <div className="flex shrink-0 items-center gap-[5.319px] px-[5.427px] py-[4.342px]">
        <Image
          src="/assets/logo.svg"
          alt="Cover Wisely"
          width={23}
          height={26}
          className="h-[25.903px] w-[22.794px]"
        />
        <span className="whitespace-nowrap text-[21.448px] font-semibold text-green-12">
          Cover Wisely
        </span>
      </div>

      <nav className="flex shrink-0 items-center gap-[2px]">
        {LINKS.map((link) => (
          <a
            key={link.label}
            href="#"
            className={`flex items-center rounded-[8px] p-[12px] text-[17px] leading-[1.5] whitespace-nowrap ${link.weight}`}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <CoveyButton size="sm">Try Covey</CoveyButton>
    </header>
  );
}
