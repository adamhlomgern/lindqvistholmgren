"use client";

import { useActionState, useRef, useState, type ReactNode } from "react";
import { ImagePlus, Plus, X } from "lucide-react";
import type { Project } from "@/lib/types";
import { createProject, updateProject, type ProjectFormState } from "@/lib/actions/projects";

const inputClasses =
  "w-full rounded-lg border border-bone/10 bg-bone/5 px-4 py-3 text-sm text-bone placeholder:text-stone/60 focus:border-emerald focus:outline-none disabled:opacity-50";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    // U+0300–U+036F: combining diacritical marks split out by NFD normalization
    // above — stripping them turns "ö"/"å"/"é" into their plain "o"/"a"/"e" base.
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function uploadImage(file: File): Promise<{ url?: string; error?: string }> {
  const body = new FormData();
  body.append("file", file);
  try {
    const response = await fetch("/api/admin/upload", { method: "POST", body });
    const result = await response.json();
    if (!response.ok) return { error: result?.error ?? "Uppladdningen misslyckades." };
    return { url: result.url as string };
  } catch {
    return { error: "Uppladdningen misslyckades. Kontrollera din internetanslutning." };
  }
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  // A <label> here would be nice for a11y, but native label-click-delegation
  // forwards any click inside it to the *first* labelable descendant — a
  // real problem once a field contains more than one control (e.g. the image
  // field's dropzone + "paste a URL instead" input), where it hijacks clicks
  // meant for something else.
  return (
    <div className="block">
      <span className="block text-xs font-medium uppercase tracking-label text-stone">{label}</span>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="border-t border-bone/10 pt-6 first:border-t-0 first:pt-0">
      <h2 className="font-display text-sm font-bold text-bone">{title}</h2>
      {description && <p className="mt-1 text-xs text-stone">{description}</p>}
      <div className="mt-4 flex flex-col gap-5">{children}</div>
    </div>
  );
}

