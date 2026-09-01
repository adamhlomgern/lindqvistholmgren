const WORDS_PER_MINUTE = 200;

export function countWords(html: string): number {
  const text = html.replace(/<[^>]*>/g, " ").trim();
  if (!text) return 0;
  return text.split(/\s+/).length;
}

export function estimateReadTime(html: string): string {
  const words = countWords(html);
  const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));
  return `${minutes} min läsning`;
}
