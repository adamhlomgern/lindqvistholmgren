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

// Shared by the attach button below and the textarea's paste-to-attach
// handler in CustomerMessagesCard/MessagesPanel — one upload path so a
// pasted screenshot and a picked file behave identically. Goes through a
// Route Handler (uploadUrl), not the text form's Server Action — Server
// Actions here are capped at a 1MB body, same reasoning as
// ProjectFileUploadForm. router.refresh() re-runs the server-rendered
// message list after a successful send, since neither caller owns the
// messages array itself. Returns whether it succeeded so the caller only
// clears its staged-image preview once the message has actually gone out.
export function useChatImageUpload({ uploadUrl, extraFields = {}, textareaRef, onError }: UseChatImageUploadParams) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function uploadFile(file: File): Promise<boolean> {
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
        return false;
      }
      if (textareaRef.current) textareaRef.current.value = "";
      router.refresh();
      return true;
    } catch {
      onError("Kunde inte skicka bilden.");
      return false;
    } finally {
      setPending(false);
    }
  }

  return { pending, uploadFile };
}

// Only stages a file (via onPick) — it isn't sent until "Skicka" is
// pressed, same as the attach-a-file-to-an-email pattern, so a pasted
// screenshot can be reviewed (and removed, if it caught something it
// shouldn't have) before it ever reaches the other person.
export function ChatImageUploadButton({ pending, onPick }: { pending: boolean; onPick: (file: File) => void }) {
  return (
    <label
      aria-label="Bifoga bild"
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
