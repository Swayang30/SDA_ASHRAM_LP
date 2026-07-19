"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import SectionHeading from "@/components/ui/SectionHeading";
import ActivityIcon from "@/components/ui/ActivityIcon";
import Parallax from "@/components/ui/Parallax";
import { sacredActivities } from "@/data/site";

export default function SacredActivities() {
  const archRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = archRef.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const border = el.querySelector<SVGPathElement>(".arch-border");
      if (border) {
        const len = border.getTotalLength();
        gsap.set(border, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(border, {
          strokeDashoffset: 0,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 75%" },
        });
      }
      gsap.from(el.querySelector(".arch-mask"), {
        clipPath: "inset(100% 0 0 0)",
        duration: 1.3,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 75%" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const { oldAgeHome, list, collage } = sacredActivities;

  return (
    <section
      id="activities"
      className="texture-paper relative bg-ivory py-24 md:py-32"
    >
      <div className="container-site">
        <div className="mb-14">
          <p className="mb-3 font-script text-3xl text-orange">Seva</p>
          <SectionHeading lead="Sacred" accent="Activities" />
        </div>

        <div className="grid items-start gap-12 lg:grid-cols-2">
          {/* left column */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -48 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-3xl bg-blush p-8 shadow-warm-sm"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-orange/15 text-orange">
                  <ActivityIcon name="hands" className="h-6 w-6" />
                </span>
                <h3 className="font-serif text-2xl text-maroon">
                  {oldAgeHome.title}
                </h3>
              </div>
              <p className="mt-4 font-sans text-sm leading-relaxed text-cocoa/75">
                {oldAgeHome.body}
              </p>
            </motion.div>

            <ul className="mt-8 divide-y divide-maroon/10">
              {list.map((item, i) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="group flex items-center gap-4 py-4 transition-colors hover:bg-blush/60"
                >
                  <motion.span
                    whileHover={{ scale: 1.15, rotate: -6 }}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-maroon/8 text-maroon transition-colors group-hover:bg-orange group-hover:text-white"
                  >
                    <ActivityIcon name={item.icon} className="h-5 w-5" />
                  </motion.span>
                  <span className="font-sans text-base text-cocoa transition-colors group-hover:text-maroon">
                    {item.label}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* right — ornate arched frame */}
          <div ref={archRef} className="relative mx-auto w-full max-w-md">
            <div className="relative aspect-4/5">
              {/* dotted arch border */}
              <svg
                viewBox="0 0 100 125"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full"
                fill="none"
                aria-hidden
              >
                <path
                  className="arch-border"
                  d="M4 123 L4 52 C4 25 25 4 50 4 C75 4 96 25 96 52 L96 123"
                  stroke="var(--color-orange)"
                  strokeWidth="1.1"
                  strokeDasharray="1 4"
                  strokeLinecap="round"
                />
              </svg>

              {/* arched image collage — border-radius arch scales with the box */}
              <div
                className="arch-mask absolute inset-1.5 overflow-hidden"
                style={{
                  borderRadius: "48% 48% 0 0 / 55% 55% 0 0",
                }}
              >
                <Parallax from={-30} to={30} className="absolute inset-0">
                  <div className="grid h-[112%] grid-cols-2 grid-rows-2 gap-1">
                    <div className="relative col-span-2 row-span-1">
                      <Image
                        src={collage[0]}
                        alt="Elders receiving care at the ashram"
                        fill
                        sizes="400px"
                        className="object-cover"
                      />
                    </div>
                    <div className="relative">
                      <Image
                        src={collage[1]}
                        alt="Seva in progress"
                        fill
                        sizes="200px"
                        className="object-cover"
                      />
                    </div>
                    <div className="relative">
                      <Image
                        src={collage[2]}
                        alt="Devotees in prayer"
                        fill
                        sizes="200px"
                        className="object-cover"
                      />
                    </div>
                  </div>
                </Parallax>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
