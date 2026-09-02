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
  /** Heading level. Detail pages pass "h1" — one per page. */
  as?: "h1" | "h2";
  /** DOM id — lets a section point `aria-labelledby` at the heading. */
  id?: string;
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
  as: Tag = "h2",
  id,
}: SectionHeadingProps) {
  const sizeClass =
    size === "lg"
      ? "text-[clamp(2.4rem,6vw,4.5rem)]"
      : "text-[clamp(1.9rem,4vw,3rem)]";

  return (
    <Tag
      id={id}
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
    </Tag>
  );
}
