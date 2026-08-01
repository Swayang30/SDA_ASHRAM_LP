"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import Carousel from "@/components/ui/Carousel";
import { gallery, type GalleryItem } from "@/data/site";

export default function Gallery() {
  const [active, setActive] = useState<GalleryItem | null>(null);

  return (
    <section
      id="gallery"
      className="texture-paper relative bg-cream py-24 md:py-32"
    >
      <div className="container-site">
        <div className="mb-14 text-center">
          <p className="mb-3 font-script text-3xl text-orange">Moments</p>
          <SectionHeading lead="Gallery" align="center" className="justify-center" />
        </div>

        <Carousel
          ariaLabel="Photo gallery"
          slideClassName="min-w-0 flex-[0_0_70%] sm:flex-[0_0_38%] lg:flex-[0_0_24%]"
          counterClassName="justify-center"
          slides={gallery.map((g) => (
            <button
              key={g.id}
              onClick={() => setActive(g)}
              className="group relative block aspect-3/4 w-full overflow-hidden rounded-2xl shadow-warm-sm focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-orange"
              aria-label={`View ${g.alt}`}
            >
              <Image
                src={g.src}
                alt={g.alt}
                fill
                sizes="(max-width: 640px) 70vw, 300px"
                className="object-cover grayscale transition-all duration-700 ease-soft group-hover:scale-110 group-hover:grayscale-0"
              />
              <span className="absolute inset-0 bg-maroon/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <span className="absolute bottom-4 left-4 translate-y-3 font-serif text-lg text-white opacity-0 drop-shadow transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                {g.alt}
              </span>
            </button>
          ))}
        />
      </div>

      {/* lightbox */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-90 flex items-center justify-center bg-black/85 p-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              layout
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
              className="relative max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-3/4 w-full">
                <Image
                  src={active.src}
                  alt={active.alt}
                  fill
                  sizes="90vw"
                  className="object-cover"
                />
              </div>
              <p className="absolute bottom-0 w-full bg-linear-to-t from-black/70 to-transparent p-5 font-serif text-lg text-white">
                {active.alt}
              </p>
            </motion.div>
            <button
              onClick={() => setActive(null)}
              aria-label="Close"
              className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
