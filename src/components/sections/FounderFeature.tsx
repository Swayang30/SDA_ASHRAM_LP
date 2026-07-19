"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import ScrollFloat from "@/components/reactbits/ScrollFloat";
import SplitText from "@/components/reactbits/SplitText";
import Parallax from "@/components/ui/Parallax";
import { LotusBloom } from "@/components/brand/LotusDecor";
import { founder } from "@/data/site";

export default function FounderFeature() {
  return (
    <section
      id="founder"
      className="texture-paper relative overflow-hidden bg-cream py-24 md:py-32"
    >
      {/* drifting pattern accent */}
      <Parallax from={80} to={-80} className="pointer-events-none absolute -right-16 top-10 hidden opacity-[0.06] lg:block">
        <LotusBloom className="h-[420px] w-[420px]" fill="var(--color-maroon)" />
      </Parallax>

      <div className="container-site relative">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* text */}
          <div>
            <p className="font-script text-4xl text-orange">
              {founder.eyebrow}
            </p>
            <h2 className="mt-2 font-serif text-[clamp(2.2rem,5vw,3.8rem)] font-medium leading-[1.08] tracking-tight">
              <ScrollFloat textClassName="heading-lead">
                Swami Debananda
              </ScrollFloat>{" "}
              <ScrollFloat textClassName="heading-accent">Maharaj</ScrollFloat>
            </h2>

            <div className="relative mt-8">
              <motion.span
                initial={{ opacity: 0, scale: 0.4, rotate: -25 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
                className="pointer-events-none absolute -left-2 -top-10 font-serif text-8xl leading-none text-orange/30"
                aria-hidden
              >
                &ldquo;
              </motion.span>
              <SplitText
                tag="p"
                text={founder.bio}
                splitType="lines"
                delay={120}
                duration={0.7}
                className="relative max-w-xl font-sans text-base leading-[1.9] text-cocoa/80"
              />
            </div>
          </div>

          {/* portrait — mask wipe + parallax */}
          <div className="relative mx-auto w-full max-w-md">
            <motion.div
              initial={{ clipPath: "inset(0 0 100% 0)" }}
              whileInView={{ clipPath: "inset(0 0 0% 0)" }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden rounded-[2rem] shadow-warm"
            >
              <Parallax from={-24} to={24}>
                <div className="relative aspect-[4/5] scale-110">
                  <Image
                    src={founder.portrait}
                    alt={founder.name}
                    fill
                    sizes="(max-width: 1024px) 90vw, 440px"
                    className="object-cover"
                  />
                </div>
              </Parallax>
            </motion.div>
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-maroon px-6 py-2 shadow-warm-sm">
              <span className="font-script text-xl text-ivory">
                {founder.eyebrow}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
