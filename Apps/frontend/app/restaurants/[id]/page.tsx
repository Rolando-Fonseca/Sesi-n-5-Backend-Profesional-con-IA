import { getRestaurantById, getMenuByRestaurantId } from "@/lib/api";
import { RestaurantDetail } from "@/components/sections/RestaurantDetail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: restaurant } = await getRestaurantById(id);
  return {
    title: `${restaurant.name} — Restaurants`,
    description: restaurant.description ?? `Detalles de ${restaurant.name}`,
  };
}

export default async function RestaurantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: restaurant } = await getRestaurantById(id);
  const { data: menus } = await getMenuByRestaurantId(id);

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <RestaurantDetail restaurant={restaurant} menus={menus} />
    </main>
  );
}
