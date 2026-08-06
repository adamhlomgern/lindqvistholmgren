"use client";

import { useRef, useState, type ReactNode } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Table, TableCell, TableHeader, TableRow } from "@tiptap/extension-table";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Bold, Italic, List, ListOrdered, Quote, Redo, Table as TableIcon, Undo } from "lucide-react";

type RichTextEditorProps = {
  name: string;
  defaultValue?: string;
};

function ToolbarButton({
  active,
  onClick,
  children,
  label,
}: {
  active?: boolean;
  onClick: () => void;
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
      aria-label={label}
      title={label}
      className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-semibold transition-colors ${
        active ? "bg-emerald/15 text-emerald" : "text-stone hover:bg-bone/10 hover:text-bone"
      }`}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({ name, defaultValue = "" }: RichTextEditorProps) {
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  // Bumped on update/selection change purely to re-render the toolbar's
  // active-state highlighting — the editor content itself never touches
  // React state (see onUpdate below), so typing can't disturb it.
  const [, bumpToolbar] = useState(0);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
      Placeholder.configure({ placeholder: "Skriv artikeltexten här…" }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: defaultValue,
    // Writes straight to the hidden input's DOM node instead of React state,
    // so typing doesn't re-render (and steal focus/selection from) the
    // editor on every keystroke.
    onUpdate: ({ editor }) => {
      if (hiddenInputRef.current) {
        hiddenInputRef.current.value = editor.getHTML();
      }
      bumpToolbar((n) => n + 1);
    },
    onSelectionUpdate: () => bumpToolbar((n) => n + 1),
    editorProps: {
      attributes: {
        class: "article-prose min-h-64 focus:outline-none",
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
  };

  return (
    <div className="rounded-lg border border-bone/10 bg-bone/5">
      <div className="flex flex-wrap items-center gap-1 border-b border-bone/10 p-2">
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
