// types/Product.ts
export interface Product {
  id: number;
  name: string;
  brand: string;
  model: string;
  organization_id: number;
  created_at: string;
  updated_at: string;
  categorie_id?: number | null;
  description?: string | null;
  price?: number | null;
  serial_number?: string | null;
  stock?: number | null;
}
