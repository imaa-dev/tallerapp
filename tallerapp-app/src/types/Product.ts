// types/Product.ts
export interface Product {
  id: number;
  name: string;
  brand: string;
  model: string;
  organization_id: number;
  price: number | null;
  stock: number | null;
}