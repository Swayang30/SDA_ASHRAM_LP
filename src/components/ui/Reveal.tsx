"use client";

import { motion, type Variants } from "framer-motion";

const variants: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 },
  }),
};

/**
 * Soft fade + rise on scroll-enter — the site-wide reveal grammar (§8.4).
 * Reduced-motion is honoured by the `.reveal-target` CSS override.
 */
export default function Reveal({
  children,
  i = 0,
  className = "",
  as = "div",
  amount = 0.3,
}: {
  children: React.ReactNode;
  i?: number;
  className?: string;
  as?: "div" | "li" | "span" | "section";
  amount?: number;
}) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={`reveal-target ${className}`}
      variants={variants}
      custom={i}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </MotionTag>
  );
}
