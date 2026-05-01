import { RestaurantDetailSkeleton } from "@/components/sections/RestaurantDetail";

export default function RestaurantDetailLoading() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <RestaurantDetailSkeleton />
    </main>
  );
}
