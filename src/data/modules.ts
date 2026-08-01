/**
 * HOMEPAGE MODULE REGISTRY  — controls homepage sections 4 … 15.
 * ---------------------------------------------------------------------------
 * The feedback says the ORDER of pages 4–15 "may be altered later" and must be
 * "easy to change". So every one of those sections is described here as data,
 * and the homepage simply renders `activeModules` in order.
 *
 * TO REORDER  → change the `order` numbers (or drag the objects around).
 * TO SHOW/HIDE → flip `enabled`.
 * TO ADD A NEW CARD SECTION (e.g. items 5–13) → copy a `kind: "cards"` block,
 *                give it cards + a stable `id`, set `enabled: true`.
 *
 * Fixed sections 1–3 (intro shutter, hero landing, divine message) live in the
 * layout / page shell, NOT here, because their order never changes.
 */

import {
  ph,
  centralAddress,
  ashramBranches,
  organization,
  sakhaSection,
} from "./site";

// ------------------------------------------------------------------ //
// Shared types                                                        //
// ------------------------------------------------------------------ //
export interface CardLink {
  id: string;
  /** small script grace-note above the title (optional) */
  script?: string;
  title: string;
  blurb: string;
  href: string;
  img: string;
}

type Bg = "ivory" | "cream" | "blush";

interface BaseModule {
  id: string; // stable anchor id — used by nav + deep links
  order: number; // lower = higher on the page
  enabled: boolean;
  navLabel: string;
  eyebrow: string; // script grace-note
  heading: { lead: string; accent?: string };
  intro?: string;
  bg?: Bg;
}

/** A grid of cards, each linking to a detail page — the "event page pattern". */
export interface CardsModule extends BaseModule {
  kind: "cards";
  cards: CardLink[];
}

/** Contact — central address + cards (Ashrams, Name registration form). */
export interface ContactModule extends BaseModule {
  kind: "contact";
  address: typeof centralAddress;
  branchCount: number;
  mapImage: string;
  cards: CardLink[];
}

/** Legal documentation — a light index of policy documents. */
export interface LegalModule extends BaseModule {
  kind: "legal";
  documents: { id: string; title: string; blurb: string; href: string }[];
}

/**
 * "Sakha Ashrams" — the pinned right→left horizontal-scroll section.
 * Its cards come straight from `ashrams` in site.ts (add an ashram there and
 * it appears here AND at /ashrams/[slug] automatically), so this entry only
 * carries the section's position in the page order.
 */
export interface SakhaModule extends BaseModule {
  kind: "sakha";
}

export type HomeModule =
  | CardsModule
  | ContactModule
  | LegalModule
  | SakhaModule;

