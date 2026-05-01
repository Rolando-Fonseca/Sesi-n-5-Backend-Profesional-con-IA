import type { Review } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ReviewsSection({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-muted-foreground">
          Aun no hay reseñas. Se el primero en compartir tu experiencia!
        </p>
      </div>
    );
  }

  const avg =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <div className="text-center">
          <p className="text-4xl font-bold">{avg.toFixed(1)}</p>
          <div className="mt-1 text-primary">
            {"★".repeat(Math.round(avg))}
            {"☆".repeat(5 - Math.round(avg))}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {reviews.length} {reviews.length === 1 ? "reseña" : "reseñas"}
          </p>
        </div>
      </div>
      <div className="space-y-4">
        {reviews.map((r) => (
          <Card key={r.id}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1 text-primary text-sm">
                    {"★".repeat(r.rating)}
                    {"☆".repeat(5 - r.rating)}
                  </div>
                  <h4 className="mt-1 font-medium">{r.title}</h4>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(r.createdAt).toLocaleDateString("es-MX")}
                </span>
              </div>
              {r.comment && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {r.comment}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function ReviewsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-5 space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
