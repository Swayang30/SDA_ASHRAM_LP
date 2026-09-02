"use client";

/**
 * Name Registration form — Swami Debananda Ashram
 *
 * Cascading location selects: Country → State → District/City, plus a Pincode text field.
 * Data comes from `country-state-city` (install: npm i country-state-city).
 *
 * NO BACKEND. handleSubmit validates, logs the payload and shows a success panel.
 * The single TODO below is where the real submit goes.
 *
 * COLOURS: brand colours use the @theme tokens from globals.css
 * (maroon · orange · ivory · gold · cream). The remaining raw hex values are
 * form-specific tints that have no token yet:
 *   #E7D8C9 field border · #7A5A48 label · #3A2418 input text · #B79E8B placeholder
 *   #F4EDE4 disabled fill · #C0392B error · #A98263 hint/chevron · #FFF3E6 success tint
 *   #6B1A05 button hover
 *
 * NOTE: no state is set inside an effect anywhere in this file, so it will not add
 * to the existing react-hooks/set-state-in-effect lint errors.
 */

import { useMemo, useRef, useState } from "react";
import { City, Country, State } from "country-state-city";

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

const DEFAULT_COUNTRY_ISO = "IN";
const PINCODE_REQUIRED = true; // flip to false to make pincode optional

/** Pincode rules per country. Countries not listed fall back to a loose check. */
const PINCODE_RULES: Record<string, { pattern: RegExp; hint: string; inputMode: "numeric" | "text" }> = {
  IN: { pattern: /^[1-9][0-9]{5}$/, hint: "Enter a 6-digit PIN code", inputMode: "numeric" },
  US: { pattern: /^[0-9]{5}(-[0-9]{4})?$/, hint: "Enter a 5-digit ZIP code", inputMode: "numeric" },
  GB: { pattern: /^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/i, hint: "Enter a valid UK postcode", inputMode: "text" },
  AU: { pattern: /^[0-9]{4}$/, hint: "Enter a 4-digit postcode", inputMode: "numeric" },
  CA: { pattern: /^[A-Z][0-9][A-Z]\s?[0-9][A-Z][0-9]$/i, hint: "Enter a valid postal code", inputMode: "text" },
};

