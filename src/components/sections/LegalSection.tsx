"use client";

import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import type { LegalModule } from "@/data/modules";

const bgClass = {
  ivory: "bg-ivory",
  cream: "bg-cream texture-paper",
  blush: "bg-blush",
} as const;

/** Homepage §15 — Legal Documentation: a light index of policy documents. */
export default function LegalSection({ module }: { module: LegalModule }) {
  return (
    <section
      id={module.id}
      className={`relative scroll-mt-24 py-24 md:py-28 ${bgClass[module.bg ?? "cream"]}`}
    >
      <div className="container-site">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 font-script text-3xl text-orange">{module.eyebrow}</p>
          <SectionHeading lead={module.heading.lead} accent={module.heading.accent} size="md" />
          {module.intro && (
            <p className="mt-4 font-sans text-sm leading-relaxed text-cocoa/70">
              {module.intro}
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {module.documents.map((doc, i) => (
            <Reveal key={doc.id} i={i}>
              <Link
                href={doc.href}
                className="group flex h-full flex-col rounded-xl border border-maroon/10 bg-white p-6 shadow-warm-sm transition-colors hover:border-orange/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-orange)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                </svg>
                <h3 className="mt-4 font-serif text-lg text-maroon">{doc.title}</h3>
                <p className="mt-2 flex-1 font-sans text-sm leading-relaxed text-cocoa/65">
                  {doc.blurb}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
