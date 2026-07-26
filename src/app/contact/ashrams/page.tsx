import type { Metadata } from "next";
import Link from "next/link";
import { centralAddress, ashramBranches, type AshramBranch } from "@/data/site";
import { LotusBloom } from "@/components/brand/LotusDecor";

export const metadata: Metadata = {
  title: "Our Ashrams",
  description:
    "Addresses and contact details for the central office and every branch of Swami Debananda Ashram.",
};

function BranchCard({ branch, highlight = false }: { branch: AshramBranch; highlight?: boolean }) {
  return (
    <div
      className={`flex h-full flex-col rounded-2xl p-7 shadow-warm-sm ${
        highlight ? "bg-maroon text-ivory" : "bg-white"
      }`}
    >
      <p
        className={`font-sans text-xs uppercase tracking-[0.25em] ${
          highlight ? "text-orange" : "text-orange"
        }`}
      >
        {branch.role ?? "Branch"}
      </p>
      <h2
        className={`mt-2 font-serif text-2xl ${highlight ? "text-ivory" : "text-maroon"}`}
      >
        {branch.name}
      </h2>
      <address
        className={`mt-4 space-y-2 font-sans text-sm not-italic ${
          highlight ? "text-ivory/85" : "text-cocoa/80"
        }`}
      >
        <p>{branch.address}</p>
        {branch.phone && (
          <p>
            <span className={highlight ? "text-ivory/60" : "text-cocoa/50"}>Phone: </span>
            <a href={`tel:${branch.phone.replace(/\s+/g, "")}`} className="hover:text-orange">
              {branch.phone}
            </a>
          </p>
        )}
        {branch.email && (
          <p>
            <span className={highlight ? "text-ivory/60" : "text-cocoa/50"}>Email: </span>
            <a href={`mailto:${branch.email}`} className="hover:text-orange">
              {branch.email}
            </a>
          </p>
        )}
      </address>
    </div>
  );
}

export default function AshramsPage() {
  return (
    <div className="bg-ivory">
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
            <Link href="/#contact" className="hover:text-orange">Contact</Link>
            <span className="mx-2 text-ivory/40">/</span>
            <span className="text-ivory">Our Ashrams</span>
          </nav>
          <p className="font-script text-3xl text-orange">Locations</p>
          <h1 className="mt-2 font-serif text-[clamp(2.4rem,6vw,4rem)] font-medium leading-[1.05] tracking-tight">
            Our Ashrams
          </h1>
          <p className="mt-5 max-w-2xl font-sans text-base leading-relaxed text-ivory/80">
            The central office and every branch — with addresses and contacts.
          </p>
        </div>
      </header>

      <div className="container-site py-16 md:py-20">
        <div className="mb-8">
          <BranchCard branch={centralAddress} highlight />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ashramBranches.map((b) => (
            <BranchCard key={b.id} branch={b} />
          ))}
        </div>

        <div className="mt-14 border-t border-maroon/10 pt-8">
          <Link
            href="/contact/register"
            className="inline-flex items-center gap-2 font-sans text-sm font-medium text-orange hover:text-maroon"
          >
            Register your name with us
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
