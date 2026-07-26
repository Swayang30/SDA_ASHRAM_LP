import type { Metadata } from "next";
import Link from "next/link";
import { OverviewCard } from "@/components/sections/CardSection";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { LotusBloom } from "@/components/brand/LotusDecor";
import { organization } from "@/data/site";

export const metadata: Metadata = {
  title: "Organization Overview",
  description:
    "About the Organization, Leadership (About Gurudev) and Governance of Swami Debananda Ashram.",
};

export default function OrganizationOverviewPage() {
  return (
    <div className="bg-cream">
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
            <span className="text-ivory">Organization</span>
          </nav>
          <p className="font-script text-3xl text-orange">Who we are</p>
          <h1 className="mt-2 font-serif text-[clamp(2.4rem,6vw,4rem)] font-medium leading-[1.05] tracking-tight">
            Organization Overview
          </h1>
          <p className="mt-5 max-w-2xl font-sans text-base leading-relaxed text-ivory/80">
            The foundations of the ashram — its purpose, its Master, and how it is
            guided. Choose a card to explore.
          </p>
        </div>
      </header>

      {/* cards — same pattern as Events & Highlights */}
      <section className="texture-paper py-20 md:py-24">
        <div className="container-site">
          <div className="mb-12">
            <SectionHeading lead="Explore the" accent="Organization" size="md" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {organization.map((o, i) => (
              <Reveal key={o.slug} i={i}>
                <OverviewCard
                  card={{
                    id: o.slug,
                    script: o.script,
                    title: o.title,
                    blurb: o.summary,
                    href: `/organization/${o.slug}`,
                    img: o.img,
                  }}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
