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

// The `nav` array itself lives at the FOOT of this file: its "Our Work"
// children are derived from `programs`, which is declared further down, and a
// module-level const cannot read a binding declared after it.

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
// Hero slider — the full-viewport auto-advancing landing carousel.    //
// Slide 1 is the original hero; slide 2 is the ashram reel that used  //
// to play as intro phase 2. Add a slide by appending to this array —  //
// the dots, prev/next and autoplay all derive from its length.        //
// ------------------------------------------------------------------ //
/**
 * A discriminated union on purpose: a `reel` slide has NO copy fields at all,
 * so headline / eyebrow / body / CTA text cannot leak back onto it by accident
 * — the reel slide is a purely visual media surface.
 */
interface HeroSlideBase {
  id: string;
  /** Short label announced to screen readers for the dot + slide controls. */
  navLabel: string;
}

export interface HeroStillSlide extends HeroSlideBase {
  kind: "still";
  eyebrow?: string;
  headline: string;
  body?: string;
  /** Background still, ken-burns drifted. */
  image: string;
  /** Optional muted looping background reel. Falls back to `image` if absent. */
  video?: string;
  ctas: {
    label: string;
    href: string;
    variant: "white" | "outline-white" | "orange";
  }[];
}

export interface HeroReelSlide extends HeroSlideBase {
  kind: "reel";
  /**
   * Optional poster still shown before/instead of the video (and always, under
   * `prefers-reduced-motion`). Left undefined while art is pending so the slide
   * falls back to the wordless brand gradient — a labelled placeholder image
   * would put text back on a slide that must carry none.
   * TODO: add the real 16:9 poster frame here.
   */
  poster?: string;
  /** The ashram reel played full-bleed behind the slide. */
  video: string;
}

export type HeroSlide = HeroStillSlide | HeroReelSlide;

export const heroSlides: HeroSlide[] = [
  {
    id: "welcome",
    kind: "still",
    headline: "Build a heart that can touch all other hearts.",
    navLabel: "Welcome",
    // TODO: replace with the real dark water-ripple footage/still.
    image: ph(1920, 1080, "Water Ripple — replace with ashram footage", "2c1810", "ff8a5b"),
    video: "/video/hero-ripple.mp4",
    ctas: [
      { label: "Enter site", href: "#divine", variant: "white" },
      { label: "Learn more", href: "#organization", variant: "outline-white" },
    ],
  },
  {
    // Reel slide — no copy, no CTA, no placeholder lettering. Just the film.
    id: "ashram-reel",
    kind: "reel",
    navLabel: "Ashram film",
    video: "/video/hero1.mp4",
  },
];

/** Autoplay cadence + crossfade for the hero slider (ms / s). */
export const heroSliderConfig = {
  AUTOPLAY_MS: 5600,
  FADE_S: 1.1,
};

// ------------------------------------------------------------------ //
// Mission activity reels + images — the standalone motion band that   //
// sits immediately below the hero slider.                             //
// TODO: replace each `img` with a real reel thumbnail / photograph.    //
// A `video` (optional) can later turn a tile into an inline reel.      //
// ------------------------------------------------------------------ //
export const missionBand = {
  eyebrow: "Our mission in motion",
  heading: { lead: "Seva", accent: "in motion" },
  // TODO: adjust freely — these are the ashram's programmes, not films.
  intro:
    "Education, healthcare, companionship and elder care — the ashram's daily work.",
};

// ------------------------------------------------------------------ //
// Programmes — the ashram's real, ongoing work. One source of truth    //
// for the mission-band cards AND the /programs/[slug] detail pages.    //
// Add a programme here and it appears in both places automatically.    //
// TODO: every string/image below is a placeholder — replace with the   //
// real copy, figures and photography.                                  //
// ------------------------------------------------------------------ //
export interface ProgramSection {
  id: string;
  heading: string;
  body?: string;
  bullets?: string[];
  type?: "text" | "gallery" | "stats";
  images?: string[];
  /** Figure blocks for `type: "stats"` sections. */
  stats?: { value: string; label: string }[];
}

