"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import Carousel from "@/components/ui/Carousel";
import Parallax from "@/components/ui/Parallax";
import Button from "@/components/ui/Button";
import { books, booksMeta, type BookItem } from "@/data/site";

function BookCard({ book }: { book: BookItem }) {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ rx: 0, ry: 0, gx: 50 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setT({ ry: (px - 0.5) * 16, rx: -(py - 0.5) * 16, gx: px * 100 });
  };
  const onLeave = () => setT({ rx: 0, ry: 0, gx: 50 });

  return (
    <div style={{ perspective: 1000 }} className="h-full">
      <motion.article
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        animate={{ rotateX: t.rx, rotateY: t.ry }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        style={{ transformStyle: "preserve-3d" }}
        className="group flex h-full flex-col items-center rounded-2xl bg-white p-6 shadow-warm-sm transition-shadow duration-500 hover:shadow-warm"
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg shadow-lg">
          <Image
            src={book.cover}
            alt={`${book.title} — book cover`}
            fill
            sizes="(max-width: 640px) 60vw, 240px"
            className="object-cover"
          />
          {/* sheen */}
          <span
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: `linear-gradient(105deg, transparent ${t.gx - 20}%, rgba(255,255,255,0.35) ${t.gx}%, transparent ${t.gx + 20}%)`,
            }}
          />
        </div>
        <h3 className="mt-5 font-serif text-2xl text-maroon">{book.title}</h3>
        <p className="mt-1 font-sans text-xs text-cocoa/60">{book.author}</p>
        <div className="mt-4">
          <Button href={book.href} variant="maroon" className="!px-6 !py-2.5">
            Read now
          </Button>
        </div>
      </motion.article>
    </div>
  );
}

export default function BooksPublications() {
  return (
    <section id="books" className="relative bg-blush py-24 md:py-32">
      <div className="container-site">
        <div className="mb-14 grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <Parallax from={30} to={-30} className="relative mx-auto hidden w-full max-w-xs lg:block">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-warm">
              <Image
                src={booksMeta.readerImage}
                alt="A devotee reading"
                fill
                sizes="320px"
                className="object-cover"
              />
            </div>
          </Parallax>

          <div>
            <p className="mb-3 font-script text-3xl text-orange">Wisdom</p>
            <SectionHeading
              lead={booksMeta.heading.lead}
              accent={booksMeta.heading.accent}
            />
            <p className="mt-5 max-w-md font-sans text-sm leading-relaxed text-cocoa/70">
              Teachings and reflections of Swami Debananda Maharaj — a path
              inward, in his own words.
            </p>
          </div>
        </div>

        <Carousel
          ariaLabel="Books and publications"
          slideClassName="min-w-0 flex-[0_0_72%] sm:flex-[0_0_42%] lg:flex-[0_0_26%]"
          slides={books.map((b) => (
            <BookCard key={b.id} book={b} />
          ))}
        />
      </div>
    </section>
  );
}
