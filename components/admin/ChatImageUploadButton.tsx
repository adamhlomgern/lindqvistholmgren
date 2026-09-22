"use client";

import { useState, type RefObject } from "react";
import { useRouter } from "next/navigation";
import { Image as ImageIcon } from "lucide-react";

const ACCEPTED_TYPES = "image/jpeg,image/png,image/webp,image/avif,image/gif";

type UseChatImageUploadParams = {
  uploadUrl: string;
  extraFields?: Record<string, string>;
  // Read at upload time so an image sent together with whatever caption is
  // already typed doesn't need a separate step — same textarea the emoji
  // picker inserts into.
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onError: (message: string | undefined) => void;
};

// Shared by the attach button below and the textarea's paste-to-upload
// handler in CustomerMessagesCard/MessagesPanel — one upload path so a
// pasted screenshot and a picked file behave identically. Goes through a
// Route Handler (uploadUrl), not the text form's Server Action — Server
// Actions here are capped at a 1MB body, same reasoning as
// ProjectFileUploadForm. router.refresh() re-runs the server-rendered
// message list after a successful upload, since neither caller owns the
// messages array itself.
export function useChatImageUpload({ uploadUrl, extraFields = {}, textareaRef, onError }: UseChatImageUploadParams) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function uploadFile(file: File) {
    setPending(true);
    onError(undefined);

    const formData = new FormData();
    for (const [key, value] of Object.entries(extraFields)) formData.set(key, value);
    formData.set("body", textareaRef.current?.value.trim() ?? "");
    formData.set("file", file);

    try {
      const response = await fetch(uploadUrl, { method: "POST", body: formData });
      const data: { error?: string } = await response.json();
      if (!response.ok) {
        onError(data.error ?? "Kunde inte skicka bilden.");
        return;
      }
      if (textareaRef.current) textareaRef.current.value = "";
      router.refresh();
    } catch {
      onError("Kunde inte skicka bilden.");
    } finally {
      setPending(false);
    }
  }

  return { pending, uploadFile };
}

export function ChatImageUploadButton({ pending, onPick }: { pending: boolean; onPick: (file: File) => void }) {
  return (
    <label
      aria-label="Skicka bild"
      className={`flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-stone transition-colors hover:bg-bone/10 hover:text-bone ${
        pending ? "opacity-60" : ""
      }`}
    >
      <ImageIcon size={17} strokeWidth={2} />
      <input
        type="file"
        accept={ACCEPTED_TYPES}
        className="hidden"
        disabled={pending}
        onChange={(event) => {
          const file = event.currentTarget.files?.[0];
          event.currentTarget.value = "";
          if (file) onPick(file);
        }}
      />
    </label>
  );
}
