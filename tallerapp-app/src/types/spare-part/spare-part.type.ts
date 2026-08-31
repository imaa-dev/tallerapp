export interface SparePart {
  id: number;
  organization_id: number;
  user_id: number;
  model: string;
  brand: string;
  price: number;
  note?: string;
  created_at: string;
}

export interface SparePartListResponse {
  spareParts: SparePart[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
  };
}
