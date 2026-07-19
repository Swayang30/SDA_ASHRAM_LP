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
const ph = (w: number, h: number, label: string, bg = "541100", fg = "FFFBF0") =>
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

export const nav: NavItem[] = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#founder" },
  { label: "Activities", href: "#activities" },
  { label: "Ashram", href: "#ashram" },
  { label: "Books", href: "#books" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

// ------------------------------------------------------------------ //
// Hero                                                                //
// ------------------------------------------------------------------ //
export const hero = {
  headline: "Build a heart that can touch all other hearts.",
  cta: { label: "Learn more", href: "#founder" },
  // Optional looping ripple video; falls back to the image if absent.
  video: "/video/hero-ripple.mp4",
  image: ph(1920, 1080, "Water Ripple Hero", "1a0a00", "ff552b"),
};

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
      title: "Explore",
      links: [
        { label: "About", href: "#founder" },
        { label: "Activities", href: "#activities" },
        { label: "Ashram", href: "#ashram" },
        { label: "Gallery", href: "#gallery" },
      ],
    },
    {
      title: "Connect",
      links: [
        { label: "Events", href: "#events" },
        { label: "Books", href: "#books" },
        { label: "Contact", href: "#contact" },
        { label: "Donate", href: "#" },
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
