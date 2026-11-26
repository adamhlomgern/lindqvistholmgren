import { getCategories } from "@/lib/data/categories";
import { getArticles } from "@/lib/data/articles";
import { Card } from "@/components/ui/Card";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { CourseEditor } from "@/components/admin/CourseEditor";

// Kategorierna är också modulerna i Kunskapsbanken (/artiklar). Här styrs
// ordning, namn, beskrivning, ikon och färg, och lektionernas ordning.
export default async function AdminCategoriesPage() {
  const [categories, articles] = await Promise.all([getCategories(), getArticles()]);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-fg">Kategorier och moduler</h1>
      <p className="mt-1 max-w-2xl text-sm text-fg-muted">
        Varje kategori är en modul i Kunskapsbanken. Dra modulerna och lektionerna i den ordning de ska läsas, och klicka på pennan
        för att byta namn, beskrivning, ikon eller färg. Nya artiklar hamnar sist i sin modul tills ni flyttar dem.
      </p>

      <div className="mt-6">
        <CourseEditor categories={categories} articles={articles} />
      </div>

      <Card className="mt-8 max-w-md">
        <h2 className="font-display text-base font-semibold text-fg">Lägg till modul</h2>
        <div className="mt-5">
          <CategoryForm />
        </div>
      </Card>
    </div>
  );
}
