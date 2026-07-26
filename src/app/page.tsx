import Hero from "@/components/sections/Hero";
import DivineMessage from "@/components/sections/DivineMessage";
import HomeModules from "@/components/home/HomeModules";

/**
 * Homepage composition:
 *   §1 Logo shutter  → layout.tsx (IntroGate)
 *   §2 Landing page  → <Hero />           (mission reels + Enter site)
 *   §3 Divine message → <DivineMessage />
 *   §4–15            → <HomeModules />    (order + enabled state live in
 *                                          src/data/modules.ts — change there)
 */
export default function Home() {
  return (
    <>
      <Hero />
      <DivineMessage />
      <HomeModules />
    </>
  );
}
