"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/Card";
import { sendAdminMessage } from "@/lib/actions/customer-messages";
import { EmojiPickerButton } from "@/components/admin/EmojiPickerButton";
import { ChatImageUploadButton, useChatImageUpload } from "@/components/admin/ChatImageUploadButton";
import { PendingImagePreview } from "@/components/admin/PendingImagePreview";
import { ImageLightbox } from "@/components/admin/ImageLightbox";
import { formatRelativeSv } from "@/lib/format";
import type { CustomerMessage } from "@/lib/types";

const textareaClasses =
  "w-full min-w-0 rounded-lg border border-bone/10 bg-bone/5 px-3.5 py-2.5 text-sm text-bone placeholder:text-stone/60 focus:border-emerald focus:outline-none";

export function CustomerMessagesCard({ customerId, messages }: { customerId: string; messages: CustomerMessage[] }) {
  const action = sendAdminMessage.bind(null, customerId);
  const [state, formAction, pending] = useActionState(action, undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [imageError, setImageError] = useState<string | undefined>();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pendingImage, setPendingImage] = useState<File | null>(null);

  const { pending: imagePending, uploadFile } = useChatImageUpload({
    uploadUrl: "/api/admin/chat-upload",
    extraFields: { customerId },
    textareaRef,
    onError: setImageError,
  });

  useEffect(() => {
    if (!pending && !state?.error) formRef.current?.reset();
  }, [pending, state]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "nearest" });
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
    <Card>
      <h2 className="font-display text-sm font-bold text-bone">Meddelanden</h2>

      <div className="mt-3 flex max-h-80 flex-col gap-2 overflow-y-auto">
        {messages.length === 0 && <p className="text-sm text-stone">Inga meddelanden ännu.</p>}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm ${
              message.authorRole === "admin" ? "self-end bg-emerald/15 text-bone" : "self-start bg-bone/10 text-bone"
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
            {message.body && <p className={message.attachment ? "mt-2 whitespace-pre-wrap" : "whitespace-pre-wrap"}>{message.body}</p>}
            <p className="mt-1 text-[11px] text-stone/60">
              {message.authorLabel} · {formatRelativeSv(message.createdAt)}
            </p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {pendingImage && pendingImageUrl && (
        <PendingImagePreview file={pendingImage} previewUrl={pendingImageUrl} onRemove={() => setPendingImage(null)} />
      )}

      <form ref={formRef} action={formAction} className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end">
        <textarea
          ref={textareaRef}
          name="body"
          required={!pendingImage}
          rows={2}
          placeholder="Skriv ett meddelande till kunden…"
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
            className="shrink-0 rounded-full bg-emerald px-4 py-2.5 text-xs font-semibold text-charcoal transition-colors hover:bg-bone disabled:opacity-60"
          >
            Skicka
          </button>
        </div>
      </form>
      {(state?.error || imageError) && <p className="mt-2 text-sm text-coral">{state?.error ?? imageError}</p>}
      {previewUrl && (
        <ImageLightbox url={previewUrl} alt="Bild från chatten" onClose={() => setPreviewUrl(null)} />
      )}
    </Card>
  );
}
