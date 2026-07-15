import { Navbar } from "@/components/navbar";
import { HeroExperience } from "@/components/hero-experience";
import { Issues } from "@/components/issues";
import { Process } from "@/components/process";
import { Comparison } from "@/components/comparison";
import { Faq } from "@/components/faq";

export default function Home() {
  return (
    <main className="flex flex-col items-start bg-white">
      <div className="mx-auto flex w-[1440px] flex-col items-center">
        <Navbar />
        <HeroExperience />
        <Issues />
        <Process />
        <Comparison />
        <Faq />
      </div>
    </main>
  );
}
