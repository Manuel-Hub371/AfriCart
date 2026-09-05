import { db } from "@/lib/db";
import { OFFICIAL_STORE_CATEGORIES, mapLegacyCategoryToOfficialSlug } from "@/lib/constants/store-categories";

/**
 * Ensures all 9 official store categories exist in PostgreSQL
 * and migrates existing stores to the StoreCategoryAssignment relation.
 */
export async function seedAndMigrateOfficialStoreCategories() {
  try {
    // 1. Upsert official store categories
    const categoryMap: Record<string, string> = {}; // slug -> id

    for (const cat of OFFICIAL_STORE_CATEGORIES) {
      const record = await db.storeCategory.upsert({
        where: { slug: cat.slug },
        create: {
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
        },
        update: {
          name: cat.name,
          description: cat.description,
        },
      });
      categoryMap[cat.slug] = record.id;
    }

    // 2. Safely migrate existing stores that don't have StoreCategoryAssignment records yet
    const storesWithoutAssignments = await db.store.findMany({
      where: {
        categories: {
          none: {},
        },
      },
      select: {
        id: true,
        category: true,
      },
    });

    for (const store of storesWithoutAssignments) {
      const targetSlug = mapLegacyCategoryToOfficialSlug(store.category);
      const categoryId = categoryMap[targetSlug];
      if (categoryId) {
        await db.storeCategoryAssignment.create({
          data: {
            storeId: store.id,
            storeCategoryId: categoryId,
          },
        }).catch(() => {
          // ignore duplicate assignment errors
        });
      }
    }
  } catch (err) {
    console.error("Failed to seed official store categories:", err);
  }
}
