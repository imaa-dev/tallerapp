export interface RepairDocument {
  id: number;
  organization_id: number;
  servi_id: number;
  type: string;
  number: string;
  date: string;
  status: string;
  amount: number;
  created_at: string;
}

export interface DocumentListResponse {
  documents: RepairDocument[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
  };
}