export interface ProgramItem {
  slug: string;
  title: string;
  /** The scope line shown under the title on the card and page. */
  subtitle?: string;
  /** 1–2 sentence intro used on the card and the page hero. */
  summary: string;
  thumbnail: string;
  hero?: string;
  gallery: string[];
  sections: ProgramSection[];
}

const programGallery = (label: string) => [
  ph(640, 800, `${label} 01`, "541100"),
  ph(640, 800, `${label} 02`, "744012"),
  ph(640, 800, `${label} 03`, "48342b"),
  ph(640, 800, `${label} 04`, "6a3410"),
  ph(640, 800, `${label} 05`, "541100"),
];

export const programs: ProgramItem[] = [
  {
    slug: "education",
    title: "Education",
    subtitle: "School, extracurricular activities",
    summary:
      "A free school and a full programme of extracurricular activities, so that no child in the ashram's care is turned away from learning.", // TODO
    thumbnail: ph(600, 800, "Education", "541100"),
    hero: ph(1600, 900, "Education", "541100"),
    gallery: programGallery("Education"),
    sections: [
      {
        id: "overview",
        heading: "Overview",
        body: "TODO — describe the ashram's approach to education: who it serves, when it began, and what it aims to change. Two or three sentences of real copy will sit comfortably here.",
      },
      {
        id: "the-school",
        heading: "The School",
        body: "TODO — the school itself: classes offered, teaching staff, timings, medium of instruction and fees (if any).",
        bullets: [
          "TODO — classes and age groups covered",
          "TODO — teaching staff and student ratio",
          "TODO — medium of instruction",
          "TODO — books, uniforms and meals provided",
        ],
      },
      {
        id: "extracurricular",
        heading: "Extracurricular Activities",
        body: "TODO — what happens beyond the syllabus: music, sport, art, scripture study, competitions and annual day.",
        bullets: [
          "TODO — music and devotional singing",
          "TODO — sport and physical training",
          "TODO — art and craft",
          "TODO — scripture and value education",
        ],
      },
      {
        id: "students-reach",
        heading: "Students & Reach",
        type: "stats",
        body: "TODO — a short line framing the figures below.",
        stats: [
          { value: "000", label: "Students enrolled" }, // TODO
          { value: "00", label: "Teachers" }, // TODO
          { value: "00", label: "Villages served" }, // TODO
          { value: "0000", label: "Alumni since inception" }, // TODO
        ],
      },
      {
        id: "gallery",
        heading: "Gallery",
        type: "gallery",
        body: "TODO — replace these placeholders with photographs from the school.",
        images: programGallery("Education"),
      },
    ],
  },
  {
    slug: "healthcare",
    title: "Healthcare Activities",
    subtitle: "Eye day care, medical camp, blood donation camp, chikitsalaya",
    summary:
      "Free eye care, medical and blood donation camps, and a standing chikitsalaya serving the villages around the ashram.", // TODO
    thumbnail: ph(600, 800, "Healthcare", "744012"),
    hero: ph(1600, 900, "Healthcare", "744012"),
    gallery: programGallery("Healthcare"),
    sections: [
      {
        id: "overview",
        heading: "Overview",
        body: "TODO — the shape of the ashram's healthcare seva: what is offered, to whom, and how it is funded and staffed.",
      },
      {
        id: "eye-day-care",
        heading: "Eye Day Care",
        body: "TODO — the eye day care unit: screening, cataract surgery referrals, spectacles and follow-up.",
        bullets: [
          "TODO — screening schedule",
          "TODO — surgeries facilitated per year",
          "TODO — partner hospitals and doctors",
        ],
      },
      {
        id: "medical-camp",
        heading: "Medical Camp",
        body: "TODO — general medical camps: frequency, specialities covered, medicines dispensed and villages reached.",
      },
      {
        id: "blood-donation-camp",
        heading: "Blood Donation Camp",
        body: "TODO — the blood donation drive: how often it runs, partner blood banks, and how devotees can register.",
      },
      {
        id: "chikitsalaya",
        heading: "Chikitsalaya",
        body: "TODO — the standing dispensary at the ashram: opening hours, resident practitioners and the treatments available.",
      },
      {
        id: "gallery",
        heading: "Gallery",
        type: "gallery",
        body: "TODO — replace these placeholders with photographs from the camps and the chikitsalaya.",
        images: programGallery("Healthcare"),
      },
    ],
  },
  {
    slug: "sathe-achi",
    title: "Sathe Achi",
    subtitle: "TODO — short line describing Sathe Achi",
    summary:
      "TODO — one or two sentences introducing Sathe Achi: what the programme is and whom it stands beside.",
    thumbnail: ph(600, 800, "Sathe Achi", "48342b"),
    hero: ph(1600, 900, "Sathe Achi", "48342b"),
    gallery: programGallery("Sathe Achi"),
    sections: [
      {
        id: "overview",
        heading: "Overview",
        body: "TODO — introduce Sathe Achi: its origin, its name's meaning, and the need it answers.",
      },
      {
        id: "what-we-do",
        heading: "What We Do",
        body: "TODO — the actual work carried out under this programme.",
        bullets: [
          "TODO — activity one",
          "TODO — activity two",
          "TODO — activity three",
        ],
      },
      {
        id: "who-we-serve",
        heading: "Who We Serve",
        body: "TODO — the people this programme reaches, and the areas it covers.",
      },
      {
        id: "how-to-take-part",
        heading: "How to Take Part",
        body: "TODO — how devotees and volunteers can join, donate or refer someone in need.",
      },
      {
        id: "gallery",
        heading: "Gallery",
        type: "gallery",
        body: "TODO — replace these placeholders with real photographs.",
        images: programGallery("Sathe Achi"),
      },
    ],
  },
  {
    slug: "pashe-achi",
    title: "Pashe Achi",
    subtitle: "TODO — short line describing Pashe Achi",
    summary:
      "TODO — one or two sentences introducing Pashe Achi: what the programme is and whom it supports.",
    thumbnail: ph(600, 800, "Pashe Achi", "6a3410"),
    hero: ph(1600, 900, "Pashe Achi", "6a3410"),
    gallery: programGallery("Pashe Achi"),
    sections: [
      {
        id: "overview",
        heading: "Overview",
        body: "TODO — introduce Pashe Achi: its origin, its name's meaning, and the need it answers.",
      },
      {
        id: "what-we-do",
        heading: "What We Do",
        body: "TODO — the actual work carried out under this programme.",
        bullets: [
          "TODO — activity one",
          "TODO — activity two",
          "TODO — activity three",
        ],
      },
      {
        id: "who-we-serve",
        heading: "Who We Serve",
        body: "TODO — the people this programme reaches, and the areas it covers.",
      },
      {
        id: "how-to-take-part",
        heading: "How to Take Part",
        body: "TODO — how devotees and volunteers can join, donate or refer someone in need.",
      },
      {
        id: "gallery",
        heading: "Gallery",
        type: "gallery",
        body: "TODO — replace these placeholders with real photographs.",
        images: programGallery("Pashe Achi"),
      },
    ],
  },
  {
    slug: "old-age-home",
    title: "Old Age Home",
    subtitle: "TODO — short line describing the old age home",
    summary:
      "A loving home for elders — shelter, healthcare, companionship and spiritual care, so every senior lives their final years in dignity.", // TODO
    thumbnail: ph(600, 800, "Old Age Home", "541100"),
    hero: ph(1600, 900, "Old Age Home", "541100"),
    gallery: programGallery("Old Age Home"),
    sections: [
      {
        id: "overview",
        heading: "Overview",
        body: "TODO — the old age home's purpose, when it opened, how many residents it houses and how it is run.",
      },
      {
        id: "facilities",
        heading: "Facilities",
        body: "TODO — accommodation, meals, medical support and the prayer hall.",
        bullets: [
          "TODO — rooms and accommodation",
          "TODO — meals and diet",
          "TODO — on-call medical support",
          "TODO — prayer and recreation spaces",
        ],
      },
      {
        id: "daily-life",
        heading: "Daily Life",
        body: "TODO — a day in the home: morning prayer, meals, activities, visits and evening aarti.",
      },
      {
        id: "admissions-support",
        heading: "Admissions & Support",
        body: "TODO — who is eligible, how to apply, what it costs, and how donors can sponsor a resident.",
      },
      {
        id: "gallery",
        heading: "Gallery",
        type: "gallery",
        body: "TODO — replace these placeholders with photographs from the home.",
        images: programGallery("Old Age Home"),
      },
    ],
  },
];

