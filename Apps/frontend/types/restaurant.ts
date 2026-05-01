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

export interface Review {
  id: string;
  restaurantId: string;
  userId: string;
  rating: number;
  title: string;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  restaurantId: string;
  userId: string;
  reservationDateTime: string;
  numberOfGuests: number;
  specialRequests?: string;
  guestName?: string;
  guestPhone?: string;
  guestEmail?: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
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
