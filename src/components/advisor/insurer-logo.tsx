"use client";

// The insurer brand mark, used wherever a policy is mentioned: tab icons,
// in-chat reference chips, premium quote rows, compare headers, funnel
// survivors. Logos vary wildly in aspect ratio (square crests to wide
// wordmarks), so each renders inside a fixed box with `object-contain`.
// Unknown insurers get a quiet monogram so the layout never jumps.

import { cn } from "@/lib/utils";
import { insurerLogo, insurerMonogram } from "@/lib/insurer-logos";

export function InsurerLogo({
  name,
  className,
  imgClassName,
}: {
  /** Insurer name as it appears in the payload (short or legal long form). */
  name: string | null | undefined;
  /** Sizes the box — default suits inline/chip use. */
  className?: string;
  imgClassName?: string;
}) {
  const logo = insurerLogo(name);

  if (!logo) {
    return (
      <span
        aria-hidden
        className={cn(
          "bg-secondary text-text-muted grid size-4.5 shrink-0 place-items-center rounded-sm text-[8px] font-bold",
          className,
        )}
      >
        {insurerMonogram(name)}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "grid size-4.5 shrink-0 place-items-center overflow-hidden",
        className,
      )}
    >
      {/* Plain <img>: tiny optimized static assets, no next/image config. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logo.src}
        alt={logo.name}
        width={logo.width}
        height={logo.height}
        loading="lazy"
        decoding="async"
        className={cn("max-h-full max-w-full object-contain", imgClassName)}
      />
    </span>
  );
}