export const programBySlug: Record<string, ProgramItem> = Object.fromEntries(
  programs.map((p) => [p.slug, p])
);

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
export type OrgSectionType = "text" | "list" | "timeline" | "gallery" | "stats";

/** A sub-block inside a section — lets one section hold several sub-headings,
 *  paragraph runs and bullet lists so dense pages don't feel sparse. */
export interface OrgBlock {
  subheading?: string;
  body?: string[];
  list?: string[];
}

/** An image + text row — alternate `side` down a page for editorial rhythm. */
export interface OrgMedia {
  img: string;
  alt: string;
  caption?: string;
  side?: "left" | "right"; // image side on desktop; defaults to "right"
  body?: string[];
}

export interface OrgSection {
  id: string; // anchor + side-menu key
  heading: string;
  type?: OrgSectionType; // defaults to "text"
  /** Short standfirst set just under the heading, before the body. */
  lead?: string;
  body?: string[];
  list?: string[];
  timeline?: { year: string; title: string; text?: string }[];
  gallery?: { id: string; label: string; img: string }[];
  /** Figure blocks — big numeral over a caption. */
  stats?: { value: string; label: string }[];
  /** Sub-headed blocks, rendered after `body`. */
  blocks?: OrgBlock[];
  /** Image + text rows, rendered after `blocks`. */
  media?: OrgMedia[];
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
  /** Slug of the matching `ashrams[]` entry — drives the card's detail link. */
  ashramSlug?: string;
}

