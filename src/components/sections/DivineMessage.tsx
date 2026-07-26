"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import SplitText from "@/components/reactbits/SplitText";
import { LotusBloom } from "@/components/brand/LotusDecor";
import { divineMessage } from "@/data/site";

/**
 * Homepage §3 — "The Divine Message": the Master's message alongside quick
 * links and the latest image of Gurudev.
 */
export default function DivineMessage() {
  return (
    <section
      id="divine"
      className="texture-paper relative overflow-hidden bg-ivory py-24 md:py-32"
    >
      <LotusBloom
        className="pointer-events-none absolute -left-16 -top-10 h-72 w-72 opacity-[0.05] lg:h-96 lg:w-96"
        fill="var(--color-maroon)"
      />

      <div className="container-site relative grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
        {/* message + quick links */}
        <div>
          <p className="font-script text-3xl text-orange">{divineMessage.script}</p>
          <h2 className="mt-2 font-serif text-[clamp(2rem,4.5vw,3.4rem)] font-medium leading-[1.1] tracking-tight text-maroon">
            {divineMessage.eyebrow}
          </h2>

          <div className="relative mt-8">
            <motion.span
              initial={{ opacity: 0, scale: 0.4, rotate: -25 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
              className="pointer-events-none absolute -left-2 -top-10 font-serif text-8xl leading-none text-orange/25"
              aria-hidden
            >
              &ldquo;
            </motion.span>
            <SplitText
              tag="p"
              text={divineMessage.message}
              splitType="lines"
              delay={90}
              duration={0.7}
              className="relative max-w-xl font-serif text-[clamp(1.25rem,2.4vw,1.7rem)] italic leading-[1.7] text-cocoa/85"
            />
          </div>

          <p className="mt-6 font-script text-2xl text-orange">
            — {divineMessage.signature}
          </p>

          {/* quick links */}
          <nav aria-label="Quick links" className="mt-10">
            <p className="mb-4 font-sans text-xs uppercase tracking-[0.25em] text-cocoa/50">
              Quick links
            </p>
            <ul className="flex flex-wrap gap-3">
              {divineMessage.quickLinks.map((link, i) => (
                <motion.li
                  key={link.href + link.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                >
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 rounded-full border border-maroon/15 bg-white px-4 py-2 font-sans text-sm text-cocoa shadow-warm-sm transition-colors hover:border-orange/40 hover:text-maroon focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
                  >
                    {link.label}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-orange transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav>
        </div>

        {/* latest image of Gurudev */}
        <div className="relative mx-auto w-full max-w-sm">
          <motion.div
            initial={{ opacity: 0, scale: 1.04 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden rounded-[2rem] shadow-warm"
          >
            <div className="relative aspect-[4/5]">
              <Image
                src={divineMessage.portrait}
                alt={divineMessage.portraitCaption}
                fill
                sizes="(max-width: 1024px) 90vw, 384px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-maroon/45 via-transparent to-transparent" />
            </div>
          </motion.div>
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-maroon px-6 py-2 shadow-warm-sm">
            <span className="font-script text-xl text-ivory">
              {divineMessage.portraitCaption}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
