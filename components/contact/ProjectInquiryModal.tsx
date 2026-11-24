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
import { CtaReassurance } from "@/components/ui/CtaReassurance";
import { trackConversion } from "@/lib/analytics";

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

// Fyra steg: vad, budget + tid, beskrivning, kontaktuppgifter. Budget och
// tidsram låg tidigare i var sitt steg; ihop blir flödet kortare utan att vi
// tappar någon uppgift.
const TOTAL_STEPS = 4;

// "Snabbt meddelande" hoppar över stegen och skickar samma standardvärden som
// kontaktformuläret på /kontakt (components/sections/ContactForm.tsx), så att
// förfrågan ser likadan ut i admin.
const QUICK_DEFAULTS = {
  categories: ["vet-inte"] as ProjectCategory[],
  budget: "vet-inte" as ProjectBudget,
  timeline: "utforskar" as ProjectTimeline,
};

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
  "w-full rounded-lg border border-line-strong bg-surface px-4 py-3 text-sm text-fg placeholder:text-fg-subtle focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none";

const EMAIL_PATTERN = /\S+@\S+\.\S+/;

// Windows renders <option> against the OS theme, not the page's CSS, unless
// each option carries its own explicit colors.
const optionStyle = { backgroundColor: "var(--color-surface)", color: "var(--color-fg)" };

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-sm font-medium text-fg">
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
    <div className="relative mt-2">
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
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-fg-muted"
      />
    </div>
  );
}

