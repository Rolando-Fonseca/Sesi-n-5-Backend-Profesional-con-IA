import type { Restaurant } from "@/types";
import { RestaurantCard, RestaurantCardSkeleton } from "./RestaurantCard";

export function RestaurantList({ restaurants }: { restaurants: Restaurant[] }) {
  if (restaurants.length === 0) {
    return <RestaurantListEmpty />;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {restaurants.map((r) => (
        <RestaurantCard key={r.id} restaurant={r} />
      ))}
    </div>
  );
}

export function RestaurantListEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <svg
        className="h-16 w-16 text-muted-foreground/40"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
        />
      </svg>
      <h3 className="mt-4 text-lg font-medium">No hay restaurantes</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Aun no hay restaurantes registrados. Vuelve pronto.
      </p>
    </div>
  );
}

export function RestaurantListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <RestaurantCardSkeleton key={i} />
      ))}
    </div>
  );
}
