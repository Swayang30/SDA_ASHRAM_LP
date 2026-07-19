"use client";

/**
 * SVG recreation of the ashram chakra (40 spokes + mantra hub), so the intro
 * can draw/scale each spoke individually. Also used small in navbar/footer.
 * Spokes carry class `chakra-spoke` and the hub `chakra-hub` for GSAP targeting.
 */
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
  const cx = 100;
  const cy = 100;
  const rInner = 30;
  const rOuter = 82;

  const spokes = Array.from({ length: SPOKES }, (_, i) => {
    const angle = (i / SPOKES) * Math.PI * 2 - Math.PI / 2;
    const x1 = cx + Math.cos(angle) * rInner;
    const y1 = cy + Math.sin(angle) * rInner;
    const x2 = cx + Math.cos(angle) * rOuter;
    const y2 = cy + Math.sin(angle) * rOuter;
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
        cx={cx}
        cy={cy}
        r={90}
        stroke="currentColor"
        strokeWidth={2.4}
        className="chakra-ring opacity-80"
      />
      <circle
        cx={cx}
        cy={cy}
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
        cx={cx}
        cy={cy}
        r={rInner - 4}
        fill="currentColor"
        className="chakra-hub"
      />
      {showMantra && (
        <text
          x={cx}
          y={cy + 2}
          textAnchor="middle"
          dominantBaseline="middle"
          className="chakra-mantra"
          fontSize="6.6"
          fill="var(--color-ivory)"
        >
          ॐ&#160;तत्&#160;त्वम्&#160;असि
        </text>
      )}
    </svg>
  );
}
