/**
 * Lightweight decorative lotus / vine flourishes used behind sections and in
 * the intro / footer. Pure SVG so they can be tinted, drawn, and parallaxed.
 * (Stand-ins for the supplied lotus-vine-gold.png / pattern-lotus-maroon.png.)
 */

export function LotusVine({
  className = "",
  stroke = "var(--color-gold)",
}: {
  className?: string;
  stroke?: string;
}) {
  return (
    <svg
      viewBox="0 0 320 120"
      className={className}
      fill="none"
      aria-hidden
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        d="M4 60 C 60 20, 90 100, 150 60 S 260 20, 316 60"
        stroke={stroke}
        strokeWidth="1.6"
        className="vine-path"
      />
      {[40, 110, 180, 250].map((x, i) => (
        <g key={i} transform={`translate(${x} 60)`}>
          <path
            d="M0 0 C -14 -18, -8 -34, 0 -40 C 8 -34, 14 -18, 0 0 Z"
            fill={stroke}
            opacity="0.85"
            transform={`rotate(${i % 2 ? 18 : -18})`}
          />
          <path
            d="M0 0 C -10 -12, -6 -24, 0 -28 C 6 -24, 10 -12, 0 0 Z"
            fill={stroke}
            opacity="0.55"
            transform={`rotate(${i % 2 ? -22 : 22})`}
          />
          <circle cx="0" cy="2" r="2.4" fill={stroke} />
        </g>
      ))}
    </svg>
  );
}

export function LotusBloom({
  className = "",
  fill = "var(--color-maroon)",
}: {
  className?: string;
  fill?: string;
}) {
  const petals = Array.from({ length: 8 });
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden>
      <g transform="translate(60 60)">
        {petals.map((_, i) => (
          <path
            key={i}
            d="M0 0 C -12 -24, -6 -46, 0 -54 C 6 -46, 12 -24, 0 0 Z"
            fill={fill}
            opacity={i % 2 ? 0.5 : 0.8}
            transform={`rotate(${(i / petals.length) * 360})`}
          />
        ))}
        <circle r="6" fill={fill} />
      </g>
    </svg>
  );
}

/** Swaying tropical leaf used to flank the quote band. */
export function TropicalLeaf({
  className = "",
  fill = "var(--color-brown)",
  flip = false,
}: {
  className?: string;
  fill?: string;
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 160 400"
      className={className}
      fill="none"
      aria-hidden
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <g fill={fill}>
        <path d="M80 400 C 20 300, 10 160, 78 4 C 150 160, 140 300, 80 400 Z" opacity="0.9" />
        <path
          d="M80 380 L80 30"
          stroke="var(--color-ivory)"
          strokeWidth="1.5"
          opacity="0.25"
        />
        {Array.from({ length: 9 }).map((_, i) => {
          const y = 60 + i * 34;
          return (
            <path
              key={i}
              d={`M80 ${y} C ${40} ${y - 6}, ${34} ${y + 14}, ${30} ${y + 26}`}
              stroke="var(--color-ivory)"
              strokeWidth="1"
              opacity="0.18"
              fill="none"
            />
          );
        })}
        {Array.from({ length: 9 }).map((_, i) => {
          const y = 60 + i * 34;
          return (
            <path
              key={`r${i}`}
              d={`M80 ${y} C ${120} ${y - 6}, ${126} ${y + 14}, ${130} ${y + 26}`}
              stroke="var(--color-ivory)"
              strokeWidth="1"
              opacity="0.18"
              fill="none"
            />
          );
        })}
      </g>
    </svg>
  );
}