export function ProjectInquiryModal({ isOpen, onClose }: ProjectInquiryModalProps) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialState);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [quick, setQuick] = useState(false);

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
    setQuick(false);
  }

  function goToStep(next: number) {
    setStep(next);
    trackConversion({ name: "inquiry_step", step: next + 1, mode: "full" });
  }

  function switchToQuick() {
    setQuick(true);
    trackConversion({ name: "inquiry_quick_mode" });
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
        return form.budget !== "" && form.timeline !== "";
      case 2:
        return form.description.trim().length >= 20;
      default:
        return true;
    }
  }

  const canSubmit =
    form.name.trim().length > 0 &&
    EMAIL_PATTERN.test(form.email) &&
    (!quick || form.description.trim().length >= 20);
  const isLastStep = quick || step === TOTAL_STEPS - 1;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;

    setSubmitState("submitting");
    try {
      const response = await fetch("/api/projektforfragan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quick ? { ...form, ...QUICK_DEFAULTS } : form),
      });
      if (!response.ok) throw new Error("request failed");
      trackConversion({ name: "inquiry_submit", mode: quick ? "quick" : "full" });
      setSubmitState("success");
    } catch {
      setSubmitState("error");
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-950/40 p-4 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-y-auto rounded-2xl bg-surface p-6 shadow-pop ring-1 ring-line md:p-8"
      >
        {submitState === "success" ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-pine-100 text-pine-800">
              <Check size={26} strokeWidth={2.5} />
            </span>
            <div>
              <h3 className="font-display text-xl font-semibold text-fg">Tack för din förfrågan!</h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-fg-muted">
                Vi går igenom det du skickat in och hör av oss inom 24 timmar.
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="mt-2 inline-flex cursor-pointer items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
            >
              Stäng
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium text-fg-muted">
                {quick ? "Snabbt meddelande" : `Steg ${step + 1} av ${TOTAL_STEPS}`}
              </p>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Stäng"
                className="cursor-pointer rounded-full p-1.5 text-fg-muted transition-colors hover:bg-surface-sunken hover:text-fg"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-fg/10">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: quick ? "100%" : `${((step + 1) / TOTAL_STEPS) * 100}%` }}
              />
            </div>

            <form
              onSubmit={isLastStep ? handleSubmit : (event) => event.preventDefault()}
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
                {quick && (
                  <div>
                    <h3 className="font-display text-xl font-semibold text-fg">Skriv fritt till oss</h3>
                    <p className="mt-1.5 text-sm text-fg-muted">
                      Berätta kort vad ni funderar på, så hör vi av oss inom 24 timmar.
                    </p>
                    <div className="mt-5 flex flex-col gap-4">
                      <Field label="Meddelande *">
                        <textarea
                          autoFocus
                          rows={4}
                          value={form.description}
                          onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                          placeholder="T.ex. Vi funderar på en ny hemsida och vill veta hur ni brukar lägga upp det…"
                          className={`${inputClasses} mt-2 resize-none`}
                        />
                      </Field>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Namn *">
                          <input
                            required
                            value={form.name}
                            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                            className={`${inputClasses} mt-2`}
                            placeholder="Ditt namn"
                          />
                        </Field>
                        <Field label="E-post *">
                          <input
                            type="email"
                            required
                            value={form.email}
                            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                            className={`${inputClasses} mt-2`}
                            placeholder="din@epost.se"
                          />
                        </Field>
                      </div>
                      {form.description.trim().length > 0 && form.description.trim().length < 20 && (
                        <p className="text-xs text-fg-muted">
                          Skriv minst {20 - form.description.trim().length} tecken till i meddelandet
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {!quick && step === 0 && (
                  <div>
                    <h3 className="font-display text-xl font-semibold text-fg">
                      Vad gäller ditt projekt?
                    </h3>
                    <p className="mt-1.5 text-sm text-fg-muted">
                      Tar under en minut. Kryssa i ett eller flera alternativ.
                    </p>
                    <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                      {CATEGORY_OPTIONS.map(({ value, label, icon: Icon }) => {
                        const checked = form.categories.includes(value);
                        return (
                          <label
                            key={value}
                            className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                              checked
                                ? "border-primary bg-pine-100 text-pine-800"
                                : "border-line bg-surface text-fg hover:border-line-strong hover:bg-surface-sunken"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleCategory(value)}
                              className="h-4 w-4 shrink-0 accent-primary"
                            />
                            <Icon
                              size={15}
                              strokeWidth={2.25}
                              className={checked ? "text-primary" : "text-fg-muted"}
                            />
                            {label}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {!quick && step === 0 && (
                  <button
                    type="button"
                    onClick={switchToQuick}
                    className="mt-5 cursor-pointer text-sm text-fg-muted underline decoration-line-strong underline-offset-4 transition-colors hover:text-fg hover:decoration-fg"
                  >
                    Hellre skriva fritt? Skicka ett kort meddelande i stället
                  </button>
                )}

                {!quick && step === 1 && (
                  <div>
                    <h3 className="font-display text-xl font-semibold text-fg">Budget och tidsram</h3>
                    <p className="mt-1.5 text-sm text-fg-muted">
                      En fingervisning räcker — det hjälper oss föreslå rätt omfattning. Ni binder er inte
                      till något.
                    </p>
                    <p className="mt-5 text-sm font-medium text-fg">Ungefärlig budget</p>
                    <Dropdown
                      value={form.budget}
                      onChange={(value) => setForm((prev) => ({ ...prev, budget: value }))}
                      options={BUDGET_OPTIONS}
                    />
                    <p className="mt-5 text-sm font-medium text-fg">När vill ni komma igång?</p>
                    <Dropdown
                      value={form.timeline}
                      onChange={(value) => setForm((prev) => ({ ...prev, timeline: value }))}
                      options={TIMELINE_OPTIONS}
                    />
                  </div>
                )}

                {!quick && step === 2 && (
                  <div>
                    <h3 className="font-display text-xl font-semibold text-fg">
                      Berätta kort om projektet
                    </h3>
                    <p className="mt-1.5 text-sm text-fg-muted">
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
                    <p className="mt-2 text-xs text-fg-muted">
                      {form.description.trim().length < 20
                        ? `Skriv minst ${20 - form.description.trim().length} tecken till`
                        : "Bra, det räcker gott!"}
                    </p>
                  </div>
                )}

                {!quick && step === 3 && (
                  <div>
                    <h3 className="font-display text-xl font-semibold text-fg">
                      Dina kontaktuppgifter
                    </h3>
                    <p className="mt-1.5 text-sm text-fg-muted">
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
                <p className="mt-4 text-sm text-danger">
                  Något gick fel. Försök igen, eller mejla oss direkt på info@lindqvistholmgren.se.
                </p>
              )}

              {isLastStep && <CtaReassurance className="mt-6 text-[13px]" />}

              <div className="mt-6 flex items-center justify-between gap-3">
                {quick || step > 0 ? (
                  <button
                    type="button"
                    onClick={() => (quick ? setQuick(false) : setStep((s) => s - 1))}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium text-fg transition-colors hover:text-primary"
                  >
                    <ChevronLeft size={16} strokeWidth={2.5} />
                    Tillbaka
                  </button>
                ) : (
                  <span />
                )}

                {!isLastStep ? (
                  <button
                    type="button"
                    disabled={!canAdvance()}
                    onClick={() => goToStep(step + 1)}
                    className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Nästa
                    <ChevronRight size={16} strokeWidth={2.5} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={submitState === "submitting" || !canSubmit}
                    className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
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