// ------------------------------------------------------------------ //
// The registry                                                        //
// ------------------------------------------------------------------ //
export const homeModules: HomeModule[] = [
  // 4 — Organization Overview  (PRIORITY — built)
  {
    kind: "cards",
    id: "organization",
    order: 4,
    enabled: true,
    navLabel: "Organization",
    eyebrow: "Who we are",
    heading: { lead: "Organization", accent: "Overview" },
    intro:
      "The foundations of the ashram — its purpose, its Master, and how it is guided.",
    bg: "cream",
    // Cards derive from the `organization` data so the homepage preview and the
    // /organization page never drift apart.
    cards: organization.map((o) => ({
      id: o.slug,
      script: o.script,
      title: o.title,
      blurb: o.summary,
      href: `/organization/${o.slug}`,
      img: o.img,
    })),
  },

  // 4.5 — Sakha Ashrams  (PRIORITY — built). Sits immediately after the
  //       Organization Overview; the fractional order keeps 5–15 untouched.
  {
    kind: "sakha",
    id: sakhaSection.id,
    order: 4.5,
    enabled: true,
    navLabel: "Sakha Ashrams",
    eyebrow: sakhaSection.eyebrow,
    heading: sakhaSection.heading,
    intro: sakhaSection.intro,
    bg: "cream",
  },

  // 5 — Spiritual Content            (scaffolded, disabled — flip to build)
  {
    kind: "cards",
    id: "spiritual-content",
    order: 5,
    enabled: false,
    navLabel: "Spiritual Content",
    eyebrow: "Wisdom",
    heading: { lead: "Spiritual", accent: "Content" },
    bg: "ivory",
    cards: [
      { id: "teachings", title: "Teachings", blurb: "Core teachings of the Master.", href: "#", img: ph(900, 1100, "Teachings", "541100") },
      { id: "discourses", title: "Discourses", blurb: "Recorded discourses.", href: "#", img: ph(900, 1100, "Discourses", "744012") },
      { id: "quotes", title: "Quotes & Wisdom", blurb: "Words to live by.", href: "#", img: ph(900, 1100, "Quotes", "48342b") },
      { id: "bhajans", title: "Bhajans / Songs", blurb: "Devotional music.", href: "#", img: ph(900, 1100, "Bhajans", "6a3410") },
      { id: "articles", title: "Spiritual Articles — Dipta Divakar", blurb: "Reflections & essays.", href: "#", img: ph(900, 1100, "Articles", "541100") },
      { id: "books", title: "Master's Literary Works / Books", blurb: "Published books.", href: "#", img: ph(900, 1100, "Books", "744012") },
    ],
  },

  // 6 — Ashram Content              (scaffolded, disabled)
  {
    kind: "cards",
    id: "ashram-content",
    order: 6,
    enabled: false,
    navLabel: "Ashrams",
    eyebrow: "Our homes",
    heading: { lead: "Ashram", accent: "Content" },
    bg: "cream",
    cards: ashramBranches.map((b) => ({
      id: b.id,
      title: b.name,
      blurb: b.address,
      href: "/contact/ashrams",
      img: ph(900, 1100, b.name, "744012"),
    })),
  },

  // 7 — Events                      (scaffolded, disabled)
  {
    kind: "cards",
    id: "events",
    order: 7,
    enabled: false,
    navLabel: "Events",
    eyebrow: "Gather",
    heading: { lead: "Events", accent: "& Calendar" },
    bg: "ivory",
    cards: [
      { id: "annual-calendar", title: "Annual Calendar", blurb: "The year's observances.", href: "#", img: ph(900, 1100, "Annual Calendar", "541100") },
      { id: "event-details", title: "Event Details", blurb: "Upcoming darshan & festivals.", href: "#", img: ph(900, 1100, "Event Details", "744012") },
      { id: "live-streaming", title: "Live Streaming", blurb: "Watch live from the ashram.", href: "#", img: ph(900, 1100, "Live Streaming", "48342b") },
    ],
  },

  // 8 — Philanthropic Activities    (scaffolded, disabled)
  {
    kind: "cards",
    id: "philanthropic",
    order: 8,
    enabled: false,
    navLabel: "Philanthropy",
    eyebrow: "Seva",
    heading: { lead: "Philanthropic", accent: "Activities" },
    bg: "cream",
    cards: [
      { id: "education", title: "Education", blurb: "Schooling & scholarships.", href: "#", img: ph(900, 1100, "Education", "541100") },
      { id: "healthcare", title: "Healthcare", blurb: "Free medical camps.", href: "#", img: ph(900, 1100, "Healthcare", "744012") },
      { id: "old-age-homes", title: "Old Age Homes", blurb: "Care for our elders.", href: "#", img: ph(900, 1100, "Old Age Homes", "48342b") },
      { id: "livelihood", title: "Livelihood Programs", blurb: "Skills & self-reliance.", href: "#", img: ph(900, 1100, "Livelihood", "6a3410") },
    ],
  },

  // 9 — Impact & Transparency       (scaffolded, disabled)
  {
    kind: "cards",
    id: "impact",
    order: 9,
    enabled: false,
    navLabel: "Impact",
    eyebrow: "Accountability",
    heading: { lead: "Impact", accent: "& Transparency" },
    bg: "ivory",
    cards: [
      { id: "statistics", title: "Statistics", blurb: "Lives touched, by the numbers.", href: "#", img: ph(900, 1100, "Statistics", "541100") },
      { id: "annual-reports", title: "Annual Reports", blurb: "Year-on-year reporting.", href: "#", img: ph(900, 1100, "Annual Reports", "744012") },
      { id: "financials", title: "Audited Financial Statements", blurb: "Independently audited accounts.", href: "#", img: ph(900, 1100, "Financials", "48342b") },
    ],
  },

  // 10 — Donation                   (scaffolded, disabled)
  {
    kind: "cards",
    id: "donation",
    order: 10,
    enabled: false,
    navLabel: "Donate",
    eyebrow: "Give",
    heading: { lead: "Donation", accent: "" },
    bg: "cream",
    cards: [
      { id: "why-donate", title: "Why Donate", blurb: "Where your gift goes.", href: "#", img: ph(900, 1100, "Why Donate", "541100") },
      { id: "categories", title: "Donation Categories", blurb: "Choose a cause.", href: "#", img: ph(900, 1100, "Categories", "744012") },
      { id: "sponsorship", title: "Sponsorship", blurb: "Sponsor a programme.", href: "#", img: ph(900, 1100, "Sponsorship", "48342b") },
    ],
  },

  // 11 — Media Center               (scaffolded, disabled)
  {
    kind: "cards",
    id: "media",
    order: 11,
    enabled: false,
    navLabel: "Media",
    eyebrow: "Gallery",
    heading: { lead: "Media", accent: "Center" },
    bg: "ivory",
    cards: [
      { id: "photo-gallery", title: "Photo Gallery", blurb: "Moments from the ashram.", href: "#", img: ph(900, 1100, "Photo Gallery", "541100") },
      { id: "video-gallery", title: "Video Gallery", blurb: "Films & reels.", href: "#", img: ph(900, 1100, "Video Gallery", "744012") },
      { id: "press", title: "Press Coverage", blurb: "In the news.", href: "#", img: ph(900, 1100, "Press Coverage", "48342b") },
    ],
  },

  // 12 — Devotees                   (scaffolded, disabled)
  {
    kind: "cards",
    id: "devotees",
    order: 12,
    enabled: false,
    navLabel: "Devotees",
    eyebrow: "Sangha",
    heading: { lead: "Devotees", accent: "" },
    bg: "cream",
    cards: [
      { id: "volunteer", title: "Volunteer Opportunities", blurb: "Offer your seva.", href: "#", img: ph(900, 1100, "Volunteer", "541100") },
      { id: "devotees", title: "Devotees", blurb: "Our community.", href: "#", img: ph(900, 1100, "Devotees", "744012") },
      { id: "testimonials", title: "Testimonials", blurb: "Voices of the sangha.", href: "#", img: ph(900, 1100, "Testimonials", "48342b") },
    ],
  },

  // 13 — Ashram Store               (scaffolded, disabled)
  {
    kind: "cards",
    id: "store",
    order: 13,
    enabled: false,
    navLabel: "Store",
    eyebrow: "Shop",
    heading: { lead: "Ashram", accent: "Store" },
    bg: "ivory",
    cards: [
      { id: "store-books", title: "Books", blurb: "Published works.", href: "#", img: ph(900, 1100, "Store — Books", "541100") },
      { id: "store-photos", title: "Photos", blurb: "Framed darshan.", href: "#", img: ph(900, 1100, "Store — Photos", "744012") },
      { id: "store-stationary", title: "Stationary", blurb: "Diaries & more.", href: "#", img: ph(900, 1100, "Store — Stationary", "48342b") },
    ],
  },

  // 14 — Contact                    (PRIORITY — built)
  {
    kind: "contact",
    id: "contact",
    order: 14,
    enabled: true,
    navLabel: "Contact",
    eyebrow: "Reach us",
    heading: { lead: "Contact", accent: "Us" },
    intro:
      "Our central office, every ashram, and a place to register your name with us.",
    bg: "ivory",
    address: centralAddress,
    branchCount: ashramBranches.length,
    mapImage: ph(1000, 900, "Map+Krishnapur+Nadia", "e7ddc8", "744012"),
    cards: [
      {
        id: "ashrams",
        script: "Locations",
        title: "Our Ashrams",
        blurb: `Addresses and contacts for the central office and all ${ashramBranches.length} branches.`,
        href: "/contact/ashrams",
        img: ph(900, 1100, "Our Ashrams", "744012"),
      },
      {
        id: "register",
        script: "Join us",
        title: "Name Registration Form",
        blurb: "Register your name to receive blessings, updates and event invitations.",
        href: "/contact/register",
        img: ph(900, 1100, "Name Registration", "541100"),
      },
    ],
  },

  // 15 — Legal Documentation        (built — light index)
  {
    kind: "legal",
    id: "legal",
    order: 15,
    enabled: true,
    navLabel: "Legal",
    eyebrow: "Compliance",
    heading: { lead: "Legal", accent: "Documentation" },
    intro: "Registration, policies and terms governing the organization.",
    bg: "cream",
    documents: [
      { id: "registration", title: "Trust Registration", blurb: "Certificate of registration of the trust.", href: "#" },
      { id: "80g", title: "80G / 12A Certificates", blurb: "Tax-exemption certifications.", href: "#" },
      { id: "privacy", title: "Privacy Policy", blurb: "How we handle your data.", href: "#" },
      { id: "terms", title: "Terms of Use", blurb: "Terms governing this website.", href: "#" },
    ],
  },
];

/** What the homepage actually renders — enabled modules, in order. */
export const activeModules: HomeModule[] = homeModules
  .filter((m) => m.enabled)
  .sort((a, b) => a.order - b.order);
