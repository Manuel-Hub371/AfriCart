import { StoreCard } from "./store-card";
import { Store } from "lucide-react";

interface StoreGridProps {
  stores?: any[];
}

export function StoreGrid({ stores = [] }: StoreGridProps) {
  if (stores.length === 0) {
    return (
      <div className="bg-gray-50 border rounded-2xl p-12 text-center">
        <Store className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-900 mb-1">No Stores Found</h3>
        <p className="text-sm text-gray-500">Be the first vendor to launch a store on AfriCart!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {stores.map((store) => (
        <StoreCard
          key={store.id}
          id={store.id}
          name={store.name}
          slug={store.slug}
          description={store.description}
          category={store.category || "General"}
          categories={store.categories || []}
          businessType={store.businessType || "Indivual"}
          location={store.location || "Ghana"}
          rating={store.rating || 5.0}
          productCount={store.productCount ?? store._count?.products ?? 0}
          followerCount={store.followerCount ?? store.followersCount ?? store._count?.followers ?? 0}
          isFollowing={Boolean(store.isFollowing)}
          verified={Boolean(store.verified)}
          logo={store.logo}
          banner={store.banner}
        />
      ))}
    </div>
  );
}
