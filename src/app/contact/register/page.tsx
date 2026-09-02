import type { Metadata } from "next";
import Link from "next/link";
import RegisterForm from "@/components/forms/RegisterForm";
import { LotusBloom } from "@/components/brand/LotusDecor";

export const metadata: Metadata = {
  title: "Name Registration",
  description:
    "Register your name with Swami Debananda Ashram to receive blessings, updates and event invitations.",
};

export default function RegisterPage() {
  return (
    <div className="bg-ivory">
      <header className="relative overflow-hidden bg-maroon text-ivory">
        <div className="absolute inset-0 bg-gradient-to-t from-maroon via-maroon/80 to-maroon/50" />
        <LotusBloom
          className="pointer-events-none absolute -right-10 -top-8 h-60 w-60 opacity-10"
          fill="var(--color-gold)"
        />
        <div className="container-site relative py-20 pt-32 md:pt-36">
          <nav aria-label="Breadcrumb" className="mb-5 font-sans text-sm text-ivory/70">
            <Link href="/" className="hover:text-orange">Home</Link>
            <span className="mx-2 text-ivory/40">/</span>
            <Link href="/#contact" className="hover:text-orange">Contact</Link>
            <span className="mx-2 text-ivory/40">/</span>
            <span className="text-ivory">Name Registration</span>
          </nav>
          <p className="font-script text-3xl text-orange">Join us</p>
          <h1 className="mt-2 font-serif text-[clamp(2.4rem,6vw,4rem)] font-medium leading-[1.05] tracking-tight">
            Name Registration
          </h1>
          <p className="mt-5 max-w-2xl font-sans text-base leading-relaxed text-ivory/80">
            Register your name with the ashram to receive blessings, updates and
            invitations to darshan and festivals.
          </p>
        </div>
      </header>

      <div className="container-site py-16 md:py-20">
        <div className="mx-auto max-w-3xl">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
