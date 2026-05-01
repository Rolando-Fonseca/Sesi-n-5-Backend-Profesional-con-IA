import { Suspense } from "react";
import { RestaurantCatalog } from "@/components/sections/RestaurantCatalog";

export const metadata = {
  title: "Restaurantes — Catalogo",
  description: "Explora todos los restaurantes disponibles.",
};

export default function RestaurantsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Restaurantes</h1>
      <Suspense>
        <RestaurantCatalog />
      </Suspense>
    </main>
  );
}
