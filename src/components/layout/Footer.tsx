"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import ChakraLogo from "@/components/brand/ChakraLogo";
import { LotusVine } from "@/components/brand/LotusDecor";
import ScrollFloat from "@/components/reactbits/ScrollFloat";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { footer } from "@/data/site";

export default function Footer() {
  const wheelRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const el = wheelRef.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.to(el, {
        rotation: 360,
        ease: "none",
        duration: 90,
        repeat: -1,
        transformOrigin: "50% 50%",
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <footer className="relative overflow-hidden bg-brown text-ivory">
      <div className="texture-diagonal absolute inset-0 opacity-40" aria-hidden />
      <LotusVine className="pointer-events-none absolute -left-10 top-8 w-72 opacity-30" />
      <LotusVine className="pointer-events-none absolute -right-10 bottom-24 w-72 rotate-180 opacity-30" />

      <div className="container-site relative py-20">
        {/* newsletter */}
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="font-script text-4xl text-orange">Stay connected</p>
          <h3 className="mt-2 font-serif text-3xl text-ivory md:text-4xl">
            {footer.newsletter.title}
          </h3>
          <p className="mx-auto mt-3 max-w-md font-sans text-sm text-ivory/70">
            {footer.newsletter.body}
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email) setSent(true);
            }}
            className="mx-auto mt-7 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={footer.newsletter.placeholder}
              aria-label="Email address"
              className="w-full rounded-full border border-ivory/25 bg-ivory/10 px-5 py-3 font-sans text-sm text-ivory placeholder:text-ivory/50 outline-none transition-all duration-300 focus:border-orange focus:bg-ivory/15 focus:shadow-[0_0_0_4px_rgba(255,85,43,0.15)]"
            />
            <Button type="submit" variant="orange" className="shrink-0">
              {sent ? "Subscribed ✓" : footer.newsletter.cta}
            </Button>
          </form>
        </Reveal>

        <div className="my-14 h-px w-full bg-ivory/15" />

        {/* brand + columns */}
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-4">
              <div ref={wheelRef} className="text-orange">
                <ChakraLogo className="h-14 w-14" showMantra={false} />
              </div>
              <ScrollFloat
                containerClassName="font-serif text-xl tracking-[0.18em] text-ivory"
                stagger={0.02}
              >
                {footer.wordmark}
              </ScrollFloat>
            </div>
            <p className="mt-5 max-w-xs font-sans text-sm leading-relaxed text-ivory/60">
              A spiritual monastic organization dedicated to meditation,
              discipline, and inner growth.
            </p>
          </div>

          {footer.columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-serif text-lg text-orange">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="group relative inline-block font-sans text-sm text-ivory/70 transition-colors hover:text-ivory"
                    >
                      {l.label}
                      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-orange transition-all duration-300 group-hover:w-full" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-3 border-t border-ivory/15 pt-6 text-center sm:flex-row">
          <p className="font-sans text-xs text-ivory/50">{footer.copyright}</p>
          <p className="font-script text-lg text-orange/80">ॐ तत् त्वम् असि</p>
        </div>
      </div>
    </footer>
  );
}
