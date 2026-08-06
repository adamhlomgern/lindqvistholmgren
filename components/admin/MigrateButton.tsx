"use client";

import { useState } from "react";

export function MigrateButton() {
  const [status, setStatus] = useState<"idle" | "running" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleClick() {
    setStatus("running");
    try {
      const response = await fetch("/api/admin/migrate-content", { method: "POST" });
      const result = await response.json();

      if (!response.ok) {
        setStatus("error");
        setMessage("Något gick fel. Kolla att tabellerna finns i Supabase.");
        return;
      }

      setStatus("done");
      setMessage(`Klart! ${result.projects} projekt och ${result.articles} artiklar sparade.`);
    } catch {
      setStatus("error");
      setMessage("Något gick fel. Försök igen.");
    }
  }

  return (
    <div className="mt-8 rounded-2xl border border-emerald/30 bg-emerald/5 p-6">
      <p className="text-sm text-bone">
        Klicka här en gång för att flytta in de gamla projekten och artiklarna i databasen.
      </p>
      <button
        type="button"
        onClick={handleClick}
        disabled={status === "running" || status === "done"}
        className="mt-4 rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-bone disabled:opacity-60"
      >
        {status === "running" ? "Flyttar innehåll…" : "Flytta in gammalt innehåll"}
      </button>
      {message && (
        <p className={`mt-3 text-sm ${status === "error" ? "text-coral" : "text-stone"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
