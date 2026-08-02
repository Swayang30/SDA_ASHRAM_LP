"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitText from "@/components/reactbits/SplitText";
import Carousel from "@/components/ui/Carousel";
import CountUp from "@/components/ui/CountUp";
import Button from "@/components/ui/Button";
import Parallax from "@/components/ui/Parallax";
import { LotusVine } from "@/components/brand/LotusDecor";
import { ashram } from "@/data/site";

export default function Ashram() {
  return (
    <section
      id="ashram"
      className="relative overflow-hidden bg-brown py-24 text-ivory md:py-32"
    >
      <div className="texture-diagonal absolute inset-0 opacity-50" aria-hidden />
      <Parallax from={50} to={-50} className="pointer-events-none absolute right-0 top-6 w-105 opacity-40">
        <LotusVine className="w-full" stroke="var(--color-gold)" />
      </Parallax>
      <Parallax from={-40} to={40} className="pointer-events-none absolute -left-10 bottom-8 w-90 opacity-30">
        <LotusVine className="w-full rotate-180" stroke="var(--color-gold)" />
      </Parallax>

      <div className="container-site relative">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* image carousel + founded tab */}
          <div className="relative">
            <motion.div
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              whileInView={{ clipPath: "inset(0 0% 0 0)" }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden rounded-3xl shadow-warm"
            >
              <Carousel
                ariaLabel="Ashram images"
                controls
                gap="gap-0"
                slideClassName="min-w-0 flex-[0_0_100%]"
                counterClassName="!mt-4 justify-center"
                slides={ashram.images.map((src, i) => (
                  <div key={i} className="relative aspect-5/4 w-full">
                    <Image
                      src={src}
                      alt={`Ashram view ${i + 1}`}
                      fill
                      sizes="(max-width: 1024px) 90vw, 560px"
                      className="object-cover"
                    />
                  </div>
                ))}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ delay: 0.5, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
              className="absolute -right-3 -top-4 rounded-2xl bg-orange px-5 py-3 text-center shadow-warm md:-right-6"
            >
              <span className="block font-sans text-[0.65rem] uppercase tracking-widest text-white/80">
                Founded on
              </span>
              <span className="font-serif text-3xl font-semibold text-white">
                <CountUp to={ashram.founded} />
              </span>
            </motion.div>
          </div>

          {/* copy */}
          <div>
            <SectionHeading
              lead={ashram.heading}
              size="lg"
              leadClassName="text-ivory"
            />
            <SplitText
              tag="p"
              text={ashram.body}
              splitType="lines"
              delay={110}
              duration={0.7}
              className="mt-6 max-w-xl font-sans text-base leading-[1.9] text-ivory/80"
            />

            <div className="mt-8 flex flex-wrap items-center gap-8">
              <div>
                <span className="font-serif text-4xl font-semibold text-orange">
                  <CountUp to={ashram.branches} suffix="+" />
                </span>
                <span className="ml-2 font-sans text-sm text-ivory/70">
                  branches across India & abroad
                </span>
              </div>
            </div>

            <div className="mt-9">
              <Button href={ashram.cta.href} variant="outline-white">
                {ashram.cta.label}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
