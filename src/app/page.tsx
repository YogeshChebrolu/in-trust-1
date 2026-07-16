import { Navbar } from "@/components/navbar";
import { HeroExperience } from "@/components/hero-experience";
import { WhyCovey } from "@/components/why-covey";
// Remaining sections below the story are hidden for now.
// import { Process } from "@/components/process";
// import { Comparison } from "@/components/comparison";
// import { Faq } from "@/components/faq";

export default function Home() {
  return (
    <main className="flex flex-col items-start bg-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center">
        <Navbar />
        <HeroExperience />
        <WhyCovey />
        {/* Hidden for now — restore when ready.
        <Process />
        <Comparison />
        <Faq /> */}
      </div>
    </main>
  );
}