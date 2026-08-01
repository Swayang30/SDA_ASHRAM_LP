import type { Metadata } from "next";
import Link from "next/link";
import {
  centralAddress,
  ashramBranches,
  ashramBySlug,
  type AshramBranch,
} from "@/data/site";
import { LotusBloom } from "@/components/brand/LotusDecor";

export const metadata: Metadata = {
  title: "Our Ashrams",
  description:
    "Addresses and contact details for the central office and every branch of Swami Debananda Ashram.",
};

/**
 * A Head Office / Main Ashram / Branch card. When the branch resolves to an
 * entry in `ashrams[]` the WHOLE card becomes a link to that ashram's detail
 * page (§5) — an `after:` overlay on the heading link covers the card, so the
 * phone/email links inside (raised to z-10) still work on their own.
 */
function BranchCard({ branch, highlight = false }: { branch: AshramBranch; highlight?: boolean }) {
  const detail = branch.ashramSlug ? ashramBySlug[branch.ashramSlug] : undefined;
  const href = detail ? `/ashrams/${detail.slug}` : undefined;

  return (
    <div
      className={`group relative flex h-full flex-col rounded-2xl p-7 shadow-warm-sm transition-[transform,box-shadow] duration-500 ease-soft ${
        highlight ? "bg-maroon text-ivory" : "bg-white"
      } ${href ? "hover:-translate-y-2 hover:shadow-warm has-[a:focus-visible]:outline has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-orange" : ""}`}
    >
      <p className="font-sans text-xs uppercase tracking-[0.25em] text-orange">
        {branch.role ?? "Branch"}
      </p>
      <h2
        className={`mt-2 font-serif text-2xl ${highlight ? "text-ivory" : "text-maroon"}`}
      >
        {href ? (
          <Link
            href={href}
            aria-label={`${branch.name} — view ashram details`}
            className="after:absolute after:inset-0 after:z-0 after:rounded-2xl after:content-[''] focus-visible:outline-none"
          >
            {branch.name}
          </Link>
        ) : (
          branch.name
        )}
      </h2>
      <address
        className={`relative z-10 mt-4 space-y-2 wrap-break-word font-sans text-sm not-italic ${
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

      {href && (
        <span className="mt-auto inline-flex items-center gap-2 pt-5 font-sans text-sm font-medium text-orange">
          View ashram
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      )}
    </div>
  );
}

export default function AshramsPage() {
  return (
    <div className="bg-ivory">
      <header className="relative overflow-hidden bg-maroon text-ivory">
        <div className="absolute inset-0 bg-linear-to-t from-maroon via-maroon/80 to-maroon/50" />
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
