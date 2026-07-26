/**
 * Single source of truth for all homepage content.
 * Edit copy / lists / cards here — never in the markup.
 *
 * Images use clearly-labelled placeholders (placehold.co) at the correct
 * aspect ratio. Replace `img` values with real exported ashram photography.
 */

// Warm placeholder helper — keeps aspect ratios honest while art is pending.
// `/png` forces a raster response (placehold.co serves SVG by default, which
// Next's image optimizer rejects). Swap these for real photography later.
// Exported so the module + detail-page data files reuse the exact same helper.
export const ph = (
  w: number,
  h: number,
  label: string,
  bg = "541100",
  fg = "FFFBF0"
) =>
  `https://placehold.co/${w}x${h}/${bg}/${fg}/png?text=${encodeURIComponent(label)}`;

export const site = {
  name: "Swami Debananda Ashram",
  shortName: "SDA",
  tagline: "Build a heart that can touch all other hearts.",
  description:
    "Swami Debananda Ashram — a spiritual monastic organization dedicated to meditation, discipline, and inner growth, founded by Satguru Swami Debananda Maharaj.",
  url: "https://swamidebanandaashram.org",
  locale: "en",
};

// ------------------------------------------------------------------ //
// Navigation — TODO: confirm real menu labels with client.            //
// ------------------------------------------------------------------ //
export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

// Route-aware hrefs: a leading "/#id" jumps to a homepage section from ANY
// route; a bare "/path" is a full page. Reordering the homepage modules in
// `modules.ts` does not break these — the anchor ids are stable.
export const nav: NavItem[] = [
  { label: "Home", href: "/#home" },
  { label: "Divine Message", href: "/divine-message" },
  {
    label: "Organization",
    href: "/organization",
    children: [
      { label: "About the Organization", href: "/organization/about" },
      { label: "Leadership — About Gurudev", href: "/organization/leadership" },
      { label: "Governance", href: "/organization/governance" },
    ],
  },
  {
    label: "Contact",
    href: "/#contact",
    children: [
      { label: "Our Ashrams", href: "/contact/ashrams" },
      { label: "Name Registration", href: "/contact/register" },
    ],
  },
];

// ------------------------------------------------------------------ //
// Hero                                                                //
// ------------------------------------------------------------------ //
export const hero = {
  headline: "Build a heart that can touch all other hearts.",
  // Primary landing action — takes the visitor into the site content.
  enterCta: { label: "Enter site", href: "#divine" },
  cta: { label: "Learn more", href: "#organization" },
  // Optional looping ripple video; falls back to the image if absent.
  // TODO: drop the real dark water-ripple reel at public/video/hero-ripple.mp4
  video: "/video/hero-ripple.mp4",
  // TODO: replace with the real dark ripple still. Kept a warm dark tone + label
  // so the hero never reads as a plain black box while art is pending.
  image: ph(1920, 1080, "Water Ripple — replace with ashram footage", "2c1810", "ff8a5b"),
};

// ------------------------------------------------------------------ //
// Mission activity reels + images — the landing-page auto-scroll strip //
// TODO: replace each `img` with a real reel thumbnail / photograph.    //
// A `video` (optional) can later turn a tile into an inline reel.      //
// ------------------------------------------------------------------ //
export interface ReelItem {
  id: string;
  label: string;
  img: string;
}

export const missionReels: ReelItem[] = [
  { id: "r1", label: "Anna Daan", img: ph(640, 800, "Anna Daan Reel", "541100") },
  { id: "r2", label: "Meditation", img: ph(640, 800, "Meditation Reel", "744012") },
  { id: "r3", label: "Healthcare Camp", img: ph(640, 800, "Healthcare Reel", "48342b") },
  { id: "r4", label: "Namgaan & Kirtan", img: ph(640, 800, "Kirtan Reel", "6a3410") },
  { id: "r5", label: "Elder Care", img: ph(640, 800, "Elder Care Reel", "541100") },
  { id: "r6", label: "Vedic Education", img: ph(640, 800, "Education Reel", "744012") },
  { id: "r7", label: "Festivals", img: ph(640, 800, "Festival Reel", "48342b") },
  { id: "r8", label: "Seva", img: ph(640, 800, "Seva Reel", "6a3410") },
];

