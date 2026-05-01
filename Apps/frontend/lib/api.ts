import type { Restaurant, Menu, Pagination } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

type PaginatedResponse<T> = {
  data: T[];
  pagination: Pagination;
};

type SingleResponse<T> = {
  data: T;
};

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchApi<T>(path: string): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url);

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message =
      body.message?.join(", ") ?? res.statusText ?? "Error desconocido";
    throw new ApiError(res.status, message);
  }

  return res.json() as Promise<T>;
}

// ── Restaurants ──────────────────────────────────────────────

export async function getRestaurants(filters?: {
  search?: string;
  cuisineType?: string;
  limit?: number;
  offset?: number;
}): Promise<PaginatedResponse<Restaurant>> {
  const params = new URLSearchParams();
  if (filters?.search) params.set("search", filters.search);
  if (filters?.cuisineType) params.set("cuisineType", filters.cuisineType);
  if (filters?.limit) params.set("limit", String(filters.limit));
  if (filters?.offset) params.set("offset", String(filters.offset));

  const qs = params.toString();
  return fetchApi<PaginatedResponse<Restaurant>>(
    `/restaurants${qs ? `?${qs}` : ""}`,
  );
}

export async function getRestaurantById(
  id: string,
): Promise<SingleResponse<Restaurant>> {
  return fetchApi<SingleResponse<Restaurant>>(`/restaurants/${id}`);
}

// ── Menus ────────────────────────────────────────────────────

export async function getMenuByRestaurantId(
  restaurantId: string,
  filters?: {
    search?: string;
    limit?: number;
    offset?: number;
  },
): Promise<PaginatedResponse<Menu>> {
  const params = new URLSearchParams({ restaurantId });
  if (filters?.search) params.set("search", filters.search);
  if (filters?.limit) params.set("limit", String(filters.limit));
  if (filters?.offset) params.set("offset", String(filters.offset));

  return fetchApi<PaginatedResponse<Menu>>(`/menus?${params.toString()}`);
}
