"use client";

import { FormEvent, ReactNode, useEffect, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Code2,
  HelpCircle,
  LucideIcon,
  Package,
  Palette,
  Printer,
  Smartphone,
  TrendingUp,
  X,
} from "lucide-react";
import type { ProjectBudget, ProjectCategory, ProjectTimeline } from "@/lib/types";

type ProjectInquiryModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CATEGORY_OPTIONS: { value: ProjectCategory; label: string; icon: LucideIcon }[] = [
  { value: "grafisk-design", label: "Grafisk design", icon: Palette },
  { value: "tryck", label: "Trycksaker", icon: Printer },
  { value: "forpackning", label: "Förpackningsdesign", icon: Package },
  { value: "webb", label: "Webbplats", icon: Code2 },
  { value: "app-utveckling", label: "App / utveckling", icon: Smartphone },
  { value: "marknadsforing", label: "Marknadsföring", icon: TrendingUp },
  { value: "vet-inte", label: "Vet inte riktigt än", icon: HelpCircle },
];

const BUDGET_OPTIONS: { value: ProjectBudget; label: string }[] = [
  { value: "under-5k", label: "Under 5 000 kr" },
  { value: "5k-15k", label: "5 000–15 000 kr" },
  { value: "15k-50k", label: "15 000–50 000 kr" },
  { value: "50k-150k", label: "50 000–150 000 kr" },
  { value: "over-150k", label: "Över 150 000 kr" },
  { value: "vet-inte", label: "Vet inte ännu" },
];

const TIMELINE_OPTIONS: { value: ProjectTimeline; label: string }[] = [
  { value: "asap", label: "Så snart som möjligt" },
  { value: "1-3-manader", label: "Inom 1–3 månader" },
  { value: "3-6-manader", label: "Inom 3–6 månader" },
  { value: "utforskar", label: "Utforskar bara ännu" },
];

const TOTAL_STEPS = 5;

const initialState = {
  categories: [] as ProjectCategory[],
  budget: "" as ProjectBudget | "",
  timeline: "" as ProjectTimeline | "",
  description: "",
  name: "",
  company: "",
  email: "",
  phone: "",
  website: "",
};

type SubmitState = "idle" | "submitting" | "success" | "error";

const inputClasses =
  "w-full rounded-lg border border-bone/10 bg-bone/5 px-4 py-3 text-sm text-bone placeholder:text-stone/60 focus:border-emerald focus:outline-none";

const EMAIL_PATTERN = /\S+@\S+\.\S+/;

// Windows renders <option> against the OS theme, not the page's CSS, unless
// each option carries its own explicit colors.
const optionStyle = { backgroundColor: "var(--color-forest)", color: "var(--color-bone)" };

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-xs font-medium uppercase tracking-label text-stone">
      {label}
      {children}
    </label>
  );
}

function Dropdown<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T | "";
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="relative mt-5">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className={`${inputClasses} cursor-pointer appearance-none pr-10`}
        style={optionStyle}
      >
        <option value="" disabled style={optionStyle}>
          Välj ett alternativ
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value} style={optionStyle}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        strokeWidth={2.5}
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-stone"
      />
    </div>
  );
}

