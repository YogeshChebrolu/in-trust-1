import type { Metadata } from "next";
import {
  Onest,
  Bricolage_Grotesque,
  IBM_Plex_Sans,
  Inter,
  Inter_Tight,
} from "next/font/google";
import "./globals.css";

const onest = Onest({
  subsets: ["latin"],
  variable: "--font-onest",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cover Wisely — Find the right insurance in 10 minutes",
  description:
    "Buying insurance shouldn't mean endless calls, confusing jargon, or pressure from sales agents.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${onest.variable} ${bricolage.variable} ${plex.variable} ${inter.variable} ${interTight.variable} bg-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
