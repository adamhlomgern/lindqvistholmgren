"use client";

import type { RefObject } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Smile } from "lucide-react";

// Small curated set rather than a full picker library — covers the common
// cases in a customer-support chat without pulling in an emoji-data package.
const EMOJIS = [
  "😀", "😂", "🙂", "😉", "😍", "🤔", "😅", "😢", "😮", "😎",
  "👍", "👎", "🙏", "👏", "💪", "👌", "✅", "❌", "🔥", "🎉",
  "❤️", "⭐", "⏰", "📎", "📷", "📄", "🏡", "🔨", "💡", "🚀",
];

type Props = {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
};

// Inserts at the current cursor position (not just appended to the end) so
// picking an emoji mid-sentence lands where you'd expect, then hands focus
// back to the textarea — onCloseAutoFocus below stops Radix returning focus
// to the trigger button instead.
export function EmojiPickerButton({ textareaRef }: Props) {
  function insertEmoji(emoji: string) {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    el.value = el.value.slice(0, start) + emoji + el.value.slice(end);

    const cursor = start + emoji.length;
    el.selectionStart = el.selectionEnd = cursor;
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label="Lägg till emoji"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-stone transition-colors hover:bg-bone/10 hover:text-bone"
        >
          <Smile size={17} strokeWidth={2} />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          side="top"
          sideOffset={8}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            textareaRef.current?.focus();
          }}
          className="z-50 grid w-60 grid-cols-6 gap-0.5 rounded-xl border border-bone/10 bg-forest p-2 shadow-xl focus:outline-none"
        >
          {EMOJIS.map((emoji) => (
            <DropdownMenu.Item
              key={emoji}
              onSelect={() => insertEmoji(emoji)}
              className="flex h-8 w-8 cursor-pointer select-none items-center justify-center rounded-lg text-base outline-none transition-colors data-[highlighted]:bg-bone/10"
            >
              {emoji}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
