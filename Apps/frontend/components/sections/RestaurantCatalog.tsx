"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getRestaurants } from "@/lib/api";
import type { Restaurant } from "@/types";
import { RestaurantList } from "@/components/sections/RestaurantList";
import { RestaurantListSkeleton } from "@/components/sections/RestaurantList";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const CUISINES = [
  "Mexican",
  "Italian",
  "Asian",
  "French",
  "American",
  "Spanish",
  "Indian",
];

export function RestaurantCatalog() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [cuisine, setCuisine] = useState(
    searchParams.get("cuisine") ?? "",
  );
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const LIMIT = 12;

  const fetchRestaurants = useCallback(
    async (newSearch: string, newCuisine: string, newOffset: number) => {
      setLoading(true);
      try {
        const { data, pagination } = await getRestaurants({
          search: newSearch || undefined,
          cuisineType: newCuisine || undefined,
          limit: LIMIT,
          offset: newOffset,
        });
        if (newOffset === 0) {
          setRestaurants(data);
        } else {
          setRestaurants((prev) => [...prev, ...data]);
        }
        setTotal(pagination.total);
        setOffset(newOffset);
      } catch {
        // error handled by list component
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRestaurants(search, cuisine, 0);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, cuisine, fetchRestaurants]);

  function updateUrl(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/restaurants?${params.toString()}`, { scroll: false });
  }

  return (
    <div>
      {/* Search bar */}
      <div className="mt-8 flex gap-3">
        <input
          type="text"
          placeholder="Buscar por nombre o descripcion..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            updateUrl("search", e.target.value);
          }}
          className="h-10 flex-1 rounded-lg border border-input bg-transparent px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Cuisine filters */}
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge
          variant={cuisine === "" ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => {
            setCuisine("");
            updateUrl("cuisine", "");
          }}
        >
          Todas
        </Badge>
        {CUISINES.map((c) => (
          <Badge
            key={c}
            variant={cuisine === c ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => {
              setCuisine(c);
              updateUrl("cuisine", c);
            }}
          >
            {c}
          </Badge>
        ))}
      </div>

      {/* Results */}
      <div className="mt-8">
        {loading && offset === 0 ? (
          <RestaurantListSkeleton count={6} />
        ) : (
          <>
            <RestaurantList restaurants={restaurants} />
            {restaurants.length > 0 && (
              <p className="mt-4 text-sm text-muted-foreground">
                Mostrando {restaurants.length} de {total} restaurantes
              </p>
            )}
          </>
        )}
        {loading && offset > 0 && (
          <div className="mt-4">
            <RestaurantListSkeleton count={3} />
          </div>
        )}
      </div>

      {/* Load more */}
      {restaurants.length < total && !loading && (
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => fetchRestaurants(search, cuisine, offset + LIMIT)}
          >
            Cargar mas restaurantes
          </Button>
        </div>
      )}
    </div>
  );
}