export const centralAddress: AshramBranch = {
  id: "central",
  name: "Swami Debananda Ashram — Central Office",
  role: "Head Office",
  address: "Krishnapur, Nadia, West Bengal 741101, India",
  phone: "+91 00000 00000",
  email: "info@swamidebanandaashram.org",
  ashramSlug: "central-office",
};

export const ashramBranches: AshramBranch[] = [
  {
    id: "krishnapur",
    name: "Krishnapur Nadia Ashram",
    role: "Main Ashram",
    address: "Krishnapur, Nadia, West Bengal 741101, India",
    phone: "+91 00000 00001",
    email: "krishnapur@swamidebanandaashram.org",
    ashramSlug: "krishnapur-nadia",
  },
  {
    id: "bardhaman",
    name: "Bardhaman Ashram",
    role: "Branch",
    address: "Bardhaman, West Bengal, India",
    phone: "+91 00000 00002",
    email: "bardhaman@swamidebanandaashram.org",
    ashramSlug: "bardhaman",
  },
  {
    id: "kolkata",
    name: "Kolkata Centre",
    role: "Branch",
    address: "Kolkata, West Bengal, India",
    phone: "+91 00000 00003",
    email: "kolkata@swamidebanandaashram.org",
    ashramSlug: "kolkata",
  },
];

