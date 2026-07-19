"use client";

import { motion } from "framer-motion";
import SplitText from "@/components/reactbits/SplitText";
import Parallax from "@/components/ui/Parallax";
import { TropicalLeaf } from "@/components/brand/LotusDecor";
import { quote } from "@/data/site";

export default function QuoteBand() {
  return (
    <section className="relative overflow-hidden bg-ivory py-28 md:py-36">
      {/* flanking leaves — gentle sway + parallax */}
      <Parallax from={40} to={-40} className="pointer-events-none absolute -left-6 bottom-0 top-0 hidden w-[22vw] max-w-[240px] sm:block">
        <div className="leaf-sway h-full origin-bottom">
          <TropicalLeaf className="h-full w-full" />
        </div>
      </Parallax>
      <Parallax from={-40} to={40} className="pointer-events-none absolute -right-6 bottom-0 top-0 hidden w-[22vw] max-w-[240px] sm:block">
        <div className="leaf-sway-alt h-full origin-bottom">
          <TropicalLeaf className="h-full w-full" flip />
        </div>
      </Parallax>

      <div className="container-site relative">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mx-auto mb-6 block font-serif text-6xl leading-none text-orange/40">
            &ldquo;
          </span>
          <h2 className="font-serif text-[clamp(1.8rem,4.5vw,3.4rem)] font-medium leading-tight text-maroon">
            <SplitText
              tag="span"
              text={quote.lead}
              splitType="words"
              delay={70}
              className="inline"
            />{" "}
            <SplitText
              tag="span"
              text={quote.emphasis}
              splitType="words"
              delay={90}
              duration={0.8}
              from={{ opacity: 0, y: 30 }}
              to={{ opacity: 1, y: 0 }}
              className="inline italic text-orange"
            />
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ delay: 0.6, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 font-script text-4xl text-orange md:text-5xl"
          >
            {quote.signature}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
