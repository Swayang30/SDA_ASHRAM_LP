"use client";

import ScrollFloat from "@/components/reactbits/ScrollFloat";

interface SectionHeadingProps {
  /** First word — rendered in maroon. */
  lead: string;
  /** Remainder — rendered in orange italic (optional for single-word headings). */
  accent?: string;
  className?: string;
  /** Visual size preset. */
  size?: "md" | "lg";
  align?: "left" | "center";
  /** Colour overrides for on-dark sections (Ashram / Footer). */
  leadClassName?: string;
  accentClassName?: string;
}

/**
 * Two-tone section heading (maroon lead + orange italic accent) with the
 * required ScrollFloat character rise. Used for every heading site-wide.
 */
export default function SectionHeading({
  lead,
  accent,
  className = "",
  size = "lg",
  align = "left",
  leadClassName = "heading-lead",
  accentClassName = "heading-accent",
}: SectionHeadingProps) {
  const sizeClass =
    size === "lg"
      ? "text-[clamp(2.4rem,6vw,4.5rem)]"
      : "text-[clamp(1.9rem,4vw,3rem)]";

  return (
    <h2
      className={`font-serif font-medium tracking-tight ${sizeClass} ${
        align === "center" ? "text-center" : "text-left"
      } ${className}`}
    >
      <ScrollFloat
        containerClassName="align-baseline"
        textClassName={leadClassName}
      >
        {lead}
      </ScrollFloat>
      {accent ? (
        <>
          {" "}
          <ScrollFloat
            containerClassName="align-baseline"
            textClassName={accentClassName}
          >
            {accent}
          </ScrollFloat>
        </>
      ) : null}
    </h2>
  );
}
