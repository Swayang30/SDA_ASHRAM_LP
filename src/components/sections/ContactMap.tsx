"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SplitText from "@/components/reactbits/SplitText";
import Button from "@/components/ui/Button";
import { contact } from "@/data/site";

export default function ContactMap() {
  return (
    <section id="contact" className="relative bg-ivory">
      <div className="grid lg:grid-cols-2">
        {/* map */}
        <div className="relative min-h-[360px] overflow-hidden lg:min-h-[620px]">
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.15 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 6, ease: "easeOut" }}
          >
            <Image
              src={contact.mapImage}
              alt="Map showing the ashram at Krishnapur, Nadia"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-maroon/5" />

          {/* dropping pin */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full"
            initial={{ y: -140, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ type: "spring", stiffness: 260, damping: 12, delay: 0.3 }}
          >
            <svg width="46" height="46" viewBox="0 0 24 24" fill="var(--color-orange)" aria-hidden className="drop-shadow-lg">
              <path
                d="M12 2C7.6 2 4 5.6 4 10c0 5.4 7 11.5 7.3 11.7.4.3 1 .3 1.4 0C13 21.5 20 15.4 20 10c0-4.4-3.6-8-8-8Z"
                stroke="white"
                strokeWidth="1"
              />
              <circle cx="12" cy="10" r="3" fill="white" />
            </svg>
            <motion.span
              className="mx-auto block h-2 w-2 rounded-full bg-black/30 blur-[2px]"
              animate={{ scaleX: [0.4, 1, 0.4] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
          </motion.div>
        </div>

        {/* details */}
        <div className="flex items-center px-6 py-20 md:px-14">
          <div className="w-full max-w-lg">
            <p className="font-script text-3xl text-orange">Visit us</p>
            <SplitText
              tag="h2"
              text={contact.heading}
              splitType="chars"
              delay={40}
              className="mt-1 font-serif text-[clamp(2.2rem,5vw,3.6rem)] font-medium text-maroon"
            />

            <dl className="mt-10 divide-y divide-maroon/10">
              {contact.rows.map((row, i) => (
                <motion.div
                  key={row.label}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ delay: i * 0.07, duration: 0.5 }}
                  className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <dt className="font-sans text-xs uppercase tracking-widest text-cocoa/50">
                    {row.label}
                  </dt>
                  <dd className="font-sans text-sm text-cocoa">{row.value}</dd>
                </motion.div>
              ))}
            </dl>

            <div className="mt-9">
              <Button href={contact.cta.href} variant="ink">
                {contact.cta.label}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