function Dropzone({
  active,
  compact,
  uploading,
  onDragOver,
  onDragLeave,
  onDrop,
  onClick,
  label,
}: {
  active: boolean;
  compact?: boolean;
  uploading: boolean;
  onDragOver: (event: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (event: React.DragEvent) => void;
  onClick: () => void;
  label: string;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
      className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed text-center transition-colors ${
        compact ? "px-4 py-5 text-xs" : "aspect-[16/10] text-sm"
      } ${active ? "border-emerald bg-emerald/5 text-emerald" : "border-bone/15 text-stone hover:border-bone/30 hover:text-bone"}`}
    >
      <ImagePlus size={compact ? 16 : 22} strokeWidth={1.75} />
      <p>{uploading ? "Laddar upp…" : label}</p>
      {!compact && <p className="text-xs text-stone/70">PNG, JPG eller WebP — dra hit eller klicka</p>}
    </div>
  );
}

function MainImageField({ name, defaultValue }: { name: string; defaultValue: string }) {
  const [image, setImage] = useState(defaultValue);
  const [imageBroken, setImageBroken] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [urlMode, setUrlMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    const result = await uploadImage(file);
    setUploading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setImage(result.url!);
    setImageBroken(false);
  }

  return (
    <div>
      {image && !imageBroken ? (
        <div className="group relative aspect-[16/10] overflow-hidden rounded-xl border border-bone/10 bg-bone/5">
          {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary uploaded/pasted URL, can't be pre-approved for next/image's remote patterns */}
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover"
            onError={() => setImageBroken(true)}
          />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-charcoal/0 opacity-0 transition-all group-hover:bg-charcoal/60 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-full bg-bone px-4 py-2 text-xs font-semibold text-charcoal"
            >
              Byt bild
            </button>
            <button
              type="button"
              onClick={() => {
                setImage("");
                setImageBroken(false);
              }}
              className="rounded-full bg-coral px-4 py-2 text-xs font-semibold text-charcoal"
            >
              Ta bort
            </button>
          </div>
        </div>
      ) : (
        <Dropzone
          active={dragActive}
          uploading={uploading}
          onDragOver={(event) => {
            event.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragActive(false);
            void handleFiles(event.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          label="Dra och släpp en bild, eller klicka för att välja"
        />
      )}

      {image && imageBroken && (
        <p className="mt-2 text-xs text-coral">Kunde inte läsa in bilden från angiven URL.</p>
      )}
      {error && <p className="mt-2 text-xs text-coral">{error}</p>}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(event) => {
          void handleFiles(event.target.files);
          event.target.value = "";
        }}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => setUrlMode((v) => !v)}
        className="mt-2 text-xs font-medium text-stone transition-colors hover:text-emerald"
      >
        {urlMode ? "Dölj URL-fält" : "eller klistra in en bild-URL"}
      </button>
      {urlMode && (
        <input
          value={image}
          onChange={(event) => {
            setImage(event.target.value);
            setImageBroken(false);
          }}
          placeholder="/images/... eller https://..."
          className={`${inputClasses} mt-2`}
        />
      )}

      <input type="hidden" name={name} value={image} />
    </div>
  );
}

function GalleryField({ name, defaultValue }: { name: string; defaultValue: string[] }) {
  const [items, setItems] = useState<string[]>(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function update(index: number, value: string) {
    setItems((prev) => prev.map((item, i) => (i === index ? value : item)));
  }
  function remove(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleFiles(files: FileList | null) {
    const list = Array.from(files ?? []);
    if (list.length === 0) return;
    setError(null);
    setUploading(true);
    const results = await Promise.all(list.map(uploadImage));
    setUploading(false);
    const urls = results.map((result) => result.url).filter((url): url is string => Boolean(url));
    const firstError = results.find((result) => result.error)?.error;
    if (firstError) setError(firstError);
    if (urls.length > 0) setItems((prev) => [...prev, ...urls]);
  }

  return (
    <div className="flex flex-col gap-3">
      {items.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="group relative aspect-square overflow-hidden rounded-lg border border-bone/10 bg-bone/5"
            >
              {item && (
                // eslint-disable-next-line @next/next/no-img-element -- arbitrary uploaded/pasted URL, can't be pre-approved for next/image's remote patterns
                <img
                  src={item}
                  alt=""
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.visibility = "hidden";
                  }}
                />
              )}
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label="Ta bort bild från galleriet"
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-charcoal/80 text-bone opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X size={12} strokeWidth={2.5} />
              </button>
            </div>
          ))}
        </div>
      )}

      <Dropzone
        compact
        active={dragActive}
        uploading={uploading}
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragActive(false);
          void handleFiles(event.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        label="Dra och släpp bilder, eller klicka för att välja"
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(event) => {
          void handleFiles(event.target.files);
          event.target.value = "";
        }}
        className="hidden"
      />
      {error && <p className="text-xs text-coral">{error}</p>}

      <button
        type="button"
        onClick={() => setManualMode((v) => !v)}
        className="self-start text-xs font-medium text-stone transition-colors hover:text-emerald"
      >
        {manualMode ? "Dölj URL-hantering" : "eller hantera bild-URL:er manuellt"}
      </button>
      {manualMode && (
        <div className="flex flex-col gap-2">
          {items.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input
                value={item}
                onChange={(event) => update(index, event.target.value)}
                placeholder="https://..."
                className={inputClasses}
              />
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label="Ta bort bild"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-stone transition-colors hover:text-coral"
              >
                <X size={16} strokeWidth={2.25} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setItems((prev) => [...prev, ""])}
            className="flex items-center gap-1.5 self-start rounded-lg px-2 py-1.5 text-xs font-medium text-emerald transition-colors hover:bg-emerald/10"
          >
            <Plus size={14} strokeWidth={2.5} />
            Lägg till URL
          </button>
        </div>
      )}

      <input
        type="hidden"
        name={name}
        value={items.map((v) => v.trim()).filter(Boolean).join("\n")}
        readOnly
      />
    </div>
  );
}

type StatRow = { value: string; label: string };

function StatsField({ name, defaultValue }: { name: string; defaultValue: StatRow[] }) {
  const [rows, setRows] = useState<StatRow[]>(defaultValue);

  function update(index: number, key: keyof StatRow, value: string) {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
  }
  function remove(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  const valid = rows
    .map((row) => ({ value: row.value.trim(), label: row.label.trim() }))
    .filter((row) => row.value && row.label);
  const serialized = valid.map((row) => `${row.value} | ${row.label}`).join("\n");

  return (
    <div className="flex flex-col gap-3">
      {rows.map((row, index) => (
        <div key={index} className="flex flex-col gap-2 rounded-xl border border-bone/10 bg-bone/5 p-3 sm:flex-row">
          <div className="sm:w-32 sm:shrink-0">
            <span className="block text-[10px] font-medium uppercase tracking-label text-stone/70">
              Siffra
            </span>
            <input
              value={row.value}
              onChange={(event) => update(index, "value", event.target.value)}
              placeholder="+250%"
              className={`${inputClasses} mt-1`}
            />
          </div>
          <div className="min-w-0 flex-1">
            <span className="block text-[10px] font-medium uppercase tracking-label text-stone/70">
              Beskrivning
            </span>
            <input
              value={row.label}
              onChange={(event) => update(index, "label", event.target.value)}
              placeholder="Fler organiska besökare"
              className={`${inputClasses} mt-1`}
            />
          </div>
          <button
            type="button"
            onClick={() => remove(index)}
            aria-label="Ta bort statistikrad"
            className="flex h-11 w-11 shrink-0 items-center justify-center self-end rounded-lg text-stone transition-colors hover:text-coral sm:self-end"
          >
            <X size={16} strokeWidth={2.25} />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => setRows((prev) => [...prev, { value: "", label: "" }])}
        className="flex items-center gap-1.5 self-start rounded-lg px-2 py-1.5 text-xs font-medium text-emerald transition-colors hover:bg-emerald/10"
      >
        <Plus size={14} strokeWidth={2.5} />
        Lägg till statistik
      </button>

      {valid.length > 0 && (
        <div>
          <p className="mb-2 text-[10px] font-medium uppercase tracking-label text-stone/70">
            Förhandsvisning
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {valid.map((row, index) => (
              <div key={index} className="rounded-xl border border-bone/10 bg-bone/5 p-3 text-center">
                <p className="font-display text-lg font-bold text-emerald">{row.value}</p>
                <p className="mt-1 text-xs leading-snug text-stone">{row.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <input type="hidden" name={name} value={serialized} readOnly />
    </div>
  );
}

type ProjectFormProps = { project?: Project; existingCategories?: string[] };

export function ProjectForm({ project, existingCategories = [] }: ProjectFormProps) {
  const isEditing = Boolean(project);
  const action = isEditing ? updateProject.bind(null, project!.slug) : createProject;
  const [state, formAction, pending] = useActionState<ProjectFormState, FormData>(action, undefined);

  const [slug, setSlug] = useState(project?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEditing);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <Section title="Grunduppgifter">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Slug (url)">
            <input
              name="slug"
              value={slug}
              onChange={(event) => {
                setSlug(event.target.value);
                setSlugTouched(true);
              }}
              disabled={isEditing}
              required
              placeholder="mitt-projekt"
              className={inputClasses}
            />
          </Field>
          <Field label="Titel">
            <input
              name="title"
              defaultValue={project?.title}
              onChange={(event) => {
                if (!slugTouched) setSlug(slugify(event.target.value));
              }}
              required
              className={inputClasses}
            />
          </Field>
        </div>
        <Field label="Kategori (t.ex. Webb, branding)">
          <input
            name="category"
            defaultValue={project?.category}
            required
            list="project-category-suggestions"
            className={inputClasses}
          />
          <datalist id="project-category-suggestions">
            {existingCategories.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </Field>
        <Field label="Sammanfattning (visas i listan)">
          <textarea
            name="summary"
            defaultValue={project?.summary}
            required
            rows={2}
            className={inputClasses}
          />
        </Field>
        <Field label="Intro (visas överst på projektsidan)">
          <textarea
            name="intro"
            defaultValue={project?.intro}
            required
            rows={3}
            className={inputClasses}
          />
        </Field>
      </Section>

      <Section title="Bild & galleri">
        <Field label="Huvudbild">
          <MainImageField name="image" defaultValue={project?.image ?? ""} />
        </Field>
        <Field label="Bildgalleri (valfritt)">
          <GalleryField name="gallery" defaultValue={project?.gallery ?? []} />
        </Field>
      </Section>

      <Section title="Projektdetaljer">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Kund">
            <input name="client" defaultValue={project?.client} required className={inputClasses} />
          </Field>
          <Field label="Bransch">
            <input name="industry" defaultValue={project?.industry} required className={inputClasses} />
          </Field>
          <Field label="Tjänster">
            <input name="services" defaultValue={project?.services} required className={inputClasses} />
          </Field>
          <Field label="Lansering">
            <input name="launch" defaultValue={project?.launch} required className={inputClasses} />
          </Field>
          <Field label="Plattform">
            <input name="platform" defaultValue={project?.platform} required className={inputClasses} />
          </Field>
        </div>
      </Section>

      <Section title="Utmaning & lösning">
        <Field label="Utmaningen">
          <textarea
            name="challenge"
            defaultValue={project?.challenge}
            required
            rows={3}
            className={inputClasses}
          />
        </Field>
        <Field label="Lösningen (ett stycke per rad)">
          <textarea
            name="solution"
            defaultValue={(project?.solution ?? []).join("\n")}
            required
            rows={4}
            className={inputClasses}
          />
        </Field>
      </Section>

      <Section title="Statistik" description="Valfritt — visas som highlights på projektsidan.">
        <StatsField name="stats" defaultValue={project?.stats ?? []} />
      </Section>

      <div className="flex flex-col gap-3 border-t border-bone/10 pt-6">
        {state?.error && <p className="text-sm text-coral">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="self-start rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-bone disabled:opacity-60"
        >
          {pending ? "Sparar…" : isEditing ? "Spara ändringar" : "Skapa case"}
        </button>
      </div>
    </form>
  );
}
