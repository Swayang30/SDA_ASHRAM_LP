"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SplitText from "@/components/reactbits/SplitText";
import Parallax from "@/components/ui/Parallax";
import Button from "@/components/ui/Button";
import MarqueeReel from "@/components/ui/MarqueeReel";
import { hero, missionReels } from "@/data/site";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex h-[100svh] min-h-[680px] w-full flex-col overflow-hidden bg-[#1a0d07] text-white"
    >
      {/* background — labelled dark water-ripple placeholder, breathing with a
          slow ken-burns drift so it never reads as a plain black box.
          TODO: when the real ripple reel exists at hero.video, layer a muted
          autoplay <video className="absolute inset-0 h-full w-full object-cover">
          on top of this Image (it must keep object-cover + inset-0 to avoid
          expanding to the file's intrinsic width). */}
      <Parallax from={-40} to={80} className="absolute inset-0 -z-10">
        <div className="hero-kenburns absolute inset-0 h-[115%] w-full">
          <Image
            src={hero.image}
            alt="Still water rippling across the ashram grounds at dawn"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </Parallax>

      {/* darkening for headline contrast + soft ripple sheen */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/75 via-black/45 to-black/25" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="hero-ripple pointer-events-none absolute inset-0 -z-10 opacity-60" />

      {/* headline + actions — pt clears the fixed navbar so they never collide */}
      <div className="container-site relative z-10 flex flex-1 items-center pt-28 md:pt-32">
        <div className="max-w-3xl">
          <SplitText
            tag="h1"
            text={hero.headline}
            splitType="words"
            delay={90}
            duration={0.9}
            from={{ opacity: 0, y: 80 }}
            to={{ opacity: 1, y: 0 }}
            className="font-serif text-[clamp(2.4rem,6.4vw,5.4rem)] font-medium leading-[1.06] tracking-tight text-white"
          />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Button href={hero.enterCta.href} variant="white">
              {hero.enterCta.label}
            </Button>
            <Button href={hero.cta.href} variant="outline-white">
              {hero.cta.label}
            </Button>
          </motion.div>
        </div>
      </div>

      {/* mission activity reels + images — auto-scroll landing strip */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 pb-8 md:pb-10"
      >
        <div className="container-site mb-3 flex items-center gap-3">
          <span className="font-script text-2xl text-orange">Our mission in motion</span>
          <span className="h-px flex-1 bg-white/20" aria-hidden />
        </div>
        <MarqueeReel
          items={missionReels}
          speed={0.5}
          tileClassName="w-40 md:w-48"
          aspect="aspect-[4/5]"
        />
      </motion.div>
    </section>
  );
}
