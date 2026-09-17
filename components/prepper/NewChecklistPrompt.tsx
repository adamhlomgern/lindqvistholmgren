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
        className="mb-2 flex items-center gap-1.5 self-start text-xs font-medium text-prepper-text-muted transition-colors hover:text-prepper-text"
      >
        <ArrowLeft size={13} strokeWidth={2} />
        Arbetsböcker
      </Link>
      <BookOpen size={22} strokeWidth={1.5} className="text-prepper-text-faint" />
      <h1 className="font-prepper-display text-3xl text-prepper-text">{notebookName}</h1>
      <p className="max-w-xs text-[15px] leading-relaxed text-prepper-text-muted">
        Här är det tomt än så länge. Lägg till första checklistan i den här arbetsboken.
      </p>
      <form onSubmit={handleSubmit} className="mt-2 flex w-full items-center gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="T.ex. Inför bebis"
          className="min-h-11 flex-1 rounded-xl border border-prepper-border bg-prepper-surface px-4 py-2.5 text-sm text-prepper-text placeholder:text-prepper-text-faint focus:border-prepper-primary focus:outline-none focus:ring-2 focus:ring-prepper-focus/30"
        />
        <button
          type="submit"
          disabled={pending || !title.trim()}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-prepper-primary text-prepper-on-primary transition-colors hover:bg-prepper-primary-hover active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-prepper-focus focus-visible:ring-offset-2 disabled:opacity-50"
        >
          <Plus size={17} strokeWidth={2.25} />
        </button>
      </form>
    </div>
  );
}
