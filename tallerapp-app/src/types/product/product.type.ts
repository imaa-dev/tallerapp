// types/Product.ts
export interface Product {
  id: number;
  organization_id: number;
  categorie_id: number;
  serial_number: number;
  name: string;
  brand: string;
  model: string;
  price: number | null;
  stock: number | null;
  created_at: string;
  updated_at: string;
}