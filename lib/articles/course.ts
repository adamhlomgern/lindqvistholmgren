import type { ArticleSummary } from "@/lib/types";
import type { ArticleCategory } from "@/lib/data/categories";
import type { Accent } from "@/lib/design/accents";
import type { ArticleIconKey } from "@/lib/types";

// Artiklarna presenteras som en kurs ("Kunskapsbanken"): varje kategori är en
// modul och artiklarna i den är lektioner, äldst först så att grunderna kommer
// före fördjupningarna.
export type CourseModule = {
  number: number;
  name: string;
  icon: ArticleIconKey;
  accent: Accent;
  lessons: ArticleSummary[];
  minutes: number;
};

export function readMinutes(readTime: string): number {
  const n = parseInt(readTime, 10);
  return Number.isFinite(n) ? n : 0;
}

export function buildCourse(articles: ArticleSummary[], categories: ArticleCategory[]): CourseModule[] {
  const byCategory = new Map<string, ArticleSummary[]>();
  for (const article of articles) byCategory.set(article.category, [...(byCategory.get(article.category) ?? []), article]);

  const known = categories.filter((c) => byCategory.has(c.name));
  const unknown = [...byCategory.keys()].filter((name) => !categories.some((c) => c.name === name));
  const ordered: { name: string; icon: ArticleIconKey; accent: Accent }[] = [
    ...known,
    ...unknown.map((name) => ({ name, icon: "layers" as ArticleIconKey, accent: "emerald" as Accent })),
  ];

  return ordered.map((cat, index) => {
    const lessons = [...(byCategory.get(cat.name) ?? [])].sort((a, b) => (a.date < b.date ? -1 : 1));
    return {
      number: index + 1,
      name: cat.name,
      icon: cat.icon,
      accent: cat.accent,
      lessons,
      minutes: lessons.reduce((sum, l) => sum + readMinutes(l.readTime), 0),
    };
  });
}

export function findLesson(course: CourseModule[], slug: string) {
  for (const mod of course) {
    const index = mod.lessons.findIndex((l) => l.slug === slug);
    if (index >= 0) {
      return {
        mod,
        index,
        previous: mod.lessons[index - 1] ?? null,
        next: mod.lessons[index + 1] ?? course[mod.number]?.lessons[0] ?? null,
        nextIsNewModule: index === mod.lessons.length - 1,
      };
    }
  }
  return null;
}