// ------------------------------------------------------------------ //
// Events & Highlights                                                 //
// ------------------------------------------------------------------ //
export interface EventItem {
  id: string;
  script: string; // small script grace-note above the title
  title: string;
  place: string;
  date: string;
  time: string;
  img: string;
}

export const events: EventItem[] = [
  {
    id: "guru-purnima",
    script: "Darshan",
    title: "Guru Purnima",
    place: "Krishnapur Nadia Ashram, Bardhaman",
    date: "12th July, Sunday",
    time: "11:00am onwards",
    img: ph(900, 1100, "Guru Purnima"),
  },
  {
    id: "janmashtami",
    script: "Utsav",
    title: "Janmashtami",
    place: "Krishnapur Nadia Ashram, Bardhaman",
    date: "26th August, Tuesday",
    time: "6:00pm onwards",
    img: ph(900, 1100, "Janmashtami", "744012"),
  },
  {
    id: "kali-puja",
    script: "Aradhana",
    title: "Kali Puja",
    place: "Krishnapur Nadia Ashram, Bardhaman",
    date: "20th October, Monday",
    time: "9:00pm onwards",
    img: ph(900, 1100, "Kali Puja", "48342b"),
  },
  {
    id: "annakut",
    script: "Bhog",
    title: "Annakut Utsav",
    place: "Krishnapur Nadia Ashram, Bardhaman",
    date: "22nd October, Wednesday",
    time: "10:00am onwards",
    img: ph(900, 1100, "Annakut", "744012"),
  },
];

// ------------------------------------------------------------------ //
// Quote band                                                          //
// ------------------------------------------------------------------ //
export const quote = {
  // `emphasis` words are tinted orange and settle a beat later.
  lead: "The most difficult work in the world",
  emphasis: "is to be simple.",
  signature: "Swami Debananda Maharaj",
};

// ------------------------------------------------------------------ //
// Divine Message (homepage §3) — the Master's message, quick links,   //
// and the latest image of Gurudev.                                    //
// TODO: swap `portrait` for the latest photograph of Gurudev.         //
// ------------------------------------------------------------------ //
export const divineMessage = {
  eyebrow: "The Divine Message",
  script: "A word from the Master",
  // The message body — kept as short paragraphs for graceful line-reveal.
  message:
    "Awaken to the light within. Serve without expectation, love without condition, and let simplicity be your discipline. The path to the divine is walked one selfless act at a time.",
  signature: "Swami Debananda Maharaj",
  portrait: ph(900, 1150, "Latest Image of Gurudev", "6a3410", "ffd9b0"),
  portraitCaption: "Gurudev — latest darshan",
  // Quick links surface the most-visited destinations without a menu hop.
  quickLinks: [
    { label: "About the Organization", href: "/organization/about" },
    { label: "About Gurudev", href: "/organization/leadership" },
    { label: "Governance", href: "/organization/governance" },
    { label: "Our Ashrams", href: "/contact/ashrams" },
    { label: "Name Registration", href: "/contact/register" },
    { label: "Contact Us", href: "/#contact" },
  ],
};

// ------------------------------------------------------------------ //
// Sacred Activities                                                   //
// ------------------------------------------------------------------ //
export const sacredActivities = {
  heading: { lead: "Sacred", accent: "Activities" },
  oldAgeHome: {
    title: "Old age home",
    body: "A loving home for our elders — providing shelter, healthcare, companionship, and spiritual care so that every senior lives their final years in peace, warmth, and dignity.",
  },
  // TODO: replace with the real activity names + icons.
  list: [
    { icon: "lotus", label: "Meditation & Yajna" },
    { icon: "heart", label: "Namgaan & Kirtan" },
    { icon: "leaf", label: "Spiritual Discussions" },
    { icon: "hands", label: "Free Healthcare Camps" },
    { icon: "book", label: "Vedic Education" },
    { icon: "bowl", label: "Anna Daan (Food Service)" },
  ],
  collage: [
    ph(600, 800, "Elders Care", "744012"),
    ph(600, 400, "Seva", "541100"),
    ph(600, 400, "Prayer", "48342b"),
  ],
};

