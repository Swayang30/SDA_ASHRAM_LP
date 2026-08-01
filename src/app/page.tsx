import HeroSlider from "@/components/sections/HeroSlider";
import MissionBand from "@/components/sections/MissionBand";
import DivineMessage from "@/components/sections/DivineMessage";
import HomeModules from "@/components/home/HomeModules";

/**
 * Homepage composition:
 *   §1 Logo shutter   → layout.tsx (IntroGate — logo reveal, then the site)
 *   §2 Landing        → <HeroSlider />   (hero slide + ashram reel slide)
 *   §2b Motion band   → <MissionBand />  (standalone "mission in motion")
 *   §3 Divine message → <DivineMessage />
 *   §4–15             → <HomeModules />  (order + enabled state live in
 *                                         src/data/modules.ts — change there)
 */
export default function Home() {
  return (
    <>
      <HeroSlider />
      <MissionBand />
      <DivineMessage />
      <HomeModules />
    </>
  );
}
