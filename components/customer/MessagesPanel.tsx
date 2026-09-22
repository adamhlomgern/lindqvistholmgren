"use client";

import { useActionState, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { sendCustomerMessage } from "@/lib/actions/customer-messages";
import { EmojiPickerButton } from "@/components/admin/EmojiPickerButton";
import { ChatImageUploadButton, useChatImageUpload } from "@/components/admin/ChatImageUploadButton";
import { PendingImagePreview } from "@/components/admin/PendingImagePreview";
import { ImageLightbox } from "@/components/admin/ImageLightbox";
import { formatRelativeSv } from "@/lib/format";
import type { CustomerMessage } from "@/lib/types";

const textareaClasses =
  "w-full min-w-0 rounded-lg border border-bone/10 bg-bone/5 px-3.5 py-2.5 text-sm text-bone placeholder:text-stone/60 focus:border-emerald focus:outline-none";

type MessagesPanelProps = {
  messages: CustomerMessage[];
  // Used by the admin-side "Kundvy" preview — that renders this exact
  // component with admin-fetched data so the preview can never drift from
  // what the real page shows, but the compose form calls sendCustomerMessage,
  // which resolves the customer from the *session* — an admin session isn't
  // a customer, so submitting it there would just redirect to /kund/login.
  // Hiding the form avoids that dead end instead of letting someone hit it.
  readOnly?: boolean;
};

export function MessagesPanel({ messages, readOnly = false }: MessagesPanelProps) {
  const [state, formAction, pending] = useActionState(sendCustomerMessage, undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [imageError, setImageError] = useState<string | undefined>();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pendingImage, setPendingImage] = useState<File | null>(null);

  const { pending: imagePending, uploadFile } = useChatImageUpload({
    uploadUrl: "/api/kund/chat-upload",
    textareaRef,
    onError: setImageError,
  });

  useEffect(() => {
    if (!pending && !state?.error) formRef.current?.reset();
  }, [pending, state]);

  // Instant (not smooth) so the chat already reads as scrolled to the
  // latest message on first paint, like Messenger — a visible scroll
  // animation on load would look like a glitch, not a feature. Runs before
  // the browser paints (useLayoutEffect, not useEffect) for the same reason.
  useLayoutEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages.length]);

  // Local preview only — nothing is uploaded until "Skicka" is pressed.
  const pendingImageUrl = useMemo(() => (pendingImage ? URL.createObjectURL(pendingImage) : null), [pendingImage]);
  useEffect(() => {
    return () => {
      if (pendingImageUrl) URL.revokeObjectURL(pendingImageUrl);
    };
  }, [pendingImageUrl]);

  async function handleSendImage() {
    if (!pendingImage) return;
    const ok = await uploadFile(pendingImage);
    if (ok) setPendingImage(null);
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0">
        <h1 className="font-display text-2xl font-bold text-bone">Meddelanden</h1>
        <p className="mt-1 text-sm text-stone">Chatta direkt med oss om ert projekt.</p>
      </div>

      {/* min-h-0 lets this flex-col actually shrink below its content size —
          without it, a nested flex-1 scroll area can't get smaller than the
          full unscrolled message list, and the chat pane just grows past the
          viewport instead of scrolling internally. */}
      <div className="mt-4 flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-bone/5">
        <div ref={listRef} className="min-h-64 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
          <div className="flex flex-col gap-2">
            {messages.length === 0 && (
              <p className="text-sm text-stone">Inga meddelanden ännu — skriv gärna om du har en fråga.</p>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm ${
                  message.authorRole === "customer"
                    ? "self-end bg-emerald/15 text-bone"
                    : "self-start bg-bone/10 text-bone"
                }`}
              >
                {message.attachment?.url && (
                  <button type="button" onClick={() => setPreviewUrl(message.attachment!.url)} className="block">
                    {/* eslint-disable-next-line @next/next/no-img-element -- signed Supabase Storage URL, not a static asset next/image can optimize */}
                    <img
                      src={message.attachment.url}
                      alt={message.attachment.filename}
                      className="max-h-52 max-w-full cursor-zoom-in rounded-lg object-contain"
                    />
                  </button>
                )}
                {message.body && (
                  <p className={message.attachment ? "mt-2 whitespace-pre-wrap" : "whitespace-pre-wrap"}>{message.body}</p>
                )}
                <p className="mt-1 text-[11px] text-stone/60">
                  {message.authorLabel} · {formatRelativeSv(message.createdAt)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="shrink-0 border-t border-bone/10 px-4 py-4 sm:px-6 sm:py-6">
          {readOnly ? (
            <p className="text-xs text-stone/60">Det här är en förhandsvisning — meddelanden går inte att skicka härifrån.</p>
          ) : (
            <>
              {pendingImage && pendingImageUrl && (
                <PendingImagePreview file={pendingImage} previewUrl={pendingImageUrl} onRemove={() => setPendingImage(null)} />
              )}
              <form ref={formRef} action={formAction} className={`flex flex-col gap-2 sm:flex-row sm:items-end ${pendingImage ? "mt-3" : ""}`}>
                <textarea
                  ref={textareaRef}
                  name="body"
                  required={!pendingImage}
                  rows={2}
                  placeholder="Skriv ett meddelande…"
                  className={textareaClasses}
                  onPaste={(event) => {
                    const item = Array.from(event.clipboardData.items).find((entry) => entry.type.startsWith("image/"));
                    const file = item?.getAsFile();
                    if (!file) return;
                    event.preventDefault();
                    setPendingImage(file);
                  }}
                />
                <div className="flex shrink-0 items-center justify-between gap-2 sm:justify-start">
                  <div className="flex items-center gap-2">
                    <EmojiPickerButton textareaRef={textareaRef} />
                    <ChatImageUploadButton pending={imagePending} onPick={setPendingImage} />
                  </div>
                  <button
                    type={pendingImage ? "button" : "submit"}
                    disabled={pending || imagePending}
                    onClick={pendingImage ? () => void handleSendImage() : undefined}
                    className="shrink-0 rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-bone disabled:opacity-60"
                  >
                    Skicka
                  </button>
                </div>
              </form>
              {(state?.error || imageError) && <p className="mt-2 text-sm text-coral">{state?.error ?? imageError}</p>}
            </>
          )}
        </div>
      </div>

      {previewUrl && <ImageLightbox url={previewUrl} alt="Bild från chatten" onClose={() => setPreviewUrl(null)} />}
    </div>
  );
}
