export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  cuisineType: string;
  ownerId: string;
  phone: string;
  email?: string;
  websiteUrl?: string;
  logoUrl?: string;
  rating: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Menu {
  id: string;
  restaurantId: string;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  limit: number;
  offset: number;
  pages: number;
  currentPage: number;
}