const FALLBACK_PINCODE = {
  pattern: /^[A-Za-z0-9][A-Za-z0-9\s-]{2,9}$/,
  hint: "Enter your postal code",
  inputMode: "text" as const,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^[+]?[0-9\s-]{7,15}$/;

/**
 * Curated district overrides. `country-state-city` returns CITIES, not districts.
 * Add entries here keyed by `${countryIso}-${stateIso}` when the client wants
 * true administrative districts. Anything not listed falls back to library data.
 */
const DISTRICT_OVERRIDES: Record<string, string[]> = {
  // "IN-WB": ["Bankura", "Birbhum", "Darjeeling", ...],
};

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const labelClass = "block text-[11px] font-medium uppercase tracking-[0.18em] text-[#7A5A48]";

const fieldBase =
  "mt-2 w-full rounded-xl border bg-cream px-4 py-3 text-[15px] text-[#3A2418] " +
  "outline-none transition-colors duration-200 placeholder:text-[#B79E8B] " +
  "focus:border-gold focus:ring-2 focus:ring-gold/25 " +
  "disabled:cursor-not-allowed disabled:bg-[#F4EDE4] disabled:text-[#B79E8B]";

const selectExtra = "appearance-none pr-11 bg-none";

const fieldClass = (hasError: boolean) =>
  `${fieldBase} ${hasError ? "border-[#C0392B]" : "border-[#E7D8C9]"}`;

const selectClass = (hasError: boolean) => `${fieldClass(hasError)} ${selectExtra}`;

/* ------------------------------------------------------------------ */
/* Small presentational pieces                                         */
/* ------------------------------------------------------------------ */

function RequiredMark() {
  return (
    <>
      <span aria-hidden="true" className="ml-1 text-orange">
        *
      </span>
      <span className="sr-only">(required)</span>
    </>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-[12px] text-[#C0392B]">
      {message}
    </p>
  );
}

function ChevronIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className="pointer-events-none absolute right-4 bottom-[15px] h-4 w-4 text-[#A98263]"
    >
      <path d="M5 7.5 10 12.5 15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Form                                                                */
/* ------------------------------------------------------------------ */

type Errors = Partial<Record<
  "fullName" | "email" | "phone" | "country" | "state" | "district" | "pincode",
  string
>>;

export default function RegisterForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryIso, setCountryIso] = useState(DEFAULT_COUNTRY_ISO);
  const [stateIso, setStateIso] = useState("");
  const [district, setDistrict] = useState("");
  const [pincode, setPincode] = useState("");
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  /* -------------------- derived location data -------------------- */

  // India pinned to the top, everything else alphabetical.
  const countries = useMemo(() => {
    const all = Country.getAllCountries();
    const india = all.filter((c) => c.isoCode === "IN");
    const rest = all
      .filter((c) => c.isoCode !== "IN")
      .sort((a, b) => a.name.localeCompare(b.name));
    return [...india, ...rest];
  }, []);

  const states = useMemo(() => {
    if (!countryIso) return [];
    return State.getStatesOfCountry(countryIso).sort((a, b) => a.name.localeCompare(b.name));
  }, [countryIso]);

  const districts = useMemo(() => {
    if (!countryIso || !stateIso) return [];

    const override = DISTRICT_OVERRIDES[`${countryIso}-${stateIso}`];
    if (override) return [...override].sort((a, b) => a.localeCompare(b));

    const cities = City.getCitiesOfState(countryIso, stateIso) ?? [];
    // The dataset contains duplicates in places — dedupe by name.
    return Array.from(new Set(cities.map((c) => c.name))).sort((a, b) => a.localeCompare(b));
  }, [countryIso, stateIso]);

  // Some countries have no states, and some states return no cities.
  // Fall back to a free-text input so the user is never blocked.
  const stateIsFreeText = countryIso !== "" && states.length === 0;
  const districtIsFreeText = countryIso !== "" && (stateIsFreeText || (stateIso !== "" && districts.length === 0));

  const pincodeRule = PINCODE_RULES[countryIso] ?? FALLBACK_PINCODE;

  const selectedCountryName = countries.find((c) => c.isoCode === countryIso)?.name ?? "";
  const selectedStateName = stateIsFreeText
    ? stateIso
    : states.find((s) => s.isoCode === stateIso)?.name ?? "";

  /* -------------------- cascade handlers -------------------- */
  // Resets happen here, in event handlers — never in an effect.

  function handleCountryChange(value: string) {
    setCountryIso(value);
    setStateIso("");
    setDistrict("");
    setPincode("");
    setErrors((prev) => ({ ...prev, country: undefined, state: undefined, district: undefined, pincode: undefined }));
  }

  function handleStateChange(value: string) {
    setStateIso(value);
    setDistrict("");
    setErrors((prev) => ({ ...prev, state: undefined, district: undefined }));
  }

  function clearError(key: keyof Errors) {
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  }

  /* -------------------- validation + submit -------------------- */

  function validate(): Errors {
    const next: Errors = {};

    if (!fullName.trim()) next.fullName = "Please enter your full name.";
    if (!email.trim()) next.email = "Please enter your email address.";
    else if (!EMAIL_PATTERN.test(email.trim())) next.email = "Please enter a valid email address.";
    if (phone.trim() && !PHONE_PATTERN.test(phone.trim())) next.phone = "Please enter a valid phone number.";

    if (!countryIso) next.country = "Please select your country.";
    if (!stateIso.trim()) next.state = stateIsFreeText ? "Please enter your state or region." : "Please select your state.";
    if (!district.trim()) next.district = districtIsFreeText ? "Please enter your district." : "Please select your district.";

    if (!pincode.trim()) {
      if (PINCODE_REQUIRED) next.pincode = "Please enter your PIN code.";
    } else if (!pincodeRule.pattern.test(pincode.trim())) {
      next.pincode = pincodeRule.hint + ".";
    }

    return next;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    const firstErrorKey = Object.keys(nextErrors)[0];
    if (firstErrorKey) {
      const el = formRef.current?.querySelector<HTMLElement>(`[name="${firstErrorKey}"]`);
      el?.focus();
      return;
    }

    const payload = {
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      country: selectedCountryName,
      countryIso,
      state: selectedStateName,
      stateIso,
      district: district.trim(),
      pincode: pincode.trim(),
      message: message.trim(),
    };

    // TODO: replace with the real submit (API route / server action) when the backend lands.
    console.log("Name registration payload:", payload);
    setSubmitted(true);
  }

  /* -------------------- success panel -------------------- */

  if (submitted) {
    return (
      <div className="mx-auto w-full max-w-3xl rounded-3xl bg-white p-8 shadow-[0_24px_60px_-30px_rgba(84,17,0,0.35)] sm:p-12">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF3E6]">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-7 w-7 text-gold">
              <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <h3 className="mt-6 font-serif text-2xl text-maroon sm:text-3xl">Your name has been received</h3>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[#7A5A48]">
            Thank you, {fullName.split(" ")[0] || "friend"}. The ashram will be in touch with updates and invitations to
            darshan and festivals.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-8 rounded-full border border-[#E7D8C9] px-7 py-3 text-[14px] font-medium text-maroon transition-colors hover:border-gold hover:bg-cream"
          >
            Register another name
          </button>
        </div>
      </div>
    );
  }

  /* -------------------- form -------------------- */

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="mx-auto w-full max-w-3xl rounded-3xl bg-white p-8 shadow-[0_24px_60px_-30px_rgba(84,17,0,0.35)] sm:p-12"
    >
      <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
        {/* Full name */}
        <div>
          <label htmlFor="fullName" className={labelClass}>
            Full name
            <RequiredMark />
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              clearError("fullName");
            }}
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
            className={fieldClass(Boolean(errors.fullName))}
          />
          <FieldError id="fullName-error" message={errors.fullName} />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className={labelClass}>
            Email address
            <RequiredMark />
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearError("email");
            }}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={fieldClass(Boolean(errors.email))}
          />
          <FieldError id="email-error" message={errors.email} />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              clearError("phone");
            }}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            className={fieldClass(Boolean(errors.phone))}
          />
          <FieldError id="phone-error" message={errors.phone} />
        </div>

        {/* Country */}
        <div className="relative">
          <label htmlFor="country" className={labelClass}>
            Country
            <RequiredMark />
          </label>
          <select
            id="country"
            name="country"
            autoComplete="country"
            value={countryIso}
            onChange={(e) => handleCountryChange(e.target.value)}
            aria-invalid={Boolean(errors.country)}
            aria-describedby={errors.country ? "country-error" : undefined}
            className={selectClass(Boolean(errors.country))}
          >
            <option value="">Select country</option>
            {countries.map((country) => (
              <option key={country.isoCode} value={country.isoCode}>
                {country.name}
              </option>
            ))}
          </select>
          <ChevronIcon />
          <FieldError id="country-error" message={errors.country} />
        </div>

        {/* State — select, or free text where the dataset has none */}
        <div className="relative">
          <label htmlFor="state" className={labelClass}>
            State / Region
            <RequiredMark />
          </label>

          {stateIsFreeText ? (
            <input
              id="state"
              name="state"
              type="text"
              autoComplete="address-level1"
              placeholder="Enter your state or region"
              value={stateIso}
              onChange={(e) => handleStateChange(e.target.value)}
              aria-invalid={Boolean(errors.state)}
              aria-describedby={errors.state ? "state-error" : undefined}
              className={fieldClass(Boolean(errors.state))}
            />
          ) : (
            <>
              <select
                id="state"
                name="state"
                autoComplete="address-level1"
                disabled={!countryIso}
                value={stateIso}
                onChange={(e) => handleStateChange(e.target.value)}
                aria-invalid={Boolean(errors.state)}
                aria-describedby={errors.state ? "state-error" : undefined}
                className={selectClass(Boolean(errors.state))}
              >
                <option value="">{countryIso ? "Select state" : "Select a country first"}</option>
                {states.map((state) => (
                  <option key={state.isoCode} value={state.isoCode}>
                    {state.name}
                  </option>
                ))}
              </select>
              <ChevronIcon />
            </>
          )}
          <FieldError id="state-error" message={errors.state} />
        </div>

        {/* District — select, or free text where the dataset has none */}
        <div className="relative">
          <label htmlFor="district" className={labelClass}>
            District / City
            <RequiredMark />
          </label>

          {districtIsFreeText ? (
            <input
              id="district"
              name="district"
              type="text"
              autoComplete="address-level2"
              placeholder="Enter your district"
              disabled={!stateIso}
              value={district}
              onChange={(e) => {
                setDistrict(e.target.value);
                clearError("district");
              }}
              aria-invalid={Boolean(errors.district)}
              aria-describedby={errors.district ? "district-error" : undefined}
              className={fieldClass(Boolean(errors.district))}
            />
          ) : (
            <>
              <select
                id="district"
                name="district"
                autoComplete="address-level2"
                disabled={!stateIso}
                value={district}
                onChange={(e) => {
                  setDistrict(e.target.value);
                  clearError("district");
                }}
                aria-invalid={Boolean(errors.district)}
                aria-describedby={errors.district ? "district-error" : undefined}
                className={selectClass(Boolean(errors.district))}
              >
                <option value="">{stateIso ? "Select district" : "Select a state first"}</option>
                {districts.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <ChevronIcon />
            </>
          )}
          <FieldError id="district-error" message={errors.district} />
        </div>

        {/* Pincode */}
        <div>
          <label htmlFor="pincode" className={labelClass}>
            PIN / Postal code
            {PINCODE_REQUIRED && <RequiredMark />}
          </label>
          <input
            id="pincode"
            name="pincode"
            type="text"
            inputMode={pincodeRule.inputMode}
            autoComplete="postal-code"
            maxLength={12}
            placeholder={countryIso === "IN" ? "e.g. 731204" : "Postal code"}
            value={pincode}
            onChange={(e) => {
              setPincode(e.target.value);
              clearError("pincode");
            }}
            aria-invalid={Boolean(errors.pincode)}
            aria-describedby={errors.pincode ? "pincode-error" : "pincode-hint"}
            className={fieldClass(Boolean(errors.pincode))}
          />
          {errors.pincode ? (
            <FieldError id="pincode-error" message={errors.pincode} />
          ) : (
            <p id="pincode-hint" className="mt-1.5 text-[12px] text-[#A98263]">
              {pincodeRule.hint}
            </p>
          )}
        </div>

        {/* Message */}
        <div className="sm:col-span-2">
          <label htmlFor="message" className={labelClass}>
            Message (optional)
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`${fieldClass(false)} resize-y`}
          />
        </div>
      </div>

      <div className="mt-8">
        <button
          type="submit"
          className="rounded-full bg-maroon px-9 py-4 text-[15px] font-semibold text-ivory transition-colors duration-200 hover:bg-[#6B1A05] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          Register my name
        </button>
        <p className="mt-5 text-[14px] text-[#A98263]">
          Your details stay private and are used only to keep you connected with the ashram.
        </p>
      </div>
    </form>
  );
}
