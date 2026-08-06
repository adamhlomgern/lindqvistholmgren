import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { getArticleBySlug } from "@/lib/data/articles";
import { getCategories } from "@/lib/data/categories";
import { accentHex, resolveCategoryVisual } from "@/lib/articles/visuals";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const categories = await getCategories();
  const accent = resolveCategoryVisual(categories, article.category).accent;
  const hex = accentHex[accent];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          backgroundColor: "#050806",
          backgroundImage: `radial-gradient(circle at 85% 10%, ${hex}4d 0%, transparent 55%), radial-gradient(circle at 5% 95%, ${hex}33 0%, transparent 45%)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 76,
              height: 76,
              borderRadius: 9999,
              backgroundColor: `${hex}26`,
              fontSize: 30,
              fontWeight: 700,
              color: hex,
            }}
          >
            {article.category.charAt(0)}
          </div>
          <span
            style={{
              fontSize: 22,
              color: "#8fab9c",
              textTransform: "uppercase",
              letterSpacing: 3,
            }}
          >
            {article.category}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              display: "flex",
              fontSize: 58,
              fontWeight: 700,
              color: "#e7f4ee",
              lineHeight: 1.15,
              maxWidth: 980,
            }}
          >
            {article.title}
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "#8fab9c" }}>
            Lindqvist / Holmgren
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