export function ProjectInquiryModal({ isOpen, onClose }: ProjectInquiryModalProps) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialState);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handleClose() {
    onClose();
    setStep(0);
    setForm(initialState);
    setSubmitState("idle");
  }

  function toggleCategory(value: ProjectCategory) {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(value)
        ? prev.categories.filter((c) => c !== value)
        : [...prev.categories, value],
    }));
  }

  function canAdvance() {
    switch (step) {
      case 0:
        return form.categories.length > 0;
      case 1:
        return form.budget !== "";
      case 2:
        return form.timeline !== "";
      case 3:
        return form.description.trim().length >= 20;
      default:
        return true;
    }
  }

  const canSubmit = form.name.trim().length > 0 && EMAIL_PATTERN.test(form.email);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;

    setSubmitState("submitting");
    try {
      const response = await fetch("/api/projektforfragan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("request failed");
      setSubmitState("success");
    } catch {
      setSubmitState("error");
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/80 p-4 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-y-auto rounded-2xl border border-bone/10 bg-forest p-6 md:p-8"
      >
        {submitState === "success" ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald/10 text-emerald">
              <Check size={26} strokeWidth={2.5} />
            </span>
            <div>
              <h3 className="font-display text-xl font-bold text-bone">Tack för din förfrågan!</h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-stone">
                Vi går igenom det du skickat in och hör av oss inom 24 timmar.
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="mt-2 inline-flex cursor-pointer items-center justify-center rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-bone"
            >
              Stäng
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs font-medium uppercase tracking-label text-stone">
                Steg {step + 1} av {TOTAL_STEPS}
              </p>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Stäng"
                className="cursor-pointer rounded-full p-1.5 text-stone transition-colors hover:bg-bone/10 hover:text-bone"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-bone/10">
              <div
                className="h-full rounded-full bg-emerald transition-all duration-300"
                style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
              />
            </div>

            <form
              onSubmit={step === TOTAL_STEPS - 1 ? handleSubmit : (event) => event.preventDefault()}
              className="mt-6 flex flex-1 flex-col"
            >
              <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                <label htmlFor="modal-website">Lämna detta fält tomt</label>
                <input
                  id="modal-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, website: event.target.value }))
                  }
                />
              </div>
              <div className="flex-1">
                {step === 0 && (
                  <div>
                    <h3 className="font-display text-xl font-bold text-bone">
                      Vad gäller ditt projekt?
                    </h3>
                    <p className="mt-1.5 text-sm text-stone">Kryssa i ett eller flera alternativ.</p>
                    <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                      {CATEGORY_OPTIONS.map(({ value, label, icon: Icon }) => {
                        const checked = form.categories.includes(value);
                        return (
                          <label
                            key={value}
                            className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                              checked
                                ? "border-emerald bg-emerald/10 text-emerald"
                                : "border-bone/10 bg-bone/5 text-bone/90 hover:border-bone/20"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleCategory(value)}
                              className="h-4 w-4 shrink-0 accent-emerald"
                            />
                            <Icon
                              size={15}
                              strokeWidth={2.25}
                              className={checked ? "text-emerald" : "text-stone"}
                            />
                            {label}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div>
                    <h3 className="font-display text-xl font-bold text-bone">
                      Vad är er ungefärliga budget?
                    </h3>
                    <p className="mt-1.5 text-sm text-stone">
                      Hjälper oss föreslå rätt omfattning — ni binder er inte till något.
                    </p>
                    <Dropdown
                      value={form.budget}
                      onChange={(value) => setForm((prev) => ({ ...prev, budget: value }))}
                      options={BUDGET_OPTIONS}
                    />
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h3 className="font-display text-xl font-bold text-bone">
                      När vill ni komma igång?
                    </h3>
                    <p className="mt-1.5 text-sm text-stone">Ingen bindning — bara en fingervisning.</p>
                    <Dropdown
                      value={form.timeline}
                      onChange={(value) => setForm((prev) => ({ ...prev, timeline: value }))}
                      options={TIMELINE_OPTIONS}
                    />
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h3 className="font-display text-xl font-bold text-bone">
                      Berätta kort om projektet
                    </h3>
                    <p className="mt-1.5 text-sm text-stone">
                      Vad vill ni åstadkomma? Ju mer vi förstår, desto bättre kan vi hjälpa er.
                    </p>
                    <textarea
                      autoFocus
                      rows={6}
                      value={form.description}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, description: event.target.value }))
                      }
                      placeholder="T.ex. Vi behöver en ny hemsida som känns modern och gör det enkelt för kunder att boka tid hos oss..."
                      className={`${inputClasses} mt-5 resize-none`}
                    />
                    <p className="mt-2 text-xs text-stone">
                      {form.description.trim().length < 20
                        ? `Skriv minst ${20 - form.description.trim().length} tecken till`
                        : "Bra, det räcker gott!"}
                    </p>
                  </div>
                )}

                {step === 4 && (
                  <div>
                    <h3 className="font-display text-xl font-bold text-bone">
                      Dina kontaktuppgifter
                    </h3>
                    <p className="mt-1.5 text-sm text-stone">
                      Sista steget — så vi vet vem vi ska höra av oss till.
                    </p>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <Field label="Namn *">
                        <input
                          required
                          value={form.name}
                          onChange={(event) =>
                            setForm((prev) => ({ ...prev, name: event.target.value }))
                          }
                          className={`${inputClasses} mt-2`}
                          placeholder="Ditt namn"
                        />
                      </Field>
                      <Field label="Företag">
                        <input
                          value={form.company}
                          onChange={(event) =>
                            setForm((prev) => ({ ...prev, company: event.target.value }))
                          }
                          className={`${inputClasses} mt-2`}
                          placeholder="Om ni har ett"
                        />
                      </Field>
                      <Field label="E-post *">
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={(event) =>
                            setForm((prev) => ({ ...prev, email: event.target.value }))
                          }
                          className={`${inputClasses} mt-2`}
                          placeholder="din@epost.se"
                        />
                      </Field>
                      <Field label="Telefon">
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(event) =>
                            setForm((prev) => ({ ...prev, phone: event.target.value }))
                          }
                          className={`${inputClasses} mt-2`}
                          placeholder="Valfritt"
                        />
                      </Field>
                    </div>
                  </div>
                )}
              </div>

              {submitState === "error" && (
                <p className="mt-4 text-sm text-coral">
                  Något gick fel. Försök igen, eller mejla oss direkt på info@lindqvistholmgren.se.
                </p>
              )}

              <div className="mt-8 flex items-center justify-between gap-3">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s - 1)}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium text-bone/80 transition-colors hover:text-emerald"
                  >
                    <ChevronLeft size={16} strokeWidth={2.5} />
                    Tillbaka
                  </button>
                ) : (
                  <span />
                )}

                {step < TOTAL_STEPS - 1 ? (
                  <button
                    type="button"
                    disabled={!canAdvance()}
                    onClick={() => setStep((s) => s + 1)}
                    className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-bone disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Nästa
                    <ChevronRight size={16} strokeWidth={2.5} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={submitState === "submitting" || !canSubmit}
                    className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-bone disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {submitState === "submitting" ? "Skickar…" : "Skicka förfrågan"}
                  </button>
                )}
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