// ------------------------------------------------------------------ //
// Sakha Ashrams — our ashrams in different places.                    //
// Feeds BOTH the homepage pinned horizontal-scroll section AND the    //
// /ashrams/[slug] detail pages, so the two can never drift apart.     //
// The model is deliberately extensible: add a field here and surface  //
// it in the card / detail page without touching any other data file.  //
// TODO: every value below is a placeholder — replace with real data.  //
// ------------------------------------------------------------------ //
export interface AshramItem {
  slug: string;
  name: string;
  /** "Head Office" / "Main Ashram" / "Branch" — shown as the card eyebrow. */
  role: string;
  location: string;
  establishedYear: string;
  phone: string;
  residentSadhus: number;
  headSadhu: string;
  /** Small scrollable strip on the card + the detail-page gallery. */
  gallery: string[];
  // ---- optional, additive fields (safe to omit) ----
  email?: string;
  address?: string;
  blurb?: string;
  card?: string; // card cover image
  hero?: string; // detail-page hero image
  /** Free-form extra facts rendered in the detail page's key-facts block. */
  facts?: { label: string; value: string }[];
  /** Long-form content, rendered with the shared detail typography. */
  sections?: OrgSection[];
}

const ashramGallery = (name: string) => [
  ph(640, 800, `${name} 01`, "541100"),
  ph(640, 800, `${name} 02`, "744012"),
  ph(640, 800, `${name} 03`, "48342b"),
  ph(640, 800, `${name} 04`, "6a3410"),
];

export const ashrams: AshramItem[] = [
  {
    slug: "central-office",
    name: "Swami Debananda Ashram — Central Office",
    role: "Head Office",
    location: "Krishnapur, Nadia, West Bengal",
    establishedYear: "1996", // TODO
    phone: "+91 00000 00000", // TODO
    email: "info@swamidebanandaashram.org", // TODO
    address: "Krishnapur, Nadia, West Bengal 741101, India", // TODO
    residentSadhus: 24, // TODO
    headSadhu: "Swami Debananda Maharaj", // TODO
    blurb:
      "The founding hermitage and the administrative heart of the sangha — where the daily yajna, the old age home and the central office all sit on one campus.", // TODO
    card: ph(900, 1100, "Central Office", "541100"),
    hero: ph(1600, 900, "Central Office", "541100"),
    gallery: ashramGallery("Central Office"),
  },
  {
    slug: "krishnapur-nadia",
    name: "Krishnapur Nadia Ashram",
    role: "Main Ashram",
    location: "Krishnapur, Nadia, West Bengal",
    establishedYear: "1996", // TODO
    phone: "+91 00000 00001", // TODO
    email: "krishnapur@swamidebanandaashram.org", // TODO
    address: "Krishnapur, Nadia, West Bengal 741101, India", // TODO
    residentSadhus: 32, // TODO
    headSadhu: "Swami Premananda Maharaj", // TODO
    blurb:
      "The main ashram — meditation hall, temple, elder care and the yearly Guru Purnima gathering.", // TODO
    card: ph(900, 1100, "Krishnapur Nadia", "744012"),
    hero: ph(1600, 900, "Krishnapur Nadia", "744012"),
    gallery: ashramGallery("Krishnapur"),
  },
  {
    slug: "bardhaman",
    name: "Bardhaman Ashram",
    role: "Branch",
    location: "Bardhaman, West Bengal",
    establishedYear: "2004", // TODO
    phone: "+91 00000 00002", // TODO
    email: "bardhaman@swamidebanandaashram.org", // TODO
    address: "Bardhaman, West Bengal, India", // TODO
    residentSadhus: 14, // TODO
    headSadhu: "Swami Jnanananda Maharaj", // TODO
    blurb:
      "A branch ashram serving the surrounding villages with free healthcare camps and anna daan.", // TODO
    card: ph(900, 1100, "Bardhaman", "48342b"),
    hero: ph(1600, 900, "Bardhaman", "48342b"),
    gallery: ashramGallery("Bardhaman"),
  },
  {
    slug: "kolkata",
    name: "Kolkata Centre",
    role: "Branch",
    location: "Kolkata, West Bengal",
    establishedYear: "2009", // TODO
    phone: "+91 00000 00003", // TODO
    email: "kolkata@swamidebanandaashram.org", // TODO
    address: "Kolkata, West Bengal, India", // TODO
    residentSadhus: 9, // TODO
    headSadhu: "Swami Shantananda Maharaj", // TODO
    blurb:
      "The city centre — weekly satsang, spiritual discussions and the publications desk.", // TODO
    card: ph(900, 1100, "Kolkata Centre", "6a3410"),
    hero: ph(1600, 900, "Kolkata Centre", "6a3410"),
    gallery: ashramGallery("Kolkata"),
  },
  {
    slug: "puri", // TODO placeholder ashram
    name: "Puri Ashram",
    role: "Branch",
    location: "Puri, Odisha",
    establishedYear: "2013", // TODO
    phone: "+91 00000 00004", // TODO
    residentSadhus: 7, // TODO
    headSadhu: "Swami Nityananda Maharaj", // TODO
    blurb:
      "A seaside retreat for extended sadhana and pilgrim hospitality.", // TODO
    card: ph(900, 1100, "Puri Ashram", "541100"),
    hero: ph(1600, 900, "Puri Ashram", "541100"),
    gallery: ashramGallery("Puri"),
  },
  {
    slug: "varanasi", // TODO placeholder ashram
    name: "Varanasi Ashram",
    role: "Branch",
    location: "Varanasi, Uttar Pradesh",
    establishedYear: "2017", // TODO
    phone: "+91 00000 00005", // TODO
    residentSadhus: 11, // TODO
    headSadhu: "Swami Chidananda Maharaj", // TODO
    blurb:
      "Vedic education and the study of the Master's literary works, beside the Ganga.", // TODO
    card: ph(900, 1100, "Varanasi Ashram", "744012"),
    hero: ph(1600, 900, "Varanasi Ashram", "744012"),
    gallery: ashramGallery("Varanasi"),
  },
];

