"use client";

import { useEffect } from "react";
import { useReadLessons } from "@/components/articles/useReadLessons";

// Markerar lektionen som läst i Kunskapsbanken när artikeln öppnas.
export function MarkLessonRead({ slug }: { slug: string }) {
  const { markRead } = useReadLessons();
  useEffect(() => {
    markRead(slug);
  }, [slug, markRead]);
  return null;
}
