import { getRestaurants } from "@/lib/api";
import { RestaurantList } from "@/components/sections/RestaurantList";

export const metadata = {
  title: "Restaurantes — Catalogo",
  description: "Explora todos los restaurantes disponibles.",
};

export default async function RestaurantsPage() {
  const { data: restaurants } = await getRestaurants({ limit: 50 });

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Restaurantes</h1>
      <div className="mt-8">
        <RestaurantList restaurants={restaurants} />
      </div>
    </main>
  );
}
