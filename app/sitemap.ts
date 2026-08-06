import type { MetadataRoute } from "next";
import { services } from "@/lib/data/services";
import { servicePages } from "@/lib/data/service-pages";
import { getProjects } from "@/lib/data/projects";
import { getArticles } from "@/lib/data/articles";

const baseUrl = "https://lindqvistholmgren.se";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, articles] = await Promise.all([getProjects(), getArticles()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${baseUrl}/tjanster`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/projekt`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/artiklar`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/om-oss`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${baseUrl}/kontakt`, changeFrequency: "yearly", priority: 0.8 },
    { url: `${baseUrl}/integritetspolicy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/starta-ett-projekt`, changeFrequency: "yearly", priority: 0.8 },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${baseUrl}/tjanster/${service.slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const servicePageRoutes: MetadataRoute.Sitemap = servicePages.map((page) => ({
    url: `${baseUrl}/tjanster/${page.category}/${page.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${baseUrl}/projekt/${project.slug}`,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/artiklar/${article.slug}`,
    lastModified: article.date,
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...servicePageRoutes,
    ...projectRoutes,
    ...articleRoutes,
  ];
}
