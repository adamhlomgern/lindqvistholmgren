"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, Plus } from "lucide-react";
import { createChecklist } from "@/lib/actions/prepper";

export function NewChecklistPrompt({ notebookId, notebookName }: { notebookId: string; notebookName: string }) {
  const [title, setTitle] = useState("");
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    startTransition(async () => {
      const created = await createChecklist(notebookId, trimmed);
      if (created) router.push(`/admin/appar/prepper/${notebookId}?checklist=${created.id}`);
    });
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-20 text-center sm:px-6">
      <Link
        href="/admin/appar/prepper"
        className="mb-2 flex items-center gap-1.5 self-start text-sm font-medium text-prepper-text-muted hover:text-prepper-text"
      >
        <ArrowLeft size={15} strokeWidth={2} />
        Arbetsböcker
      </Link>
      <BookOpen size={26} strokeWidth={1.75} className="text-prepper-text-muted" />
      <h1 className="font-prepper-display text-2xl text-prepper-text">{notebookName}</h1>
      <p className="text-sm text-prepper-text-muted">
        Här är det tomt än så länge. Lägg till första checklistan i den här arbetsboken.
      </p>
      <form onSubmit={handleSubmit} className="mt-2 flex w-full items-center gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="T.ex. Inför bebis"
          className="min-h-11 flex-1 rounded-full border border-prepper-border bg-prepper-surface px-4 text-sm text-prepper-text placeholder:text-prepper-text-muted focus:border-prepper-primary focus:outline-none focus:ring-2 focus:ring-prepper-focus/30"
        />
        <button
          type="submit"
          disabled={pending || !title.trim()}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-prepper-primary text-prepper-lavender-50 transition-colors hover:bg-prepper-primary-hover disabled:opacity-50"
        >
          <Plus size={17} strokeWidth={2.25} />
        </button>
      </form>
    </div>
  );
}
