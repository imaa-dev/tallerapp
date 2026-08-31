export interface OrganizationDetail {
  id: number;
  name: string;
  description: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
}