export const ashramBySlug: Record<string, AshramItem> = Object.fromEntries(
  ashrams.map((a) => [a.slug, a])
);

/** Homepage §"Sakha Ashrams" — the pinned horizontal-scroll section. */
export const sakhaSection = {
  id: "sakha-ashrams",
  eyebrow: "Across the map",
  heading: { lead: "Sakha", accent: "Ashrams" },
  intro:
    "Our ashrams in different places — each a home for sadhana and seva. Scroll to travel between them.",
};

// ------------------------------------------------------------------ //
// Footer                                                              //
// ------------------------------------------------------------------ //
/** Social profiles — shown in the menu panel's footer block.
 *  TODO: replace every `href` with the ashram's real profile URL. */
export const social: { label: string; href: string }[] = [
  { label: "Facebook", href: "#" },
  { label: "YouTube", href: "#" },
  { label: "Instagram", href: "#" },
];

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

// ------------------------------------------------------------------ //
// Navigation — TODO: confirm real menu labels with client.            //
// Declared LAST because "Our Work" derives its children from          //
// `programs` above. Route-aware hrefs: a leading "/#id" jumps to a     //
// homepage section from ANY route; a bare "/path" is a full page.      //
// Reordering the homepage modules in `modules.ts` does not break these //
// — the anchor ids are stable.                                         //
// ------------------------------------------------------------------ //
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
    label: "Our Work",
    href: "/#mission",
    // Derived from `programs` so adding a programme adds a menu entry.
    children: programs.map((p) => ({
      label: p.title,
      href: `/programs/${p.slug}`,
    })),
  },
  {
    label: "Contact",
    href: "/#contact",
    children: [
      { label: "Sakha Ashrams", href: "/#sakha-ashrams" },
      { label: "Our Ashrams", href: "/contact/ashrams" },
      { label: "Name Registration", href: "/contact/register" },
    ],
  },
];
