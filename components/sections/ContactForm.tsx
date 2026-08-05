"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";

const inputClasses =
  "mt-2 w-full rounded-xl border border-bone/10 bg-bone/5 px-4 py-3.5 text-sm text-bone placeholder:text-stone/50 transition-colors focus:border-emerald/60 focus:bg-bone/[0.08] focus:outline-none focus:ring-4 focus:ring-emerald/10";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const subject = encodeURIComponent(`Projektförfrågan från ${name || "hemsidan"}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);

    window.location.href = `mailto:info@lindqvistholmgren.se?subject=${subject}&body=${body}`;
  }

  return (
    <div className="rounded-3xl bg-gradient-to-br from-emerald/30 via-bone/10 to-transparent p-px">
      <div className="rounded-[calc(1.5rem-1px)] bg-charcoal/60 p-6 backdrop-blur-xl sm:p-8">
        <h2 className="font-display text-xl font-bold text-bone">Skicka ett meddelande</h2>
        <p className="mt-1 text-sm text-stone">Fyll i formuläret så återkommer vi inom 24 timmar.</p>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="text-xs font-medium uppercase tracking-label text-stone">
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
              <label htmlFor="email" className="text-xs font-medium uppercase tracking-label text-stone">
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
            <label htmlFor="message" className="text-xs font-medium uppercase tracking-label text-stone">
              Meddelande
            </label>
            <textarea
              id="message"
              required
              rows={5}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className={`${inputClasses} resize-none`}
              placeholder="Berätta kort om vad ni behöver hjälp med"
            />
          </div>
          <button
            type="submit"
            className="group mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-emerald px-6 py-3.5 text-sm font-semibold text-charcoal transition-all hover:bg-bone hover:shadow-lg hover:shadow-emerald/20"
          >
            Skicka meddelande
            <Send
              size={14}
              strokeWidth={2.5}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </button>
        </form>
      </div>
    </div>
  );
}
