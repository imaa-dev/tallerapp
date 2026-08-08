import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}
export interface BreadcrumbItem {
    title: string | JSX.Element;
    href: string;
}
export interface ButtonItem {
    title: string;
    href: string;
}
export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    roles: Array | null;
    handleDelete?: () => void;
}
export interface NavItemDrop {
    title: string;
    icon: LucideIcon;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}
export interface User {
    id: number;
    created_by_organization_id?: number;
    name: string;
    email: string;
    phone: string;
    rol: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    file?: FileMeta | null;
    [key: string]: unknown; // This allows for additional properties...
}
export interface FileMeta {
    id: number;
    fileable_id: number;
    fileable_type: string;
    path: string | null;
    created_at: string;
    updated_at: string;
}
export interface CountableOrganization {
    users_count: number;
    services_count: number;
    products_count: number;
    clients_count: number;
}

export interface OrganizationData extends CountableOrganization{
    id: number;
    user_id: number;
    file: FileMeta | null;
    name: string;
    description: string;
    status: string;
    phone: string;
    address: string;
    email: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
    website: string;
    created_at: string;
    updated_at: string;
    subscription: SubscriptionData
}
export interface ProductData {
    id: number;
    brand: string;
    model: string;
    name: string;
}
export interface CreateProductData {
    brand: string;
    model: string;
    name: string;
}
export interface CreateClientData{
    name: string;
    email: string;
    phone: string;
}
export interface Client {
    id: number;
    name: string;
    email: string;
    phone: string;
}
export interface Technician{
    id: number;
    name: string;
    email: string;
    phone: string;
    password: string;
}
export interface Page {
    props: {
        organization: {
            id: number,
        }
    };
}
export interface DiagnosisPage {
    props: {
        products: ProductData;
        clients: User;
    }
}
export interface ClientDataProp {
    clients: Client[];
}
export interface ProductDataProp {
    products: ProductData[];
}
export interface ServiDataForm {
    organization_id: number | undefined;
    product_id: number | undefined;
    user_id: number | undefined;
    status_id: number | undefined;
    date_entry: string;
    file: File[] | null;
    issues: { issue: string }[];
}
export interface DiagnosisData {
    id?: number;
    servi_id: number;
    diagnosis: string;
    repair_time: string;
    cost: number | undefined;
}
export interface ServiceIssue{
    id: number;
    servi_id: number;
    issue: string;
    diagnosis?: string | null;
    repair_time?: string | null;
    cost?: number | null;
    attend?: boolean;
    created_at: string;
    updated_at: string;
}
export interface PublicDiagnosisProps {
    issue: {
        id: number;
        issue: string;
        diagnosis: string | null;
        repair_time: string | null;
        cost: number | null;
    };
    servi: {
        client_name: string | null;
        organization_name: string | null;
        organization_description: string | null;
        product_name: string | null;
        product_brand: string | null;
        product_model: string | null;
        date_entry: string | null;
        files: string[];
    };
    pdf_url: string;
}
export interface Status {
    id: number;
    name: string;
}
export interface ServiData {
    id: number;
    uuid: string;
    user_id: number;
    product_id: number;
    organization_id: number;
    status_id: number;
    date_entry: string;
    date_exit: string;
    satisfied: number;
    service_issues: ServiceIssue[];
    file: FileMeta[];
    product: ProductData;
    client: Client;
    approve_spare_parts;
    spareparts: ListSparePartsData[];
    created_at: Date;
    updated_at: Date;
}

export interface SparePartsData {
    service_id: number | null;
    model: string;
    brand: string;
    price: number;
    note: string;
}

export interface ListSparePartsData{
    id: number;
    service_id: number;
    user_id: number
    model: string;
    brand: string;
    price: number;
    note: string;
}

export interface ServiForm {
    id: number;
    organization_id: number;
    product_id: number;
    user_id: number;
    date_entry: string;
}

export interface FileResponse {
    code: number;
    message: string;
    success: boolean;
    files: FileMeta[];
}
export interface SubscriptionData {
    id: number;
    organization_id: number;
    plan_id: number;
    provider: string;
    provider_subscription_id: string;
    provider_customer_id: string;
    start_at: string;
    ends_at: string;
    status: string;
    created_at: string;
    updated_at: string;
}
export interface DocumentFilters {
    search?: string;
    from?: string;
    to?: string;
    page?: number;
    per_page?: number;
    sort?: string;
    direction?: "asc" | "desc";
}
export interface Pagination {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
}
export interface RepairDocument {
    service_id: number;
    organization_id: number,
    type: string;
    filename: string;
    path: string;
    created_at: string;
}
export interface ProductFilters {
    search?: string;
    brand?: string;
    model?: string;
    page?: number;
    per_page?: number;
    sort?: string;
    direction?: "asc" | "desc";
}
export interface UserFilters {
    search?: string;
    email?: string;
    rol?: string;
    page?: number;
    per_page?: number;
    sort?: string;
    direction?: "asc" | "desc";
}

export interface SparePartsFilters {
    search?: string;
    brand?: string;
    model?: string;
    page?: number;
    per_page?: number;
    sort?: string;
    direction?: "asc" | "desc";
}

export type Subscription = {
  id: number;
  provider: string;
  provider_subscription_id: string;
  provider_customer_id: string;
  provider_metadata: Record<string, unknown> | null;
  starts_at: string | null;
  ends_at: string | null;
  status: string;
  plan: Plan;
  created_at: string;
  updated_at: string;
};

export type Plan = {
  id: number;
  name: string;
  price: number;
  interval: string;
  duration_days: number;
  features: string[] | Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};
