"use client";

import { useEffect, useRef } from "react";

/**
 * SVG recreation of the ashram chakra (40 spokes + mantra hub), so the intro
 * can draw/scale each spoke individually. Also used small in navbar/footer.
 * Spokes carry class `chakra-spoke` and the hub `chakra-hub` for GSAP targeting.
 */

const CX = 100;
const CY = 100;
const R_INNER = 30;
const R_OUTER = 82;
const R_HUB = R_INNER - 4;
/** Radius the mantra must fit inside — hub radius minus optical padding. */
const R_MANTRA_FIT = R_HUB - 2.6;

export default function ChakraLogo({
  className = "",
  spokeClassName = "",
  showMantra = true,
  title = "Swami Debananda Ashram",
}: {
  className?: string;
  spokeClassName?: string;
  showMantra?: boolean;
  title?: string;
}) {
  const SPOKES = 40;
  const fitRef = useRef<SVGGElement>(null);

  /**
   * Centre + size the mantra to the hub from its MEASURED box rather than from
   * guessed font metrics: the Devanagari face's advance widths (and the ॐ
   * glyph's ascender) differ per platform, so a hard-coded font-size either
   * clipped or floated off-centre. Measuring makes it exact on both axes and
   * it scales with the logo for free because the SVG uses a viewBox.
   *
   * The fit transform lives on an INNER group so it never fights the GSAP
   * counter-rotation applied to the outer `.chakra-mantra` group.
   */
  useEffect(() => {
    const g = fitRef.current;
    if (!g) return;

    const fit = () => {
      g.removeAttribute("transform"); // measure the natural box
      const b = g.getBBox();
      if (!b.width || !b.height) return;
      // Inscribe the text box's diagonal in the hub circle → guaranteed to sit
      // fully inside the disc whatever the box's aspect ratio.
      const s = (2 * R_MANTRA_FIT) / Math.hypot(b.width, b.height);
      const bx = b.x + b.width / 2;
      const by = b.y + b.height / 2;
      g.setAttribute(
        "transform",
        `translate(${CX - bx * s} ${CY - by * s}) scale(${s})`
      );
    };

    fit();
    // Re-fit once the webfont actually lands (first paint may use a fallback).
    let cancelled = false;
    document.fonts?.ready
      .then(() => {
        if (!cancelled) fit();
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [showMantra]);

  const spokes = Array.from({ length: SPOKES }, (_, i) => {
    const angle = (i / SPOKES) * Math.PI * 2 - Math.PI / 2;
    const x1 = CX + Math.cos(angle) * R_INNER;
    const y1 = CY + Math.sin(angle) * R_INNER;
    const x2 = CX + Math.cos(angle) * R_OUTER;
    const y2 = CY + Math.sin(angle) * R_OUTER;
    return { x1, y1, x2, y2, i };
  });

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label={title}
      fill="none"
    >
      <title>{title}</title>
      {/* outer ring */}
      <circle
        cx={CX}
        cy={CY}
        r={90}
        stroke="currentColor"
        strokeWidth={2.4}
        className="chakra-ring opacity-80"
      />
      <circle
        cx={CX}
        cy={CY}
        r={84}
        stroke="currentColor"
        strokeWidth={1}
        className="chakra-ring opacity-40"
      />
      {/* spokes */}
      <g>
        {spokes.map((s) => (
          <line
            key={s.i}
            x1={s.x1}
            y1={s.y1}
            x2={s.x2}
            y2={s.y2}
            stroke="currentColor"
            strokeWidth={3.4}
            strokeLinecap="round"
            className={`chakra-spoke ${spokeClassName}`}
          />
        ))}
      </g>
      {/* hub */}
      <circle
        cx={CX}
        cy={CY}
        r={R_HUB}
        fill="currentColor"
        className="chakra-hub"
      />
      {showMantra && (
        // Outer group = GSAP's counter-rotation target (keeps the mantra
        // upright while the wheel turns). Inner group = the measured fit.
        <g className="chakra-mantra">
          <g ref={fitRef} aria-hidden>
            {/* Two lines so the phrase reads large inside a circular hub
                instead of shrinking to a thin single line. The `y` values are
                a sensible pre-measurement default for the no-JS/first-paint
                case; the effect above then centres them exactly. */}
            <text
              x={CX}
              y={CY - 5.4}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="9"
              fill="var(--color-ivory)"
              className="font-devanagari"
            >
              ॐ&#160;तत्
            </text>
            <text
              x={CX}
              y={CY + 5.4}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="9"
              fill="var(--color-ivory)"
              className="font-devanagari"
            >
              त्वम्&#160;असि
            </text>
          </g>
        </g>
      )}
    </svg>
  );
}
