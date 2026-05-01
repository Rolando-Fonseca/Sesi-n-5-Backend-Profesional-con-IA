import { RestaurantListSkeleton } from "@/components/sections/RestaurantList";

export default function RestaurantsLoading() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <div className="h-9 w-48 animate-pulse rounded bg-muted" />
      <div className="mt-8">
        <RestaurantListSkeleton count={6} />
      </div>
    </main>
  );
}
