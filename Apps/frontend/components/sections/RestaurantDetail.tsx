import Link from "next/link";
import type { Restaurant, Menu } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function RestaurantDetail({
  restaurant,
  menus,
}: {
  restaurant: Restaurant;
  menus: Menu[];
}) {
  return (
    <div>
      <Link href="/restaurants">
        <Button variant="ghost" size="sm">&larr; Volver al catalogo</Button>
      </Link>

      <div className="mt-6">
        <h1 className="text-4xl font-bold tracking-tight">
          {restaurant.name}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Badge variant="outline">{restaurant.cuisineType}</Badge>
          <span className="flex items-center gap-1.5 text-sm">
            <span className="text-primary">
              {"★".repeat(Math.floor(restaurant.rating))}
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
          <span className="flex items-center gap-1.5">📞 {restaurant.phone}</span>
        )}
        {restaurant.email && (
          <a
            href={`mailto:${restaurant.email}`}
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            ✉ {restaurant.email}
          </a>
        )}
        {restaurant.websiteUrl && (
          <a
            href={restaurant.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            🔗 Sitio web
          </a>
        )}
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">Ubicaciones</h2>
        {menus.length > 0 ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {menus.map((m) => (
              <Card key={m.id}>
                <CardContent className="p-5">
                  <h3 className="font-semibold">{m.name}</h3>
                  {m.address && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {[m.address, m.city, m.state]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}
                  {m.zipCode && (
                    <p className="text-sm text-muted-foreground">
                      C.P. {m.zipCode}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            Este restaurante aun no tiene ubicaciones registradas.
          </p>
        )}
      </section>
    </div>
  );
}

export function RestaurantDetailSkeleton() {
  return (
    <div>
      <Skeleton className="h-4 w-40" />
      <div className="mt-6 space-y-4">
        <Skeleton className="h-10 w-2/3" />
        <div className="flex gap-3">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
        <div className="flex gap-6 mt-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="mt-12 space-y-4">
        <Skeleton className="h-8 w-40" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
