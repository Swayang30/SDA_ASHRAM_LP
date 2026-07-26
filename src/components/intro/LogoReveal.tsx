"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import ChakraLogo from "@/components/brand/ChakraLogo";
import { LotusVine } from "@/components/brand/LotusDecor";

/** Phase 1 of the intro — cinematic chakra logo feature (~10s). */
export default function LogoReveal() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const spokes = el.querySelectorAll(".chakra-spoke");
      const rings = el.querySelectorAll(".chakra-ring");

      // slow continuous rotation of the whole wheel, mantra held upright
      gsap.to(".chakra-wheel", {
        rotation: 360,
        transformOrigin: "50% 50%",
        duration: 140,
        ease: "none",
        repeat: -1,
      });
      gsap.to(el.querySelectorAll(".chakra-mantra"), {
        rotation: -360,
        svgOrigin: "100 100",
        duration: 140,
        ease: "none",
        repeat: -1,
      });

      const tl = gsap.timeline();
      tl.from(".chakra-glow", {
        opacity: 0,
        scale: 0.6,
        duration: 1.6,
        ease: "power2.out",
      })
        .from(
          rings,
          { scale: 0, opacity: 0, transformOrigin: "50% 50%", duration: 1.2, ease: "power3.out" },
          0.1
        )
        .from(
          spokes,
          {
            scale: 0,
            opacity: 0,
            svgOrigin: "100 100",
            duration: 0.9,
            ease: "back.out(1.7)",
            stagger: { each: 0.012, from: "start" },
          },
          0.2
        )
        .from(
          ".chakra-hub, .chakra-mantra",
          { scale: 0, opacity: 0, transformOrigin: "50% 50%", duration: 0.9, ease: "back.out(2)" },
          "-=0.3"
        )
        .from(
          ".intro-label",
          { y: 28, opacity: 0, duration: 1, ease: "power3.out" },
          "-=0.4"
        )
        .from(
          ".intro-vine",
          { opacity: 0, y: 20, duration: 1.4, ease: "power2.out", stagger: 0.2 },
          "-=0.8"
        );

      // gentle glow pulse
      gsap.to(".chakra-glow", {
        opacity: 0.55,
        scale: 1.08,
        duration: 2.4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={root}
      className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[rgba(240,229,208,0.82)] backdrop-blur-xl"
    >
      {/* soft warm glow on the beige backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,85,43,0.16),transparent_62%)]" />
      <div
        className="chakra-glow pointer-events-none absolute left-1/2 top-1/2 h-[46vmin] w-[46vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange/20 blur-[80px]"
      />

      {/* corner vines */}
      <LotusVine className="intro-vine pointer-events-none absolute -left-10 top-6 w-[38vmin] rotate-[8deg] opacity-40" />
      <LotusVine className="intro-vine pointer-events-none absolute -right-10 bottom-6 w-[38vmin] rotate-188 opacity-40" />

      {/* Logo + wordmark share one centred column and one max-width so the text
          aligns to the logo instead of floating loose beneath it. */}
      <div className="relative flex w-[min(88vw,42vmin)] flex-col items-center text-center">
        <div className="chakra-wheel text-orange">
          <ChakraLogo className="h-[42vmin] w-[42vmin] drop-shadow-[0_0_28px_rgba(255,85,43,0.28)]" />
        </div>
        <p className="intro-label mt-7 w-full text-balance font-serif text-[clamp(1.35rem,3.2vw,2.4rem)] font-medium leading-tight tracking-[0.14em] text-maroon">
          Swami Debananda Ashram
        </p>
      </div>
    </div>
  );
}
