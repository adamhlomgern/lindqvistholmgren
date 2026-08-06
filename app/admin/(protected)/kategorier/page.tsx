import { X } from "lucide-react";
import { getCategories } from "@/lib/data/categories";
import { deleteCategory } from "@/lib/actions/categories";
import { articleIcons } from "@/lib/articles/visuals";
import { AccentBadge } from "@/components/ui/AccentBadge";
import { Card } from "@/components/ui/Card";
import { CategoryForm } from "@/components/admin/CategoryForm";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-bone">Kategorier</h1>
      <p className="mt-1 text-sm text-stone">
        Styr vilka kategorier som går att välja för artiklar, samt vilken ikon och färg de får.
      </p>

      <div className="mt-8 flex flex-col gap-2">
        {categories.map((category) => {
          const Icon = articleIcons[category.icon];
          return (
            <div
              key={category.name}
              className="flex items-center justify-between rounded-2xl bg-bone/5 px-5 py-3"
            >
              <div className="flex items-center gap-3">
                <AccentBadge icon={Icon} accent={category.accent} size={16} className="h-9 w-9" />
                <span className="text-sm font-medium text-bone">{category.name}</span>
              </div>
              <form action={deleteCategory.bind(null, category.name)}>
                <button
                  type="submit"
                  aria-label={`Ta bort ${category.name}`}
                  className="text-stone hover:text-coral"
                >
                  <X size={16} strokeWidth={2.25} />
                </button>
              </form>
            </div>
          );
        })}
        {categories.length === 0 && <p className="text-sm text-stone">Inga kategorier ännu.</p>}
      </div>

      <Card className="mt-8 max-w-md">
        <h2 className="font-display text-base font-bold text-bone">Lägg till kategori</h2>
        <div className="mt-5">
          <CategoryForm />
        </div>
      </Card>
    </div>
  );
}
