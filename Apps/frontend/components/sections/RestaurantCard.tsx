import Link from "next/link";
import type { Restaurant } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const CUISINE_IMAGES: Record<string, string> = {
  Mexican:
    "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80",
  Asian:
    "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80",
  Italian:
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80",
  French:
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80",
  American:
    "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80",
  Spanish:
    "https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=400&q=80",
  Indian:
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80",
};

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80";

export function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const image = CUISINE_IMAGES[restaurant.cuisineType] ?? DEFAULT_IMAGE;

  return (
    <Link href={`/restaurants/${restaurant.id}`} className="group block">
      <Card className="overflow-hidden transition-shadow hover:shadow-lg">
        <div className="relative h-48 w-full overflow-hidden bg-muted">
          <img
            src={image}
            alt={restaurant.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <Badge
            variant="secondary"
            className="absolute top-3 right-3 backdrop-blur-sm"
          >
            {restaurant.cuisineType}
          </Badge>
        </div>
        <CardContent className="p-5">
          <h2 className="text-lg font-semibold group-hover:text-primary transition-colors">
            {restaurant.name}
          </h2>
          <div className="mt-1 flex items-center gap-1.5 text-sm">
            <span className="text-primary">
              {"★".repeat(Math.floor(restaurant.rating))}
            </span>
            <span className="text-muted-foreground">{restaurant.rating}</span>
          </div>
          {restaurant.description && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {restaurant.description}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export function RestaurantCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <CardContent className="p-5 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-full" />
      </CardContent>
    </Card>
  );
}
