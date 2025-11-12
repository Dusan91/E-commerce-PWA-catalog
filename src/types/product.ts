export interface Product {
  productId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  brand: string;
  rating: number;
  reviewsCount: number;
  availability: 'In Stock' | 'Out of Stock';
  images: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
}

export type SelectedCategory = string | null;