// ------------------------------------------------------------------ //
// Founder feature                                                     //
// ------------------------------------------------------------------ //
export const founder = {
  eyebrow: "His Holiness",
  name: "Swami Debananda Maharaj",
  bio: "A saint and philosopher, arrived for mankind's spiritual growth after years as a Naga sanyasin. Initiated at six by Swami Gyanananda Maharaj, he renounced his comfortable life in Kolkata, believing a selfish life is not a true life. At seventeen, he devoted himself to serving mankind as an ascetic.",
  portrait: ph(900, 1150, "Swami Debananda Maharaj", "6a3410", "ffd9b0"),
};

// ------------------------------------------------------------------ //
// Organization Overview (homepage §4 + routes /organization/*)         //
// Single source for the overview cards AND the detail pages.           //
// A section's `type` decides how DetailPageView renders it:            //
//   text (heading+body) · list (bulleted) · timeline · gallery         //
// TODO: replace all copy + images with the real content.               //
// ------------------------------------------------------------------ //
export type OrgSectionType = "text" | "list" | "timeline" | "gallery";

export interface OrgSection {
  id: string; // anchor + side-menu key
  heading: string;
  type?: OrgSectionType; // defaults to "text"
  body?: string[];
  list?: string[];
  timeline?: { year: string; title: string; text?: string }[];
  gallery?: { id: string; label: string; img: string }[];
}

export interface OrgItem {
  slug: string; // about | leadership | governance
  title: string;
  summary: string; // card blurb
  script: string; // card grace-note
  img: string; // card image
  eyebrow: string; // detail-page script eyebrow
  subtitle: string; // detail-page subtitle
  hero: string; // detail-page hero image
  sections: OrgSection[];
}

