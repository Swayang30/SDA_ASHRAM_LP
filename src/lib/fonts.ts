import {
  Playfair_Display,
  Pinyon_Script,
  Poppins,
  Noto_Serif_Devanagari,
} from "next/font/google";

/**
 * Best-match Google fonts per the master brief §3.2.
 * TODO: confirm the exact Figma typefaces — if different, change only these
 * three imports and the design updates everywhere via the CSS variables.
 */
export const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

export const pinyon = Pinyon_Script({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pinyon",
  display: "swap",
});

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

/**
 * Devanagari face for the chakra mantra "ॐ तत् त्वम् असि".
 * The Latin serif has no Devanagari coverage, so conjuncts (त्व) and vowel
 * signs (matras) fall back to a system font and render inconsistently — this
 * pins them to a real Devanagari serif everywhere.
 */
export const notoDevanagari = Noto_Serif_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600"],
  variable: "--font-devanagari-noto",
  display: "swap",
});

export const fontVariables = `${playfair.variable} ${pinyon.variable} ${poppins.variable} ${notoDevanagari.variable}`;
