"use client";

import { useRef, useState, type ReactNode } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import { Table, TableCell, TableHeader, TableRow } from "@tiptap/extension-table";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Image } from "@tiptap/extension-image";
import {
  Bold,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo,
  Table as TableIcon,
  Undo,
} from "lucide-react";
import { slugifyHeading, type OutlineHeading } from "@/lib/articles/outline";
import { countWords } from "@/lib/articles/reading-time";

// Headings need a stable DOM id for the outline sidebar to scroll to. The
// id is derived from the heading's own text, so it updates automatically
// as the user edits — no separate id bookkeeping to keep in sync.
const HeadingWithId = Heading.extend({
  renderHTML({ node, HTMLAttributes }) {
    const level = node.attrs.level as number;
    const id = slugifyHeading(node.textContent);
    return [`h${level}`, { ...HTMLAttributes, id }, 0];
  },
});

type RichTextEditorProps = {
  name: string;
  defaultValue?: string;
  onOutlineChange?: (headings: OutlineHeading[]) => void;
  onWordCountChange?: (count: number) => void;
};

function ToolbarButton({
  active,
  onClick,
  disabled,
  children,
  label,
}: {
  active?: boolean;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      // Editor loses DOM focus on mousedown otherwise, which drops the
      // selection the command below is supposed to act on.
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-semibold transition-colors disabled:opacity-40 ${
        active ? "bg-emerald/15 text-emerald" : "text-stone hover:bg-bone/10 hover:text-bone"
      }`}
    >
      {children}
    </button>
  );
}

function extractOutline(doc: Editor["state"]["doc"]): OutlineHeading[] {
  const headings: OutlineHeading[] = [];
  doc.descendants((node) => {
    if (node.type.name === "heading") {
      headings.push({
        id: slugifyHeading(node.textContent),
        level: node.attrs.level as number,
        text: node.textContent,
      });
    }
  });
  return headings;
}

export function RichTextEditor({ name, defaultValue = "", onOutlineChange, onWordCountChange }: RichTextEditorProps) {
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  // Bumped on update/selection change purely to re-render the toolbar's
  // active-state highlighting — the editor content itself never touches
  // React state (see onUpdate below), so typing can't disturb it.
  const [, bumpToolbar] = useState(0);
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
  const [linkDraft, setLinkDraft] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        link: { openOnClick: false, autolink: true },
      }),
      HeadingWithId.configure({ levels: [2, 3, 4] }),
      Placeholder.configure({ placeholder: "Skriv artikeltexten här…" }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      Image,
    ],
    content: defaultValue,
    // Writes straight to the hidden input's DOM node instead of React state,
    // so typing doesn't re-render (and steal focus/selection from) the
    // editor on every keystroke.
    onUpdate: ({ editor }) => {
      if (hiddenInputRef.current) {
        hiddenInputRef.current.value = editor.getHTML();
      }
      onOutlineChange?.(extractOutline(editor.state.doc));
      onWordCountChange?.(countWords(editor.getHTML()));
      bumpToolbar((n) => n + 1);
    },
    onSelectionUpdate: () => bumpToolbar((n) => n + 1),
    onCreate: ({ editor }) => {
      onOutlineChange?.(extractOutline(editor.state.doc));
      onWordCountChange?.(countWords(editor.getHTML()));
    },
    editorProps: {
      attributes: {
        class: "article-prose min-h-[32rem] focus:outline-none",
      },
    },
  });

  if (!editor) {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-lg border border-bone/10 bg-bone/5 text-sm text-stone">
        Laddar redigerare…
      </div>
    );
  }

  const toolbarState = {
    h2: editor.isActive("heading", { level: 2 }),
    h3: editor.isActive("heading", { level: 3 }),
    h4: editor.isActive("heading", { level: 4 }),
    bold: editor.isActive("bold"),
    italic: editor.isActive("italic"),
    bulletList: editor.isActive("bulletList"),
    orderedList: editor.isActive("orderedList"),
    blockquote: editor.isActive("blockquote"),
    link: editor.isActive("link"),
  };

  async function handleImageChoice(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !editor) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Uppladdningen misslyckades");
      editor.chain().focus().setImage({ src: body.url }).run();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Kunde inte ladda upp bilden.");
    } finally {
      setUploadingImage(false);
    }
  }

  return (
    <div className="rounded-lg border border-bone/10 bg-bone/5">
      <div className="sticky top-28 z-10 flex flex-wrap items-center gap-1 rounded-t-lg border-b border-bone/10 bg-charcoal/95 p-2 backdrop-blur sm:top-16">
        <ToolbarButton
          label="Rubrik H2"
          active={toolbarState.h2}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          label="Rubrik H3"
          active={toolbarState.h3}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </ToolbarButton>
        <ToolbarButton
          label="Rubrik H4"
          active={toolbarState.h4}
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        >
          H4
        </ToolbarButton>
        <div className="mx-1 h-5 w-px bg-bone/10" />
        <ToolbarButton
          label="Fet text"
          active={toolbarState.bold}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={14} strokeWidth={2.5} />
        </ToolbarButton>
        <ToolbarButton
          label="Kursiv text"
          active={toolbarState.italic}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={14} strokeWidth={2.5} />
        </ToolbarButton>
        <div className="mx-1 h-5 w-px bg-bone/10" />
        <ToolbarButton
          label="Punktlista"
          active={toolbarState.bulletList}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={14} strokeWidth={2.5} />
        </ToolbarButton>
        <ToolbarButton
          label="Numrerad lista"
          active={toolbarState.orderedList}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={14} strokeWidth={2.5} />
        </ToolbarButton>
        <ToolbarButton
          label="Citat"
          active={toolbarState.blockquote}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote size={14} strokeWidth={2.5} />
        </ToolbarButton>
        <div className="mx-1 h-5 w-px bg-bone/10" />
        <div className="relative">
          <ToolbarButton
            label="Länk"
            active={toolbarState.link}
            onClick={() => {
              setLinkDraft(editor.getAttributes("link").href ?? "");
              setLinkPopoverOpen((v) => !v);
            }}
          >
            <LinkIcon size={14} strokeWidth={2.5} />
          </ToolbarButton>
          {linkPopoverOpen && (
            <div className="absolute left-0 top-full z-20 mt-1.5 flex w-64 items-center gap-1.5 rounded-xl border border-bone/10 bg-forest p-2 shadow-xl">
              <input
                autoFocus
                value={linkDraft}
                onChange={(event) => setLinkDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    if (linkDraft.trim()) {
                      editor.chain().focus().extendMarkRange("link").setLink({ href: linkDraft.trim() }).run();
                    } else {
                      editor.chain().focus().extendMarkRange("link").unsetLink().run();
                    }
                    setLinkPopoverOpen(false);
                  }
                  if (event.key === "Escape") setLinkPopoverOpen(false);
                }}
                placeholder="https://…"
                className="w-full rounded-lg border border-bone/10 bg-bone/5 px-2.5 py-1.5 text-xs text-bone placeholder:text-stone/60 focus:border-emerald focus:outline-none"
              />
              {toolbarState.link && (
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    editor.chain().focus().extendMarkRange("link").unsetLink().run();
                    setLinkPopoverOpen(false);
                  }}
                  className="shrink-0 text-xs font-medium text-coral hover:underline"
                >
                  Ta bort
                </button>
              )}
            </div>
          )}
        </div>
        <ToolbarButton
          label="Infoga bild"
          disabled={uploadingImage}
          onClick={() => imageInputRef.current?.click()}
        >
          {uploadingImage ? "…" : <ImageIcon size={14} strokeWidth={2.5} />}
        </ToolbarButton>
        <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChoice} />
        <div className="mx-1 h-5 w-px bg-bone/10" />
        <ToolbarButton
          label="Infoga tabell"
          onClick={() =>
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          }
        >
          <TableIcon size={14} strokeWidth={2.5} />
        </ToolbarButton>
        <div className="mx-1 h-5 w-px bg-bone/10" />
        <ToolbarButton label="Ångra" onClick={() => editor.chain().focus().undo().run()}>
          <Undo size={14} strokeWidth={2.5} />
        </ToolbarButton>
        <ToolbarButton label="Gör om" onClick={() => editor.chain().focus().redo().run()}>
          <Redo size={14} strokeWidth={2.5} />
        </ToolbarButton>
      </div>
      <div className="px-4 py-3">
        <EditorContent editor={editor} />
      </div>
      <input type="hidden" name={name} ref={hiddenInputRef} defaultValue={defaultValue} />
    </div>
  );
}