export const organization: OrgItem[] = [
  {
    slug: "about",
    title: "About the Organization",
    summary:
      "Vision, mission, core values, history, milestones and why the ashram exists.",
    script: "Foundation",
    img: ph(900, 1100, "About the Organization", "541100"),
    eyebrow: "Foundation",
    subtitle:
      "The vision, mission and story of Swami Debananda Ashram — why it exists and how it came to be.",
    hero: ph(1600, 900, "About the Organization", "541100"),
    sections: [
      {
        id: "vision",
        heading: "Vision Statement",
        body: [
          "A world awakened to its own inner light — where every heart, regardless of birth or circumstance, has the means and the guidance to grow toward the divine.",
        ],
      },
      {
        id: "mission",
        heading: "Mission Statement",
        body: [
          "To guide seekers along the spiritual path through meditation, discipline and selfless service, while caring for the vulnerable and preserving the timeless teachings of the Master.",
        ],
      },
      {
        id: "core-values",
        heading: "Core Values",
        type: "list",
        list: [
          "Renunciation — freedom from attachment",
          "Love — unconditional and universal",
          "Respect — for all beings and all faiths",
          "Joy — the natural state of a simple heart",
          "Selfless Service — seva without expectation",
        ],
      },
      {
        id: "purpose",
        heading: "Purpose",
        body: [
          "The ashram exists to make spiritual practice accessible and to translate inner realisation into outward service — meditation and yajna on one hand, food, healthcare and shelter on the other.",
        ],
      },
      {
        id: "history",
        heading: "Organizational History",
        body: [
          "Founded in 1996 by Satguru Swami Debananda Maharaj, the ashram began as a single hermitage dedicated to meditation and the care of the elderly.",
          "Over the following decades it grew into a spiritual monastic organization with branches across India and abroad, each upholding the same ideals of Renunciation, Love, Respect and Joy.",
        ],
      },
      {
        id: "milestones",
        heading: "Key Milestones",
        type: "timeline",
        timeline: [
          { year: "1996", title: "The ashram is founded", text: "Established at Krishnapur, Nadia by Swami Debananda Maharaj." },
          { year: "2003", title: "First old age home", text: "A loving home for elders opens its doors." },
          { year: "2010", title: "Healthcare camps begin", text: "Free medical camps extend seva to surrounding villages." },
          { year: "2018", title: "15 branches", text: "The sangha spreads across India and abroad." },
        ],
      },
      {
        id: "timeline",
        heading: "Timeline",
        type: "timeline",
        timeline: [
          { year: "Then", title: "A single hermitage", text: "Meditation, yajna and the care of a few elders." },
          { year: "Now", title: "A monastic organization", text: "Meditation, education, healthcare and philanthropy across many centres." },
          { year: "Ahead", title: "A living tradition", text: "Carrying the Master's teachings to the next generation." },
        ],
      },
      {
        id: "founder-story",
        heading: "Founder Story",
        body: [
          "Initiated at the age of six by Swami Gyanananda Maharaj, Swami Debananda Maharaj renounced a comfortable life in Kolkata, believing that a selfish life is not a true life.",
          "At seventeen he devoted himself entirely to serving mankind as an ascetic, and after years as a Naga sanyasin he returned for the spiritual upliftment of others.",
        ],
      },
      {
        id: "why-we-exist",
        heading: "Why the Organization Exists",
        body: [
          "Because realisation that stays within is incomplete. The ashram exists so that inner growth and outer service become one path — walked together, one selfless act at a time.",
        ],
      },
    ],
  },
  {
    slug: "leadership",
    title: "Leadership — About Gurudev",
    summary:
      "The life, spiritual journey, teachings and message of Swami Debananda Maharaj.",
    script: "Guru",
    img: ph(900, 1100, "About Gurudev", "744012"),
    eyebrow: "Guru",
    subtitle:
      "The life, spiritual journey and teachings of Satguru Swami Debananda Maharaj.",
    hero: ph(1600, 900, "About Gurudev", "744012"),
    sections: [
      {
        id: "biography",
        heading: "Biography",
        body: [
          "Swami Debananda Maharaj is a saint and philosopher who arrived for mankind's spiritual growth after years as a Naga sanyasin.",
          "Born into a comfortable Kolkata family, he was initiated into spiritual life at the age of six and chose renunciation over comfort while still a young man.",
        ],
      },
      {
        id: "spiritual-journey",
        heading: "Spiritual Journey",
        body: [
          "From initiation at six, through the austerities of a Naga ascetic, to the founding of the ashram in 1996 — his journey is one of ever-deepening surrender and service.",
        ],
      },
      {
        id: "message-from-master",
        heading: "Message from Master",
        body: [
          "\"Build a heart that can touch all other hearts. The most difficult work in the world is to be simple — so make simplicity your discipline, and let love be your only method.\"",
        ],
      },
      {
        id: "key-teachings",
        heading: "Key Teachings",
        type: "list",
        list: [
          "A selfish life is not a true life.",
          "Serve without expectation of reward.",
          "Simplicity is the highest discipline.",
          "Renunciation, Love, Respect and Joy are one path.",
          "The divine is realised through selfless action.",
        ],
      },
      {
        id: "exclusive-images",
        heading: "Baba's Exclusive Images",
        type: "gallery",
        body: [
          "A collection of rare darshan moments. (Placeholder gallery — auto-scrolling and swipeable; swap in real photographs.)",
        ],
        gallery: [
          { id: "b1", label: "Darshan", img: ph(640, 800, "Baba 01", "6a3410", "ffd9b0") },
          { id: "b2", label: "Meditation", img: ph(640, 800, "Baba 02", "541100", "ffd9b0") },
          { id: "b3", label: "Blessing", img: ph(640, 800, "Baba 03", "744012", "ffd9b0") },
          { id: "b4", label: "Yajna", img: ph(640, 800, "Baba 04", "48342b", "ffd9b0") },
          { id: "b5", label: "Discourse", img: ph(640, 800, "Baba 05", "6a3410", "ffd9b0") },
          { id: "b6", label: "Festival", img: ph(640, 800, "Baba 06", "541100", "ffd9b0") },
        ],
      },
    ],
  },
  {
    slug: "governance",
    title: "Governance",
    summary:
      "Trustees, organizational structure, policies and how the ashram is administered.",
    script: "Structure",
    img: ph(900, 1100, "Governance", "48342b"),
    eyebrow: "Structure",
    subtitle:
      "How Swami Debananda Ashram is administered, overseen and held accountable.",
    hero: ph(1600, 900, "Governance", "48342b"),
    sections: [
      {
        id: "board",
        heading: "Board of Trustees",
        body: [
          "The ashram is governed by a Board of Trustees responsible for its spiritual continuity, ethical conduct and stewardship of resources. (TODO: trustee names & roles.)",
        ],
      },
      {
        id: "structure",
        heading: "Organizational Structure",
        body: [
          "A central office coordinates the branches, each led by resident sanyasins and supported by volunteers who carry out daily worship, service and administration.",
        ],
      },
      {
        id: "policies",
        heading: "Policies",
        type: "list",
        list: [
          "Code of conduct for residents and volunteers",
          "Child and elder protection policy",
          "Donation and financial-use policy",
          "Grievance redressal policy",
        ],
      },
      {
        id: "oversight",
        heading: "Financial Oversight",
        body: [
          "Accounts are independently audited each year, and summaries are published under Impact & Transparency to keep the sangha informed.",
        ],
      },
      {
        id: "committees",
        heading: "Committees",
        type: "list",
        list: [
          "Spiritual affairs committee",
          "Philanthropy & seva committee",
          "Finance & audit committee",
          "Events & festivals committee",
        ],
      },
    ],
  },
];

