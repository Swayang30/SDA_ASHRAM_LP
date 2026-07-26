"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";

interface Fields {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  message: string;
}

const EMPTY: Fields = { fullName: "", email: "", phone: "", city: "", message: "" };

const FIELDS: {
  key: keyof Fields;
  label: string;
  type?: string;
  required?: boolean;
  full?: boolean;
  textarea?: boolean;
}[] = [
  { key: "fullName", label: "Full name", required: true },
  { key: "email", label: "Email address", type: "email", required: true },
  { key: "phone", label: "Phone number", type: "tel" },
  { key: "city", label: "City" },
  { key: "message", label: "Message (optional)", full: true, textarea: true },
];

/**
 * Name Registration form (Contact §14). Client-side validation + success state.
 * NOTE: there is no backend wired yet — on submit it validates and confirms
 * locally. TODO: POST to a real endpoint / email service before launch.
 */
export default function RegistrationForm() {
  const [values, setValues] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  function validate(v: Fields) {
    const e: Partial<Record<keyof Fields, string>> = {};
    if (!v.fullName.trim()) e.fullName = "Please enter your name.";
    if (!v.email.trim()) e.email = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email))
      e.email = "Please enter a valid email.";
    return e;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate(values);
    setErrors(e);
    if (Object.keys(e).length === 0) {
      // TODO: send `values` to the ashram's registration endpoint.
      setSubmitted(true);
    }
  }

  return (
    <div className="rounded-2xl bg-white p-7 shadow-warm-sm md:p-10">
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-8 text-center"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange/12">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--color-orange)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <h2 className="mt-5 font-serif text-2xl text-maroon">
              Thank you, {values.fullName.split(" ")[0]}.
            </h2>
            <p className="mx-auto mt-3 max-w-md font-sans text-sm leading-relaxed text-cocoa/70">
              Your name has been registered with the ashram. We&rsquo;ll be in touch
              with blessings, updates and event invitations.
            </p>
            <div className="mt-7">
              <Button
                variant="maroon"
                onClick={() => {
                  setValues(EMPTY);
                  setErrors({});
                  setSubmitted(false);
                }}
              >
                Register another name
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit}
            noValidate
            className="grid gap-5 sm:grid-cols-2"
          >
            {FIELDS.map((f) => (
              <div key={f.key} className={f.full ? "sm:col-span-2" : ""}>
                <label
                  htmlFor={f.key}
                  className="mb-1.5 block font-sans text-xs uppercase tracking-[0.18em] text-cocoa/55"
                >
                  {f.label}
                  {f.required && <span className="text-orange"> *</span>}
                </label>
                {f.textarea ? (
                  <textarea
                    id={f.key}
                    rows={4}
                    value={values[f.key]}
                    onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                    className="w-full rounded-xl border border-maroon/15 bg-cream/60 px-4 py-3 font-sans text-sm text-cocoa outline-none transition-colors focus:border-orange focus:bg-white"
                  />
                ) : (
                  <input
                    id={f.key}
                    type={f.type ?? "text"}
                    value={values[f.key]}
                    onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                    aria-invalid={!!errors[f.key]}
                    className="w-full rounded-xl border border-maroon/15 bg-cream/60 px-4 py-3 font-sans text-sm text-cocoa outline-none transition-colors focus:border-orange focus:bg-white"
                  />
                )}
                {errors[f.key] && (
                  <p className="mt-1.5 font-sans text-xs text-orange">{errors[f.key]}</p>
                )}
              </div>
            ))}

            <div className="sm:col-span-2">
              <Button type="submit" variant="maroon">
                Register my name
              </Button>
              <p className="mt-3 font-sans text-xs text-cocoa/50">
                Your details stay private and are used only to keep you connected
                with the ashram.
              </p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
