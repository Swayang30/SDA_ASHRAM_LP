"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import SplitText from "@/components/reactbits/SplitText";
import { LotusBloom } from "@/components/brand/LotusDecor";
import { divineMessage } from "@/data/site";

/**
 * The Divine Message page (route /divine-message): a featured teaching from
 * Gurudev, quick links to key destinations, and the latest image of Gurudev.
 * Reuses the `divineMessage` content from site.ts.
 */
export default function DivineMessagePage() {
  return (
    <div className="bg-ivory">
      {/* hero band */}
      <header className="relative overflow-hidden bg-maroon text-ivory">
        <div className="absolute inset-0 bg-gradient-to-t from-maroon via-maroon/80 to-maroon/50" />
        <LotusBloom
          className="pointer-events-none absolute -right-10 -top-8 h-60 w-60 opacity-10"
          fill="var(--color-gold)"
        />
        <div className="container-site relative py-20 pt-32 md:pt-36">
          <nav aria-label="Breadcrumb" className="mb-5 font-sans text-sm text-ivory/70">
            <Link href="/" className="hover:text-orange">Home</Link>
            <span className="mx-2 text-ivory/40">/</span>
            <span className="text-ivory">Divine Message</span>
          </nav>
          <p className="font-script text-3xl text-orange">{divineMessage.script}</p>
          <h1 className="mt-2 font-serif text-[clamp(2.4rem,6vw,4rem)] font-medium leading-[1.05] tracking-tight">
            The Divine Message
          </h1>
        </div>
      </header>

      {/* message + latest image of Gurudev */}
      <section className="texture-paper relative overflow-hidden py-20 md:py-28">
        <LotusBloom
          className="pointer-events-none absolute -left-16 top-10 h-72 w-72 opacity-[0.05] lg:h-96 lg:w-96"
          fill="var(--color-maroon)"
        />
        <div className="container-site relative grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          {/* featured message */}
          <div>
            <div className="relative">
              <motion.span
                initial={{ opacity: 0, scale: 0.4, rotate: -25 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
                className="pointer-events-none absolute -left-2 -top-12 font-serif text-[7rem] leading-none text-orange/25"
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
                className="relative max-w-2xl font-serif text-[clamp(1.5rem,3vw,2.4rem)] italic leading-[1.5] text-maroon"
              />
            </div>
            <p className="mt-8 font-script text-3xl text-orange">
              — {divineMessage.signature}
            </p>
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
                  priority
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

      {/* quick links */}
      <section className="bg-cream py-16 md:py-20">
        <div className="container-site">
          <p className="mb-6 font-sans text-xs uppercase tracking-[0.25em] text-cocoa/50">
            Quick links
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {divineMessage.quickLinks.map((link, i) => (
              <motion.div
                key={link.href + link.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <Link
                  href={link.href}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-maroon/12 bg-white px-6 py-5 shadow-warm-sm transition-colors hover:border-orange/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
                >
                  <span className="font-serif text-lg text-maroon">{link.label}</span>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-orange transition-transform group-hover:translate-x-1"
                    aria-hidden
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
