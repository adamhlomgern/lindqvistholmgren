"use client";

import { FormEvent, useState } from "react";
import { Check, Send } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

const inputClasses =
  "mt-2 w-full rounded-xl border border-line-strong bg-surface px-4 py-3.5 text-sm text-fg placeholder:text-fg-subtle transition-colors focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10";

type SubmitState = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState("submitting");

    try {
      const response = await fetch("/api/projektforfragan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categories: ["vet-inte"],
          budget: "vet-inte",
          timeline: "utforskar",
          description: message,
          name,
          company: "",
          email,
          phone: "",
          website,
        }),
      });
      if (!response.ok) throw new Error("request failed");
      setSubmitState("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setSubmitState("error");
    }
  }

  if (submitState === "success") {
    return (
      <GlassCard accent="emerald">
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-pine-100 text-pine-800">
            <Check size={26} strokeWidth={2.5} />
          </span>
          <div>
            <h3 className="font-display text-xl font-semibold text-fg">Tack för ditt meddelande!</h3>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-fg-muted">
              Vi återkommer inom 24 timmar.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSubmitState("idle")}
            className="mt-2 inline-flex cursor-pointer items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
          >
            Skicka ett till
          </button>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard accent="emerald">
      <h2 className="font-display text-xl font-semibold text-fg">Skicka ett meddelande</h2>
      <p className="mt-1 text-sm text-fg-muted">Fyll i formuläret så återkommer vi inom 24 timmar.</p>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
          <label htmlFor="website">Lämna detta fält tomt</label>
          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="text-xs font-medium uppercase tracking-label text-fg-muted">
              Namn
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={inputClasses}
              placeholder="Ditt namn"
            />
          </div>
          <div>
            <label htmlFor="email" className="text-xs font-medium uppercase tracking-label text-fg-muted">
              E-post
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={inputClasses}
              placeholder="din@epost.se"
            />
          </div>
        </div>
        <div>
          <label htmlFor="message" className="text-xs font-medium uppercase tracking-label text-fg-muted">
            Meddelande
          </label>
          <textarea
            id="message"
            required
            minLength={20}
            rows={5}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className={`${inputClasses} resize-none`}
            placeholder="Berätta kort om vad ni behöver hjälp med"
          />
        </div>
        {submitState === "error" && (
          <p className="text-sm text-coral">
            Något gick fel. Försök igen, eller mejla oss direkt på info@lindqvistholmgren.se.
          </p>
        )}
        <button
          type="submit"
          disabled={submitState === "submitting"}
          className="group mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-on-primary transition-all hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitState === "submitting" ? "Skickar…" : "Skicka meddelande"}
          <Send
            size={14}
            strokeWidth={2.5}
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </button>
      </form>
    </GlassCard>
  );
}
