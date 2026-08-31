export interface UserListResponse {
  users: UserListItem[];
  pagination: PaginationMeta;
}

export interface UserListItem {
  id: number;
  name: string;
  email: string;
  phone?: string;
  rol: "ADMIN" | "TECHNICIAN" | "CLIENT";
  created_at: string;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}
