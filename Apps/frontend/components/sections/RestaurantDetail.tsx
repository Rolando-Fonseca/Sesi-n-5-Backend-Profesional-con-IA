import Link from "next/link";
import type { Restaurant, Menu } from "@/types";

function getRatingStars(rating: number) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const stars: string[] = [];
  for (let i = 0; i < full; i++) stars.push("★");
  if (half) stars.push("★");
  return stars.join("");
}

export function RestaurantDetail({
  restaurant,
  menus,
}: {
  restaurant: Restaurant;
  menus: Menu[];
}) {
  return (
    <div>
      <Link
        href="/restaurants"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <span aria-hidden="true">&larr;</span> Volver al catalogo
      </Link>

      <div className="mt-6">
        <h1 className="text-4xl font-bold tracking-tight">
          {restaurant.name}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
            {restaurant.cuisineType}
          </span>
          <span className="flex items-center gap-1.5 text-sm">
            <span className="text-primary">
              {getRatingStars(restaurant.rating)}
            </span>
            <span className="text-muted-foreground">{restaurant.rating}</span>
          </span>
        </div>
      </div>

      {restaurant.description && (
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          {restaurant.description}
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
        {restaurant.phone && (
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true">📞</span> {restaurant.phone}
          </span>
        )}
        {restaurant.email && (
          <a
            href={`mailto:${restaurant.email}`}
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <span aria-hidden="true">✉</span> {restaurant.email}
          </a>
        )}
        {restaurant.websiteUrl && (
          <a
            href={restaurant.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <span aria-hidden="true">🔗</span> Sitio web
          </a>
        )}
      </div>

      {menus.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-2xl font-bold">Ubicaciones</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {menus.map((m) => (
              <div
                key={m.id}
                className="rounded-lg border border-border p-5"
              >
                <h3 className="font-semibold">{m.name}</h3>
                {m.address && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {[m.address, m.city, m.state].filter(Boolean).join(", ")}
                  </p>
                )}
                {m.zipCode && (
                  <p className="text-sm text-muted-foreground">
                    C.P. {m.zipCode}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="mt-12">
          <h2 className="text-2xl font-bold">Ubicaciones</h2>
          <p className="mt-4 text-sm text-muted-foreground">
            Este restaurante aun no tiene ubicaciones registradas.
          </p>
        </section>
      )}
    </div>
  );
}

export function RestaurantDetailSkeleton() {
  return (
    <div>
      <div className="h-4 w-40 animate-pulse rounded bg-muted" />
      <div className="mt-6 space-y-4">
        <div className="h-10 w-2/3 animate-pulse rounded bg-muted" />
        <div className="flex gap-3">
          <div className="h-7 w-24 animate-pulse rounded-full bg-muted" />
          <div className="h-7 w-20 animate-pulse rounded-full bg-muted" />
        </div>
        <div className="h-5 w-full animate-pulse rounded bg-muted" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
        <div className="flex gap-6 mt-4">
          <div className="h-4 w-28 animate-pulse rounded bg-muted" />
          <div className="h-4 w-32 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="mt-12 space-y-4">
        <div className="h-8 w-40 animate-pulse rounded bg-muted" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-24 animate-pulse rounded-lg bg-muted" />
          <div className="h-24 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    </div>
  );
}
