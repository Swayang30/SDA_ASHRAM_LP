"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type Variant = "maroon" | "white" | "orange" | "ink" | "outline-white";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  className?: string;
  type?: "button" | "submit";
  ariaLabel?: string;
}

const base =
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-3 text-sm font-medium tracking-wide transition-colors duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange";

const variants: Record<Variant, { idle: string; fill: string; label: string }> =
  {
    maroon: {
      idle: "bg-maroon text-ivory",
      fill: "bg-orange",
      label: "group-hover:text-white",
    },
    white: {
      idle: "bg-white text-maroon",
      fill: "bg-maroon",
      label: "group-hover:text-white",
    },
    orange: {
      idle: "bg-orange text-white",
      fill: "bg-maroon",
      label: "group-hover:text-white",
    },
    ink: {
      idle: "bg-black text-white",
      fill: "bg-orange",
      label: "group-hover:text-white",
    },
    "outline-white": {
      idle: "border border-white/70 text-white",
      fill: "bg-white",
      label: "group-hover:text-maroon",
    },
  };

/** Pill CTA with a fill-sweep + slight scale on hover. */
export default function Button({
  children,
  href,
  onClick,
  variant = "maroon",
  className = "",
  type = "button",
  ariaLabel,
}: ButtonProps) {
  const v = variants[variant];

  const inner = (
    <>
      {/* fill-sweep */}
      <span
        aria-hidden
        className={`absolute inset-0 -z-0 origin-left scale-x-0 rounded-full transition-transform duration-500 ease-[var(--ease-soft)] group-hover:scale-x-100 ${v.fill}`}
      />
      <span className={`relative z-10 transition-colors duration-500 ${v.label}`}>
        {children}
      </span>
    </>
  );

  const cls = `${base} ${v.idle} ${className}`;

  if (href) {
    return (
      <motion.span
        whileHover={{ scale: 1.035 }}
        whileTap={{ scale: 0.97 }}
        className="inline-block"
      >
        <Link href={href} aria-label={ariaLabel} className={cls}>
          {inner}
        </Link>
      </motion.span>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.035 }}
      whileTap={{ scale: 0.97 }}
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      className={cls}
    >
      {inner}
    </motion.button>
  );
}
