const RADIAL_SHEEN = [
  // Dark scrim, then the green sheen rising from the top-left corner.
  "radial-gradient(ellipse 86% 86% at 9.7% 17.3%, rgba(6,64,43,0.8) 15.38%, rgba(3,34,24,1) 100%)",
  "radial-gradient(ellipse 86% 86% at 9.7% 17.3%, rgba(61,198,148,0.8) 15.38%, rgba(46,157,117,0.85) 36.5%, rgba(32,116,86,0.9) 57.7%, rgba(17,75,55,0.95) 78.8%, rgba(10,54,40,0.975) 89.4%, rgba(3,34,24,1) 100%)",
].join(", ");

const PRODUCT_URL = "https://coverwisely.vercel.app/";

const BASE_LAYERS = [
  "linear-gradient(90deg, rgba(255,255,255,0.01) 0%, rgba(255,255,255,0.01) 100%)",
  'url("/assets/btn-texture.png")',
  "linear-gradient(172.34deg, rgba(255,255,255,0.15) 8.56%, rgba(255,255,255,0) 85.04%)",
  "linear-gradient(90deg, #0a5136 0%, #0a5136 100%)",
].join(", ");

export function CoveyButton({
  children,
  size = "md",
}: {
  children: React.ReactNode;
  size?: "sm" | "md";
}) {
  return (
    <a
      href={PRODUCT_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`relative flex shrink-0 items-center justify-center overflow-hidden ${
        size === "sm"
          ? "rounded-[8px] px-4 py-2"
          : "rounded-[10px] px-[21px] py-[12px]"
      }`}
    >
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[10px]">
        <span
          className="absolute inset-0 rounded-[10px] bg-left-top"
          style={{
            backgroundImage: BASE_LAYERS,
            backgroundSize: "auto, 32px 32px, auto, auto",
          }}
        />
        <span className="absolute inset-0 rounded-[10px] bg-[rgba(15,102,66,0.6)] mix-blend-overlay" />
        <span
          className="absolute inset-0 rounded-[10px]"
          style={{ backgroundImage: RADIAL_SHEEN }}
        />
      </span>
      <span
        className={`relative whitespace-nowrap font-medium leading-[1.5] text-white ${
          size === "sm"
            ? "text-[15px] tracking-[-0.3px]"
            : "text-[16px] tracking-[-0.32px]"
        }`}
      >
        {children}
      </span>
    </a>
  );
}