export const organizationBySlug: Record<string, OrgItem> = Object.fromEntries(
  organization.map((o) => [o.slug, o])
);

// ------------------------------------------------------------------ //
// Ashram                                                              //
// ------------------------------------------------------------------ //
export const ashram = {
  heading: "Ashram",
  founded: 1996,
  branches: 15,
  foundedTab: "Founded on 1996",
  body: "Founded by Satguru Swami Debananda Maharaj, Swami Debananda Ashram is a spiritual monastic organization dedicated to meditation, discipline, and inner growth. With 15 branches across India and abroad, the ashram guides devotees through practices such as meditation, yajna, namgaan, and spiritual discussions while upholding the ideals of Renunciation, Love, Respect, and Joy.",
  cta: { label: "Learn more", href: "#founder" },
  images: [
    ph(1000, 800, "Ashram Grounds", "744012"),
    ph(1000, 800, "Temple", "541100"),
    ph(1000, 800, "Prayer Hall", "48342b"),
  ],
};

// ------------------------------------------------------------------ //
// Books & Publications                                                //
// ------------------------------------------------------------------ //
export interface BookItem {
  id: string;
  title: string;
  author: string;
  cover: string;
  href: string;
  coverBg: string; // spine/cover accent
}

export const books: BookItem[] = [
  {
    id: "tripto",
    title: "Tripto",
    author: "Swami Debananda Maharaj",
    cover: ph(600, 820, "Tripto", "1f5136", "ffe9c7"),
    href: "#",
    coverBg: "#1f5136",
  },
  {
    id: "antaryatra",
    title: "Antaryatra",
    author: "Swami Debananda Maharaj",
    cover: ph(600, 820, "Antaryatra", "6a1f10", "ffe9c7"),
    href: "#",
    coverBg: "#6a1f10",
  },
  {
    id: "premamoy",
    title: "Premamoy",
    author: "Swami Debananda Maharaj",
    cover: ph(600, 820, "Premamoy", "2a3d66", "ffe9c7"),
    href: "#",
    coverBg: "#2a3d66",
  },
  {
    id: "sadhana",
    title: "Sadhana Path",
    author: "Swami Debananda Maharaj",
    cover: ph(600, 820, "Sadhana Path", "7a5a12", "ffe9c7"),
    href: "#",
    coverBg: "#7a5a12",
  },
];

export const booksMeta = {
  heading: { lead: "Books", accent: "and Publications" },
  readerImage: ph(800, 1000, "Reading", "744012"),
};

// ------------------------------------------------------------------ //
// Gallery                                                             //
// ------------------------------------------------------------------ //
export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
}

