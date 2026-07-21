export interface User {
  id: number
  name: string
  email: string
  rol: "ADMIN" | "TECHNICIAN"
  phone?: string
}

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  rol: 'CLIENT' | string; // Puedes usar un string literal si el rol es fijo
  created_by_organization_id: number;
  created_at: string;
  updated_at: string;
  approval_token?: string | null;
  email_verified_at?: string | null;
  token_expires_at?: string | null;
  verification_code?: string | null;
  verification_code_expires_at?: string | null;
}