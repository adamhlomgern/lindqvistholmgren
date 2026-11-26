import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { getPublishedArticleBySlug } from "@/lib/data/articles";
import { getCategories } from "@/lib/data/categories";
import { accentHex, accentSoftHex, resolveCategoryVisual } from "@/lib/articles/visuals";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const categories = await getCategories();
  const accent = resolveCategoryVisual(categories, article.category).accent;
  const hex = accentHex[accent];
  const soft = accentSoftHex[accent];

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
          backgroundColor: "#ffffff",
          backgroundImage: `radial-gradient(circle at 92% 0%, ${soft} 0%, transparent 45%)`,
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
              backgroundColor: soft,
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
              color: "#575a59",
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
              fontWeight: 600,
              color: "#1b1e1c",
              letterSpacing: -1,
              lineHeight: 1.15,
              maxWidth: 980,
            }}
          >
            {article.title}
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "#005035", fontWeight: 600 }}>
            Lindqvist / Holmgren
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
