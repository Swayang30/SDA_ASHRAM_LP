"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SplitText from "@/components/reactbits/SplitText";
import Parallax from "@/components/ui/Parallax";
import Button from "@/components/ui/Button";
import { hero } from "@/data/site";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex h-[100svh] min-h-[640px] w-full items-center overflow-hidden bg-black text-white"
    >
      {/* background — slow ken-burns / ripple breathing, parallax drift */}
      <Parallax from={-40} to={80} className="absolute inset-0 -z-10">
        <div className="hero-kenburns absolute inset-0 h-[115%] w-full">
          <Image
            src={hero.image}
            alt="Water ripples across the ashram grounds at dawn"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </Parallax>

      {/* darkening + ripple sheen */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/45 to-black/20" />
      <div className="hero-ripple pointer-events-none absolute inset-0 -z-10 opacity-40" />

      <div className="container-site">
        <div className="max-w-3xl">
          <SplitText
            tag="h1"
            text={hero.headline}
            splitType="words"
            delay={90}
            duration={0.9}
            from={{ opacity: 0, y: 80 }}
            to={{ opacity: 1, y: 0 }}
            className="font-serif text-[clamp(2.6rem,7vw,5.6rem)] font-medium leading-[1.05] tracking-tight text-white"
          />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10"
          >
            <Button href={hero.cta.href} variant="white">
              {hero.cta.label}
            </Button>
          </motion.div>
        </div>
      </div>

      {/* scroll indicator */}
      <motion.a
        href="#events"
        aria-label="Scroll to events"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-white/80"
      >
        <span className="font-sans text-[0.7rem] uppercase tracking-[0.25em]">
          Scroll
        </span>
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-white/50 p-1">
          <motion.span
            className="h-1.5 w-1 rounded-full bg-white"
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.a>
    </section>
  );
}