export const gallery: GalleryItem[] = [
  { id: "g1", src: ph(700, 900, "Sadhu", "541100"), alt: "A sadhu in meditation" },
  { id: "g2", src: ph(700, 900, "Devotees", "744012"), alt: "Devotees at prayer" },
  { id: "g3", src: ph(700, 900, "Aarti", "48342b"), alt: "Evening aarti" },
  { id: "g4", src: ph(700, 900, "Festival", "6a3410"), alt: "Festival gathering" },
  { id: "g5", src: ph(700, 900, "Ashram Life", "541100"), alt: "Daily ashram life" },
  { id: "g6", src: ph(700, 900, "Sannyasin", "744012"), alt: "A sannyasin" },
];

// ------------------------------------------------------------------ //
// Contact & Map                                                       //
// TODO: replace with the ashram's real NAP details.                   //
// ------------------------------------------------------------------ //
export const contact = {
  heading: "Krishnapur Nadia",
  rows: [
    { label: "General enquiries", value: "info@swamidebanandaashram.org" },
    { label: "Customer service", value: "seva@swamidebanandaashram.org" },
    { label: "Phone", value: "+91 00000 00000" },
    { label: "Fax", value: "+91 00000 00001" },
    { label: "Email", value: "contact@swamidebanandaashram.org" },
    {
      label: "Address",
      value: "Krishnapur, Nadia / Bardhaman, West Bengal, India",
    },
  ],
  cta: { label: "Contact us", href: "#contact" },
  mapImage: ph(1000, 900, "Map+Krishnapur+Nadia", "e7ddc8", "744012"),
};

// ------------------------------------------------------------------ //
// Ashram branches — the central address + every branch, listed on the //
// Contact → "Our Ashrams" page. TODO: replace with real NAP details.  //
// ------------------------------------------------------------------ //
export interface AshramBranch {
  id: string;
  name: string;
  role?: string; // e.g. "Head Office" / "Branch"
  address: string;
  phone?: string;
  email?: string;
}

export const centralAddress: AshramBranch = {
  id: "central",
  name: "Swami Debananda Ashram — Central Office",
  role: "Head Office",
  address: "Krishnapur, Nadia, West Bengal 741101, India",
  phone: "+91 00000 00000",
  email: "info@swamidebanandaashram.org",
};

export const ashramBranches: AshramBranch[] = [
  {
    id: "krishnapur",
    name: "Krishnapur Nadia Ashram",
    role: "Main Ashram",
    address: "Krishnapur, Nadia, West Bengal 741101, India",
    phone: "+91 00000 00001",
    email: "krishnapur@swamidebanandaashram.org",
  },
  {
    id: "bardhaman",
    name: "Bardhaman Ashram",
    role: "Branch",
    address: "Bardhaman, West Bengal, India",
    phone: "+91 00000 00002",
    email: "bardhaman@swamidebanandaashram.org",
  },
  {
    id: "kolkata",
    name: "Kolkata Centre",
    role: "Branch",
    address: "Kolkata, West Bengal, India",
    phone: "+91 00000 00003",
    email: "kolkata@swamidebanandaashram.org",
  },
];

// ------------------------------------------------------------------ //
// Footer                                                              //
// ------------------------------------------------------------------ //
export const footer = {
  wordmark: "SWAMI DEBANANDA ASHRAM",
  newsletter: {
    title: "Stay connected",
    body: "Receive event dates, teachings, and news from the ashram.",
    placeholder: "Your email address",
    cta: "Subscribe",
  },
  columns: [
    {
      title: "Organization",
      links: [
        { label: "About the Organization", href: "/organization/about-the-organization" },
        { label: "About Gurudev", href: "/organization/leadership" },
        { label: "Governance", href: "/organization/governance" },
        { label: "Divine Message", href: "/#divine" },
      ],
    },
    {
      title: "Connect",
      links: [
        { label: "Our Ashrams", href: "/contact/ashrams" },
        { label: "Name Registration", href: "/contact/register" },
        { label: "Contact", href: "/#contact" },
        { label: "Legal", href: "/#legal" },
      ],
    },
  ],
  copyright: "© 2025 Swami Debananda Ashram. All rights reserved.",
};

export const introConfig = {
  LOGO_MS: 10000,
  VIDEO_MAX_MS: 30000,
  video: "/video/intro-reel.mp4",
  poster: ph(1920, 1080, "Ashram+Reel", "1a0a00", "ff552b"),
};
